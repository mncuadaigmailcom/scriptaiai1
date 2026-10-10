-- Bộ test cho script.js (chạy bằng tests/run_tests.py, không cần Roblox).
-- Python truyền vào: SCRIPT_SRC (mã Lua đã chuyển từ Luau), MOCK_PATH, SNAPSHOT_OUT (tuỳ chọn).

local M = dofile(MOCK_PATH)

local ROUTES_BY_NAME = {}  -- tên -> dữ liệu (đồng bộ với M.users / M.profiles)

-- ===================== khung test tối thiểu =====================
local tests = {}
local function test(name, fn) tests[#tests + 1] = { name = name, fn = fn } end

local function expect(cond, msg) if not cond then error(msg or "điều kiện sai", 2) end end
local function eq(a, b, msg)
    if a ~= b then error((msg or "không bằng") .. ": nhận '" .. tostring(a) .. "', mong đợi '" .. tostring(b) .. "'", 2) end
end
local function contains(s, sub, msg)
    s = tostring(s or "")
    if not string.find(s, sub, 1, true) then error((msg or "thiếu chuỗi") .. ": '" .. sub .. "' trong '" .. s .. "'", 2) end
end

-- ===================== môi trường =====================
local function clearBananaGlobals()
    for k in pairs(_G) do
        if type(k) == "string" and string.sub(k, 1, 11) == "BananaCatHub" then _G[k] = nil end
    end
end

local function installDefaultRoutes()
    -- POST https://users.roblox.com/v1/usernames/users
    M.httpRoutes[#M.httpRoutes + 1] = {
        method = "POST", match = "users.roblox.com/v1/usernames/users",
        handler = function(method, url, body)
            if M.failures.usernames then return 500, "{}" end
            local req = M.jsonDecode(body or "{}")
            local out = {}
            for _, name in ipairs(req.usernames or {}) do
                local id = M.users[string.lower(name)]
                if id then
                    local p = M.profiles[id]
                    out[#out + 1] = { requestedUsername = name, id = id, name = p and p.name or name, displayName = p and p.displayName or name }
                end
                local d = M.nameDelay and M.nameDelay[string.lower(name)]
                if d then _G.task.wait(d) end
            end
            return 200, { data = out }
        end,
    }
    -- GET https://users.roblox.com/v1/users/{id}
    M.httpRoutes[#M.httpRoutes + 1] = {
        method = "GET", match = "users.roblox.com/v1/users/",
        handler = function(method, url, body)
            local id = tonumber(string.match(url, "/v1/users/(%d+)"))
            local p = id and M.profiles[id]
            if not p then return 404, { errors = { { message = "User not found" } } } end
            return 200, p
        end,
    }
    -- POST https://presence.roblox.com/v1/presence/users
    M.httpRoutes[#M.httpRoutes + 1] = {
        method = "POST", match = "presence.roblox.com/v1/presence/users",
        handler = function(method, url, body)
            if M.failures.presence then return 500, "{}" end
            local req = M.jsonDecode(body or "{}")
            local out = {}
            for _, id in ipairs(req.userIds or {}) do
                out[#out + 1] = M.presence[id] or { userPresenceType = 0, lastLocation = "Offline" }
            end
            return 200, { userPresences = out }
        end,
    }
    -- Ảnh dự phòng: thumbnails.roblox.com
    M.httpRoutes[#M.httpRoutes + 1] = {
        method = "GET", match = "thumbnails.roblox.com/v1/users/avatar",
        handler = function(method, url, body)
            local id = tonumber(string.match(url, "userIds=(%d+)")) or 0
            return 200, { data = { { targetId = id, imageUrl = "https://tr.rbxcdn.com/fallback-" .. id .. ".png" } } }
        end,
    }
end

-- Chạy script.js trong một "phiên" mới (như executor chạy lại script)
local function runScript(opts)
    opts = opts or {}
    clearBananaGlobals()
    M.reset()
    M.installGlobals()
    M.executorFns(opts.executor ~= false)
    installDefaultRoutes()
    local chunk, err = load(SCRIPT_SRC, "=script.js")
    if not chunk then return false, "lỗi biên dịch: " .. tostring(err) end
    local ok, e = pcall(chunk)
    return ok, e
end

local function registerUser(id, name, opts)
    opts = opts or {}
    if not opts.noName then M.users[string.lower(name)] = id end
    M.profiles[id] = {
        id = id, name = name, displayName = opts.displayName or (name .. " Display"),
        description = opts.desc or ("Mô tả của " .. name), created = "2010-05-01T00:00:00.000Z",
        isBanned = opts.banned or false, hasVerifiedBadge = opts.verified ~= false,
    }
    M.presence[id] = opts.presence
    M.descs[id] = M.makeDesc(id, opts.acc or { { name = "Hat" }, { name = "Hair" }, { name = "Face" } })
    return id
end

-- ===================== tiện ích tìm UI =====================
local function panel() return M.findByName("HubPlayerInfo_Panel") end
local function within(root, pred)
    for _, d in ipairs(M.descendants(root)) do if pred(d) then return d end end
    return nil
end
local function byName(name) return M.findByName(name) end
local function findBtn(root, sub)
    local b = within(root, function(d) return d.ClassName == "TextButton" and string.find(tostring(d.Text), sub, 1, true) ~= nil end)
    expect(b ~= nil, "không thấy nút chứa '" .. sub .. "'")
    return b
end
local function findLabel(root, prefix)
    return within(root, function(d) return d.ClassName == "TextLabel" and string.sub(tostring(d.Text), 1, #prefix) == prefix end)
end
local function rowText(root, prefix)
    local l = findLabel(root, prefix)
    expect(l ~= nil, "không thấy dòng '" .. prefix .. "'")
    return l.Text
end
local function queryBox(root) return byName("HubPlayerInfo_Query") end
local function statusText() local s = byName("HubPlayerInfo_Status") expect(s ~= nil, "thiếu nhãn trạng thái") return s.Text end
local function searchFor(text)
    local p = panel()
    local box = queryBox(p)
    box.Text = text
    M.fire(findBtn(p, "Tra cứu"), "Activated")
end
local function click(root, sub) M.fire(findBtn(root, sub), "Activated") end
local function PI() return _G.BananaCatHub_PlayerInfo end
local function httpCount(pattern)
    local n = 0
    for _, h in ipairs(M.httpLog) do if string.find(h.url, pattern, 1, true) then n = n + 1 end end
    return n
end
local function noErrors()
    if #M.errors > 0 then error("lỗi runtime: " .. table.concat(M.errors, " | "), 2) end
end

-- ===================== TEST: nạp script & tích hợp =====================
test("script.js nạp không lỗi và báo sẵn sàng", function()
    local ok, e = runScript()
    expect(ok, "script lỗi: " .. tostring(e))
    noErrors()
    local banner = false
    for _, line in ipairs(M.printed) do if string.find(line, "sẵn sàng", 1, true) then banner = true end end
    expect(banner, "không thấy dòng 'sẵn sàng'")
end)

test("panel tra cứu nằm trong tab 👥 Người Chơi (không đè các panel cũ)", function()
    runScript()
    local p = panel()
    expect(p ~= nil, "chưa tạo HubPlayerInfo_Panel")
    expect(p.Parent ~= nil and p.Parent.ClassName == "ScrollingFrame", "panel không nằm trong ScrollingFrame của tab")
    local obj = byName("HubObjTrack_Panel")
    expect(obj ~= nil, "mất HubObjTrack_Panel")
    local objBottom = obj.Position.Y.Offset + obj.Size.Y.Offset
    expect(p.Position.Y.Offset >= objBottom, "panel mới đè lên panel định vị vật (y=" .. p.Position.Y.Offset .. " < " .. objBottom .. ")")
    noErrors()
end)

test("các panel cũ vẫn còn và nút định vị vật vẫn đổi trạng thái", function()
    runScript()
    expect(byName("HubLoc_Panel") ~= nil, "mất HubLoc_Panel")
    expect(byName("HubSpec_Panel") ~= nil, "mất HubSpec_Panel")
    expect(byName("HubObjTrack_Panel") ~= nil, "mất HubObjTrack_Panel")
    expect(_G.BananaCatHub_ObjTrack ~= nil, "mất _G.BananaCatHub_ObjTrack")
    -- Chưa nhập tên vật thì nút phải báo cần nhập tên (hành vi cũ), không được lỗi runtime
    local objPanel = byName("HubObjTrack_Panel")
    click(objPanel, "Định vị: TẮT")
    noErrors()
    local said = false
    for _, w in ipairs(M.created) do
        if w.ClassName == "TextLabel" and string.find(tostring(w.Text), "nhập tên vật", 1, true) then said = true end
    end
    expect(said or string.find(tostring(M.printed[#M.printed] or ""), "nhập tên", 1, true), "nút định vị không phản hồi")
end)

-- ===================== TEST: tra cứu thông tin =====================
test("tra cứu theo tên: hiện đủ thông tin và ảnh (người không trong server)", function()
    runScript()
    registerUser(156, "Builderman", { presence = { userPresenceType = 0, lastLocation = "Website" } })
    searchFor("  Builderman  ")
    noErrors()
    contains(statusText(), "Đã tải hồ sơ Builderman")
    eq(rowText(panel(), "Tên:"), "Tên: @Builderman")
    eq(rowText(panel(), "UserId:"), "UserId: 156")
    eq(rowText(panel(), "Ngày tạo:"), "Ngày tạo: 2010-05-01")
    contains(rowText(panel(), "Trạng thái:"), "Offline")
    eq(rowText(panel(), "Trong server này:"), "Trong server này: KHÔNG")
    contains(rowText(panel(), "Huy hiệu"), "xác minh")
    eq(rowText(panel(), "Phụ kiện skin:"), "Phụ kiện skin: 3 món (có thể áp)")
    local img = byName("HubPlayerInfo_Thumb")
    contains(img.Image, "rbxthumb://", "ảnh đại diện không đúng")
    -- tên được gửi lên API đã cắt khoảng trắng
    local sent = false
    for _, h in ipairs(M.httpLog) do if h.body and string.find(h.body, '"Builderman"', 1, true) then sent = true end end
    expect(sent, "tên gửi lên API chưa được cắt khoảng trắng")
end)

test("tra cứu bằng UserId không gọi API tìm theo tên", function()
    runScript()
    registerUser(424, "SomeoneElse")
    searchFor("424")
    noErrors()
    eq(httpCount("usernames"), 0, "không được gọi usernames khi nhập số")
    eq(rowText(panel(), "UserId:"), "UserId: 424")
end)

test("người đang trong ĐÚNG server này được đánh dấu CÓ", function()
    runScript()
    M.addPlayer("Friend", 999)
    registerUser(999, "Friend", { presence = { userPresenceType = 2, lastLocation = "Blox Fruits", gameId = "job-current", placeId = 111 } })
    searchFor("Friend")
    noErrors()
    eq(rowText(panel(), "Trong server này:"), "Trong server này: CÓ")
    contains(rowText(panel(), "Trạng thái:"), "Đang trong game: Blox Fruits")
end)

test("đang chơi game khác (không phải server này) thì KHÔNG", function()
    runScript()
    registerUser(77, "OtherGuy", { presence = { userPresenceType = 2, lastLocation = "Doors", gameId = "job-other", placeId = 222 } })
    searchFor("77")
    noErrors()
    eq(rowText(panel(), "Trong server này:"), "Trong server này: KHÔNG")
    contains(rowText(panel(), "Trạng thái:"), "Doors")
end)

test("người offline lấy được skin (không cần có trong server)", function()
    runScript()
    registerUser(5150, "Ghost", { presence = { userPresenceType = 0, lastLocation = "Offline" }, acc = { { name = "A" } } })
    searchFor("Ghost")
    noErrors()
    eq(rowText(panel(), "Phụ kiện skin:"), "Phụ kiện skin: 1 món (có thể áp)")
    local p = panel()
    click(p, "Áp skin lên tôi")
    noErrors()
    eq(#M.applyCalls, 1, "phải áp được skin của người offline")
    eq(M.applyCalls[1].desc, M.descs[5150], "áp sai skin")
end)

test("UserId không tồn tại: báo lỗi rõ ràng, không làm hỏng trạng thái", function()
    runScript()
    searchFor("424242")
    noErrors()
    contains(statusText(), "UserId 424242 không tồn tại")
    expect(PI().last == nil, "không được lưu bản ghi lỗi")
end)

test("tên không tồn tại: báo không tìm thấy", function()
    runScript()
    searchFor("NoSuchUserXYZ")
    noErrors()
    contains(statusText(), "không tìm thấy người chơi 'NoSuchUserXYZ'")
end)

test("nhập sai định dạng/trống: báo lỗi và KHÔNG gửi HTTP", function()
    runScript()
    local before = #M.httpLog
    searchFor("12345678901234567890")
    contains(statusText(), "UserId không hợp lệ")
    searchFor("ab")
    contains(statusText(), "tên không hợp lệ")
    searchFor("bad name!")
    contains(statusText(), "tên không hợp lệ")
    searchFor("   ")
    contains(statusText(), "Chưa nhập")
    eq(#M.httpLog, before, "không được gửi request khi input sai")
    noErrors()
end)

test("API tìm theo tên lỗi mạng → tự dùng GetUserIdFromNameAsync", function()
    runScript()
    registerUser(156, "Builderman")
    M.httpRoutes[#M.httpRoutes + 1] = { method = "POST", match = "users.roblox.com/v1/usernames/users", error = "network down" }
    searchFor("Builderman")
    noErrors()
    contains(statusText(), "Đã tải hồ sơ Builderman")
end)

test("presence lỗi → vẫn hiện hồ sơ, trạng thái 'không rõ'", function()
    runScript()
    registerUser(156, "Builderman")
    M.failures.presence = true
    searchFor("Builderman")
    noErrors()
    contains(statusText(), "Đã tải hồ sơ")
    contains(rowText(panel(), "Trạng thái:"), "không rõ")
end)

test("GetHumanoidDescription lỗi → không có skin, nút áp skin báo rõ, không gọi ApplyDescription", function()
    runScript()
    registerUser(156, "Builderman")
    M.failures.desc = true
    searchFor("Builderman")
    noErrors()
    contains(rowText(panel(), "Phụ kiện skin:"), "không lấy được")
    contains(statusText(), "không có skin công khai")
    click(panel(), "Áp skin lên tôi")
    noErrors()
    contains(statusText(), "không có dữ liệu skin")
    eq(#M.applyCalls, 0, "không được áp khi không có skin")
end)

test("thumbnail API lỗi → dùng API dự phòng", function()
    runScript()
    registerUser(156, "Builderman")
    M.failures.thumb = true
    searchFor("Builderman")
    noErrors()
    eq(byName("HubPlayerInfo_Thumb").Image, "https://tr.rbxcdn.com/fallback-156.png")
end)

test("mô tả dài tiếng Việt được cắt an toàn theo ký tự UTF-8", function()
    runScript()
    local long = string.rep("Chào bạn, đây là phần mô tả dài có dấu tiếng Việt ", 10)
    registerUser(156, "Builderman", { desc = long })
    searchFor("Builderman")
    noErrors()
    local txt = rowText(panel(), "Mô tả:")
    expect(utf8.len(txt) ~= nil, "cắt làm hỏng UTF-8")
    contains(txt, "…")
    expect(utf8.len(txt) <= 150, "mô tả không được cắt")
end)

test("tra cứu mới hơn làm bỏ kết quả cũ (stale) đang chờ", function()
    runScript()
    registerUser(156, "Builderman")
    registerUser(777, "SlowUser")
    M.nameDelay = { slowuser = 2 }
    searchFor("SlowUser")                -- chờ 2 giây trong API
    searchFor("Builderman")              -- xong ngay
    noErrors()
    contains(statusText(), "Builderman")
    _G.task.wait(0) M.advance(3)         -- kết quả SlowUser về muộn
    noErrors()
    eq(rowText(panel(), "UserId:"), "UserId: 156", "kết quả cũ đè lên kết quả mới")
    contains(statusText(), "Builderman")
    M.nameDelay = nil
end)

test("nút Xoá huỷ kết quả đang chờ", function()
    runScript()
    registerUser(777, "SlowUser")
    M.nameDelay = { slowuser = 2 }
    searchFor("SlowUser")
    click(panel(), "Xoá")
    M.advance(3)
    noErrors()
    eq(rowText(panel(), "UserId:"), "UserId: —", "kết quả hiện sau khi đã Xoá")
    expect(PI().last == nil, "bản ghi cũ còn sau khi Xoá")
    M.nameDelay = nil
end)

test("Enter trong ô nhập tra cứu; rời ô không Enter thì không tra cứu", function()
    runScript()
    registerUser(156, "Builderman")
    local box = queryBox(panel())
    box.Text = "Builderman"
    M.fire(box, "FocusLost", false)
    eq(httpCount("usernames"), 0, "rời ô không Enter không được tra cứu")
    M.fire(box, "FocusLost", true)
    noErrors()
    contains(statusText(), "Đã tải hồ sơ Builderman")
end)

test("copy link hồ sơ và UserId (có setclipboard)", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("156")
    click(panel(), "Copy link hồ sơ")
    noErrors()
    eq(M.clipboard, "https://www.roblox.com/users/156/profile")
    click(panel(), "Copy UserId")
    eq(M.clipboard, "156")
end)

test("không có setclipboard: vẫn chạy, hiện link để copy tay", function()
    runScript({ executor = false })
    registerUser(156, "Builderman")
    searchFor("156")
    click(panel(), "Copy link hồ sơ")
    noErrors()
    contains(statusText(), "https://www.roblox.com/users/156/profile")
end)

-- ===================== TEST: áp / trả skin =====================
test("áp skin: gọi ApplyDescription đúng skin và lưu skin gốc", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Áp skin lên tôi")
    noErrors()
    eq(#M.applyCalls, 1, "số lần áp")
    eq(M.applyCalls[1].desc, M.descs[156], "áp sai skin")
    eq(PI().origDesc, M.ownDesc, "chưa lưu skin gốc")
    contains(statusText(), "Đã áp skin của Builderman")
end)

test("trả skin gốc: ApplyDescription với skin gốc của bạn", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Áp skin lên tôi")
    click(panel(), "Trả skin gốc")
    noErrors()
    eq(#M.applyCalls, 2, "số lần áp")
    eq(M.applyCalls[2].desc, M.ownDesc, "không trả đúng skin gốc")
    expect(PI().applied == nil, "vẫn ghi nhận đang áp skin")
    contains(statusText(), "Đã trả lại skin gốc")
end)

test("trả skin khi chưa áp: báo lỗi, không gọi API", function()
    runScript()
    click(panel(), "Trả skin gốc")
    noErrors()
    contains(statusText(), "chưa có skin gốc")
    eq(#M.applyCalls, 0)
end)

test("áp nhiều người liên tiếp: skin gốc vẫn là của bạn", function()
    runScript()
    registerUser(156, "Builderman")
    registerUser(999, "Other")
    searchFor("Builderman")
    click(panel(), "Áp skin lên tôi")
    searchFor("Other")
    click(panel(), "Áp skin lên tôi")
    eq(PI().origDesc, M.ownDesc, "skin gốc bị ghi đè bởi skin người khác")
    click(panel(), "Trả skin gốc")
    noErrors()
    eq(M.applyCalls[#M.applyCalls].desc, M.ownDesc, "trả sai skin")
end)

test("không có nhân vật: báo lỗi rõ ràng", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    M.localPlayer.__character = nil
    click(panel(), "Áp skin lên tôi")
    noErrors()
    contains(statusText(), "chưa có nhân vật")
    eq(#M.applyCalls, 0)
end)

test("ApplyDescription lỗi: báo lỗi, không ghi nhận đang áp", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    M.failures.apply = "Rig type mismatch"
    click(panel(), "Áp skin lên tôi")
    noErrors()
    contains(statusText(), "áp skin lỗi")
    contains(statusText(), "Rig type mismatch")
    expect(PI().applied == nil, "ghi nhận đang áp dù lỗi")
end)

test("giữ skin sau respawn (mặc định BẬT): tự áp lại trên nhân vật mới", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Áp skin lên tôi")
    local newChar = M.spawnCharacter()
    M.advance(1)
    noErrors()
    eq(#M.applyCalls, 2, "không áp lại sau respawn")
    eq(M.applyCalls[2].desc, M.descs[156])
    eq(M.applyCalls[2].humanoid, newChar:FindFirstChildOfClass("Humanoid"), "áp nhầm nhân vật")
end)

test("tắt 'giữ skin sau respawn' thì không tự áp lại", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Áp skin lên tôi")
    click(panel(), "Giữ skin sau respawn")
    contains(findBtn(panel(), "Giữ skin sau respawn").Text, "TẮT")
    M.spawnCharacter()
    M.advance(1)
    noErrors()
    eq(#M.applyCalls, 1, "vẫn tự áp dù đã tắt")
end)

test("đã trả skin gốc thì respawn không áp lại", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Áp skin lên tôi")
    click(panel(), "Trả skin gốc")
    M.spawnCharacter()
    M.advance(1)
    noErrors()
    eq(#M.applyCalls, 2, "áp lại skin sau khi đã trả")
end)

test("nút Copy/áp skin trước khi tra cứu: báo 'hãy tra cứu trước'", function()
    runScript()
    click(panel(), "Áp skin lên tôi")
    contains(statusText(), "tra cứu một người")
    click(panel(), "Copy link hồ sơ")
    contains(statusText(), "tra cứu một người")
    noErrors()
end)

test("mở lại script (chạy lại) không nhân đôi panel và không lỗi", function()
    runScript()
    local ok, e = runScript()
    expect(ok, "chạy lại lỗi: " .. tostring(e))
    noErrors()
    local n = 0
    for _, inst in ipairs(M.created) do
        if inst.Name == "HubPlayerInfo_Panel" and inst.__parent ~= nil then n = n + 1 end
    end
    eq(n, 1, "số panel sau khi chạy lại")
end)

-- ===================== chạy =====================
local failed, passed = {}, 0
for _, t in ipairs(tests) do
    local ok, err = pcall(t.fn)
    if ok then
        passed = passed + 1
        io.write("  PASS  " .. t.name .. "\n")
    else
        failed[#failed + 1] = t.name
        io.write("  FAIL  " .. t.name .. "\n        -> " .. tostring(err) .. "\n")
    end
end
io.write(string.format("\nKết quả: %d/%d đạt, %d lỗi\n", passed, #tests, #failed))

if SNAPSHOT_OUT then
    runScript()
    local snap = M.snapshot()
    local f = assert(io.open(SNAPSHOT_OUT, "w"))
    f:write(M.jsonEncode({ uiNames = snap.uiNames, texts = snap.texts, globals = snap.globals, printed = snap.printed, errors = snap.errors }))
    f:close()
end

RESULT = { passed = passed, failed = #failed, total = #tests }
