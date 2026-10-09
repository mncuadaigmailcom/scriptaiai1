# Phân tích `script.js`

> Báo cáo sinh ngày 2026-10-09 trên nhánh `arena/b0b48d1c-scriptaiai1`,
> commit gốc `09ba9105`.

---

## 1. Kết luận nhanh: file này KHÔNG phải JavaScript

`script.js` là **Luau (Roblox Lua)**, không phải JS. Chính header của file cũng ghi rõ:

```
-- Kiem tra: parser Luau + static regression (script.js la Luau, khong phai JavaScript).
```

Dòng đầu tiên của phần code là `local Players = game:GetService("Players")` (dòng 9).
Tên file `.js` chỉ là quy ước của repo, không phản ánh nội dung.

**Số liệu đo được:**

| Chỉ số | Giá trị |
|---|---|
| Kích thước | 638.683 byte |
| Số dòng | 8.800 |
| Số token (Luau lexer) | 136.964 |
| Số nút AST | 113.117 |
| Câu lệnh cấp cao nhất (top-level) | 940 |
| Function body | 1.669 (1.092 ẩn danh + 157 `local function` + 420 `function X.y`) |
| Số lần gọi `pcall(` | 932 |
| `RunService:BindToRenderStep` | 17 binding |
| Số tab GUI | 8 |

**Kiểm tra cú pháp:** đã chạy parser Luau thật (`luau-parser@1.0.3` từ npm)
trên toàn bộ file → **không có `ParseError` / `LexError` nào**, file parse sạch 100%.

---

## 2. Bản chất phần mềm

Đây là một **Roblox executor hub** (menu cheat/exploit) tên nội bộ
`taodepzai v5.0 NOIR` / `BananaCatHub`, chạy trong executor (Delta/Synapse…)
hoặc LocalScript. Nó là bản hợp nhất, tiến hoá từ 2 file Lua khác trong repo:

| File | Dòng | Vai trò |
|---|---|---|
| `aiaitao` | 1.584 | Bản tiền thân — "BANANA CAT EXECUTOR HUB - FLY WALK SYSTEM" |
| `aiaitao1` | 2.074 | Bản tiền thân — "EXECUTOR MENU - Fix NoClip…" |
| `script.js` | 8.800 | Bản hiện tại, gộp + mở rộng toàn bộ |

Toàn bộ GUI được **dựng tay 100% bằng `Instance.new`** — không dùng thư viện
UI bên ngoài (Rayfield, OrionLib, Fluent…).

---

## 3. Kiến trúc

940 câu lệnh top-level chia ra: 269 `FunctionDeclaration`, 247 `Assignment`,
210 `CallStatement`, 157 `LocalFunction`, 134 `LocalStatement`, 29 `do`-block,
6 `if`, 4 `for`.

Các namespace chính:

| Namespace | Vai trò | Dòng bắt đầu |
|---|---|---|
| `C` | Bảng màu (obsidian noir palette) | 87 |
| `D` | Design kit: `Paint`, `Stroke`, `Corner`, `Tween`, `CardBtn`, `Glow`, `Tactile`… | 168 |
| `S` | State + services + compat + toàn bộ module nghiệp vụ | 170 |
| `MV` (`S.Move`) | Di chuyển: fly / noclip / speed / jump / carpet | ~3640 |
| `MV.Safe` | Bay an toàn + khiên + thảm kính | ~4300 |
| `OT` (`S.ObjTrack`) | Định vị vật thể theo tên/path (ESP) | ~7660 |
| `GL` (`S.Glow`) | Ánh sáng / Lighting | ~7065 |
| `Store` | Lưu trữ JSON (file / memory / none) | ~679 |
| `Hit` | Hit-test GUI (input xuyên menu) | 319 |
| `_G.BananaCatHubAPI` | API public cho script bên ngoài | 2410 |

**8 tab:** 💾 Code Đã Lưu (1) · 💻 Code (2) · 📚 Script Hub (3) · 👥 Người Chơi (4) ·
🛠 Hỗ Trợ (5) · ⚙️ Thiết Lập (6) · ➕ Tạo Tính Năng (7) · 🧩 GUI Ngoài (99).

