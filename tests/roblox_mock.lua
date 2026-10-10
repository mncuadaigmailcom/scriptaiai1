-- Mock môi trường Roblox + executor để CHẠY script.js ngoài Roblox (Lua 5.3).
-- Mục tiêu: phát hiện lỗi runtime, kiểm tra luồng tính năng và so sánh trước/sau khi sửa.
-- Không phải Roblox thật: API nào chưa mô phỏng sẽ báo lỗi rõ ràng ("not a valid member") để sửa mock.

local M = {}

-- ===================== trạng thái có thể đọc từ test =====================
M.errors = {}        -- lỗi xảy ra trong task/connection (Roblox chỉ in ra, nên ta gom lại)
M.printed = {}       -- print()
M.warned = {}        -- warn()
M.created = {}       -- mọi Instance đã tạo
M.clipboard = nil    -- setclipboard
M.applyCalls = {}    -- { humanoid = , desc = } mỗi lần ApplyDescription
M.httpLog = {}       -- { method =, url =, body = }
M.renderSteps = {}   -- BindToRenderStep
M.users = {}         -- lower(name) -> userId (dữ liệu giả)
M.profiles = {}      -- userId -> profile table (dữ liệu giả)
M.presence = {}      -- userId -> presence table
M.accessories = {}   -- userId -> list phụ kiện
M.failures = {}      -- bật lỗi giả: M.failures.apply = "msg", M.failures.thumb = true, ...
M.httpRoutes = {}    -- { method =, match = "chuỗi con của URL", status =, body =, delay =, error = }
M.clockT = 1000
M.sleepers = {}
M.playersList = {}   -- Player instances khác (ngoài LocalPlayer)
M.services = {}
M.lastCharacter = nil

local Instance_mt, Signal_mt, Conn_mt
local Vec3_mt, Vec2_mt, Color3_mt, UDim2_mt, UDim_mt, CFrame_mt, Enum_mt

