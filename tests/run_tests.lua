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
    M.descs[id] = M.makeDesc(id, opts.acc or { M.acc(101, "Hat"), M.acc(102, "Hair"), M.acc(103, "FaceAccessory") })
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
    eq(rowText(panel(), "Phụ kiện skin:"), "Phụ kiện skin: 3 món · đang giữ 3")
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
    registerUser(5150, "Ghost", { presence = { userPresenceType = 0, lastLocation = "Offline" }, acc = { M.acc(1, "Hat") } })
    searchFor("Ghost")
    noErrors()
    eq(rowText(panel(), "Phụ kiện skin:"), "Phụ kiện skin: 1 món · đang giữ 1")
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

test("GetHumanoidDescription lỗi → không có skin, nút thay nhân vật báo rõ, không dựng rig", function()
    runScript()
    registerUser(156, "Builderman")
    M.failures.desc = true
    searchFor("Builderman")
    noErrors()
    contains(rowText(panel(), "Phụ kiện skin:"), "không lấy được")
    contains(statusText(), "không có skin công khai")
    click(panel(), "Thay nhân vật")
    noErrors()
    contains(statusText(), "không có dữ liệu skin")
    eq(#M.rigCalls, 0, "không được dựng khi không có skin")
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

-- ===================== TEST: thay nhân vật (dựng rig phía client) =====================
local function puppets()
    local out = {}
    for _, inst in ipairs(M.created) do
        if inst.Name == "BC_Puppet" and not inst.__destroyed and inst.__parent ~= nil then out[#out + 1] = inst end
    end
    return out
end
local function ownChar() return M.localPlayer.__character end
local function ownHum() return ownChar():FindFirstChildOfClass("Humanoid") end
local function ownParts()
    local out = {}
    for _, d in ipairs(M.descendants(ownChar())) do if d.ClassName == "Part" then out[#out + 1] = d end end
    return out
end
local function allHidden(v)
    for _, p in ipairs(ownParts()) do if p.LocalTransparencyModifier ~= v then return false end end
    return true
end
local function accButtons(root)
    local list = within(root, function(d) return d.ClassName == "ScrollingFrame" and d.Name == "HubPlayerInfo_AccList" end)
    expect(list ~= nil, "thiếu danh sách phụ kiện")
    local out = {}
    for _, d in ipairs(M.descendants(list)) do if d.ClassName == "TextButton" then out[#out + 1] = d end end
    return out
end
local function accLabels(root)
    local list = within(root, function(d) return d.Name == "HubPlayerInfo_AccList" end)
    local out = {}
    for _, d in ipairs(M.descendants(list)) do if d.ClassName == "TextLabel" then out[#out + 1] = d.Text end end
    return out
end
local function accCount(model)
    local n = 0
    for _, c in ipairs(model:GetChildren()) do if c.ClassName == "Accessory" then n = n + 1 end end
    return n
end
local function viewModel()
    local wm = byName("HubPlayerInfo_WorldModel")
    expect(wm ~= nil, "thiếu WorldModel")
    local out = {}
    for _, c in ipairs(wm:GetChildren()) do if c.Name == "BC_ViewModel" then out[#out + 1] = c end end
    return out
end

test("lỗi gốc được tái hiện: ApplyDescription trực tiếp lên nhân vật do server tạo bị từ chối", function()
    runScript()
    local hum = ownHum()
    local ok, err = pcall(function() hum:ApplyDescription(M.descs[1] or M.ownDesc) end)
    expect(not ok, "mock phải từ chối ApplyDescription trên nhân vật server")
    contains(tostring(err), "backend server", "thông báo lỗi không khớp Roblox")
end)

test("thay nhân vật KHÔNG gọi ApplyDescription trên nhân vật server; báo thành công", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Thay nhân vật")
    noErrors()
    eq(#M.applyCalls, 0, "không được gọi ApplyDescription lên nhân vật server")
    contains(statusText(), "Đã thay nhân vật của bạn bằng của Builderman")
    eq(#puppets(), 1, "phải có đúng 1 rig")
end)

test("rig dựng từ skin của người kia: đủ phụ kiện, cùng kiểu rig với nhân vật của bạn", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Thay nhân vật")
    noErrors()
    local rig = puppets()[1]
    expect(rig ~= nil, "không có rig")
    eq(accCount(rig), 3, "rig thiếu phụ kiện")
    local last = M.rigCalls[#M.rigCalls]
    eq(last.rigType, ownHum().RigType, "rig khác kiểu với nhân vật của bạn")
    expect(rig:FindFirstChildOfClass("Humanoid") ~= nil, "rig không có Humanoid")
    expect(rig:FindFirstChild("HumanoidRootPart") ~= nil, "rig không có HumanoidRootPart")
end)

test("thân thật bị ẩn ở phía client; camera theo rig; nhân vật thật không bị khoá", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Thay nhân vật")
    noErrors()
    expect(allHidden(1), "thân thật chưa bị ẩn")
    eq(M.workspace.CurrentCamera.CameraSubject, puppets()[1]:FindFirstChildOfClass("Humanoid"), "camera không theo rig")
    eq(ownHum().WalkSpeed, 16, "nhân vật thật bị đổi tốc độ")
    expect(ownChar():FindFirstChild("HumanoidRootPart").Anchored == false, "nhân vật thật bị neo")
end)

test("trạng thái nhân vật thật (nhảy/rơi) được đồng bộ sang rig để animation khớp", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Thay nhân vật")
    M.stepFrames(1)
    ownHum().__state = M.Enum.HumanoidStateType.Jumping
    M.stepFrames(1)
    noErrors()
    local rigHum = puppets()[1]:FindFirstChildOfClass("Humanoid")
    eq(rigHum.__state, M.Enum.HumanoidStateType.Jumping, "rig không nhảy theo nhân vật thật")
    ownHum().__state = M.Enum.HumanoidStateType.Dead
    M.stepFrames(1)
    eq(rigHum.__state, M.Enum.HumanoidStateType.Jumping, "trạng thái Dead không được đồng bộ (rig vẫn sống)")
end)

test("rig bám theo nhân vật thật khi nhân vật di chuyển", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Thay nhân vật")
    ownChar():FindFirstChild("HumanoidRootPart").CFrame = M.cframe(10, 5, 0)
    M.stepFrames(1)
    noErrors()
    eq(puppets()[1].CFrame.Position.X, 10, "rig không bám theo X")
    eq(puppets()[1].CFrame.Position.Y, 5, "rig không bám theo Y")
    ownChar():FindFirstChild("HumanoidRootPart").CFrame = M.cframe(-4, 2, 7)
    M.stepFrames(3)
    noErrors()
    eq(puppets()[1].CFrame.Position.Z, 7, "rig không theo khi di chuyển tiếp")
end)

test("Animate của nhân vật được sao chép sang rig (có hoạt động đi/đứng)", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Thay nhân vật")
    local rig = puppets()[1]
    expect(rig:FindFirstChild("Animate") ~= nil, "thiếu Animate trên rig")
    expect(rig:FindFirstChildOfClass("Humanoid"):FindFirstChildOfClass("Animator") ~= nil, "thiếu Animator dưới Humanoid của rig")
    noErrors()
end)

test("tắt phụ kiện: rig, 3D và dòng tóm tắt đều cập nhật", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Thay nhân vật")
    local btns = accButtons(panel())
    eq(#btns, 3, "mỗi món phải có đúng 1 nút giữ/bỏ")
    M.fire(btns[1], "Activated")
    noErrors()
    eq(PI().last.keep[1], false, "chưa ghi nhận bỏ món 1")
    eq(accCount(puppets()[1]), 2, "rig vẫn còn món đã tắt")
    eq(accCount(viewModel()[1]), 2, "3D vẫn còn món đã tắt")
    eq(rowText(panel(), "Phụ kiện skin:"), "Phụ kiện skin: 3 món · đang giữ 2")
    eq(#M.descs[156].__accessories, 3, "dữ liệu gốc của người kia bị sửa")
    M.fire(accButtons(panel())[1], "Activated")
    eq(accCount(puppets()[1]), 3, "bật lại không khôi phục rig")
    noErrors()
end)

test("phân tích từng món: tên (MarketplaceService), loại, lớp/cứng, AssetId", function()
    runScript()
    registerUser(156, "Builderman")
    M.products[101] = { Name = "Mũ Xanh", Creator = { Name = "Roblox" } }
    searchFor("Builderman")
    noErrors()
    local labels = table.concat(accLabels(panel()), "\n")
    contains(labels, "Mũ Xanh", "thiếu tên món đã biết")
    contains(labels, "Hat · cứng · ID 101", "thiếu loại/AssetId")
    contains(labels, "Hair · cứng · ID 102", "thiếu món thứ 2")
    contains(labels, "không rõ tên", "món không có tên phải báo 'không rõ tên'")
end)

test("món lớp (layered) được đánh dấu 'lớp'", function()
    runScript()
    registerUser(156, "Builderman", { acc = { M.acc(900, "Jacket", true) } })
    searchFor("Builderman")
    noErrors()
    contains(table.concat(accLabels(panel()), "\n"), "Jacket · lớp · ID 900")
end)

test("nút Tắt hết / Bật hết", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Thay nhân vật")
    click(panel(), "Tắt hết")
    noErrors()
    eq(accCount(puppets()[1]), 0, "tắt hết nhưng rig vẫn còn phụ kiện")
    eq(rowText(panel(), "Phụ kiện skin:"), "Phụ kiện skin: 3 món · đang giữ 0")
    click(panel(), "Bật hết")
    noErrors()
    eq(accCount(puppets()[1]), 3, "bật hết chưa khôi phục đủ")
end)

test("3D: ViewportFrame + WorldModel + Camera; model người kia nằm trong WorldModel", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    noErrors()
    local vp = byName("HubPlayerInfo_Viewport")
    expect(vp ~= nil and vp.ClassName == "ViewportFrame", "thiếu ViewportFrame")
    expect(vp.CurrentCamera ~= nil and vp.CurrentCamera.ClassName == "Camera", "thiếu Camera cho ViewportFrame")
    eq(#viewModel(), 1, "thiếu model 3D")
    eq(byName("HubPlayerInfo_Thumb").Visible, false, "ảnh dự phòng vẫn hiện khi đã có 3D")
end)

test("kéo chuột trong khung 3D để xoay camera; thả chuột thì dừng", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    local vp = byName("HubPlayerInfo_Viewport")
    local uis = M.services.UserInputService
    local V2 = M.valueClasses.Vector2
    local p0 = PI().view.cam.CFrame.Position.X
    M.fire(vp, "InputBegan", { UserInputType = M.Enum.UserInputType.MouseButton1 })
    M.fire(uis, "InputChanged", { UserInputType = M.Enum.UserInputType.MouseMovement, Delta = V2.new(60, 0) })
    noErrors()
    local p1 = PI().view.cam.CFrame.Position.X
    expect(p1 ~= p0, "kéo không xoay camera")
    M.fire(uis, "InputEnded", { UserInputType = M.Enum.UserInputType.MouseButton1 })
    M.fire(uis, "InputChanged", { UserInputType = M.Enum.UserInputType.MouseMovement, Delta = V2.new(60, 0) })
    eq(PI().view.cam.CFrame.Position.X, p1, "vẫn xoay sau khi thả chuột")
    noErrors()
end)

test("cuộn chuột để zoom (khi con trỏ ở trong khung 3D); nút ➕ ➖ và 🎯 Đặt lại", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    local vp = byName("HubPlayerInfo_Viewport")
    local uis = M.services.UserInputService
    local d0 = PI().view.dist
    M.fire(uis, "InputChanged", { UserInputType = M.Enum.UserInputType.MouseWheel, Position = M.vec3(0, 0, 1) })
    eq(PI().view.dist, d0, "cuộn khi chuột không ở trong khung vẫn zoom")
    M.fire(vp, "MouseEnter")
    M.fire(uis, "InputChanged", { UserInputType = M.Enum.UserInputType.MouseWheel, Position = M.vec3(0, 0, 1) })
    expect(PI().view.dist < d0, "cuộn lên không zoom gần")
    local d1 = PI().view.dist
    click(panel(), "Xa")
    expect(PI().view.dist > d1, "nút Xa không hoạt động")
    click(panel(), "Gần")
    click(panel(), "Gần")
    expect(PI().view.dist < d1, "nút Gần không hoạt động")
    click(panel(), "Đặt lại")
    eq(PI().view.dist, 9, "đặt lại góc không khôi phục khoảng cách")
    noErrors()
end)

test("nút ⟲/⟳ xoay camera; tự xoay bật thì quay theo thời gian, tắt thì đứng yên", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    local y0 = PI().view.yaw
    click(panel(), "Trái")
    expect(PI().view.yaw ~= y0, "nút Trái không xoay")
    M.stepFrames(10, 0.1)
    noErrors()
    local y1 = PI().view.yaw
    expect(y1 ~= y0 + 0.5, "tự xoay không chạy")
    click(panel(), "Tự xoay")
    eq(PI().view.auto, false, "không tắt được tự xoay")
    M.stepFrames(5, 0.1)
    eq(PI().view.yaw, y1, "đã tắt tự xoay mà vẫn quay")
    noErrors()
end)

test("tra cứu người khác: model 3D cũ bị huỷ (không chồng)", function()
    runScript()
    registerUser(156, "Builderman")
    registerUser(999, "Other")
    searchFor("Builderman")
    searchFor("Other")
    noErrors()
    eq(#viewModel(), 1, "model 3D cũ còn sót")
end)

test("Trả nhân vật gốc: huỷ rig, hiện lại thân thật, camera về nhân vật của bạn", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Thay nhân vật")
    click(panel(), "Trả nhân vật gốc")
    noErrors()
    eq(#puppets(), 0, "rig chưa bị huỷ")
    expect(allHidden(0), "thân thật chưa hiện lại")
    eq(M.workspace.CurrentCamera.CameraSubject, ownHum(), "camera chưa về nhân vật của bạn")
    contains(statusText(), "Đã trả lại nhân vật gốc")
    M.stepFrames(3)
    noErrors()
    expect(PI().swap == nil, "còn trạng thái thay nhân vật")
end)

test("trả khi chưa thay: báo rõ, không lỗi", function()
    runScript()
    click(panel(), "Trả nhân vật gốc")
    noErrors()
    contains(statusText(), "chưa thay nhân vật")
end)

test("giữ sau respawn (mặc định BẬT): dựng lại rig trên nhân vật mới, không để rig cũ", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Thay nhân vật")
    local newChar = M.spawnCharacter()
    M.advance(1)
    noErrors()
    eq(#puppets(), 1, "số rig sau respawn phải là 1")
    eq(M.workspace.CurrentCamera.CameraSubject, puppets()[1]:FindFirstChildOfClass("Humanoid"), "camera không theo rig mới")
    expect(allHidden(1), "nhân vật mới chưa bị ẩn thân thật")
    eq(newChar:FindFirstChildOfClass("Humanoid").__serverOwned, true)
end)

test("tắt 'giữ sau respawn' thì respawn không thay nữa", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Thay nhân vật")
    click(panel(), "Giữ sau respawn")
    contains(findBtn(panel(), "Giữ sau respawn").Text, "TẮT")
    M.spawnCharacter()
    M.advance(1)
    noErrors()
    eq(#puppets(), 0, "vẫn thay dù đã tắt")
end)

test("đã trả nhân vật gốc thì respawn không thay lại", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    click(panel(), "Thay nhân vật")
    click(panel(), "Trả nhân vật gốc")
    M.spawnCharacter()
    M.advance(1)
    noErrors()
    eq(#puppets(), 0, "thay lại sau khi đã trả")
end)

test("không có nhân vật: báo lỗi rõ ràng, không dựng rig", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    M.localPlayer.__character = nil
    click(panel(), "Thay nhân vật")
    noErrors()
    contains(statusText(), "chưa có nhân vật")
    eq(#puppets(), 0, "vẫn dựng rig khi không có nhân vật")
end)

test("dựng rig lỗi: báo rõ, không kẹt nhân vật (không ẩn thân, không còn rig)", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    M.failures.rig = "Rig type mismatch"
    click(panel(), "Thay nhân vật")
    noErrors()
    contains(statusText(), "không dựng được nhân vật")
    contains(statusText(), "Rig type mismatch")
    expect(allHidden(0), "thân thật bị ẩn dù lỗi")
    eq(#puppets(), 0, "còn rig sau khi lỗi")
    expect(PI().swap == nil, "ghi nhận đang thay dù lỗi")
end)

test("không dựng được 3D: vẫn hiện hồ sơ + ảnh dự phòng, báo rõ", function()
    runScript()
    M.failures.rig = "viewport unavailable"
    registerUser(156, "Builderman")
    searchFor("Builderman")
    noErrors()
    contains(statusText(), "Đã tải hồ sơ Builderman")
    contains(statusText(), "không dựng được 3D")
    eq(byName("HubPlayerInfo_Thumb").Visible, true, "không hiện ảnh dự phòng")
    eq(rowText(panel(), "UserId:"), "UserId: 156")
end)

test("bật/tắt phụ kiện khi SetAccessories lỗi: báo lỗi, không crash", function()
    runScript()
    registerUser(156, "Builderman")
    searchFor("Builderman")
    M.failures.setAccessories = "accessory list invalid"
    M.fire(accButtons(panel())[1], "Activated")
    noErrors()
    contains(statusText(), "không đổi được phụ kiện")
end)

test("người không có skin công khai: không thay được, báo rõ", function()
    runScript()
    registerUser(156, "Builderman")
    M.failures.desc = true
    searchFor("Builderman")
    noErrors()
    contains(rowText(panel(), "Phụ kiện skin:"), "không lấy được")
    click(panel(), "Thay nhân vật")
    noErrors()
    contains(statusText(), "không có dữ liệu skin")
    eq(#M.rigCalls, 0, "dựng rig dù không có skin")
end)

test("người offline/không trong server: vẫn thay được nhân vật", function()
    runScript()
    registerUser(5150, "Ghost", { presence = { userPresenceType = 0, lastLocation = "Offline" }, acc = { M.acc(501, "Hat") } })
    searchFor("Ghost")
    noErrors()
    eq(rowText(panel(), "Phụ kiện skin:"), "Phụ kiện skin: 1 món · đang giữ 1")
    click(panel(), "Thay nhân vật")
    noErrors()
    eq(#M.applyCalls, 0)
    eq(accCount(puppets()[1]), 1, "rig của người offline thiếu phụ kiện")
end)

test("thay nhân vật lần 2 (người khác): rig cũ bị huỷ, không còn 2 rig", function()
    runScript()
    registerUser(156, "Builderman")
    registerUser(999, "Other")
    searchFor("Builderman")
    click(panel(), "Thay nhân vật")
    searchFor("Other")
    click(panel(), "Thay nhân vật")
    noErrors()
    eq(#puppets(), 1, "còn rig cũ")
    expect(allHidden(1), "thân thật không còn bị ẩn")
end)

test("nút Copy/Thay nhân vật/Trả trước khi tra cứu: báo 'hãy tra cứu trước'", function()
    runScript()
    click(panel(), "Thay nhân vật")
    contains(statusText(), "tra cứu một người")
    click(panel(), "Copy link hồ sơ")
    contains(statusText(), "tra cứu một người")
    noErrors()
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