**Trạng thái chia sẻ qua `_G`:** 12 khoá `BananaCatHub_*`
(`_MV`, `_Free`, `_Connections`, `_SavedData`, `_AntiBan`, `_AntiBanUnhook`,
`_SpecCam`, `_Perf`, `_ObjTrack`, `_EmbedHosts`, `_SyncEmbeds`, `BananaCatHubAPI`).

---

## 4. Nhóm tính năng

- **Di chuyển:** fly, noclip, sprint/speed, high jump, infinite jump, "chạy trên
  thảm kính" (carpet), safe fly.
- **Bay tới mục tiêu:** `FlyToPlayer`, `FlyToGlass`, `_ObjectFlyStep`.
- **ESP / camera:** `S.ObjTrack` (định vị vật theo tên), `S.Loc` (toạ độ),
  `S.Spec` (camera khán giả), FreeCam, crosshair, `AnaAim` (ngắm tâm màn hình).
- **Server:** Reset / Hop / Hop ít người / Hop siêu vắng — gọi API
  `https://games.roblox.com/v1/games/{PlaceId}/servers/Public` (dòng 5188).
- **Anti-ban / anti-kick** (dòng 5305–5343): hook `player.Kick` bằng
  `hookfunction`, bắt `GuiService.ErrorMessageChanged`,
  `TeleportService.TeleportInitFailed`, `LogService.MessageOut`, và phát hiện
  server reset `WalkSpeed` (≥3 lần/4s → tự hop server).
- **Nạp code bên thứ ba:** `S.ScriptHubList` (dòng 5346) chứa Infinite Yield,
  Dex Explorer, SimpleSpy v3 — đều chạy dạng
  `loadstring(game:HttpGet("https://raw.githubusercontent.com/..."))()`.
- **Nhúng GUI script khác vào menu:** hệ thống park/embed (`S.ParkHost`,
  `S.FitEmbedded`, `S.PruneEmbeds`, hook `Instance.new` để bắt GUI tạo trễ).
- **Lưu trữ:** `Store` ghi `banana_cat_saved.json` (SAVE_VERSION 3), có export/import.

---

## 5. Điểm kỹ thuật làm tốt

1. **Dọn dẹp khi chạy lại (dòng 21–79)** — huỷ instance cũ, disconnect mọi
   connection cũ, unbind cả 17 render step, dọn Highlight còn sót trong
   `workspace`. Đây là phần nhiều hub bỏ qua.
2. **Quản lý kết nối** — `trackConn()` (dòng 70) gom mọi connection vào
   `_G.BananaCatHub_Connections`, có compaction khi vượt 300 phần tử.
3. **Lớp tương thích executor** — `S.EnsureCompat()` (dòng 849–870) bù ~45 API
   executor còn thiếu: `readfile/writefile` → ổ đĩa ảo trong RAM (`S.vfs`),
   `Drawing` → object dummy, `hookfunction` → hàm identity, `request` →
   `HttpService:RequestAsync` với fallback `game:HttpGet`.
4. **Store có 3 chế độ** (`file` / `memory` / `none`) và báo lỗi rõ ràng khi
   JSON hỏng (`Store.lastError`).
5. **Tối ưu hiệu năng có hệ thống:**
   - `S.PagePerf` tạm dừng tính năng theo tab đang mở.
   - Quét workspace **chia lát theo frame** (`scanBudget = 300`,
     `scanSliceMs = 2.0`) thay vì `GetDescendants()` một phát — comment ở dòng
     8051 nêu đúng lý do.
   - Cache `Humanoid` / `RootPart` (dòng 3666) thay vì `FindFirstChild` mỗi frame.
   - Tái sử dụng `RaycastParams` (dòng 1416).
   - Tần suất thích ứng: 0.25s khi đang ở tab, 0.5s khi đóng menu, 2–3s khi ẩn.
6. **Không có global ghi nhầm** — phân tích scope cho kết quả
   *"globals WRITTEN by this file (0)"*, tức không có biến nào bị gán nhầm ra
   global (lỗi kinh điển của Lua).

---

## 6. Lỗi và vấn đề tìm được

### 6.1 Bug thật

**① `supportTab` ở dòng 626 luôn là `nil`.**

```lua
function S.PagePerf.ShouldRunForSupportTab()      -- định nghĩa ~dòng 617
    ...
    local ok, t = pcall(function() return supportTab end)   -- dòng 626
```