-- ===================== JSON =====================
local function jsonEncode(v)
    local t = type(v)
    if v == nil then return "null" end
    if t == "boolean" then return v and "true" or "false" end
    if t == "number" then return string.format("%.14g", v) end
    if t == "string" then
        local s = v:gsub('[%c"\\]', function(c)
            if c == '"' then return '\\"' elseif c == "\\" then return "\\\\"
            elseif c == "\n" then return "\\n" elseif c == "\r" then return "\\r" elseif c == "\t" then return "\\t" end
            return string.format("\\u%04x", c:byte())
        end)
        return '"' .. s .. '"'
    end
    if t == "table" then
        local isArr, n = true, 0
        for k in pairs(v) do
            n = n + 1
            if type(k) ~= "number" then isArr = false end
        end
        if isArr and n == #v then
            local parts = {}
            for i = 1, #v do parts[i] = jsonEncode(v[i]) end
            return "[" .. table.concat(parts, ",") .. "]"
        end
        local keys = {}
        for k in pairs(v) do keys[#keys + 1] = tostring(k) end
        table.sort(keys)
        local parts = {}
        for _, k in ipairs(keys) do parts[#parts + 1] = jsonEncode(k) .. ":" .. jsonEncode(v[k]) end
        return "{" .. table.concat(parts, ",") .. "}"
    end
    error("cannot encode " .. t)
end

local function jsonDecode(s)
    local pos = 1
    local parseValue
    local function ws() pos = s:find("[^ \t\r\n]", pos) or (#s + 1) end
    local function parseString()
        pos = pos + 1
        local buf = {}
        while true do
            local c = s:sub(pos, pos)
            if c == "" then error("unterminated string") end
            if c == '"' then pos = pos + 1; break end
            if c == "\\" then
                local e = s:sub(pos + 1, pos + 1)
                if e == "u" then
                    local cp = tonumber(s:sub(pos + 2, pos + 5), 16)
                    buf[#buf + 1] = utf8.char(cp)
                    pos = pos + 6
                else
                    local map = { n = "\n", t = "\t", r = "\r", b = "\b", f = "\f" }
                    buf[#buf + 1] = map[e] or e
                    pos = pos + 2
                end
            else
                buf[#buf + 1] = c
                pos = pos + 1
            end
        end
        return table.concat(buf)
    end
    parseValue = function()
        ws()
        local c = s:sub(pos, pos)
        if c == "{" then
            pos = pos + 1
            local obj = {}
            ws()
            if s:sub(pos, pos) == "}" then pos = pos + 1; return obj end
            while true do
                ws()
                local key = parseString()
                ws()
                if s:sub(pos, pos) ~= ":" then error("expected ':' at " .. pos) end
                pos = pos + 1
                obj[key] = parseValue()
                ws()
                local d = s:sub(pos, pos)
                pos = pos + 1
                if d == "}" then break end
                if d ~= "," then error("expected ',' or '}' at " .. pos) end
            end
            return obj
        elseif c == "[" then
            pos = pos + 1
            local arr, n = {}, 0
            ws()
            if s:sub(pos, pos) == "]" then pos = pos + 1; return arr end
            while true do
                n = n + 1
                arr[n] = parseValue()
                ws()
                local d = s:sub(pos, pos)
                pos = pos + 1
                if d == "]" then break end
                if d ~= "," then error("expected ',' or ']' at " .. pos) end
            end
            return arr
        elseif c == '"' then
            return parseString()
        elseif s:sub(pos, pos + 3) == "true" then pos = pos + 4; return true
        elseif s:sub(pos, pos + 4) == "false" then pos = pos + 5; return false
        elseif s:sub(pos, pos + 3) == "null" then pos = pos + 4; return nil
        else
            local num = s:match("^-?%d+%.?%d*[eE]?[-+]?%d*", pos)
            if not num or num == "" then error("bad json at " .. pos) end
            pos = pos + #num
            return tonumber(num)
        end
    end
    local v = parseValue()
    return v
end

M.jsonEncode, M.jsonDecode = jsonEncode, jsonDecode

-- ===================== tín hiệu / kết nối =====================
Signal_mt = { __index = {} }
Signal_mt.__index.Connect = function(self, fn)
    local c = setmetatable({ Connected = true, fn = fn, sig = self }, Conn_mt)
    self.conns[#self.conns + 1] = c
    return c
end
Signal_mt.__index.Once = Signal_mt.__index.Connect
Signal_mt.__index.Wait = function(self) return nil end
Signal_mt.__index.DisconnectAll = function(self) for _, c in ipairs(self.conns) do c.Connected = false end self.conns = {} end
Conn_mt = { __index = {} }
Conn_mt.__index.Disconnect = function(self) self.Connected = false end
Conn_mt.__index.disconnect = Conn_mt.__index.Disconnect

local function newSignal(name)
    return setmetatable({ conns = {}, name = name }, Signal_mt)
end

local function fireSignal(sig, ...)
    local args = table.pack(...)
    for _, c in ipairs(sig.conns) do
        if c.Connected then
            local ok, err = pcall(c.fn, table.unpack(args, 1, args.n))
            if not ok then M.errors[#M.errors + 1] = "connection(" .. tostring(sig.name) .. "): " .. tostring(err) end
        end
    end
end
M.fireSignal = fireSignal

-- ===================== giá trị kiểu Roblox =====================
local function vec3(x, y, z) return setmetatable({ X = x or 0, Y = y or 0, Z = z or 0, __kind = "Vector3" }, Vec3_mt) end
local function vec2(x, y) return setmetatable({ X = x or 0, Y = y or 0, __kind = "Vector2" }, Vec2_mt) end
local function color3(r, g, b) return setmetatable({ R = r or 0, G = g or 0, B = b or 0, __kind = "Color3" }, Color3_mt) end
local function udim(s, o) return { Scale = s or 0, Offset = o or 0, __kind = "UDim" } end
local function udim2(xs, xo, ys, yo)
    return setmetatable({ X = udim(xs, xo), Y = udim(ys, yo), __kind = "UDim2" }, UDim2_mt)
end
local function cframe(x, y, z)
    local pos = type(x) == "table" and x or vec3(x, y, z)
    return setmetatable({ Position = pos, LookVector = vec3(0, 0, -1), RightVector = vec3(1, 0, 0), UpVector = vec3(0, 1, 0), __kind = "CFrame" }, CFrame_mt)
end
M.vec3, M.cframe = vec3, cframe

Vec3_mt = { __kind = "Vector3" }
Vec3_mt.__index = function(self, k)
    if k == "Magnitude" then return math.sqrt(self.X * self.X + self.Y * self.Y + self.Z * self.Z) end
    if k == "Unit" then local m = math.sqrt(self.X ^ 2 + self.Y ^ 2 + self.Z ^ 2); if m == 0 then return vec3() end return vec3(self.X / m, self.Y / m, self.Z / m) end
    if k == "Dot" then return function(a, b) return a.X * b.X + a.Y * b.Y + a.Z * b.Z end end
    if k == "Cross" then return function(a, b) return vec3(a.Y * b.Z - a.Z * b.Y, a.Z * b.X - a.X * b.Z, a.X * b.Y - a.Y * b.X) end end
    error("Vector3 has no member '" .. tostring(k) .. "'", 2)
end
Vec3_mt.__add = function(a, b) return vec3(a.X + b.X, a.Y + b.Y, a.Z + b.Z) end
Vec3_mt.__sub = function(a, b) return vec3(a.X - b.X, a.Y - b.Y, a.Z - b.Z) end
Vec3_mt.__mul = function(a, b)
    if type(a) == "number" then return vec3(a * b.X, a * b.Y, a * b.Z) end
    if type(b) == "number" then return vec3(a.X * b, a.Y * b, a.Z * b) end
    return vec3(a.X * b.X, a.Y * b.Y, a.Z * b.Z)
end
Vec3_mt.__div = function(a, n) return vec3(a.X / n, a.Y / n, a.Z / n) end
Vec3_mt.__unm = function(a) return vec3(-a.X, -a.Y, -a.Z) end
Vec3_mt.__eq = function(a, b) return a.X == b.X and a.Y == b.Y and a.Z == b.Z end
Vec3_mt.__tostring = function(a) return string.format("%g, %g, %g", a.X, a.Y, a.Z) end

Vec2_mt = { __kind = "Vector2" }
Vec2_mt.__index = function(self, k) error("Vector2 has no member '" .. tostring(k) .. "'", 2) end
Vec2_mt.__add = function(a, b) return vec2(a.X + b.X, a.Y + b.Y) end
Vec2_mt.__tostring = function(a) return string.format("%g, %g", a.X, a.Y) end

Color3_mt = { __kind = "Color3" }
Color3_mt.__index = function(self, k)
    if k == "Lerp" then return function(a, b, t) return color3(a.R + (b.R - a.R) * t, a.G + (b.G - a.G) * t, a.B + (b.B - a.B) * t) end end
    error("Color3 has no member '" .. tostring(k) .. "'", 2)
end
UDim2_mt = { __kind = "UDim2" }
UDim2_mt.__index = function(self, k) error("UDim2 has no member '" .. tostring(k) .. "'", 2) end
UDim2_mt.__add = function(a, b) return udim2(a.X.Scale + b.X.Scale, a.X.Offset + b.X.Offset, a.Y.Scale + b.Y.Scale, a.Y.Offset + b.Y.Offset) end
UDim2_mt.__tostring = function(a) return string.format("{%g,%g},{%g,%g}", a.X.Scale, a.X.Offset, a.Y.Scale, a.Y.Offset) end
CFrame_mt = { __kind = "CFrame" }
CFrame_mt.__index = function(self, k)
    if k == "X" then return self.Position.X end
    if k == "Y" then return self.Position.Y end
    if k == "Z" then return self.Position.Z end
    if k == "Lerp" then return function(a, b) return cframe(a.Position + (b.Position - a.Position) * 0.5) end end
    if k == "Inverse" then return function(a) return a end end
    if k == "ToWorldSpace" or k == "PointToWorldSpace" then return function(a, b) return b end end
    error("CFrame has no member '" .. tostring(k) .. "'", 2)
end
CFrame_mt.__mul = function(a, b)
    if type(b) == "table" and b.__kind == "Vector3" then return a.Position + b end
    return cframe(a.Position + (b.Position or vec3()))
end
CFrame_mt.__tostring = function(a) return "CFrame(" .. tostring(a.Position) .. ")" end

local function makeValueClasses()
    local V = {}
    V.Vector3 = { new = function(x, y, z) return vec3(x, y, z) end, zero = vec3(), one = vec3(1, 1, 1) }
    V.Vector2 = { new = function(x, y) return vec2(x, y) end, zero = vec2(0, 0), one = vec2(1, 1) }
    V.Color3 = {
        new = function(r, g, b) return color3(r, g, b) end,
        fromRGB = function(r, g, b) return color3((r or 0) / 255, (g or 0) / 255, (b or 0) / 255) end,
        fromHSV = function(h, s, v) return color3(v, v, v) end,
    }
    V.UDim2 = { new = udim2, fromOffset = function(x, y) return udim2(0, x, 0, y) end, fromScale = function(x, y) return udim2(x, 0, y, 0) end }
    V.UDim = { new = function(s, o) return setmetatable(udim(s, o), { __index = function(_, k) error("UDim has no member " .. k) end }) end }
    V.CFrame = {
        new = function(x, y, z, ...) return cframe(x, y, z) end,
        Angles = function() return cframe() end,
        lookAt = function(p) return cframe(p) end,
        fromEulerAnglesXYZ = function() return cframe() end,
    }
    V.TweenInfo = { new = function(t, style, dir, rep, rev, delay) return { Time = t or 1, EasingStyle = style, EasingDirection = dir, __kind = "TweenInfo" } end }
    V.ColorSequence = { new = function(a, b) return { __kind = "ColorSequence", a = a, b = b } end }
    V.NumberSequence = { new = function(a, b) return { __kind = "NumberSequence", a = a, b = b } end }
    V.NumberRange = { new = function(a, b) return { __kind = "NumberRange", Min = a, Max = b or a } end }
    V.Rect = { new = function(a, b, c, d) return { __kind = "Rect", Min = a, Max = b } end }
    V.Ray = { new = function(o, d) return { __kind = "Ray", Origin = o, Direction = d } end }
    V.RaycastParams = { new = function() return { FilterType = nil, FilterDescendantsInstances = {}, IgnoreWater = false, __kind = "RaycastParams" } end }
    return V
end
M.valueClasses = makeValueClasses()

Enum_mt = {}
local enumCache = {}
local Enum = setmetatable({}, {
    __index = function(t, group)
        local g = enumCache[group]
        if not g then
            g = setmetatable({}, { __index = function(gt, item)
                local it = { Name = item, Value = #item, __kind = "EnumItem", EnumType = group }
                rawset(gt, item, it)
                return it
            end })
            enumCache[group] = g
        end
        return g
    end,
})
M.Enum = Enum

-- ===================== instance =====================
local EVENTS = {
    Activated = true, MouseButton1Click = true, MouseButton1Down = true, MouseButton1Up = true, MouseButton2Click = true,
    FocusLost = true, Focused = true, Changed = true, ChildAdded = true, ChildRemoved = true, DescendantAdded = true,
    CharacterAdded = true, CharacterRemoving = true, PlayerRemoving = true, PlayerAdded = true, InputBegan = true,
    InputEnded = true, InputChanged = true, MessageOut = true, ErrorMessageChanged = true, TeleportInitFailed = true,
    Heartbeat = true, RenderStepped = true, Stepped = true, Touched = true, TouchEnded = true, Triggered = true,
    MouseEnter = true, MouseLeave = true, Died = true, Destroying = true, AncestryChanged = true, Completed = true,
    HealthChanged = true, Equipped = true, Unequipped = true, Changed2 = true, OnClientEvent = true, OnServerEvent = true,
    Button1Down = true, Button1Up = true, Idled = true, MouseMoved = true, Chatted = true,
    DescendantRemoving = true, ChildAdded2 = true, Stepped2 = true, PrimaryPartCFrameChanged = true,
    StateChanged = true, Ended = true, Resumed = true, ScaleChanged = true, GetPropertyChangedSignal2 = true,
}

-- Giá trị mặc định cho thuộc tính đọc chưa được gán (giống Roblox)
local DEFAULT_PROPS = {
    Text = "", PlaceholderText = "", Image = "", ToolTip = "", ContentText = "", RichText = false,
    Visible = true, Enabled = true, Active = false, Selectable = true,
    BackgroundTransparency = 0, TextTransparency = 0, ImageTransparency = 0, Transparency = 0,
    ZIndex = 1, LayoutOrder = 0, BorderSizePixel = 1, Rotation = 0, ScrollBarThickness = 0,
    TextSize = 14, TextWrapped = false, ClearTextOnFocus = true, MultiLine = false, TextEditable = true,
    TextScaled = false, Font = nil, AutomaticSize = 0, ClipsDescendants = false, ScaleType = nil,
    Value = nil, Anchored = false, CanCollide = true, Massless = false, Mass = 1,
    WalkSpeed = 16, JumpPower = 50, JumpHeight = 7.2, Health = 100, MaxHealth = 100, UseJumpPower = true,
    HipHeight = 2, Sit = false, AutoRotate = true, PlatformStand = false, FloorMaterial = nil,
    FieldOfView = 70, CameraType = nil, Gravity = 196.2, PlaceId = 111, JobId = "job-current",
    Name = nil, ClassName = nil, Parent = nil, Archivable = true,
    Locked = false, SelectionBehavior = nil,
}

local BASE_CLASS = {
    Humanoid = "Instance", BasePart = "Instance", Part = "BasePart", MeshPart = "BasePart", Model = "Instance",
    Frame = "GuiObject", TextLabel = "GuiObject", TextButton = "GuiObject", TextBox = "GuiObject", ImageLabel = "GuiObject",
    ImageButton = "GuiObject", ScrollingFrame = "GuiObject", GuiObject = "Instance", ScreenGui = "LayerCollector",
    LayerCollector = "Instance", UIStroke = "Instance",
}

local function isA(obj, cls)
    local c = obj.ClassName
    while c do
        if c == cls then return true end
        c = BASE_CLASS[c]
    end
    return false
end

local function allChildren(obj) return obj.__children end

local function findChild(obj, name, recursive)
    for _, ch in ipairs(obj.__children) do
        if ch.Name == name then return ch end
    end
    if recursive then
        for _, ch in ipairs(obj.__children) do
            local f = findChild(ch, name, true)
            if f then return f end
        end
    end
    return nil
end

local function descendants(obj, out)
    out = out or {}
    for _, ch in ipairs(obj.__children) do
        out[#out + 1] = ch
        descendants(ch, out)
    end
    return out
end
M.descendants = descendants

local function destroy(obj)
    if obj.__destroyed then return end
    obj.__destroyed = true
    for _, ch in ipairs(obj.__children) do destroy(ch) end
    if obj.__parent then
        local list = obj.__parent.__children
        for i, ch in ipairs(list) do if ch == obj then table.remove(list, i) break end end
    end
    obj.__parent = nil
end

local function setParent(obj, parent)
    if obj.__parent then
        local list = obj.__parent.__children
        for i, ch in ipairs(list) do if ch == obj then table.remove(list, i) break end end
    end
    obj.__parent = parent
    if parent then
        parent.__children[#parent.__children + 1] = obj
    end
end

local METHODS = {}

METHODS.Destroy = function(self) destroy(self) end
METHODS.ClearAllChildren = function(self) for _, ch in ipairs({ table.unpack(self.__children) }) do destroy(ch) end end
METHODS.GetChildren = function(self) return { table.unpack(self.__children) } end
METHODS.GetDescendants = function(self) return descendants(self) end
METHODS.FindFirstChild = function(self, name, recursive) return findChild(self, name, recursive) end
METHODS.FindFirstChildOfClass = function(self, cls)
    for _, ch in ipairs(self.__children) do if ch.ClassName == cls then return ch end end
    return nil
end
METHODS.FindFirstChildWhichIsA = function(self, cls)
    for _, ch in ipairs(self.__children) do if isA(ch, cls) then return ch end end
    return nil
end
METHODS.WaitForChild = function(self, name, timeout)
    local c = findChild(self, name)
    return c
end
METHODS.IsA = function(self, cls) return isA(self, cls) end
METHODS.IsDescendantOf = function(self, anc)
    local p = self
    while p do if p == anc then return true end p = p.__parent end
    return false
end
METHODS.GetPropertyChangedSignal = function(self, name)
    self.__ev["__prop_" .. name] = self.__ev["__prop_" .. name] or newSignal(name)
    return self.__ev["__prop_" .. name]
end
METHODS.Clone = function(self)
    local c = M.newInstance(self.ClassName)
    for k, v in pairs(self.__props) do c.__props[k] = v end
    c.Name = self.Name
    return c
end
METHODS.GetAttribute = function(self, k) return self.__attrs[k] end
METHODS.SetAttribute = function(self, k, v) self.__attrs[k] = v end
METHODS.CaptureFocus = function(self) self.__focused = true end
METHODS.ReleaseFocus = function(self, submit) self.__focused = false end
METHODS.GetMouse = function(self) return M.newInstance("Mouse") end
METHODS.GetPivot = function(self) return cframe() end
METHODS.PivotTo = function(self, cf) self.__props.CFrame = cf end
METHODS.GetBoundingBox = function(self) return cframe(), vec3(4, 5, 4) end
METHODS.Play = function(self) self.__playing = true end
METHODS.Pause = function(self) self.__playing = false end
METHODS.Cancel = function(self) self.__playing = false end
METHODS.Kick = function(self, msg) self.__kicked = msg end
METHODS.ApplyDescription = function(self, desc)
    if M.failures.apply then error(M.failures.apply, 0) end
    self.__appliedDesc = desc
    M.applyCalls[#M.applyCalls + 1] = { humanoid = self, desc = desc }
end
METHODS.GetAppliedDescription = function(self)
    if M.failures.getApplied then error("GetAppliedDescription failed", 0) end
    return self.__appliedDesc or M.ownDesc
end
METHODS.TakeDamage = function(self, n) self.Health = self.Health - n end
METHODS.MoveTo = function(self, p) self.__moveTo = p end
METHODS.Raycast = function(self) return nil end
METHODS.GetAccessories = function(self) return self.__accessories or {} end
METHODS.GetPlayers = function(self) return M.getPlayers() end
METHODS.GetPlayerByUserId = function(self, id) return M.getPlayerByUserId(id) end
METHODS.GetUserIdFromNameAsync = function(self, name)
    local id = M.users[string.lower(tostring(name))]
    if not id then error("Couldn't find user " .. tostring(name), 0) end
    return id
end
METHODS.GetUserThumbnailAsync = function(self, id, ttype, size)
    if M.failures.thumb then error("thumbnail API failed", 0) end
    return "rbxthumb://type=AvatarThumbnail&id=" .. tostring(id) .. "&w=420&h=420", true
end
METHODS.GetHumanoidDescriptionFromUserId = function(self, id)
    if M.failures.desc then error("Failed to get HumanoidDescription for " .. tostring(id), 0) end
    local d = M.descs[id]
    if not d then error("HumanoidDescription not found for userId " .. tostring(id), 0) end
    return d
end
METHODS.GetCharacterAppearanceInfoAsync = function(self, id) return { assets = {} } end
METHODS.JSONEncode = function(self, v) return jsonEncode(v) end
METHODS.JSONDecode = function(self, s) return jsonDecode(s) end
METHODS.GenerateGUID = function(self) return "00000000-0000-0000-0000-000000000000" end
METHODS.BindToRenderStep = function(self, name, prio, fn) M.renderSteps[name] = fn end
METHODS.UnbindFromRenderStep = function(self, name) M.renderSteps[name] = nil end
METHODS.GetService = function(self, name) return M.getService(name) end
METHODS.HttpGet = function(self, url) return M.httpCall("GET", url, nil, true) end
METHODS.GetAsync = function(self, url) return M.httpCall("GET", url, nil, true) end
METHODS.RequestAsync = function(self, opts) return M.requestAsync(opts) end
METHODS.Teleport = function(self, placeId, player) M.teleports = (M.teleports or 0) + 1 end
METHODS.TeleportToPlaceInstance = function(self, placeId, jobId, player) M.lastTeleportJob = jobId end
METHODS.Create = function(self, obj, info, goal) return M.newInstance("Tween", { Object = obj, Goal = goal }) end
METHODS.GetFocusedTextBox = function(self) return nil end
METHODS.GetMouseLocation = function(self) return vec2(0, 0) end
METHODS.IsKeyDown = function(self) return false end
METHODS.IsMouseButtonPressed = function(self) return false end
METHODS.GetKeysPressed = function(self) return {} end
METHODS.GetConnectedGamepads = function(self) return {} end
METHODS.SetCore = function(self) return nil end
METHODS.GetCoreGuiEnabled = function(self) return true end
METHODS.SetCoreGuiEnabled = function(self) return nil end
METHODS.GetUserInfosByUserIdsAsync = function(self) return {} end
METHODS.GetFriendsOnline = function(self) return {} end
METHODS.IsFriendsWith = function(self) return false end
METHODS.GetFriendCountAsync = function(self) return 0 end

-- Thuộc tính đặc biệt: đọc/ghi qua __props
local SPECIAL_READ = {
    Position = function(self)
        local cf = self.__props.CFrame or cframe(0, 0, 0)
        return cf.Position
    end,
}

local function instanceIndex(self, k)
    if type(k) == "string" and string.sub(k, 1, 2) == "__" then return rawget(self, k) end
    local props = rawget(self, "__props")
    if props and props[k] ~= nil then return props[k] end
    if k == "Name" then return rawget(self, "__name") or self.ClassName end
    if k == "Parent" then return rawget(self, "__parent") end
    if k == "ClassName" then return rawget(self, "__class") end
    if k == "__children" or k == "__ev" or k == "__props" then return rawget(self, k) end
    if METHODS[k] then return function(...) return METHODS[k](...) end end
    if EVENTS[k] then
        local ev = rawget(self, "__ev")
        ev[k] = ev[k] or newSignal(k)
        return ev[k]
    end
    if SPECIAL_READ[k] then
        local v = SPECIAL_READ[k](self)
        if v ~= nil then return v end
    end
    if k == "Position" and (self.ClassName == "Frame" or self.ClassName == "TextLabel" or self.ClassName == "ImageLabel" or self.ClassName == "TextButton" or self.ClassName == "TextBox" or self.ClassName == "ImageButton" or self.ClassName == "ScrollingFrame") then
        return udim2(0, 0, 0, 0)
    end
    if k == "Name" then return self.ClassName end
    if k == "Changed" then return rawget(self, "__ev").Changed end
    if DEFAULT_PROPS[k] ~= nil then return DEFAULT_PROPS[k] end
    if k == "Font" then return Enum.Font.SourceSans end
    if k == "CFrame" then return cframe(0, 0, 0) end
    if k == "Size" then
        if self.ClassName == "Part" or self.ClassName == "BasePart" or self.ClassName == "MeshPart" then return vec3(2, 2, 1) end
        return udim2(0, 0, 0, 0)
    end
    if k == "AbsoluteSize" or k == "AbsolutePosition" or k == "ViewportSize" or k == "CanvasPosition" or k == "AnchorPoint" then
        return vec2(0, 0)
    end
    if k == "CanvasSize" then return udim2(0, 0, 0, 0) end
    if k == "Velocity" or k == "AssemblyLinearVelocity" or k == "AssemblyAngularVelocity" then return vec3() end
    if k == "LookVector" then return vec3(0, 0, -1) end
    if k == "Parent" then return rawget(self, "__parent") end
    if k == "Character" and self.ClassName == "Player" then return rawget(self, "__character") end
    if k == "Health" then return 100 end
    if k == "RootPart" then return findChild(self, "HumanoidRootPart") end
    if k == "PrimaryPart" then return findChild(self, "HumanoidRootPart") end
    if k == "CurrentCamera" then return nil end
    if k == "UserId" then return rawget(self, "__userId") end
    if k == "DisplayName" then return rawget(self, "__name") end
    if k == "Keys" then return nil end
    if k == "Value" and (self.ClassName == "NumberValue" or self.ClassName == "IntValue") then return 0 end
    if k == "Value" and self.ClassName == "BoolValue" then return false end
    if k == "Value" and self.ClassName == "StringValue" then return "" end
    if k == "Text" then return "" end
    error(string.format("'%s' is not a valid member of %s '%s'", tostring(k), tostring(self.ClassName), tostring(rawget(self, "__name") or "")), 2)
end

local function instanceNewIndex(self, k, v)
    if type(k) == "string" and string.sub(k, 1, 2) == "__" then rawset(self, k, v) return end
    if k == "Parent" then
        setParent(self, v)
        return
    end
    if k == "Name" then rawset(self, "__name", v) return end
    if k == "Position" and self.__props.CFrame and type(v) == "table" and v.__kind == "Vector3" then
        self.__props.CFrame = cframe(v)
        return
    end
    local props = rawget(self, "__props")
    props[k] = v
end

Instance_mt = { __index = instanceIndex, __newindex = instanceNewIndex, __tostring = function(self) return tostring(rawget(self, "__name") or self.ClassName) end }

function M.newInstance(cls, parent)
    local inst = setmetatable({
        __class = cls, __name = nil, __parent = nil, __children = {}, __props = {}, __ev = {}, __attrs = {},
    }, Instance_mt)
    rawset(inst, "__name", cls)
    if cls == "Humanoid" then inst.__props.WalkSpeed = 16 end
    M.created[#M.created + 1] = inst
    if parent ~= nil then inst.Parent = parent end
    return inst
end

-- ===================== task / thời gian =====================
local currentCo = nil

local function resume(co, ...)
    local prev = currentCo
    currentCo = co
    local ok, err = coroutine.resume(co, ...)
    currentCo = prev
    if not ok then M.errors[#M.errors + 1] = "task: " .. tostring(err) end
    return ok
end

local task = {}
function task.spawn(f, ...)
    local co = coroutine.create(f)
    resume(co, ...)
    return co
end
function task.defer(f, ...)
    local co = coroutine.create(f)
    M.sleepers[#M.sleepers + 1] = { at = M.clockT, co = co, args = table.pack(...) }
    return co
end
function task.delay(t, f, ...)
    local co = coroutine.create(f)
    M.sleepers[#M.sleepers + 1] = { at = M.clockT + (tonumber(t) or 0), co = co, args = table.pack(...) }
    return co
end
function task.wait(t)
    t = tonumber(t) or 1 / 60
    if coroutine.isyieldable() then
        M.sleepers[#M.sleepers + 1] = { at = M.clockT + t, co = coroutine.running() }
        coroutine.yield()
        return t, M.clockT, t
    end
    M.advance(t)
    return t, M.clockT, t
end
function task.cancel(co)
    for i, s in ipairs(M.sleepers) do if s.co == co then table.remove(M.sleepers, i) break end end
    pcall(function() M.killed = (M.killed or 0) + 1 end)
    return true
end

-- Chạy các task đang chờ tới thời điểm clock + dt (thời gian ảo)
function M.advance(dt)
    local target = M.clockT + (tonumber(dt) or 0)
    while true do
        local best, bi = nil, nil
        for i, s in ipairs(M.sleepers) do
            if s.at <= target and (best == nil or s.at < best.at) then best, bi = s, i end
        end
        if not best then break end
        table.remove(M.sleepers, bi)
        M.clockT = math.max(M.clockT, best.at)
        if best.args then resume(best.co, table.unpack(best.args, 1, best.args.n)) else resume(best.co) end
    end
    M.clockT = target
end

-- Gọi mọi render step đang bind (mô phỏng vài khung hình)
function M.stepFrames(n, dt)
    for _ = 1, (n or 1) do
        for name, fn in pairs(M.renderSteps) do
            local ok, err = pcall(fn, dt or 1 / 60)
            if not ok then M.errors[#M.errors + 1] = "renderstep(" .. name .. "): " .. tostring(err) end
        end
    end
end

-- ===================== HTTP =====================
function M.requestAsync(opts)
    local method = string.upper(tostring(opts.Method or opts.method or "GET"))
    local url = tostring(opts.Url or opts.url or "")
    local body = opts.Body or opts.body
    M.httpLog[#M.httpLog + 1] = { method = method, url = url, body = body }
    for _, r in ipairs(M.httpRoutes) do
        local bodyOk = (r.bodyMatch == nil) or (body ~= nil and string.find(tostring(body), r.bodyMatch, 1, true) ~= nil)
        if bodyOk and (r.method == nil or r.method == method) and string.find(url, r.match, 1, true) then
            if r.delay then task.wait(r.delay) end
            if r.error then error(r.error, 0) end
            local code = r.status or 200
            local bodyStr = r.body
            if r.handler then
                code, bodyStr = r.handler(method, url, body)
                if code == nil then goto continue end
            end
            if type(bodyStr) == "table" then bodyStr = jsonEncode(bodyStr) end
            return { Success = code >= 200 and code < 300, StatusCode = code, Body = bodyStr or "", Headers = {} }
        end
        ::continue::
    end
    return { Success = false, StatusCode = 404, Body = "{}", Headers = {} }
end

function M.httpCall(method, url, body, isGame)
    local r = M.requestAsync({ Method = method, Url = url, Body = body })
    if not r.Success then error("HttpGet failed: " .. tostring(r.StatusCode), 0) end
    return r.Body
end

-- ===================== dịch vụ / game =====================
local function newService(name)
    local s = M.newInstance(name)
    s.__props.Name = name
    return s
end

function M.getService(name)
    if M.services[name] then return M.services[name] end
    error("Unknown service: " .. tostring(name), 0)
end

M.game = nil
M.workspace = nil
M.localPlayer = nil

function M.getPlayers()
    local out = { M.localPlayer }
    for _, p in ipairs(M.playersList) do out[#out + 1] = p end
    return out
end
function M.getPlayerByUserId(id)
    for _, p in ipairs(M.getPlayers()) do if p.UserId == id then return p end end
    return nil
end

function M.addPlayer(name, userId)
    local p = M.newInstance("Player")
    p.Name = name
    p.__userId = userId
    p.__props.UserId = userId
    M.playersList[#M.playersList + 1] = p
    M.fireSignal(M.services.Players.PlayerAdded and M.services.Players.PlayerAdded or newSignal("PlayerAdded"), p)
    return p
end

-- Tạo nhân vật mới cho LocalPlayer (mô phỏng respawn) và bắn CharacterAdded
function M.spawnCharacter()
    local old = M.localPlayer.__character
    if old then destroy(old) end
    local char = M.newInstance("Model")
    char.Name = "Tester"
    local hum = M.newInstance("Humanoid", char)
    hum.Name = "Humanoid"
    local root = M.newInstance("Part", char)
    root.Name = "HumanoidRootPart"
    local head = M.newInstance("Part", char)
    head.Name = "Head"
    M.localPlayer.__character = char
    M.lastCharacter = char
    M.fireSignal(M.localPlayer.__ev.CharacterAdded or newSignal("CharacterAdded"), char)
    return char
end

-- Đặt lại toàn bộ môi trường cho một lần chạy test
function M.reset()
    M.errors, M.printed, M.warned, M.created = {}, {}, {}, {}
    M.clipboard = nil
    M.applyCalls, M.httpLog, M.renderSteps = {}, {}, {}
    M.users, M.profiles, M.presence, M.accessories = {}, {}, {}, {}
    M.failures, M.httpRoutes = {}, {}
    M.descs = {}
    M.sleepers, M.playersList = {}, {}
    M.clockT = 1000
    M.teleports = 0
    M.lastTeleportJob = nil

    M.services = {}
    M.services.Players = newService("Players")
    M.services.Players.__ev.PlayerRemoving = newSignal("PlayerRemoving")
    M.services.Players.__ev.PlayerAdded = newSignal("PlayerAdded")
    M.services.Players.__props.Name = "Players"
    M.services.HttpService = newService("HttpService")
    M.services.TweenService = newService("TweenService")
    M.services.RunService = newService("RunService")
    M.services.RunService.__ev.Heartbeat = newSignal("Heartbeat")
    M.services.UserInputService = newService("UserInputService")
    M.services.TeleportService = newService("TeleportService")
    M.services.GuiService = newService("GuiService")
    M.services.LogService = newService("LogService")
    M.services.CoreGui = newService("CoreGui")
    M.services.ReplicatedStorage = newService("ReplicatedStorage")
    M.services.Lighting = newService("Lighting")
    M.services.Workspace = newService("Workspace")
    M.services.StarterGui = newService("StarterGui")

    M.localPlayer = M.newInstance("Player")
    M.localPlayer.Name = "Tester"
    M.localPlayer.__userId = 1
    M.localPlayer.__props.UserId = 1
    M.localPlayer.__ev.CharacterAdded = newSignal("CharacterAdded")
    M.localPlayer.__ev.CharacterRemoving = newSignal("CharacterRemoving")
    local pg = M.newInstance("PlayerGui", M.localPlayer)
    pg.Name = "PlayerGui"
    M.services.Players.__props.LocalPlayer = M.localPlayer
    M.ownDesc = nil

    M.workspace = M.newInstance("Workspace")
    M.workspace.Name = "Workspace"
    local cam = M.newInstance("Camera", M.workspace)
    cam.Name = "Camera"
    M.workspace.__props.CurrentCamera = cam
    M.workspace.__props.Gravity = 196.2

    M.game = M.newInstance("DataModel")
    M.game.Name = "Game"
    M.game.__props.PlaceId = 111
    M.game.__props.JobId = "job-current"
    M.game.__props.Workspace = M.workspace

    M.ownDesc = M.makeDesc(1, {})
    M.spawnCharacter()
    M.clipboard = nil
    M.spawnNoCharacterFlag = false
end

function M.makeDesc(userId, accessories)
    local d = M.newInstance("HumanoidDescription")
    d.Name = "HumanoidDescription"
    d.__accessories = accessories or {}
    d.__props.Shirt = 0
    d.__props.Pants = 0
    d.__props.HeadColor = color3(1, 0.8, 0.6)
    d.__props.userId = userId
    return d
end

-- Lấy hàm tiện ích: tìm instance trong cây theo tên/lớp
function M.findByName(name, root)
    for _, inst in ipairs(M.created) do
        if inst.Name == name and not inst.__destroyed and inst.__parent ~= nil then
            if not root or M.isDescendant(inst, root) then return inst end
        end
    end
    return nil
end
function M.isDescendant(inst, anc)
    local p = inst
    while p do if p == anc then return true end p = p.__parent end
    return false
end

-- Phát sự kiện (Activated, FocusLost, CharacterAdded...) lên một instance
function M.fire(inst, eventName, ...)
    local sig = rawget(inst, "__ev")[eventName]
    if sig then fireSignal(sig, ...) end
end

-- Chụp trạng thái UI/tính năng để so sánh trước & sau khi sửa (kiểm tra "không mất tính năng")
function M.snapshot()
    local names = {}
    for _, inst in ipairs(M.created) do
        if not inst.__destroyed and inst.__parent ~= nil then
            local n = tostring(rawget(inst, "__name") or "")
            if n ~= "" and n ~= inst.ClassName then names[#names + 1] = inst.ClassName .. ":" .. n end
        end
    end
    table.sort(names)
    local texts = {}
    for _, inst in ipairs(M.created) do
        if not inst.__destroyed and inst.__parent ~= nil and (inst.ClassName == "TextButton" or inst.ClassName == "TextLabel") then
            local t = tostring(inst.Text or "")
            if t ~= "" then texts[#texts + 1] = inst.ClassName .. ":" .. t end
        end
    end
    table.sort(texts)
    local gkeys = {}
    for k in pairs(_G) do
        if type(k) == "string" and string.sub(k, 1, 13) == "BananaCatHub_" then gkeys[#gkeys + 1] = k end
    end
    table.sort(gkeys)
    return { uiNames = names, texts = texts, globals = gkeys, printed = M.printed, errors = M.errors }
end

-- ===================== môi trường toàn cục =====================
local function installGlobals()
    local G = _G
    G.game = M.game
    G.workspace = M.workspace
    G.script = M.newInstance("Script")
    G.task = task
    G.spawn = function(f, ...) return task.spawn(f, ...) end
    G.delay = function(t, f, ...) return task.delay(t, f, ...) end
    G.wait = function(t) return task.wait(t) end
    G.tick = function() return M.clockT end
    G.time = function() return M.clockT - 1000 end
    G.typeof = function(v)
        local t = type(v)
        if t == "table" then
            if v.__kind then return v.__kind end
            if rawget(v, "__class") then return "Instance" end
            return "table"
        end
        if t == "userdata" then return "userdata" end
        return t
    end
    G.print = function(...)
        local parts = {}
        for i = 1, select("#", ...) do parts[i] = tostring((select(i, ...))) end
        M.printed[#M.printed + 1] = table.concat(parts, "\t")
    end
    G.warn = function(...)
        local parts = {}
        for i = 1, select("#", ...) do parts[i] = tostring((select(i, ...))) end
        M.warned[#M.warned + 1] = table.concat(parts, "\t")
    end
    G.Instance = { new = function(cls, parent) return M.newInstance(cls, parent) end }
    G.Enum = Enum
    G.setclipboard = nil  -- executor không có: script phải chịu được điều này
    G.utf8 = utf8
    G.unpack = table.unpack
    G.math.clamp = G.math.clamp or function(x, a, b) return math.max(a, math.min(b, x)) end
    G.math.sign = G.math.sign or function(x) return x > 0 and 1 or (x < 0 and -1 or 0) end
    G.table.find = G.table.find or function(t, v, init)
        for i = init or 1, #t do if t[i] == v then return i end end return nil
    end
    G.table.clear = G.table.clear or function(t) for k in pairs(t) do t[k] = nil end end
    G.table.freeze = G.table.freeze or function(t) return t end
    G.Vector3 = M.valueClasses.Vector3
    G.Vector2 = M.valueClasses.Vector2
    G.Color3 = M.valueClasses.Color3
    G.UDim2 = M.valueClasses.UDim2
    G.UDim = M.valueClasses.UDim
    G.CFrame = M.valueClasses.CFrame
    G.TweenInfo = M.valueClasses.TweenInfo
    G.ColorSequence = M.valueClasses.ColorSequence
    G.NumberSequence = M.valueClasses.NumberSequence
    G.NumberRange = M.valueClasses.NumberRange
    G.Rect = M.valueClasses.Rect
    G.Ray = M.valueClasses.Ray
    G.RaycastParams = M.valueClasses.RaycastParams
    G.gethui = nil
end

function M.installGlobals()
    installGlobals()
end

-- Bộ mô phỏng hàm executor để test (set/clear)
function M.executorFns(enable)
    if enable then
        _G.setclipboard = function(t) M.clipboard = tostring(t) end
        _G.writefile = nil
        _G.readfile = nil
    else
        _G.setclipboard = nil
    end
end

M.Signal = { new = newSignal, fire = fireSignal }
M.isA = isA

return M
