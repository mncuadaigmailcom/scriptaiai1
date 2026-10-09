#!/usr/bin/env node
/**
 * luau-check — static checker cho file Luau (Roblox Lua)
 * ------------------------------------------------------------------
 * Cài đặt (một lần):
 *     cd tools && npm install
 *
 * Dùng:
 *     node tools/luau-check.mjs script.js
 *     node tools/luau-check.mjs *.luau tools/../*.js
 *     node tools/luau-check.mjs script.js --strict     # cảnh báo cũng làm fail
 *     node tools/luau-check.mjs script.js --json       # xuất JSON cho CI
 *
 * Kiểm tra:
 *   1. Lex + parse error (có line/column)
 *   2. Global ghi nhầm (implicit global)      -> LỖI, gần như luôn là typo
 *   3. Global đọc mà chưa khai báo            -> LỖI nếu không phải API Roblox/executor
 *   4. Local khai báo không dùng              -> CẢNH BÁO
 *   5. Local function không bao giờ được gọi  -> CẢNH BÁO (code chết)
 *   6. Số liệu: dòng, token, hàm, mật độ pcall
 *
 * Exit code: 0 = sạch · 1 = có lỗi · 2 = không đọc được file
 */

import fs from 'node:fs';
import path from 'node:path';
import { parse, tokenize, analyzeScopes, isGlobal, isUnassignedGlobal } from 'luau-parser';

// ---------------------------------------------------------------------------
// Danh sách global hợp lệ
// ---------------------------------------------------------------------------

/** Luau + Roblox engine globals (create.roblox.com/docs/reference/engine/globals) */
const LUAU_GLOBALS = new Set(`
  assert error getfenv setfenv getmetatable setmetatable ipairs next pairs pcall xpcall print
  rawequal rawget rawset rawlen select tonumber tostring type typeof unpack warn loadstring
  newproxy gcinfo collectgarbage isclose _G _VERSION
  coroutine bit32 buffer debug math os string table task utf8
  game script workspace plugin shared require tick time elapsedTime wait delay spawn
`.split(/\s+/).filter(Boolean));

/** Roblox datatype / enum constructors */
const ROBLOX_TYPES = new Set(`
  Instance Vector2 Vector3 CFrame Color3 Enum UDim UDim2 Vector2int16 Vector3int16 Rect
  Region3 Ray RaycastParams OverlapParams NumberRange NumberSequence NumberSequenceKeypoint
  ColorSequence ColorSequenceKeypoint PhysicalProperties Random TweenInfo BrickColor Faces
  Axes DateTime Font CatalogCategory PathWaypoint Content Object ContentId
`.split(/\s+/).filter(Boolean));

/**
 * API đặc thù executor (Delta / Synapse / Wave / Fluxus...).
 * Chỉ hợp lệ khi script chạy trong executor — checker không báo lỗi,
 * nhưng sẽ liệt kê riêng để bạn biết script của mình phụ thuộc executor tới đâu.
 */
const EXECUTOR_GLOBALS = new Set(`
  gethui getgenv getrenv getscript getcallingscript getscripthash getloadedmodules
  identifyexecutor getexecutorname checkcaller isourclosure is_synapse_function
  hookfunction hookmetamethod getrawmetatable setrawmetatable setreadonly isreadonly
  newcclosure newlclosure getnamecallmethod setnamecallmethod getconnections
  getgc getreg getinstances getnilinstances getactors
  readfile writefile appendfile isfile delfile listfiles makefolder isfolder delfolder
  setclipboard toclipboard set_clipboard getcustomasset getsynasset getasset
  request http_request http HttpRequest syn_request
  fireclickdetector firetouchinterest fireproximityprompt firetouchinterest
  Drawing setfpscap getfpscap iswindowactive queue_on_teleport syn_isactive
  crypt base64 lz4 bit
`.split(/\s+/).filter(Boolean));

const ALL_KNOWN = new Set([...LUAU_GLOBALS, ...ROBLOX_TYPES]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--')));
const files = argv.filter((a) => !a.startsWith('--'));

const STRICT = flags.has('--strict');
const JSON_OUT = flags.has('--json');

const lineOf = (node) => (node && node.line ? node.line.start : null);

function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((n) => walk(n, visit));
    return;
  }
  if (typeof node.type === 'string') visit(node);
  for (const key of Object.keys(node)) {
    if (key === 'type' || key === 'line' || key === 'column') continue;
    walk(node[key], visit);
  }
}