`supportTab` là `local` khai báo ở **dòng 1209**, tức *sau* closure này →
parser resolve nó thành **global**, và global đó không bao giờ được gán.
Scope analyzer xếp nó vào nhóm *"undeclared + non-builtin globals"*.
Hàm vẫn chạy đúng chỉ nhờ nhánh phía trên dùng
`S.AnaUi.supportTabIndex` + `tabContent`. Nhánh fallback là code chết.

**② `MV.SetRunMode(on)` bỏ qua tham số (dòng 5116).**

```lua
function MV.SetRunMode(on) MV.runMode = false
    ...
    return false, "tinh nang chay tren tham da bi xoa" end
```

Tham số `on` không bao giờ được đọc; hàm luôn set `false`. Tính năng "chạy trên
thảm" đã bị gỡ nhưng chữ ký hàm vẫn giữ nguyên → gây hiểu nhầm cho người sửa sau.
Các chỗ gọi hiện tại (3949, 5101, 5131) đều truyền `false` nên chưa lộ ra ngoài.

**③ Shim `loadstring` gọi `load` — hàm không tồn tại trong Luau (dòng 851).**

```lua
S.SetGlobal("loadstring", function(src, nm) return load(tostring(src), nm or "compat") end)
```

Danh sách Luau globals chính thức của Roblox có `loadstring` nhưng **không có
`load`** ([LuaGlobals — create.roblox.com](https://create.roblox.com/docs/reference/engine/globals/LuaGlobals)).
Shim này chỉ được cài khi executor *thiếu* `loadstring` — đúng trường hợp
chạy như LocalScript thường. Khi đó lần gọi đầu tiên sẽ ném
`attempt to call a nil value (global 'load')`.

### 6.2 Code chết / rác tĩnh

Phân tích scope báo **188 local khai báo mà không bao giờ đọc**.
Phần lớn là `_` (placeholder hợp lệ), nhưng có code chết thật:

| Tên | Dòng | Ghi chú |
|---|---|---|
| `glowRound` | 7065 | `local function` không bao giờ được gọi |
| `rule` | 8591 | `local function` không bao giờ được gọi (kẻ đường phân cách tab ⚙️) |
| `gui` | 2328 | `local host, gui = entry.host, entry.gui` — `gui` bỏ đi |
| `bg` | 4336 | `local bv, bg = MV.Safe._EnsureBV()` — `bg` bỏ đi |
| `nameLbl` | 1140 | TextLabel được tạo & gắn parent nhưng biến không dùng lại |
| `isRightClick` | 1697 | Tham số `PickObjectAt` không dùng |
| `gp` ×2, `i`, `j`, `r`, `c`, `on` | 3142, 3583, 3815, 4120, 6839, 6960, 7460 | biến lặp/return thừa |

### 6.3 Rủi ro thiết kế

- **932 lời gọi `pcall`** bọc gần như mọi thao tác. Ưu điểm: hub không crash.
  Nhược điểm: lỗi bị nuốt im lặng; chỉ `Store.lastError`, `S.lastRunError`,
  `OT._renderErr` là nơi lỗi lộ ra. Rất khó debug khi một tính năng "không chạy
  mà không báo gì".
- **Thực thi mã từ xa không kiểm chứng.** `S.ScriptHubList` + tab 💻 Code chạy
  `loadstring(game:HttpGet(raw.githubusercontent.com/…))()` — không hash, không
  chữ ký, không pin commit (dùng nhánh `master`/`main`). Ai chiếm được repo đó
  thì có toàn quyền trên client người dùng. `S.CompatRequest` còn tự fallback
  từ `RequestAsync` sang `game:HttpGet`.
- **`workspace:GetDescendants()` lúc khởi động (dòng 65)** để dọn
  `BC_OT_HL/BB/BOX`. Đây chính là thao tác mà comment dòng 8051 gọi là
  *"thủ phạm gây khựng"* — chỉ khác là ở đây chạy một lần nên chấp nhận được,
  nhưng vẫn nên đổi sang quét theo lát cho nhất quán.
- **`ipairs({targetGui, playerGui, CoreGui})` (dòng 55)** — `ipairs` dừng ở phần
  tử `nil`. Hiện `targetGui` luôn được gán nên chưa nổ, nhưng nếu sau này có
  nhánh nào để `targetGui = nil` thì cả `playerGui` lẫn `CoreGui` sẽ bị bỏ qua
  âm thầm. Nên đổi sang `pairs` hoặc liệt kê tường minh.
- **6 vòng `while true do`** (dòng 304, 1067, 3285, 3483, 3528, 6103). Đã kiểm
  tra: 5 vòng là vòng sinh tên duy nhất có `break` đúng; vòng 304 (rainbow
  stroke) có guard `if not togBtn.Parent then break end`. Không phát hiện vòng
  lặp vô hạn thật.
- **Đơn khối 8.800 dòng trong 1 file**, nhiều dòng chứa 2–4 lệnh → diff/merge
  gần như bất khả thi. Nên tách ít nhất: `palette+design`, `gui-kit`,
  `move`, `objtrack`, `store`, `compat`.

### 6.4 Toàn cục chưa khai báo (12 tên)

Đều là API executor, đã được guard bằng `type(...) == "function"` hoặc `pcall`
trước khi gọi — **không phải bug**:

`gethui` (19), `_G` (46 lần), `Font` (127), `writefile`/`readfile` (691, 707, 721),
`isfile` (718–719), `hookfunction` (2865–5315), `setclipboard`/`toclipboard`/
`set_clipboard` (5184–5185), `identifyexecutor` (8699–8700), và `supportTab` (626)
— tên cuối là bug ① ở trên.

---

## 7. Đề xuất sửa (theo độ ưu tiên)

1. Sửa bug ①: truyền `supportTab` qua `S.AnaUi.supportTab` ngay sau dòng 1209
   rồi đọc từ đó ở dòng 626, bỏ tham chiếu global.
2. Sửa bug ③: bỏ shim `loadstring` dựa trên `load`, thay bằng trả về
   `nil, "loadstring không khả dụng trong môi trường này"` để người dùng thấy
   lý do thay vì lỗi khó hiểu.
3. Sửa bug ②: đổi tên thành `MV.SetRunModeRemoved()` hoặc xoá tham số `on`,
   cập nhật 3 chỗ gọi.
4. Xoá 7 mục code chết ở bảng 6.2 (giảm ~40 dòng và bớt nhiễu khi đọc).
5. Pin commit SHA thay vì nhánh `master`/`main` cho 3 script trong
   `S.ScriptHubList`, và in rõ URL nguồn trước khi chạy.
6. Thêm một "log lỗi" tập trung: mỗi `pcall` thất bại đẩy vào
   `S.errors[]`, hiện trong tab ⚙️ Thiết Lập — thay vì nuốt im lặng.
7. Đổi `.js` → `.luau` (hoặc `.lua`) cho đúng bản chất file; nếu bắt buộc giữ
   `.js` vì công cụ nạp thì ghi chú rõ trong README.

---

## 8. Cách tái lập các kiểm tra trong báo cáo

```bash
# cú pháp + scope analysis (parser Luau thật)
mkdir -p /tmp/luacheck && cd /tmp/luacheck
npm install luau-parser
node --stack-size=8000 analyze.mjs  /path/to/script.js   # tokenize + parse + census
node --stack-size=8000 analyze2.mjs /path/to/script.js   # globals + unused locals

# số liệu thô
wc -lc script.js
grep -c 'pcall(' script.js
grep -oE 'BindToRenderStep\("[^"]+"' script.js | sort -u
```

`analyze.mjs` / `analyze2.mjs` là 2 script Node dùng API
`parse`, `tokenize`, `analyzeScopes`, `getBinding`, `isGlobal`,
`isUnassignedGlobal` của `luau-parser`. Chúng đã được chạy thật trên
`script.js` trong phiên làm việc này; mọi con số ở mục 1 và 6 lấy trực tiếp
từ output của chúng.

---

## 9. Lưu ý về mặt sử dụng

Nội dung file là công cụ gian lận trong game Roblox (fly, noclip, speed hack,
ESP, anti-ban, auto server-hop) và có nạp/thực thi mã Lua từ Internet.
Việc dùng nó vi phạm Điều khoản dịch vụ của Roblox và có thể dẫn đến khoá tài
khoản. Báo cáo này chỉ phân tích kỹ thuật mã nguồn, không khuyến khích sử dụng.
