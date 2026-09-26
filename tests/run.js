const fs = require('node:fs');
const assert = require('node:assert/strict');
const code = fs.readFileSync('script.js', 'utf8');
assert.match(code, /Text="taodepzai"/);
assert.match(code, /✅ taodepzai v4\.67/);
assert.match(code, /local togBtn = New\("TextButton"/);
assert.match(code, /_G\.taodepzaiToggleImage/);
assert.match(code, /Name="GameToggleImage"/);
assert.match(code, /if not okImage then warn/);
assert.match(code, /togBtn\.Activated:Connect/);
assert.match(code, /togBtn\.InputBegan:Connect/);
assert.match(code, /function Store\.load\(/);
assert.match(code, /local function RunCode\(/);
// Optional real Luau grammar parser (install externally with npm install --prefix /tmp/luau-test luau-parser).
try {
    require('/tmp/luau-test/node_modules/luau-parser').parse(code);
    console.log('Luau syntax: OK');
} catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    console.log('Luau parser unavailable; syntax check skipped');
}
console.log('Static regression checks passed (Roblox runtime not available).');