// ---------------------------------------------------------------------------
// Phân tích 1 file
// ---------------------------------------------------------------------------

function checkFile(file) {
  const result = {
    file,
    ok: false,
    errors: [],
    warnings: [],
    notes: [],
    metrics: {},
  };

  let src;
  try {
    src = fs.readFileSync(file, 'utf8');
  } catch (e) {
    result.errors.push({ kind: 'io', message: e.message });
    return result;
  }

  const lines = src.split('\n').length;
  const bytes = Buffer.byteLength(src);

  // -- 1. lex -------------------------------------------------------------
  let tokens;
  try {
    tokens = tokenize(src);
  } catch (e) {
    result.errors.push({
      kind: 'lex',
      line: e.line,
      column: e.column,
      message: `Lỗi cú pháp (lexer): ${e.message}`,
    });
    result.metrics = { lines, bytes };
    return result;
  }

  // -- 2. parse -----------------------------------------------------------
  let program;
  try {
    program = parse(src);
  } catch (e) {
    result.errors.push({
      kind: 'parse',
      line: e.line,
      column: e.column,
      message: `Lỗi cú pháp (parser): ${e.message}`,
    });
    result.metrics = { lines, bytes, tokens: tokens.length };
    return result;
  }

  // -- 3. số liệu ---------------------------------------------------------
  const census = {};
  walk(program, (n) => {
    census[n.type] = (census[n.type] || 0) + 1;
  });
  const funcBodies = census.FunctionBody || 0;
  const pcallCalls = (src.match(/(?<![.\w])pcall\s*\(/g) || []).length;

  result.metrics = {
    lines,
    bytes,
    tokens: tokens.length,
    astNodes: Object.values(census).reduce((a, b) => a + b, 0),
    topStatements: program.body.statements.length,
    functions: funcBodies,
    anonymousFunctions: census.FunctionExpression || 0,
    localFunctions: census.LocalFunctionStatement || 0,
    methodAssignments: census.FunctionDeclarationStatement || 0,
    pcallCalls,
    pcallPer1kLines: lines ? +((pcallCalls / lines) * 1000).toFixed(1) : 0,
  };

  // -- 4. scope analysis --------------------------------------------------
  let analysis;
  try {
    analysis = analyzeScopes(program, { builtinGlobals: [...ALL_KNOWN] });
  } catch (e) {
    result.errors.push({ kind: 'scope', message: `Phân tích scope thất bại: ${e.message}` });
    return result;
  }

  // Nhận diện hàm chết: binding.declarationNode chỉ là node Identifier, không
  // phải statement cha, nên phải tự thu thập mọi `local function` từ AST
  // rồi khớp theo (tên, dòng).
  const localFuncKeys = new Set();
  walk(program, (n) => {
    if (n.type === 'LocalFunctionStatement' && n.name && n.name.name) {
      const ln = lineOf(n.name) || lineOf(n);
      if (ln != null) localFuncKeys.add(`${n.name.name}@${ln}`);
    }
  });

  const implicitGlobals = [];
  const unknownGlobals = new Map();
  const executorUsed = new Map();
  const unusedLocals = [];
  const unusedParams = [];
  const deadFunctions = new Map();

  for (const [, binding] of analysis.bindings) {
    const name = binding.name;
    const declLine = lineOf(binding.declarationNode);
    const refLines = binding.references.map((r) => lineOf(r)).filter((l) => l != null);

    if (isGlobal(binding)) {
      if (binding.isBuiltin) continue;

      // global bị gán mà không khai báo local -> implicit global
      if (!isUnassignedGlobal(binding)) {
        implicitGlobals.push({ name, line: declLine, refs: binding.references.length });
        continue;
      }
      // global chỉ đọc, chưa khai báo
      if (EXECUTOR_GLOBALS.has(name)) {
        executorUsed.set(name, { count: binding.references.length, lines: refLines });
      } else if (!ALL_KNOWN.has(name)) {
        unknownGlobals.set(name, { count: binding.references.length, lines: refLines });
      }
    } else if (binding.references.length === 0 && name !== '_' && !name.startsWith('_')) {
      // local / param khai báo mà không được đọc
      if (binding.kind === 'param') {
        // `self` trong function(self) là chữ ký method hợp lệ, bỏ qua.
        if (name !== 'self') unusedParams.push({ name, line: declLine });
      } else {
        const entry = { name, line: declLine };
        if (declLine != null && localFuncKeys.has(`${name}@${declLine}`)) {
          deadFunctions.set(name, entry);
        } else {
          unusedLocals.push(entry);
        }
      }
    }
  }

  // -- 5. gom kết quả -----------------------------------------------------
  for (const g of implicitGlobals) {
    result.errors.push({
      kind: 'implicit-global',
      line: g.line,
      message: `Global ghi nhầm '${g.name}' (thiếu 'local'?) — ${g.refs} lần dùng`,
    });
  }

  for (const [name, info] of unknownGlobals) {
    result.errors.push({
      kind: 'unknown-global',
      line: info.lines[0],
      message: `Global '${name}' chưa khai báo và không phải API Roblox (${info.count} lần dùng, dòng ${info.lines.slice(0, 5).join(', ')})`,
    });
  }

  for (const [name, info] of executorUsed) {
    result.notes.push({
      kind: 'executor-api',
      line: info.lines[0],
      message: `${name} (API executor, ${info.count} lần)`,
    });
  }

  for (const u of unusedLocals) {
    result.warnings.push({
      kind: 'unused-local',
      line: u.line,
      message: `Local '${u.name}' khai báo nhưng không dùng (dòng ${u.line})`,
    });
  }

  for (const u of unusedParams) {
    result.warnings.push({
      kind: 'unused-param',
      line: u.line,
      message: `Tham số '${u.name}' khai báo nhưng không dùng (dòng ${u.line}) — chữ ký hàm có thể đã lỗi thời`,
    });
  }

  for (const [name, info] of deadFunctions) {
    result.warnings.push({
      kind: 'dead-function',
      line: info.line,
      message: `Local function '${name}' không bao giờ được gọi (dòng ${info.line})`,
    });
  }

  result.ok = result.errors.length === 0 && (!STRICT || result.warnings.length === 0);
  return result;
}

// ---------------------------------------------------------------------------
// Chạy
// ---------------------------------------------------------------------------

if (files.length === 0) {
  console.error('Cách dùng: node luau-check.mjs <file...> [--strict] [--json]');
  process.exit(2);
}

const results = files.map(checkFile);

if (JSON_OUT) {
  console.log(JSON.stringify({ results }, null, 2));
} else {
  for (const r of results) {
    const rel = path.relative(process.cwd(), r.file) || r.file;
    console.log(`\n══ ${rel} ${'═'.repeat(Math.max(0, 60 - rel.length))}`);

    if (r.errors.some((e) => e.kind === 'lex' || e.kind === 'parse')) {
      const e = r.errors[0];
      console.log(`  ❌ ${e.message}`);
      if (e.line) console.log(`     tại dòng ${e.line}, cột ${e.column}`);
      continue;
    }

    const m = r.metrics;
    console.log(
      `  📊 ${m.lines} dòng · ${m.tokens} token · ${m.functions} hàm ` +
        `(${m.localFunctions} local + ${m.methodAssignments} method + ${m.anonymousFunctions} ẩn danh)`
    );
    console.log(
      `     ${m.pcallCalls} pcall (${m.pcallPer1kLines}/1000 dòng) · ${m.topStatements} câu lệnh top-level`
    );

    if (r.errors.length) {
      console.log(`\n  ❌ LỖI (${r.errors.length})`);
      for (const e of r.errors) console.log(`     [${e.kind}] ${e.message}`);
    }
    if (r.warnings.length) {
      console.log(`\n  ⚠️  CẢNH BÁO (${r.warnings.length})`);
      for (const w of r.warnings.slice(0, 40)) console.log(`     [${w.kind}] ${w.message}`);
      if (r.warnings.length > 40) console.log(`     … và ${r.warnings.length - 40} cảnh báo nữa`);
    }
    if (r.notes.length) {
      console.log(`\n  ℹ️  Phụ thuộc executor (${r.notes.length} API):`);
      console.log(`     ${r.notes.map((n) => n.message.split(' ')[0]).join(' · ')}`);
    }
    if (!r.errors.length && !r.warnings.length) console.log('\n  ✅ Sạch — không tìm thấy lỗi nào.');
  }

  const totalErr = results.reduce((a, r) => a + r.errors.length, 0);
  const totalWarn = results.reduce((a, r) => a + r.warnings.length, 0);
  console.log(`\n──────────────────────────────────────────────────────────────`);
  console.log(`  ${results.length} file · ${totalErr} lỗi · ${totalWarn} cảnh báo`);
  console.log(`──────────────────────────────────────────────────────────────`);
}

const failed = results.some((r) => !r.ok);
process.exit(failed ? 1 : 0);
