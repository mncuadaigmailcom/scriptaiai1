--[[
    🍌 Banana Cat Hub — MÃ NGUỒN ĐẦY ĐỦ · OBSIDIAN NOIR + bố cục kiểu DELTA
    v4.43: 🔐 Anti Ban — máy chủ tự nhảy khác khi bị kick/ban hoặc máy chủ nghi ngờ.
    v4.42: rút gọn bình luận/tiêu đề — KHÔNG cắt chức năng, khung, thẻ hay hành vi.
    v4.41: chip Script Hub ẩn khung sai nhóm (Admin không còn 🦘/✨/🚀).
    v4.40: khung ⚙ TUỲ CHỈNH — 🚀 Bay · 💨 Tốc độ camera · 🦘 Skip cao · 👟 Di chuyển.
    v4.39: up tags Script Hub. v4.38 nhảy cao. v4.37 tốc độ theo camera. v4.36 bay theo camera.
    Giữ: 🚀/🛡 bay · 🧱 noclip · 🦘 nhảy · 💨 chạy nước rút · 🪩 thảm/kính · 📍👣 · ✨ · 👥 · ⚙️.
    Kiểm thử: node tests/run.js
--]]
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local HttpService = game:GetService("HttpService")
local TeleportService = game:GetService("TeleportService") -- v4.6.3: Reset / Hop / vào server theo mã

người chơi cục bộ = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")
camera cục bộ = workspace.CurrentCamera

local targetGui = playerGui
pcall(function()
    nếu gethui thì
        local hui = gethui()
        if hui then targetGui = hui end
    elseif game:GetService("CoreGui") then
        targetGui = game:GetService("CoreGui")
    kết thúc
kết thúc)

LÀM
    cục bộ cũ = _G.BananaCatHub_MV
    nếu cũ thì
        if old.StopAll then pcall(old.StopAll) end
        old._wdToken = nil
        if type(old._wd) == "thread" then pcall(task.cancel, old._wd) end
        old._wd = nil
    kết thúc
kết thúc

nếu _G.BananaCatHub_Connections thì
    for _, c in ipairs(_G.BananaCatHub_Connections) do
        pcall(function() c:Disconnect() end)
    kết thúc
kết thúc
_G.BananaCatHub_Connections = {}

pcall(function()
    cục bộ cũ = _G.BananaCatHub_SpecCam
    nếu old ~= nil thì
        local cam = workspace.CurrentCamera
        nếu có camera thì
            nếu old ~= Enum.CameraType.Scriptable thì
                pcall(function() cam.CameraType = old end)
            khác
                pcall(function() cam.CameraType = Enum.CameraType.Custom end)
            kết thúc
            pcall(function()
                local char = player and player.Character
                local hum = char and char:FindFirstChildOfClass("Humanoid")
                cục bộ gốc = char và char:FindFirstChild("HumanoidRootPart")
                nếu có tiếng "hum" thì cam.CameraSubject = hum end
                nếu là root thì
                    cam.CFrame = CFrame.new(root.Position + Vector3.new(0, 3.2, 12), root.Position + Vector3.new(0,1.5,0))
                    cam.Focus = CFrame.new(root.Position)
                kết thúc
            kết thúc)
        kết thúc
        _G.BananaCatHub_SpecCam = nil
    kết thúc
    pcall(function() RunService:UnbindFromRenderStep("BC_Spec") end)
kết thúc)

for _, parent in ipairs({targetGui, playerGui, game:GetService("CoreGui")}) do
    pcall(function()
        cục bộ cũ = cha:TìmConĐầuTiên("BananaCatHub_Crosshair")
        nếu cũ thì hủy bỏ cũ()
    kết thúc)
kết thúc

hàm cục bộ trackConn(conn)
    local t = _G.BananaCatHub_Connections
    nếu #t > 300 thì
        còn sống cục bộ, n = {}, 0
        for i = 1, #t do
            cục bộ c = t[i]
            if c ~= nil and c.Connected ~= false then n = n + 1; alive[n] = c end
        kết thúc
        for i = 1, #t do t[i] = live[i] end -- ngâm lên đầu; thành phần nhiều phần tử thành con số không
    kết thúc
    table.insert(t, conn)
    trả về kết nối
kết thúc

pcall(function() RunService:UnbindFromRenderStep("Fly") end)
pcall(function() RunService:UnbindFromRenderStep("Carpet") end)
pcall(function() RunService:UnbindFromRenderStep("BC_Speed") end)

cục bộ C = {
    TRẮNG = Color3.fromRGB(255, 255, 255),
    DARK = Color3.fromRGB(238, 241, 248), -- chữ chính trên nền tối
    GRAY = Color3.fromRGB(120, 128, 146), -- nút tắt / chữ phụ
    XANH LÁ CÂY = Color3.fromRGB(64, 214, 152),
    XANH DƯƠNG = Color3.fromRGB(79, 150, 240),
    ĐỎ = Color3.fromRGB(230, 88, 88),
    VÀNG = Color3.fromRGB(250, 204, 102),
    TÍM = Color3.fromRGB(155, 128, 245),
    CAM = Color3.fromRGB(251, 146, 60),
    HỒNG = Color3.fromRGB(226, 82, 158),
    BG = Color3.fromRGB(11, 12, 17), -- nền cửa sổ chính (obsidian)

    INK = Color3.fromRGB(12, 10, 6), -- chữ ĐẬM dùng trên nền vàng/cam/sáng
    SURFACE = Color3.fromRGB(20, 22, 30), -- thẻ, ô nhập
    SURFACE2 = Color3.fromRGB(29, 32, 43), -- panel, line hover, thanh tiêu đề
    SURFACE3 = Color3.fromRGB(44, 49, 64), -- viền sáng, thanh cuộn, nút mặc định
    BORDER = Color3.fromRGB(60, 66, 84), -- viền mảnh 1px
    MUTED = Color3.fromRGB(154, 162, 180), -- chữ phụ
    ACCENT = Color3.fromRGB(240, 201, 122), -- Champagne (màu nhận diện hub)
    ACCENT2 = Color3.fromRGB(198, 141, 62), -- đồng (đuôi gradient / nhấn viền)

    ACCENT3 = Color3.fromRGB(255, 238, 203), -- đỉnh sáng nhất của vàng (highlight viền trên)
    HAIRLINE = Color3.fromRGB(72, 79, 99), -- đường phân tách khối sáng hơn BORDER một bậc
    GLOW = Color3.fromRGB(255, 214, 140), -- màu quần sáng ấm
    DEEP = Color3.fromRGB(7, 8, 11), -- đáy của mọi độ dốc dọc (hút chiều sâu)
}

hàm cục bộ New(cls, props, parent)
    cục bộ obj = Instance.new(cls)
    pcall(function()
        nếu cls == "Frame" hoặc cls == "ScrollingFrame" hoặc cls == "TextButton"
           hoặc cls == "TextLabel" hoặc cls == "TextBox" hoặc cls == "ImageButton" thì
            obj.BorderSizePixel = 0 -- Lớp, không viền 1px kiểu cũ
        kết thúc
        nếu cls == "ScrollingFrame" thì
            obj.ScrollBarThickness = 3 -- thanh cuộn mảnh kiểu hiện đại
            obj.ScrollBarImageColor3 = Color3.fromRGB(88, 96, 118) -- v4.9: sáng hơn để hiển thị trên nền obsidian
            obj.ScrollBarImageTransparency = 0.45
        kết thúc
    kết thúc)
    for k, v in pairs(props or {}) do
        obj[k] = v
    kết thúc
    nếu đối tượng cha thì đối tượng cha bằng đối tượng cha.
    pcall(function()
        nếu cls == "TextButton" hoặc cls == "TextLabel" hoặc cls == "TextBox" thì
            local w = Enum.FontWeight.Medium
            cục bộ f = obj.Font
            nếu f == Enum.Font.GothamBold hoặc f == Enum.Font.GothamBlack thì
                w = Enum.FontWeight.Bold
            elseif f == Enum.Font.GothamSemibold then
                w = Enum.FontWeight.SemiBold
            elseif f == Enum.Font.Gotham or f == Enum.Font.GothamLight or f == Enum.Font.GothamItalic then
                w = Enum.FontWeight.Regular
            kết thúc
            obj.FontFace = Font.new("rbxasset://fonts/families/GothamSSo.json", w)
        kết thúc
    kết thúc)
    pcall(function()
        nếu cls == "TextBox" thì
            trackConn(obj.Focused:Connect(function()
                local st = obj:FindFirstChildOfClass("UIStroke")
                if not st then -- ô chưa có ranh giới thì tạo lúc tập trung (không tạo quyền lúc UI)
                    st = New("UIStroke", {
                        Độ dày = 1,3, Độ trong suốt = 0,05,
                        ApplyStrokeMode = Enum.ApplyStrokeMode.Border,
                    }, obj)
                kết thúc
                TweenService:Create(st, TweenInfo.new(0.16, Enum.EasingStyle.Quart, Enum.EasingDirection.Out),
                    {Color = C.ACCENT, Transparency = 0.02}):Play()
            kết thúc))
            trackConn(obj.FocusLost:Connect(function()
                local st = obj:FindFirstChildOfClass("UIStroke")
                nếu st thì
                    TweenService:Create(st, TweenInfo.new(0.28, Enum.EasingStyle.Quart, Enum.EasingDirection.Out),
                        {Color = C.BORDER, Transparency = 0.35}):Play()
                kết thúc
            kết thúc))
        kết thúc
    kết thúc)
    pcall(function()
        nếu (cls == "TextButton" hoặc cls == "TextLabel") và props
           và props.BackgroundColor3 ~= nil và props.TextColor3 ~= nil
           và (props.BackgroundTransparency hoặc 0) < 0.5 thì
            local bg = props.BackgroundColor3
            nếu typeof(bg) == "Color3" thì
                local lum = 0.2126 * bg.R + 0.7152 * bg.G + 0.0722 * bg.B
                nếu lum > 0.6 và props.TextColor3 == Color3.fromRGB(255, 255, 255) thì
                    obj.TextColor3 = C.INK
                kết thúc
            kết thúc
        kết thúc
    kết thúc)
    trả về obj
kết thúc

hàm cục bộ Corner(p, r)
    return New("UICorner", {CornerRadius = r or UDim.new(0, 10)}, p) -- v4.5: bo 10px ( 8px)
kết thúc

hàm cục bộ Stroke(p, c, t)
    trả về New("UIStroke", {
        Color = c hoặc C.BORDER, -- v4.9: viền đóng khối rõ hơn trên nền obsidian
        Độ dày = t hoặc 1,
        Độ trong suốt = 0,15, -- v4.9: viền viền "có mặt" hơn (trước 0,25)
        ApplyStrokeMode = Enum.ApplyStrokeMode.Border,
    }, P)
kết thúc

local flashBack = setmetatable({}, { __mode = "k" })
hàm cục bộ flash(btn, temp, secs, tempColor, back)
    nếu không phải btn thì trả về end
    if flashBack[btn] == nil then flashBack[btn] = { back or btn.Text, btn.TextColor3 } end
    pcall(function()
        btn.Text = tostring(temp)
        if tempColor then btn.TextColor3 = tempColor end
    kết thúc)
    task.delay(giây hoặc 1.6, hàm())
        if not (btn and btn.Parent) then return end
        cục bộ cũ = flashBack[btn]
        nếu không phải là cũ thì trả về cuối
        pcall(function() btn.Text = old[1]; btn.TextColor3 = old[2] end)
        flashBack[btn] = nil
    kết thúc)
kết thúc

hàm cục bộ Tween(o, p, d, e)
    TweenService:Create(o, TweenInfo.new(d or 1.5, e or Enum.EasingStyle.Quart, Enum.EasingDirection.Out), p):Play()
kết thúc

cục bộ D = {}

địa phương S

hàm D.Say(msg, color)
    nếu không phải D.hubStatus thì trả về end
    pcall(function()
        D.hubStatus.Text = tostring(msg)
        D.hubStatus.TextColor3 = màu hoặc C.RED
    kết thúc)
kết thúc

hàm D.BestText(bg)
    if typeof(bg) ~= "Color3" then return C.WHITE end
    local lum = 0.2126 * bg.R + 0.7152 * bg.G + 0.0722 * bg.B
    trả lại (lum > 0.6) và C.INK hoặc C.WHITE
kết thúc

hàm D.Edge(bg)
    if typeof(bg) ~= "Color3" then return C.BORDER end
    trả về Color3.new(
        math.min(1, bg.R + 0.11), math.min(1, bg.G + 0.12), math.min(1, bg.B + 0.16))
kết thúc

hàm D.Grad(obj)
    local g = obj:FindFirstChildOfClass("UIGradient")
    nếu không phải g thì
        g = New("UIGradient", {Color = ColorSequence.new(Color3.new(1,1,1), Color3.new(1,1,1))}, obj)
    kết thúc
    trả lại g
kết thúc

hàm D.Paint(obj, c1, c2, rotation)
    pcall(function()
        obj.BackgroundColor3 = Color3.new(1, 1, 1)
        cục bộ g = D.Grad(obj)
        g.Color = ColorSequence.new(c1, c2 or c1)
        g. Xoay = xoay hoặc 90
    kết thúc)
    trả về obj
kết thúc

hàm D.Unpaint(obj)
    pcall(function()
        nếu không phải là obj thì trả về end
        local g = obj:FindFirstChildOfClass("UIGradient")
        nếu g thì g.Color = ColorSequence.new(Color3.new(1, 1, 1), Color3.new(1, 1, 1)) end
    kết thúc)
    trả về obj
kết thúc

hàm D.Paint3(obj, colors, rotation)
    pcall(function()
        if type(colors) ~= "table" or #colors == 0 then return obj end
        obj.BackgroundColor3 = Color3.new(1, 1, 1)
        cục bộ g = D.Grad(obj)
        cục bộ n = #màu sắc
        nếu n == 1 thì
            g.Color = ColorSequence.new(colors[1], colors[1])
        khác
            cục bộ kp = {}
            for i, col in ipairs(colors) do
                kp[i] = ColorSequenceKeypoint.new((i - 1) / (n - 1), col)
            kết thúc
            g.Color = ColorSequence.new(kp)
        kết thúc
        g. Xoay = xoay hoặc 90
    kết thúc)
    trả về obj
kết thúc

hàm D.TopLight(obj, color, thickness, inset)
    dòng cục bộ = nil
    pcall(function()
        inset = inset hoặc 14
        dòng = Mới("Khung", {
            Tên = "BC_TopLight",
            Kích thước = UDim2.new(1, -inset * 2, 0, thickness hoặc 1),
            Vị trí = UDim2.new(0, inset, 0, 0),
            BackgroundColor3 = màu hoặc C.HAIRLINE,
            Độ trong suốt của nền = 0.3,
            BorderSizePixel = 0,
            ZIndex = (obj.ZIndex hoặc 1) + 1,
        }, obj)
        local g = New("UIGradient", {Rotation = 0}, line)
        g.Transparency = NumberSequence.new({
            NumberSequenceKeypoint.new(0.00, 1.00),
            NumberSequenceKeypoint.new(0.50, 0.05),
            NumberSequenceKeypoint.new(1.00, 1.00),
        })
    kết thúc)
    đường trả về
kết thúc

hàm D.Shade(obj, k1, k2, rotation)
    pcall(function()
        cục bộ g = D.Grad(obj)
        local a = k1 or Color3.new(1.0, 1.0, 1.0)
        local b = k2 or Color3.new(0.82, 0.84, 0.90)
        hàm cục bộ mix(t)
            return Color3.new(aR + (bR - aR) * t, aG + (bG - aG) * t, aB + (bB - aB) * t)
        kết thúc
        g.Color = ColorSequence.new({
            ColorSequenceKeypoint.new(0.00, a), -- mép trên: hắt sáng
            ColorSequenceKeypoint.new(0.10, mix(0.28)),
            ColorSequenceKeypoint.new(0.58, mix(0.62)),
            ColorSequenceKeypoint.new(1.00, b), -- đáy: hút tối
        })
        g. Xoay = xoay hoặc 90
    kết thúc)
    trả về obj
kết thúc

hàm D.PaintText(obj, c1, c2)
    pcall(function()
        obj.TextColor3 = Color3.new(1, 1, 1)
        cục bộ g = D.Grad(obj)
        g.Color = ColorSequence.new(c1, c2 or c1)
        g.Rotation = 0
    kết thúc)
    trả về obj
kết thúc

hàm D.Tactile(btn, baseTrans)
    baseTrans = baseTrans hoặc 0,08
    pcall(function()
        trackConn(btn.MouseEnter:Connect(function()
            Tween(btn, {BackgroundTransparency = math.max(0, baseTrans - 0.06)}, 0.16)
        kết thúc))
        trackConn(btn.MouseLeave:Connect(function()
            Tween(btn, {BackgroundTransparency = baseTrans}, 0.2)
        kết thúc))
        trackConn(btn.MouseButton1Down:Connect(function()
            Tween(btn, {BackgroundTransparency = math.min(1, baseTrans + 0.12)}, 0.08)
        kết thúc))
        trackConn(btn.MouseButton1Up:Connect(function()
            Tween(btn, {BackgroundTransparency = baseTrans}, 0.14)
        kết thúc))
    kết thúc)
    nút quay lại
kết thúc

hàm D.HoverText(btn, overColor, downColor)
    pcall(function()
        local base = btn.TextColor3
        trackConn(btn.MouseEnter:Connect(function() Tween(btn, {TextColor3 = overColor or C.WHITE}, 0.15) end))
        trackConn(btn.MouseLeave:Connect(function() Tween(btn, {TextColor3 = base}, 0.2) end))
        trackConn(btn.MouseButton1Down:Connect(function()
            Tween(btn, {TextColor3 = downColor or overColor or C.WHITE}, 0.08)
        kết thúc))
    kết thúc)
    nút quay lại
kết thúc

hàm D.Glow(obj, color, pad, trans)
    ánh sáng cục bộ = không
    pcall(function()
        nếu không phải obj hoặc không phải obj.Parent thì trả về end
        miếng đệm = miếng đệm hoặc 7
        hàm cục bộ posOf()
            local pp = obj.Position
            return UDim2.new(pp.X.Scale, pp.X.Offset - pad, pp.Y.Scale, pp.Y.Offset - pad)
        kết thúc
        phát sáng = Mới("Khung", {
            Tên = "BC_Glow",
            Kích thước = UDim2.new(1, pad * 2, 1, pad * 2),
            Vị trí = posOf(),
            BackgroundColor3 = màu hoặc C.ACCENT,
            BackgroundTransparency = trans hoặc 0.86,
            BorderSizePixel = 0,
            ZIndex = (obj.ZIndex hoặc 1) - 1,
        }, obj.Parent)
        Góc(phát sáng, UDim.new(1, 0))
        trackConn(obj:GetPropertyChangedSignal("Position"):Connect(function()
            pcall(function() glow.Position = posOf() end)
        kết thúc))
    kết thúc)
    ánh sáng trở lại
kết thúc

hàm D.SetBg(obj, color, trans)
    pcall(function()
        nếu không phải là obj thì trả về end
        obj.BackgroundColor3 = màu
        if trans ~= nil then obj.BackgroundTransparency = trans end
        nếu obj:IsA("TextButton") hoặc obj:IsA("TextLabel") thì
            obj.TextColor3 = D.BestText(màu)
        kết thúc
        local st = obj:FindFirstChildOfClass("UIStroke")
        if st then st.Color = D.Edge(color) end
    kết thúc)
    trả về obj
kết thúc

hàm D.Breathe(obj, props, dur)
    pcall(function()
        local ti = TweenInfo.new(dur or 1.9, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut, -1, true)
        TweenService:Create(obj, ti, props):Play()
    kết thúc)
kết thúc

hàm cục bộ ReleaseHubFocus()
    pcall(function()
        local tb = UserInputService:GetFocusedTextBox()
        if tb then tb:ReleaseFocus() end
    kết thúc)
    pcall(function() playerGui:ReleaseFocus() end)
kết thúc

nếu targetGui:FindFirstChild("ExMenu") thì
    targetGui.ExMenu:Destroy()
kết thúc

local gui = New("ScreenGui", {
    Tên="ExMenu",
    IgnoreGuiInset=true,
    ResetOnSpawn=false,
    ZIndexBehavior=Enum.ZIndexBehavior.Sibling,
}, targetGui)

local togBtn = New("TextButton", {
    Kích thước = UDim2.new(0,48,0,48),
    Vị trí = UDim2.new(1, -60, 1, -60),
    Văn bản="🍌",
    BackgroundColor3=C.ACCENT,
    Độ trong suốt của nền = 0.03,
    TextColor3=C.INK,
    Font=Enum.Font.GothamBold,
    Kích thước văn bản=24,
    BorderSizePixel=0,
    Chỉ số Z = 1000,
}, gui)
Góc(togBtn, UDim.new(1,0))
Stroke(togBtn, C.ACCENT2, 1.4)
D.Paint3(togBtn, {C.ACCENT3, C.ACCENT, C.ACCENT2}, 135)
D.Tactile(togBtn, 0.03)
pcall(function()
    độ sáng cục bộ = D.Glow(togBtn, C.GLOW, 9, 0.9)
    if glow then D.Breathe(glow, {BackgroundTransparency = 0.975}, 2.4) end
kết thúc)

local main = New("Frame", {
    Kích thước = UDim2.new(0, 540, 0, 340),
    Vị trí = UDim2.new(0.5, -270, 0.5, -170),
    BackgroundColor3=C.BG,
    BackgroundTransparency=0, -- v4.9: đục tuyệt đối để gradient 4 màu lên đúng màu
    BorderSizePixel=0,
    Hiển thị = false,
    ClipsDescendants=false,
    Chỉ số Z = 2,
}, gui)
Góc(chính, UDim.new(0,16))
Stroke(main, C.HAIRLINE, 1.2)
D.Paint3(main, {C.SURFACE2, C.BG, C.BG, C.DEEP}, 90)

Lượt truy cập cục bộ = {}

hàm Hit.inObject(o, x, y)
    nếu không phải là o thì trả về false kết thúc
    cục bộ ok, res = pcall(function()
        if not o.Visible then return false end
        local p, s = o.AbsolutePosition, o.AbsoluteSize
        Trả về x >= pX và x <= pX + sX và y >= pY và y <= pY + sY
    kết thúc)
    trả về ok và res == true
kết thúc

hàm Hit.onHub(x, y)
    cục bộ ổn, objs = pcall(function()
        return playerGui:GetGuiObjectsAtPosition(x, y)
    kết thúc)
    nếu ok và type(objs) == "table" thì
        for _, o in ipairs(objs) do
            if o == gui or o:IsDescendantOf(gui) then return true end
        kết thúc
    kết thúc
    if Hit.inObject(main, x, y) then return true end
    if Hit.inObject(togBtn, x, y) then return true end
    trả về false
kết thúc

local bgPattern = New("ImageLabel", {
    Tên = "CheckeredBG",
    Kích thước = UDim2.new(1, 0, 1, 0),
    Vị trí = UDim2.new(0, 0, 0, 0),
    Độ trong suốt của nền = 1,
    Hình ảnh = "rbxassetid9822602710",
    Loại tỷ lệ = Enum.ScaleType.Tile,
    TileSize = UDim2.new(0, 13, 0, 13), -- v4.9: hạt nhỏ hơn -> chất liệu thô như vải, không còn "caro"
    ImageTransparency = 0.955, -- v4.9: nhẹ hơn nữa, chỉ còn là loại kim loại
    ImageColor3 = C.ACCENT2, -- v4.9: ánh đồng (trước là vàng chuối gạt)
    Chỉ số Z = 2,
}, chủ yếu)
Góc(bgPattern, UDim.new(0, 14))

local titleBar = New("Frame", {
    Kích thước = UDim2.new(1, 0, 0, 30),
    BackgroundColor3=C.SURFACE2,
    BackgroundTransparency=0, -- v4.9: đục để gradient 3 tăng đúng
    BorderSizePixel=0,
    Chỉ số Z = 3,
}, chủ yếu)
Góc(thanh tiêu đề, UDim.new(0,16))
D.Paint3(titleBar, {C.SURFACE3, C.SURFACE2, C.SURFACE}, 90)
D.TopLight(titleBar, C.ACCENT3, 1, 22) -- v4.9: chỉ vàng mảnh chạy dọc viền trên cửa sổ

D.Paint3(New("Frame", {
    Tên="TitleAccent", Kích thước=UDim2.new(1,-2,0,2), Vị trí=UDim2.new(0,1,1,-1),
    BackgroundColor3=C.ACCENT, BorderSizePixel=0, ZIndex=5,
}, titleBar), {C.ACCENT2, C.ACCENT3, C.ACCENT2}, 0)

D.PaintText(New("TextLabel", {
    Kích thước = UDim2.new(1, -90, 1, 0),
    Vị trí = UDim2.new(0, 12, 0, 0),
    Văn bản="🍌 Banana Cat Hub",
    Độ trong suốt nền = 1,
    TextColor3=C.DARK,
    Font=Enum.Font.GothamBold,
    Kích thước văn bản=13,
    TextXAlignment = Enum.TextXAlignment.Left,
    Chỉ số Z = 4,
}, titleBar), C.ACCENT, C.ACCENT3) -- v4.9: chữ gradient vàng rượu-panh -> trắng ngà

D.verPill = New("Frame", {
    Tên="VersionPill", Kích thước=UDim2.new(0,62,0,16), Vị trí=UDim2.new(0,158,0,7),
    BackgroundColor3=C.DEEP, BackgroundTransparency=0.15, BorderSizePixel=0, ZIndex=5,
}, thanh tiêu đề)
Góc (D.verPill, UDim.new (1,0))
Stroke(D.verPill, C.ACCENT2, 1) -- v4.9: huy hiệu đen + viền đồng, chữ sâm panh
Mới("TextLabel", {
    Size=UDim2.new(1,0,1,0), Text="v4.43 · NOIR", BackgroundTransparency=1,
    TextColor3=C.ACCENT3, Font=Enum.Font.GothamBold, TextSize=8, ZIndex=6,
}, D.verPill)

hàm cục bộ TitleBtn(txt, xOff)
    trả về New("TextButton", {
        Kích thước=UDim2.new(0,30,0,30), Vị trí=UDim2.new(1,-xOff,0,0), Văn bản=txt,
        BackgroundTransparency=1, TextColor3=C.MUTED, Font=Enum.Font.GothamBold,
        Kích thước chữ=15, Kích thước viền pixel=0, Chỉ số Z=4,
    }, thanh tiêu đề)
kết thúc
local dragLockBtn = TitleBtn("🔒", 64)
local closeBtn = TitleBtn("✕", 32)
D.HoverText(closeBtn, C.RED, C.RED)
D.HoverText(dragLockBtn, C.ACCENT, C.ACCENT)

minW, minH cục bộ = 440, 260

hàm cục bộ BcFit()
    local fn = _G.BananaCatHub_SyncEmbeds
    if type(fn) ~= "function" then return end
    cục bộ ổn, bây giờ = pcall(os.clock)
    Nếu ổn và _G.BcFitLast và bây giờ - _G.BcFitLast < 0.05 thì trả về end
    _G.BcFitLast = ok và bây giờ hoặc 0
    task.defer(fn)
kết thúc

hàm cục bộ SetupResizeHandle(btn, cornerType)
    thay đổi kích thước cục bộ, sizeStart, posStart, inputStart
    trackConn(btn.InputBegan:Connect(function(i)
        nếu i.UserInputType == Enum.UserInputType.MouseButton1 hoặc i.UserInputType == Enum.UserInputType.Touch thì
            pcall(function() if D.openTween then D.openTween:Cancel() D.openTween = nil end end) -- v4.5
            thay đổi kích thước = đúng
            sizeStart=main.Size
            posStart=main.Position
            inputStart=i.Position
        kết thúc
    kết thúc))
    trackConn(UserInputService.InputChanged:Connect(function(i)
        nếu resizing và sizeStart và posStart và inputStart và (i.UserInputType==Enum.UserInputType.MouseMovement hoặc i.UserInputType==Enum.UserInputType.Touch) thì
            local d = i.Position - inputStart
            local w, h = sizeStart.X.Offset, sizeStart.Y.Offset
            local posX, posY = posStart.X.Offset, posStart.Y.Offset
            cục bộ newW, newH = w, h
            cục bộ newX, newY = posX, posY
            nếu cornerType == "BR" thì
                newW = math.max(minW, w + dX)
                newH = math.max(minH, h + dY)
            elseif cornerType == "BL" then
                newW = math.max(minW, w - dX)
                newH = math.max(minH, h + dY)
                newX = posX + (w - newW)
            elseif cornerType == "TR" then
                newW = math.max(minW, w + dX)
                newH = math.max(minH, h - dY)
                newY = posY + (h - newH)
            elseif cornerType == "TL" then
                newW = math.max(minW, w - dX)
                newH = math.max(minH, h - dY)
                newX = posX + (w - newW)
                newY = posY + (h - newH)
            kết thúc
            main.Size = UDim2.new(sizeStart.X.Scale, newW, sizeStart.Y.Scale, newH)
            main.Position = UDim2.new(posStart.X.Scale, newX, posStart.Y.Scale, newY)
        kết thúc
    kết thúc))
    trackConn(UserInputService.InputEnded:Connect(function(i)
        nếu i.UserInputType == Enum.UserInputType.MouseButton1 hoặc i.UserInputType == Enum.UserInputType.Touch thì
            thay đổi kích thước = false
        kết thúc
    kết thúc))
kết thúc

hàm cục bộ CreateHandle(icon, pos)
    local btn = New("TextButton", {
        Kích thước = UDim2.new(0,20,0,20),
        Vị trí = vị trí,
        Văn bản=biểu tượng,
        BackgroundColor3=C.SURFACE3,
        Độ trong suốt của nền = 0.35,
        TextColor3=C.MUTED,
        Font=Enum.Font.GothamBold,
        Kích thước văn bản=11,
        BorderSizePixel=0,
        Chỉ số Z = 100,
    }, chủ yếu)
    Góc(btn, UDim.new(0,5))
    Stroke(btn, C.HAIRLINE, 1)
    D.Shade(btn, Color3.fromRGB(255,255,255), Color3.fromRGB(190,196,210), 90)
    D.Tactile(btn, 0.35)
    nút quay lại
kết thúc

SetupResizeHandle(CreateHandle("↖", UDim2.new(0, 2, 0, 2)), "TL")
SetupResizeHandle(CreateHandle("↗", UDim2.new(1, -22, 0, 2)), "TR")
SetupResizeHandle(CreateHandle("↙", UDim2.new(0, 2, 1, -22)), "BL")
SetupResizeHandle(CreateHandle("↘", UDim2.new(1, -22, 1, -22)), "BR")

tab cục bộ = {}
local tabContent = {}

tab cục bộBar = Mới ("ScrollingFrame", {
    Kích thước = UDim2.new(0, 56, 1, -30),
    Vị trí = UDim2.new(0,0,0,30),
    BackgroundColor3=C.SURFACE,
    Độ trong suốt nền = 0,
    BorderSizePixel=0,
    Chỉ số Z = 3,
    Độ dày thanh cuộn = 3,
    CanvasSize=UDim2.new(0,0,0,0),
}, chủ yếu)
D.Paint3(tabBar, {C.SURFACE, C.BG, C.DEEP}, 90)

Mới("Khung", {
    Tên="TabRailDivider", Kích thước=UDim2.new(0,1,1,-30), Vị trí=UDim2.new(0,56,0,30),
    BackgroundColor3=C.HAIRLINE, BackgroundTransparency=0.45, BorderSizePixel=0, ZIndex=4,
}, chủ yếu)

Mới("UIListLayout", {
    FillDirection=Enum.FillDirection.Vertical,
    SortOrder=Enum.SortOrder.LayoutOrder,
    Padding=UDim.new(0,4),
}, tabBar)

New("UIPadding", {PaddingTop=UDim.new(0,6), PaddingLeft=UDim.new(0,4)}, tabBar)

local contentArea = New("Frame", {
    Size=UDim2.new(1,-56,1,-54), -- v4.5: nhường 56px cho thanh icon + 24px cho header trang
    Vị trí = UDim2.new(0, 56, 0, 54),
    Độ trong suốt nền = 1,
    BorderSizePixel=0,
    Chỉ số Z = 3,
    ClipsDescendants=true,
}, chủ yếu)

D.pageHeader = New("Frame", {
    Tên="Tiêu đề trang", Kích thước=UDim2.new(1,-56,0,24), Vị trí=UDim2.new(0,56,0,30),
    BackgroundColor3=C.SURFACE, BackgroundTransparency=0.2, BorderSizePixel=0, ZIndex=3,
}, chủ yếu)
D.Paint3(D.pageHeader, {C.SURFACE2, C.SURFACE}, 90) -- v4.9: phạm vi chrome mảnh dưới thanh tiêu đề
D.pageTitle = New("TextLabel", {
    Tên="Tiêu đề trang", Kích thước=UDim2.new(1,-196,1,0), Vị trí=UDim2.new(0,10,0,0),
    Text="💾 Code Đã Lưu", BackgroundTransparency=1, TextColor3=C.ACCENT, -- v4.6.2: trang đầu tiên
    Font=Enum.Font.GothamBold, TextSize=11,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=5,
}, D.pageHeader)
D.pageChips = New("Frame", {
    Tên="PageChips", Kích thước=UDim2.new(0,150,1,-6), Vị trí=UDim2.new(1,-156,0,3),
    BackgroundTransparency=1, BorderSizePixel=0, ZIndex=5,
}, D.pageHeader)
Mới("UIListLayout", {
    FillDirection=Enum.FillDirection.Horizontal, Padding=UDim.new(0,8),
    SortOrder=Enum.SortOrder.LayoutOrder, VerticalAlignment=Enum.VerticalAlignment.Center,
}, D.pageChips)

D.hdrSwitches = {}
đối với i, sw trong ipairs({
    {key="embed", icon="🧩", onColor=C.GREEN, tip="Nhúng GUI của tập lệnh vào tab tính năng"},
    {key="guess", icon="🕵", onColor=C.ORANGE, tip="Đoán GUI tạo đị (dễ ăn nhầm GUI game)"},
    {key="park", icon="🪟", onColor=C.GREEN, tip="Đưa GUI của tab 💻 Mã vào menu"},
}) LÀM
    local btn = New("TextButton", {
        Size=UDim2.new(0,42,0,16), Text="", AutoButtonColor=false,
        BackgroundTransparency=1, BorderSizePixel=0, LayoutOrder=i, ZIndex=6,
    }, D.pageChips)
    btn:SetAttribute("BCSwKey", sw.key)
    local ic = New("TextLabel", {
        Kích thước=UDim2.new(0,14,1,0), Vị trí=UDim2.new(0,0,0,0), Văn bản=sw.icon,
        BackgroundTransparency=1, TextColor3=C.MUTED, Font=Enum.Font.GothamBold,
        Kích thước văn bản=10, Căn chỉnh văn bản theo chiều ngang=Enum.TextXAlignment.Left, Chỉ số Z=7,
    }, btn)
    theo dõi cục bộ = Mới("Khung", {
        Tên="BC_SwTrack", Kích thước=UDim2.new(0,26,0,12), Vị trí=UDim2.new(1,-26,0,2),
        BackgroundColor3=C.SURFACE3, BorderSizePixel=0, ZIndex=7,
    }, btn)
    Góc(track, UDim.new(1,0))
    local trackStroke = Stroke(track, C.HAIRLINE, 1)
    nút cục bộ = Mới("Khung", {
        Tên="BC_SwKnob", Kích thước=UDim2.new(0,8,0,8), Vị trí=UDim2.new(0,2,0,2),
        BackgroundColor3=C.GRAY, BorderSizePixel=0, ZIndex=8,
    }, theo dõi)
    Góc(núm vặn, UDim.new(1,0))
    D.hdrSwitches[sw.key] = {btn=btn, icon=ic, track=track, knob=knob, onColor=sw.onColor, stroke=trackStroke}

    btn.Activated:Connect(function()
        local fn = (sw.key == "embed" and S.DoToggleEmbed)
                hoặc (sw.key == "guess" và S.DoToggleGuess)
                hoặc (sw.key == "park" và S.DoTogglePark)
        nếu kiểu(fn) == "function" thì
            pcall(fn) -- function gốc đã tự động thay đổi nút nhãn, ghi đĩa và trạng thái báo cáo
        kết thúc
        D.SyncPageChips()
        pcall(function() if S.SyncEmbedToggles then S.SyncEmbedToggles() end end)
    kết thúc)
    btn.MouseEnter:Connect(function()
        D.pageTitle.Text = sw.icon .. " " .. sw.tip
        D.pageTitle.TextColor3 = C.DARK
        D.pageTitle.TextTransparency = 0,25
    kết thúc)
    btn.MouseLeave:Connect(function()
        D.pageTitle.TextColor3 = C.ACCENT
        local back = D.hoverName or D.activeName
        nếu quay lại thì D.pageTitle.Text = back end
        D.pageTitle.TextTransparency = D.hoverName và 0.4 hoặc 0
    kết thúc)
kết thúc
Mới("Khung", { -- bỏ sót phần dưới tiêu đề
    Name="PageHeaderRule", Size=UDim2.new(1,-56,0,1), Position=UDim2.new(0,56,0,53),
    BackgroundColor3=C.HAIRLINE, BackgroundTransparency=0.5, BorderSizePixel=0, ZIndex=4,
}, chủ yếu)

local activeTab = nil

hàm cục bộ SwitchTab(index)
    ReleaseHubFocus() -- v4.4b:thay đổi tab mà để TextBox còn tập trung vào trò chơi chặn đầu vào (không đi/không bắn)
    for _, t in ipairs(tabContent) do t.Visible = false end
    for _, b in ipairs(tabs) do
        b.BackgroundColor3 = C.SURFACE2
        b. Độ trong suốt của nền = 1
        b.TextColor3 = C.MUTED
        D.Unpaint(b) -- v4.9: wash gradient of time before open to pill ghost/hover up right color
        local bar = b:FindFirstChild("BC_Bar")
        nếu thanh thì thanh đó hiển thị (không hiển thị)
    kết thúc
    nếu tabContent[index] và tabs[index] thì
        tabContent[index].Visible = true
        cục bộ b = tab[chỉ mục]
        b.BackgroundColor3 = C.SURFACE2
        b.BackgroundTransparency = 0.1
        b.TextColor3 = C.ACCENT
        D.Paint3(b, {C.SURFACE3, C.SURFACE2, C.SURFACE}, 90)
        local bar = b:FindFirstChild("BC_Bar")
        nếu không phải quán bar thì
            thanh = Mới("Khung", {
                Tên = "BC_Bar", Kích thước = UDim2.new(0, 3, 1, -12), Vị trí = UDim2.new(0, 2, 0, 6),
                BackgroundColor3 = C.ACCENT, BorderSizePixel = 0, ZIndex = 6,
            }, b)
            Góc(thanh, UDim.new(1, 0))
            D.Paint3(bar, {C.ACCENT3, C.ACCENT, C.ACCENT2}, 90) -- v4.9: vạch như thanh kim loại đánh bóng
        kết thúc
        thanh hiển thị = true
        activeTab = tabContent[index]
        pcall(function()
            nếu D.pageTitle thì
                local ic = b:GetAttribute("BCTabIcon")
                local nm = b:GetAttribute("BCTabName")
                D.activeName = (ic and (ic .. " ") or "") .. tostring(nm or ("Trang " .. index))
                nếu không phải D.hoverName thì
                    D.pageTitle.Text = D.activeName
                    D.pageTitle.TextTransparency = 0
                kết thúc
            kết thúc
        kết thúc)
    kết thúc
    BcFit() -- v4.4c: tab vừa hiện -> đo lại để GUI vừa đúng ô của tab
kết thúc

hàm cục bộ OpenFirstPage()
    chỉ số cục bộ, tốt nhất = 1, nil
    for i, b in ipairs(tabs) do
        cục bộ o = b và b.LayoutOrder
        if type(o) == "number" and (best == nil or o < best) then best = o; idx = i end
    kết thúc
    SwitchTab(idx)
kết thúc

hàm cục bộ MakeTabFrame()
    trả về New("ScrollingFrame", {
        Kích thước = UDim2.new(1, 0, 1, 0),
        Độ trong suốt nền = 1,
        BorderSizePixel=0,
        ScrollBarThickness=4, -- v4.9: mảnh hơn
        ScrollBarImageColor3=Color3.fromRGB(88, 96, 118), -- v4.9: known obsidian trên nền
        ClipsDescendants=true,
        CanvasSize=UDim2.new(0,0,0,0),
        Hiển thị = false,
        Active=true,
        Có thể chọn = false,
        ScrollingDirection=Enum.ScrollingDirection.Y,
        Chỉ số Z = 4,
    }, contentArea)
kết thúc

hàm cục bộ MakeTabButton(name, icon, order, onClick)
    local btn = New("TextButton", {
        Kích thước=UDim2.new(1,-8,0,38), -- v4.5 Delta: ô icon 48x38
        Text=icon, -- CHỈ icon; tên trang hiện ở tiêu đề
        BackgroundColor3=C.SURFACE2, -- pill ghost (SwitchTab tô màu khi trang mở)
        Độ trong suốt nền = 1,
        TextColor3=C.MUTED,
        Font=Enum.Font.GothamBold,
        Kích thước văn bản=16,
        BorderSizePixel=0,
        LayoutOrder=order,
        TextXAlignment=Enum.TextXAlignment.Center,
        Chỉ số Z = 4,
    }, tabBar)
    Corner(btn, UDim.new(0,10)) -- v4.5 Delta: bo 10px cho ô icon
    pcall(function()
        btn:SetAttribution("BCTabName", name) -- tiêu đề + di chuột đọc tên trang từ đây
        btn:SetAttribute("BCTabIcon", icon)
    kết thúc)
    pcall(function()
        trackConn(btn.MouseEnter:Connect(function()
            if btn.BackgroundTransparency > 0.5 then Tween(btn, {BackgroundTransparency = 0.62}, 0.16) end
            pcall(function() -- v4.5 Delta: rê vào icon nào thì header hiện NAME trang đó (mờ nhẹ)
                nếu D.pageTitle thì
                    D.hoverName = btn:GetAttribute("BCTabName")
                    local ic = btn:GetAttribute("BCTabIcon")
                    D.pageTitle.Text = (ic and (ic .. " ") or "") .. tostring(D.hoverName or "")
                    D.pageTitle.TextTransparency = 0,4
                kết thúc
            kết thúc)
        kết thúc))
        trackConn(btn.MouseLeave:Connect(function()
            if btn.TextColor3 ~= C.ACCENT then Tween(btn, {BackgroundTransparency = 1}, 0.2) end
            pcall(function() -- left mouse: header trả về tên trang ĐANG MỞ
                D.hoverName = nil
                nếu D.pageTitle và D.activeName thì
                    D.pageTitle.Text = D.activeName
                    D.pageTitle.TextTransparency = 0
                kết thúc
            kết thúc)
        kết thúc))
    kết thúc)
    btn.Activated:Connect(function()
        for i, b in ipairs(tabs) do
            nếu b == btn thì
                SwitchTab(i)
                nếu onClick thì pcall(onClick) end
                phá vỡ
            kết thúc
        kết thúc
    kết thúc)
    nút quay lại
kết thúc

hàm cục bộ AddTab(name, icon, order, customContent)
    khoa học viễn tưởng địa phương
    nếu customContent thì
        sf = customContent
        sf.Parent = contentArea
        sf.Visible = false
    khác
        sf = MakeTabFrame()
    kết thúc
    local btn = MakeTabButton(name, icon, order)
    table.insert(tabs, btn)
    table.insert(tabContent, sf)
    tabBar.CanvasSize = UDim2.new(0, 0, 0, #tabs * 44 + 10)
    trả lại sf, btn
kết thúc
local codeTab = AddTab("Code", "💻", 2)
local saveCodeTab = AddTab("Code Đã Lưu", "💾", 1)

OpenFirstPage() -- v4.6.2: mở trang START TIÊN theo thứ tự Rail (💾 Code Đã Lưu)

S = {
    dragMenu = false,
    kéo lê = sai,
    dragStart = nil,
    startPos = nil,
    togDragging = false,
    togDragStart = nil,
    togStartPos = nil,
    togMoved = false,
    embedEnabled = true, -- tab 5 có nút 🧩 để tắt toàn bộ công việc nhúng
    embedGuessNew = false, -- 🕵 nhận cả ScreenGui "lạ" mới xuất hiện (mạnh hơn nhưng dễ ăn GUI game)
    parkCodeGuis = true,
    embeds = {}, -- registry: {host, gui, recs={{child,origParent,origPos,origSize}}, conns={}}
}

S.WRAP_MARK_OLD = "-- ===== KÍCH THƯỚC ĐƯỢC TỰ ĐỘNG TẠO"
S.WRAP_MARK_NEW = "-- ===== BỘ PHẬN BỌC VỪA TỰ ĐỘNG TẠO"
hàm S.SanitizeCode(c)
    nếu kiểu dữ liệu của c khác với "string" thì trả về c.
    if not c:find(S.WRAP_MARK_OLD, 1, true) then return c end
    đầu ra cục bộ = (c:gsub(
        "pcall%s*%(%s*function%s*%(%)%s*_ForceStretch%s*%(%s*g%s*%)%s*end%s*%)",
        ""))
    trở lại
kết thúc

hàm S.Shimmed(n)
    cục bộ v = S.shimmedFns và S.shimmedFns[n]
    nếu v == nil thì trả về false
    trả về rawget(_G, n) == v
kết thúc

hàm D.SyncPageChips()
    pcall(function()
        nếu không phải D.hdrSwitches thì trả về end
        trạng thái cục bộ = {
            nhúng = (S.embedEnabled == true),
            đoán = (S.embedGuessNew == true),
            công viên = (S.parkCodeGuis ~= false),
        }
        for k, s in pairs(D.hdrSwitches) do
            cục bộ bật = (trạng thái[k] == true)
            s.track.BackgroundColor3 = on and (s.onColor or C.GREEN) or C.SURFACE3
            s.knob.BackgroundColor3 = on and C.WHITE or C.GRAY
            s.knob.Position = on và UDim2.new(1,-10,0,2) hoặc UDim2.new(0,2,0,2)
            s.icon.TextColor3 = bật và C.DARK hoặc C.GRAY
            if s.stroke then s.stroke.Color = on and D.Edge(s.onColor or C.GREEN) or C.HAIRLINE end
        kết thúc
    kết thúc)
kết thúc
tập lệnh cục bộ = {}
local waypoints = {} -- khai báo sớm để lưu trữ kho lưu trữ bên dưới được sử dụng
local featureTabs = {} -- nt: khai báo sớm để Store.serialize() và trạng thái sử dụng được
local featureTabIndex = 7 -- 1=Code Đã Lưu 2=Code 3=Script Hub 4= Hỗ Trợ 5=Thiết Lập 6=Tạo Tính Năng; tab tính năng của người dùng từ 7 trở đi
tổng số lần chạy cục bộ, đã hủy = 0, sai
curThread cục bộ, curIndicator = nil, nil
local runActive = false -- chạy trạng thái cờ (không dựa vào curThread nữa)

Cửa hàng cục bộ = {}

Store.SAVE_FILE = "banana_cat_saved.json"
Store.SAVE_VERSION = 3
Store.mode = "none" -- "file" | "memory" | "empty" | "none"
Store.lastError = nil
Store.lastSavedAt = nil
Store.saveCount = 0
Store.loadedScripts = 0
Store.loadedWp = 0
Store.loadedFeatures = {} -- đọc dữ liệu thô từ đĩa; TAB5 sẽ xây dựng tab thật sự
Store.restoreFeatures = nil -- TAB5 gán chức năng xây dựng lại tab vào đây
Store.restoreWaypoints = nil -- TAB3 gán RebuildWaypoints vào đây (TAB2 cần mà chưa tồn tại)
Store.statusLbl = nil -- tab "Code Đã Lưu" gán nhãn trạng thái vào đây
Store.reloadBtn = nil
Store._scheduled = false
Store.refreshStatus = nil -- tab "Code Đã lưu" gán chức năng cập nhật nhãn vào đây

hàm Store.canWrite()
    if type(writefile) ~= "function" or type(readfile) ~= "function" then return false end
    nếu S.Shimmed("writefile") hoặc S.Shimmed("readfile") thì trả về false.
    trả về giá trị đúng
kết thúc

hàm Store.isFinite(n)
    return type(n) == "number" and n == n and n ~= math.huge and n ~= -math.huge
kết thúc

hàm Store.write(data)
    local okEnc, json = pcall(function() return HttpService:JSONEncode(data) end)
    nếu không phải okEnc thì
        Store.mode = "memory"
        Store.lastError = "Không thể mã hóa JSON: " .. tostring(json)
        _G.BananaCatHub_SavedData = dữ liệu
        trả về false
    kết thúc

    nếu không thể ghi vào Store.canWrite() thì
        Store.mode = "memory"
        Store.lastError = "Executor no writefile — chỉ được lưu trong phiên bản trò chơi này"
        _G.BananaCatHub_SavedData = dữ liệu
        trả về false
    kết thúc

    local okW, errW = pcall(writefile, Store.SAVE_FILE, json)
    nếu không okW thì
        Store.mode = "memory"
        Store.lastError = "Tập tin Ghi bị lỗi: " .. tostring(errW)
        _G.BananaCatHub_SavedData = dữ liệu
        trả về false
    kết thúc

    Store.mode = "file"
    Store.lastError = nil
    Store.saveCount = Store.saveCount + 1
    pcall(function() Store.lastSavedAt = os.date("%H:%M:%S") end)
    _G.BananaCatHub_SavedData = dữ liệu
    trả về giá trị đúng
kết thúc

hàm Store.read()
    nếu Store.canWrite() thì
        local hasFile = true
        nếu kiểu dữ liệu (isfile) == "function" thì
            local okI, r = pcall(isfile, Store.SAVE_FILE)
            hasFile = (okI và r == true)
        kết thúc
        nếu có tệp tin thì
            local okR, txt = pcall(readfile, Store.SAVE_FILE)
            nếu okR và type(txt) == "string" và #txt > 0 thì
                local okD, data = pcall(function() return HttpService:JSONDecode(txt) end)
                nếu okD và kiểu dữ liệu == "table" thì
                    Store.mode = "file"
                    Store.lastError = nil
                    dữ liệu trả về
                kết thúc
                Store.lastError = "Việc lưu tệp bị hỏng (JSON không đọc được) — đã bị bỏ qua"
            kết thúc
        kết thúc
    kết thúc
    if Store.lastError and Store.lastError:find("bị hỏng", 1, true) then
        Store.mode = "none"
        trả về nil
    kết thúc
    nếu kiểu dữ liệu (_G.BananaCatHub_SavedData) == "table" thì
        Store.mode = "memory"
        trả về _G.BananaCatHub_SavedData
    kết thúc
    Store.mode = "none"
    trả về nil
kết thúc

hàm Store.serialize()
    local sOut = {}
    for _, s in ipairs(scripts) do
        table.insert(sOut, {
            tên = tostring(s.name hoặc ""),
            mã = tostring(s.code hoặc ""),
            mở rộng = (s.expanded == true),
        })
    kết thúc
    cục bộ wOut = {}
    for _, w in ipairs(waypoints) do
        vị trí cục bộ = w và w.pos
        nếu pos và Store.isFinite(pos.X) và Store.isFinite(pos.Y) và Store.isFinite(pos.Z) thì
            table.insert(wOut, {name = tostring(w.name or ""), x = pos.X, y = pos.Y, z = pos.Z})
        kết thúc
    kết thúc
    cục bộ fOut = {}
    for _, f in ipairs(featureTabs) do
        bảng.chèn(fOut, {
            tên = tostring(f.name hoặc ""),
            icon = tostring(f.icon or "⚙️"),
            mã = tostring(f.code hoặc ""),
        })
    kết thúc
    trở lại {
        phiên bản = Store.SAVE_VERSION,
        scripts = sOut,
        điểm tham chiếu = wOut,
        các tính năng = fOut,
        cài đặt = {
            embedEnabled = (S.embedEnabled == true),
            embedGuessNew = (S.embedGuessNew == true),
            parkCodeGuis = (S.parkCodeGuis ~= false), -- v4.4i
            hubFavs = (function()
                đầu ra cục bộ = {}
                nếu kiểu dữ liệu (S.hubFavs) == "table" thì
                    for nm, v in pairs(S.hubFavs) do if v then out[#out + 1] = tostring(nm) end end
                kết thúc
                trở lại
            kết thúc)(),
        },
    }
kết thúc

hàm Store.save()
    local ok = Store.write(Store.serialize())
    if Store.refreshStatus then pcall(Store.refreshStatus) end
    trả về ok
kết thúc

function Store.saveSoon()
    nếu Store._scheduled thì trả về end
    Store._scheduled = true
    task.delay(0.3, function()
        Store._scheduled = false
        Store.save()
    kết thúc)
kết thúc

hàm Store.load()
    dữ liệu cục bộ = Store.read()
    nếu kiểu dữ liệu (type) khác "table" thì
        Store.mode = Store.canWrite() và "empty" hoặc "none"
        Store.loadedScripts, Store.loadedWp = 0, 0
        Store.loadedFeatures = {}
        trở lại
    kết thúc

    local fileVer = tonumber(data.version) or 1
    nếu fileVer > Store.SAVE_VERSION thì
        Store.lastError = string.format(
            "File save là phiên bản %d, tập lệnh này chỉ hiểu v%d — một số mục không thể tải",
            fileVer, Store.SAVE_VERSION)
    kết thúc

    nếu kiểu dữ liệu (data.settings) == "table" thì
        S.embedEnabled = (data.settings.embedEnabled ~= false)
        S.embedGuessNew = (data.settings.embedGuessNew == true)
        S.parkCodeGuis = (data.settings.parkCodeGuis ~= false)
        nếu type(data.settings.hubFavs) == "table" thì
            S.hubFavs = {}
            for _, nm in ipairs(data.settings.hubFavs) do S.hubFavs[tostring(nm)] = true end
        kết thúc
    kết thúc

    local sOut = {}
    nếu kiểu dữ liệu (data.scripts) == "table" thì
        for _, s in ipairs(data.scripts) do
            nếu type(s) == "table" và type(s.code) == "string" và #s.code > 0 thì
                table.insert(sOut, {
                    tên = (loại(s.name) == "chuỗi" và #s.name > 0) và s.name hoặc ("Script " .. (#sOut + 1)),
                    mã = S.SanitizeCode(s.code),
                    mở rộng = (s.expanded == true),
                })
            kết thúc
        kết thúc
    kết thúc

    cục bộ wOut = {}
    nếu kiểu dữ liệu (data.waypoints) == "table" thì
        for _, w in ipairs(data.waypoints) do
            nếu type(w) == "table" và Store.isFinite(wx) và Store.isFinite(wy) và Store.isFinite(wz) thì
                bảng.chèn(wOut, {
                    tên = (loại(w.name) == "chuỗi" và #w.name > 0) và w.name hoặc ("WP " .. (#wOut + 1)),
                    pos = Vector3.new(wx, wy, wz),
                })
            kết thúc
        kết thúc
    kết thúc

    cục bộ fOut = {}
    nếu kiểu dữ liệu (data.features) == "table" thì
        for _, f in ipairs(data.features) do
            nếu type(f) == "table" và type(f.code) == "string" và #f.code > 0 thì
                bảng.chèn(fOut, {
                    tên = (type(f.name) == "string" và #f.name > 0) và f.name hoặc ("Chiều Năng " .. (#fOut + 1)),
                    icon = (type(f.icon) == "string" and #f.icon > 0) and f.icon or "⚙️",
                    mã = S.SanitizeCode(f.code),
                })
            kết thúc
        kết thúc
    kết thúc

    scripts = sOut
    điểm tham chiếu = wOut
    Store.loadedFeatures = fOut
    Store.loadedScripts, Store.loadedWp = #sOut, #wOut
kết thúc

Store.load()

-- ----------------------------------------------------------------------------
S.compatAdded = S.compatAdded or {} -- tên các hàm đã bù (để cảnh báo lại cho người dùng)
S.compatTried = false
S.vfs = S.vfs hoặc {} -- drive disk Virtual in RAM (khi bộ thực thi không có readfile/writefile)
S.clipboardTxt = S.clipboardTxt hoặc ""
S.queued = S.queued hoặc {} -- queue_on_teleport: giữ lại, không chạy
S.lastRunReport = nil -- báo cáo lần chạy cuối cùng (nhãn 💻 + nút 💾 dùng chung)
S.lastRunError = nil
S.lastNormalizeNote = nil
S.lastParkedCount = 0
S.lastParkedNames = {}

hàm S.HasGlobal(n)
    cục bộ ok, v = pcall(function() return rawget(_G, n) end)
    trả về ok và v ~= nil
kết thúc

hàm S.SetGlobal(n, v)
    if S.HasGlobal(n) then return false end -- KHONG de ham that cua executor
    local ok = pcall(function() rawset(_G, n, v) end)
    nếu được thì
        S.compatAdded[#S.compatAdded + 1] = n
        S.shimmedFns = S.shimmedFns hoặc {}
        S.shimmedFns[n] = rawget(_G, n)
    kết thúc
    trả về ok
kết thúc

hàm S.VRead(p)
    cục bộ f = S.vfs[tostring(p)]
    if f == nil then error("Không tìm thấy tệp: " .. tostring(p)) end
    trả về f
kết thúc
function S.VWrite(p, c) S.vfs[tostring(p)] = tostring(c); return true end
function S.VAppend(p, c) S.vfs[tostring(p)] = (S.vfs[tostring(p)] or "") .. tostring(c); return true end
hàm S.VExists(p) trả về S.vfs[tostring(p)] ~= nil kết thúc
function S.VDel(p) S.vfs[tostring(p)] = nil; return true end
hàm S.VList(dir)
    dir = tostring(dir or ""):gsub("[/\\]+$", "")
    đầu ra cục bộ = {}
    for k in pairs(S.vfs) do
        if dir == "" or k:sub(1, #dir) == dir then out[#out + 1] = k end
    kết thúc
    trở lại
kết thúc

hàm S.CompatRequest(opts)
    if type(opts) ~= "table" then opts = {Url = tostring(opts)} end
    URL cục bộ = tostring(opts.Url hoặc opts.url hoặc "")
    cơ quan địa phương, tình trạng, tốt = "", 200, đúng
    pcall(function()
        local r = game:GetService("HttpService"):RequestAsync({
            URL = URL,
            Phương thức = tostring(opts.Method hoặc opts.method hoặc "GET"):upper(),
            Tiêu đề = opts.Headers hoặc opts.headers,
            Body = opts.Body hoặc opts.body,
        })
        thân, trạng thái, tốt = tostring(r.Body hoặc ""), tonumber(r.StatusCode) hoặc 200, (r.Success ~= false)
    kết thúc)
    if body == "" then pcall(function() body = tostring(game:HttpGet(url)) end) end
    return {StatusCode = status, StatusMessage = "", Body = body, Success = good, Headers = {}}
kết thúc

hàm S.CompatDrawing()
    cục bộ D = {}
    D.Fonts = {UI = 0, System = 0, Plex = 1, Monospace = 2}
    D.new = function(cls)
        local o = {__class = tostring(cls or ""), Visible = false, ZIndex = 1, Transparency = 1}
        trả về setmetatable(o, {
            __index = function(t, k)
                nếu k == "Xóa" hoặc k == "Hủy" thì
                    return function(self) rawset(self, "Visible", false) end
                kết thúc
                trả về rawget(t, k)
            kết thúc,
            __newindex = function(t, k, v) rawset(t, k, v) end,
        })
    kết thúc
    trả về D
kết thúc

hàm S.EnsureCompat()
    if S.compatTried then return S.compatAdded end
    S.compatTried = true
    pcall(function()
        S.SetGlobal("loadstring", function(src, nm) return load(tostring(src), nm or "compat") end)
        S.SetGlobal("getgenv", function() return _G end)
        S.SetGlobal("getrenv", function() return _G end)
        S.SetGlobal("identifyexecutor", function() return "BananaCatHub-Compat", "4.7" end)
        S.SetGlobal("getexecutorname", function() return "BananaCatHub-Compat" end)
        S.SetGlobal("getscript", function() return nil end)
        S.SetGlobal("getcallingscript", function() return nil end)
        S.SetGlobal("checkcaller", function() return false end)
        S.SetGlobal("isourclosure", function() return false end)
        S.SetGlobal("is_synapse_function", function() return false end)
        S.SetGlobal("setclipboard", function(t) S.clipboardTxt = tostring(t); return true end)
        S.SetGlobal("toclipboard", function(t) S.clipboardTxt = tostring(t); return true end)
        S.SetGlobal("set_clipboard", function(t) S.clipboardTxt = tostring(t); return true end)
        S.SetGlobal("readfile", function(p) return S.VRead(p) end)
        S.SetGlobal("writefile", function(p, c) return S.VWrite(p, c) end)
        S.SetGlobal("appendfile", function(p, c) return S.VAppend(p, c) end)
        S.SetGlobal("isfile", function(p) return S.VExists(p) end)
        S.SetGlobal("delfile", function(p) return S.VDel(p) end)
        S.SetGlobal("listfiles", function(d) return S.VList(d) end)
        S.SetGlobal("makefolder", function() return true end)
        S.SetGlobal("isfolder", function() return true end)
        S.SetGlobal("delfolder", function() return true end)
        S.SetGlobal("getcustomasset", function(_, p) return tostring(p) end)
        S.SetGlobal("getsynasset", function(_, p) return tostring(p) end)
        S.SetGlobal("request", function(o) return S.CompatRequest(o) end)
        S.SetGlobal("http_request", function(o) return S.CompatRequest(o) end)
        S.SetGlobal("http", {request = function(o) return S.CompatRequest(o) end})
        S.SetGlobal("HttpRequest", function(o) return S.CompatRequest(o) end)
        S.SetGlobal("hookfunction", function(_, nw) return nw end)
        S.SetGlobal("hookmetamethod", function() return function() end end)
        S.SetGlobal("getrawmetatable", function(o) return getmetatable(o) or {} end)
        S.SetGlobal("setrawmetatable", function(o, m) pcall(setmetatable, o, m); return o end)
        S.SetGlobal("setreadonly", function() return true end)
        S.SetGlobal("isreadonly", function() return false end)
        S.SetGlobal("newcclosure", function(f) return f end)
        S.SetGlobal("getnamecallmethod", function() return "" end)
        S.SetGlobal("setnamecallmethod", function() return true end)
        S.SetGlobal("getconnections", function() return {} end)
        S.SetGlobal("fireclickdetector", function() return true end)
        S.SetGlobal("firetouchinterest", function() return true end)
        S.SetGlobal("fireproximityprompt", function() return true end)
        S.SetGlobal("gethui", function() return game:GetService("CoreGui") end)
        S.SetGlobal("Drawing", S.CompatDrawing())
        S.SetGlobal("setfpscap", function() return true end)
        S.SetGlobal("getfpscap", function() return 60 end)
        S.SetGlobal("iswindowactive", function() return true end)
        S.SetGlobal("queue_on_teleport", function(_, src)
            S.queued[#S.queued + 1] = tostring(src); return true end)
    kết thúc)
    nếu #S.compatAdded > 0 thì
        pcall(function() print("[BananaCatHub] " .. S.CompatNote()) end)
    kết thúc
    trả về S.compatAdded
kết thúc

hàm S.CompatNote()
    cục bộ n = #S.compatAdded
    nếu n == 0 thì trả về "" kết thúc
    mẫu cục bộ = {}
    for i = 1, math.min(4, n) do sample[#sample + 1] = S.compatAdded[i] end
    return "🩹 đã bù " .. n .. " hàm thi hành còn thiếu (" .. table.concat(sample, ", ")
        .. (n > 4 và "..." hoặc "") .. ")"
kết thúc

hàm S.NormalizeRunnable(c)
    S.lastNormalizeNote = nil
    nếu kiểu dữ liệu (c) ~= "string" thì trả về ""
    c = c:gsub("\239\187\191", ""):gsub("\226\128\139", "")
    c = c:gsub("\226\128\142", ""):gsub("\226\128\143", "")
    local t = c:match("^%s*(.-)%s*$") or ""
    local q = t:match('^["\'](.-)["\']$') -- phong cách cả dấu chớp bao quanh link
    nếu q và q ≈ "" thì t = q kết thúc
    nếu t:match("^https?://") thì
        nếu t:find('[%c"\\]') thì
            S.lastNormalizeNote = "⚠️ link có ký tự lạ -> chạy văn bản"
            trả về c
        kết thúc
        S.lastNormalizeNote = "🔗 link trần -> tự bọc Loadstring(game:HttpGet(...))()"
        return 'loadstring(game:HttpGet("' .. t .. '"))()'
    kết thúc
    local u = t:match('^game:HttpGet%s*%(%s*"(https?://.-)"%s*%)$')
        hoặc t:match('^HttpGet%s*%(%s*"(https?://.-)"%s*%)$')
    nếu bạn thì
        S.lastNormalizeNote = "🔗 HttpGet trần -> chuỗi tải tự bọc(...)()"
        return 'loadstring(game:HttpGet("' .. u .. '"))()'
    kết thúc
    nếu t:match("^loadstring%s*%(") và t:sub(-2) ~= "()" thì
        S.lastNormalizeNote = "➕ chuỗi tải thiếu dấu () -> đã thêm để chạy"
        trả về t .. "()"
    kết thúc
    trả về c
kết thúc

hàm S.RunReportText()
    local r = S.lastRunReport
    nếu không phải r thì trả về "" kết thúc
    nếu r.fail > 0 và r.ok == 0 thì
        local e = tostring(r.err hoặc "không rõ"):gsub("%s+", " ")
        nếu #e > 160 thì e = e:sub(1, 160) .. "…" kết thúc
        return "❌ Không thể chạy: " .. e .. " · mở F9 xem đầy đủ"
    kết thúc
    local t = " ✅Đã chạy xong (" .. r.ok .. " lần)"
    if r.fail > 0 thì t = t .. " · ⚠️ " .. r.fail .. " lần lỗi" end
    nếu r.guis và r.guis > 0 thì
        cục bộ nm = (r.names và r.names[1]) và (" '" .. r.names[1] .. "'") hoặc ""
        t = t .. " · 🧩 " .. r.guis .. " GUI đã vào tab 'GUI Ngoài'" .. nm .. " (bấm ↩ trả ra màn hình)"
    nếu r.parked thì
        t = t .. " · " .. r.parked
    kết thúc
    nếu r.note thì t = t .. " · " .. r.note end
    if r.compat and r.compat ~= "" then t = t .. " · " .. r.compat end
    trả lại t
kết thúc

hàm cục bộ ExecOnce(code, name)
    if #name>0 then print("👤 Chạy bởi:", name) end
    code = S.SanitizeCode(code) -- v4.4b: cut Wrapper "tự động kích thước" độc hại của bản cũ
    code = S.NormalizeRunnable(code) -- v4.7: link trần / thiếu () / BOM -> chạy được
    S.EnsureCompat() -- v4.7: Thiếu hàm thực thi bù (không ghi đè hàm thật)
    cục bộ ok, err = pcall(function()
        local fn, lerr = loadstring(code)
        nếu không phải fn thì lỗi (lerr) kết thúc
        fn()
    kết thúc)
    nếu được thì
        S.lastRunError = nil
    khác
        S.lastRunError = tostring(err)
        pcall(function() warn("[BananaCatHub] ❌ '" .. tostring(name) .. "' lỗi: " .. tostring(err)) end)
    kết thúc
    trả về ok, err
kết thúc

hàm cục bộ Cancel()
    pcall(function() if S.AbortRunCapture then S.AbortRunCapture() end end)
    bị hủy bỏ=đúng
    runActive=false
    if curThread then pcall(task.cancel, curThread); curThread=nil end
    nếu curIndicator thì curIndicator.BackgroundColor3=C.BLUE; curIndicator=nil kết thúc
kết thúc

hàm cục bộ RunCode(code, name, ind, times, delay, noPark)
    Hủy bỏ()
    ReleaseHubFocus() -- v4.4b: free focus TextBox, if not game block input (không đi/không bắn)
    nếu #code==0 thì trả về false, "⚠️ Vui lòng nhập mã!" kết thúc
    đã hủy bỏ = sai
    if ind then curIndicator=ind; ind.BackgroundColor3=C.RED end
    cục bộ okC, failC = 0, 0
    curThread = task.spawn(function())
        runActive=true
        S.lastParkedCount, S.lastParkedNames = 0, {} -- v4.7: GUI đếm của RIÊNG lần chạy này
        S.lastRunError = nil
        local skipPark, skipWhy = (noPark == true), (noPark == true and "nút script nhanh" or nil)
        nếu không phải skipPark và S.ShouldSkipPark thì
            local s2, w2 = S.ShouldSkipPark(code, name)
            nếu s2 thì skipPark, skipWhy = true, w2 end
        kết thúc
        giới hạn địa phương = không
        nếu bỏ qua bãi đậu xe thì
            S.lastParkNote = "🪟 GUI để NGOÀI màn hình trò chơi (công cụ riêng cửa sổ) — không được đưa vào menu"
            pcall(function()
                print("[BananaCatHub] 🛠 '" .. tostring(name) .. "': GUI ở NGOÀI màn hình game như cũ"
                    .. " (lý do không đưa vào menu: " .. tostring(skip Why) .. ")")
            kết thúc)
        khác
            S.lastParkNote = nil
            cap = S.BeginRunCapture()
        kết thúc
        for i=1,times do
            nếu bị hủy thì dừng lại
            nếu i>1 và độ trễ>0 thì
                cục bộ e=0
                trong khi e<delay thì
                    nếu bị hủy thì dừng lại
                    task.wait(0.1); e+=0.1
                kết thúc
                nếu bị hủy thì dừng lại
            kết thúc
            cục bộ ok, err = ExecOnce(code, name)
            if ok then okC+=1 else failC+=1; warn("❌ góc",i,err) end
            nếu có thì
                S.EndRunCapture(cap, (#name>0 and name or "Script"))
                S.lastParkedCount = cap.parked hoặc 0 -- v4.7: để báo "GUI đang nằm ở đâu"
                S.lastParkedNames = cap.names hoặc {}
                mũ = không
            kết thúc
        kết thúc
        if cap then S.EndRunCapture(cap, (#name>0 and name or "Script")) cap = nil end
        S.lastRunReport = {
            tên = tên,
            ok = okC,
            thất bại = thất bạiC,
            err = S.lastRunError,
            parked = (skipPark và S.lastParkNote hoặc nil),
            guis = S.lastParkedCount,
            names = S.lastParkedNames,
            note = S.lastNormalizeNote,
            compat = S.CompatNote(),
        }
        totalRuns+=okC+failC
        if ind then ind.BackgroundColor3=C.GREEN; if curIndicator==ind then curIndicator=nil end end
        runActive=false
        curThread=nil
    kết thúc)
    trả về true, nil
kết thúc

hàm cục bộ Label(parent, text, y)
    local isRule = (tostring(text):find("━") ~= nil)
    trả về New("TextLabel", {
        Kích thước=UDim2.new(1,-16,0,14), Vị trí=UDim2.new(0,8,0,y hoặc 0),
        Văn bản=văn bản, Độ trong suốt nền=1,
        TextColor3=(isRule and C.BORDER or C.MUTED), -- v4.5: chữ phụ / đường yêu trên nền tối
        Font=Enum.Font.GothamMedium, TextSize=10, TextXAlignment=Enum.TextXAlignment.Left, ZIndex=6,
    }, cha)
kết thúc

hàm cục bộ Button(parent, text, x, y, w, h, color)
    cơ sở cục bộ = màu hoặc C.SURFACE3
    local btn = New("TextButton", {
        Kích thước = UDim2.new(0, w hoặc 100, 0, h hoặc 24), Vị trí = UDim2.new(0, x hoặc 8, 0, y hoặc 0),
        Văn bản=văn bản, Màu nền 3=màu cơ bản, Độ trong suốt nền=0.08,
        TextColor3=D.BestText(base), Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=6,
    }, cha)
    Góc(btn, UDim.new(0,8))
    Stroke(btn, D.Edge(base), 1.1)
    D.Shade(btn, Color3.fromRGB(255,255,255), Color3.fromRGB(182,187,201), 90)
    D.Tactile(btn, 0.08)
    nút quay lại
kết thúc

hàm S.Debounce(key, secs, fn)
    S._dbt = S._dbt hoặc {}
    cục bộ n = (S._dbt[key] hoặc 0) + 1
    S._dbt[key] = n
    task.delay(secs or 0.18, function()
        if S._dbt[key] ~= n then return end -- đã có phím mới hơn -> lượt xem này bỏ qua
        S._dbt[key] = nil
        pcall(fn)
    kết thúc)
kết thúc

cục bộ y = 8
Label(codeTab, "💻 Nhập Code Tùy Chỉnh", y)
y = y + 14
Label(codeTab, "👤 Tên Script", y)
y = y + 14

local nameIn = New("TextBox", {
    Kích thước=UDim2.new(1,-16,0,26), Vị trí=UDim2.new(0,8,0,y), Văn bản="",
    PlaceholderText="Nhập tên script...", PlaceholderColor3=Color3.fromRGB(122, 130, 148),
    BackgroundColor3=Color3.fromRGB(26, 29, 38), BackgroundTransparency=0, TextColor3=Color3.fromRGB(233, 237, 245),
    Font=Enum.Font.GothamMedium, TextSize=12, BorderSizePixel=0, ClearTextOnFocus=false,
    Active=true, Selectable=true, ZIndex=10, TextXAlignment=Enum.TextXAlignment.Left,
}, codeTab)
Góc(nameIn, UDim.new(0,5))
Stroke(nameIn, Color3.fromRGB(100,120,200), 1.5)
New("UIPadding", {PaddingLeft=UDim.new(0,6)}, nameIn)

y = y + 32
Nhãn(codeTab, "💻 Mã (Lua)", y)
y = y + 14

local codeIn = New("TextBox", {
    Kích thước=UDim2.new(1,-16,0,80), Vị trí=UDim2.new(0,8,0,y), Văn bản="",
    PlaceholderText="-- Nhập mã Lua tại đây...", PlaceholderColor3=Color3.fromRGB(122, 130, 148),
    BackgroundColor3=Color3.fromRGB(28, 31, 41), BackgroundTransparency=0, TextColor3=Color3.fromRGB(233, 237, 245),
    Font=Enum.Font.Code, TextSize=11, BorderSizePixel=0, ClearTextOnFocus=false,
    MultiLine=true, TextWrapped=true, TextXAlignment=Enum.TextXAlignment.Left, TextYAlignment=Enum.TextYAlignment.Top,
    Active=true, Selectable=true, ZIndex=10,
}, codeTab)
Góc(codeIn, UDim.new(0,5))
Stroke(codeIn, Color3.fromRGB(100,120,200), 1.5)
New("UIPadding", {PaddingLeft=UDim.new(0,6), PaddingTop=UDim.new(0,4)}, codeIn)

y = y + 86
Label(codeTab, "🔁 Cài đặt", y)
y = y + 14
Label(codeTab, "Số lần lặp:", y)

local repIn = New("TextBox", {
    Kích thước=UDim2.new(0,55,0,24), Vị trí=UDim2.new(0,8,0,y+12), Văn bản="1",
    PlaceholderColor3=Color3.fromRGB(122, 130, 148), BackgroundColor3=Color3.fromRGB(26, 29, 38), BackgroundTransparency=0,
    TextColor3=Color3.fromRGB(233, 237, 245), Font=Enum.Font.GothamMedium, TextSize=12, BorderSizePixel=0,
    ClearTextOnFocus=false, Active=true, Selectable=true, ZIndex=10,
}, codeTab)
Góc(repIn, UDim.new(0,5))
Stroke(repIn, Color3.fromRGB(180,180,200), 1.2)

Label(codeTab, "Thời gian chờ:", y+36)

local delIn = New("TextBox", {
    Kích thước=UDim2.new(0,55,0,24), Vị trí=UDim2.new(0,8,0,y+50), Văn bản="0",
    PlaceholderColor3=Color3.fromRGB(122, 130, 148), BackgroundColor3=Color3.fromRGB(26, 29, 38), BackgroundTransparency=0,
    TextColor3=Color3.fromRGB(233, 237, 245), Font=Enum.Font.GothamMedium, TextSize=12, BorderSizePixel=0,
    ClearTextOnFocus=false, Active=true, Selectable=true, ZIndex=10,
}, codeTab)
Góc(delIn, UDim.new(0,5))
Stroke(delIn, Color3.fromRGB(180,180,200), 1.2)

local unitBtn = New("TextButton", {
    Size=UDim2.new(0,55,0,24), Position=UDim2.new(0,75,0,y+50), Text="Giây ▾",
    BackgroundColor3=Color3.fromRGB(26, 29, 38), BackgroundTransparency=0, TextColor3=C.DARK,
    Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=10,
}, codeTab)
Góc(unitBtn,UDim.new(0,4)); Đường viền(unitBtn)

local ddFrame = New("Frame", {
    Kích thước=UDim2.new(0,55,0,48), Vị trí=UDim2.new(0,75,0,y+74),
    BackgroundColor3=Color3.fromRGB(26, 29, 38), BackgroundTransparency=0, BorderSizePixel=0, Visible=false, ZIndex=15,
}, codeTab)
Góc(ddFrame,UDim.new(0,4)); Đường viền(ddFrame)

local secOpt = New("TextButton", {
    Size=UDim2.new(1,0,0,24), Text="Giây", BackgroundColor3=Color3.fromRGB(28, 31, 41),
    BackgroundTransparency=0, TextColor3=C.DARK, Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=16,
}, ddFrame)

local minOpt = New("TextButton", {
    Size=UDim2.new(1,0,0,24), Position=UDim2.new(0,0,0,24), Text="Phút",
    BackgroundColor3=Color3.fromRGB(28, 31, 41), BackgroundTransparency=0, TextColor3=C.DARK,
    Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=16,
}, ddFrame)

unitBtn.Activated:Connect(function() ddFrame.Visible=not ddFrame.Visible end)
secOpt.Activated:Connect(function() unitBtn.Text="Giây ▾"; ddFrame.Visible=false end)
minOpt.Activated:Connect(function() unitBtn.Text="Phút ▾"; ddFrame.Visible=false end)

trackConn(UserInputService.InputBegan:Connect(function(i,gp)
    nếu gp thì trả về end
    nếu i.UserInputType == Enum.UserInputType.MouseButton1 hoặc i.UserInputType == Enum.UserInputType.Touch thì
        local f = Hit.inObject(unitBtn, i.Position.X, i.Position.Y)
            hoặc Hit.inObject(ddFrame, i.Position.X, i.Position.Y)
        if not f then ddFrame.Visible=false end
    kết thúc
kết thúc))

y = y + 82

local runBtn = Button(codeTab, "▶ Chạy Mã", 8, y, 336, 26, Color3.fromRGB(0,160,90))
local stopBtn = Button(codeTab, "⏹ cột", 350, y, 126, 26, C.RED)
y = y + 32
local saveBtn = Button(codeTab, "💾 Lưu Vào Danh Sách", 8, y, 468, 26, C.BLUE)
y = y + 32

local statusLbl = Label(codeTab, "", y)
statusLbl.TextColor3=Color3.fromRGB(255, 205, 64); statusLbl.TextSize=9; trạng tháiLbl.ZIndex=6
y = y + 14

local countLbl = Label(codeTab, "🔄 Tổng số lần chạy: 0", y)
countLbl.TextColor3=C.GREEN; countLbl.TextSize=9; countLbl.ZIndex=6

codeTab.CanvasSize = UDim2.new(0, 0, 0, y + 30)

stopBtn.Activated:Connect(function() Cancel(); statusLbl.Text="⏹️ Đã dừng" end)

runBtn.Activated:Connect(function()
    local t=math.clamp(tonumber(repIn.Text)or 1,1,1000)
    local d=math.max(tonumber(delIn.Text)or 0,0)
    if unitBtn.Text:find("Phút") then d=d*60 end
    local ok,err=RunCode(codeIn.Text,nameIn.Text,nil,t,d)
    nếu không ổn thì
        statusLbl.Text=err hoặc "❌ Lỗi không xác định"
    khác
        statusLbl.Text="⏳ Đang thực thi..."
        task.spawn(function()
            trong khi runActive thực hiện
                if cancelled then statusLbl.Text="⏹️ Đã dừng"; return end
                task.wait(0.1)
            kết thúc
            nếu không bị hủy bỏ thì
                local rep7 = S.RunReportText()
                statusLbl.Text = (rep7 ~= "") và rep7
                    hoặc ("✅ Hoàn thành!" .. (S.lastParkNote và (" · " .. S.lastParkNote) hoặc ""))
                statusLbl.TextColor3 = (S.lastRunReport và S.lastRunReport.fail > 0
                    và S.lastRunReport.ok == 0) và C.RED hoặc Color3.fromRGB(255, 205, 64)
            kết thúc
            countLbl.Text="🔄 Tổng số lần chạy: "..totalRuns
            task.delay(1.5, function()
                nếu statusLbl và statusLbl.Parent và (S.lastParkNote hoặc S.lastRunReport) thì
                    local rep7 = S.RunReportText()
                    if rep7 ~= "" then statusLbl.Text = rep7 end
                kết thúc
            kết thúc)
        kết thúc)
    kết thúc
kết thúc)

Tập lệnh xây dựng lại cục bộ

saveBtn.Activated:Connect(function()
    cục bộ n=nameIn.Text
    local c=codeIn.Text
    if #c==0 thì statusLbl.Text="⚠️ Vui lòng nhập mã!"; kết thúc trở lại
    nếu #n==0 thì n="Script "..(#scripts+1) end
    cục bộ bn=n
    local cnt=1
    trong khi đúng vậy
        cục bộ ex=false
        for _,s in ipairs(scripts) do if s.name==n then ex=true; break end end
        nếu không phải ex thì dừng lại
        cnt+=1; n=bn.." ("..cnt..")"
    kết thúc
    table.insert(scripts,{name=n, code=c, expanded=false})
    nếu RebuildScripts thì RebuildScripts() kết thúc
    Store.saveSoon()
    statusLbl.Text=" ✅ Đã lưu vào Tab 'Code Đã Lưu'! (đã ghi xuống đĩa)"
kết thúc)

sy cục bộ = 8
Label(savedCodeTab, "💾 Danh Sách Script Đã Lưu", sy)
sy = sy + 18

local searchIn = New("TextBox", {
    Kích thước=UDim2.new(1,-16,0,26), Vị trí=UDim2.new(0,8,0,sy), Văn bản="",
    PlaceholderText="🔍Tìm kiếm tập lệnh...", PlaceholderColor3=Color3.fromRGB(122, 130, 148),
    BackgroundColor3=Color3.fromRGB(26, 29, 38), BackgroundTransparency=0, TextColor3=Color3.fromRGB(233, 237, 245),
    Font=Enum.Font.GothamMedium, TextSize=12, BorderSizePixel=0, ClearTextOnFocus=false,
    Active=true, Selectable=true, ZIndex=10, TextXAlignment=Enum.TextXAlignment.Left,
}, savedCodeTab)
Góc(searchIn, UDim.new(0,5))
Stroke(searchIn, Color3.fromRGB(180,180,200), 1.2)
New("UIPadding", {PaddingLeft=UDim.new(0,6)}, searchIn)
sy = sy + 32

Store.statusLbl = New("TextLabel", {
    Kích thước=UDim2.new(1,-110,0,20), Vị trí=UDim2.new(0,8,0,sy),
    Văn bản="💾 ...", Độ trong suốt nền=1, Màu chữ 3=XÁM,
    Font=Enum.Font.GothamMedium, TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left, TextYAlignment=Enum.TextYAlignment.Center,
    TextTruncate=Enum.TextTruncate.AtEnd, ZIndex=7,
}, savedCodeTab)

Store.reloadBtn = New("TextButton", {
    Kích thước=UDim2.new(0,94,0,20), Vị trí=UDim2.new(1,-102,0,sy),
    Text="🔄 Nạp lại", BackgroundColor3=C.BLUE, BackgroundTransparency=0.1,
    TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=8,
}, savedCodeTab)
Góc(Store.reloadBtn, UDim.new(0,5))
Stroke(Store.reloadBtn, Color3.fromRGB(0,90,170), 1)

Store.refreshStatus = function()
    if not Store.statusLbl or not Store.statusLbl.Parent then return end
    cục bộ ns, nw, nf = #scripts, #waypoints, #featureTabs
    nếu Store.lastError thì
        Store.statusLbl.TextColor3=Color3.fromRGB(255, 160, 90)
        Store.statusLbl.Text = string.format("⚠️ %d script · %d WP · %d tab — %s", ns, nw, nf, Store.lastError)
    elseif Store.mode == "file" then
        Store.statusLbl.TextColor3=Color3.fromRGB(58, 214, 140)
        Store.statusLbl.Text = string.format("💾 %d script · %d WP · %d tab · %s%s", ns, nw, nf, Store.SAVE_FILE,
            Store.lastSavedAt và (" · lưu lúc ".. Store.lastSavedAt) hoặc "")
    elseif Store.mode == "memory" then
        Store.statusLbl.TextColor3=Color3.fromRGB(255, 205, 64)
        Store.statusLbl.Text = string.format("⚠️ %d script · %d WP · %d tab — chỉ giữ trong phiên bản trò chơi này (thiếu tập tin ghi)", ns, nw, nf)
    elseif Store.mode == "empty" then
        Store.statusLbl.TextColor3 = C.GRAY
        Store.statusLbl.Text = string.format("💾 Chưa lưu gì · sẽ ghi vào %s khi bạn nhấn Lưu", Store.SAVE_FILE)
    khác
        Store.statusLbl.TextColor3 = C.GRAY
        Store.statusLbl.Text = "💾 Chưa lưu gì (người thực thi thiếu tệp ghi — chỉ giữ trong phiên bản trò chơi)"
    kết thúc
kết thúc

S.DoReload = function()
    Store.load()
    RebuildScripts()
    S.Rebuild()
    if Store.restoreWaypoints then pcall(Store.restoreWaypoints) end
    if Store.restoreFeatures then pcall(Store.restoreFeatures) end
    flash(Store.reloadBtn, " ✅ Đã tải", 1.4)
kết thúc
Store.reloadBtn.Activated:Connect(S.DoReload)

sy = sy + 24

local scriptList = New("Frame", {
    Kích thước=UDim2.new(1,-16,0,0), Vị trí=UDim2.new(0,8,0,sy),
    BackgroundTransparency=1, BorderSizePixel=0, ZIndex=6,
}, savedCodeTab)
New("UIListLayout", {SortOrder=Enum.SortOrder.LayoutOrder, Padding=UDim.new(0,6)}, scriptList)

RebuildScripts = function()
    for _,c in ipairs(scriptList:GetChildren()) do
        if not c:IsA("UIListLayout") then c:Destroy() end
    kết thúc

    thuật ngữ cục bộ = searchIn.Text:lower()
    local disp={}
    for _,d in ipairs(scripts) do
        if term=="" or d.name:lower():find(term,1,true) then table.insert(disp,d) end
    kết thúc

    nếu #disp==0 thì
        Mới("TextLabel", {
            Kích thước = UDim2.new(1, 0, 0, 40),
            Text=term~="" và "📭 Không tìm thấy tập lệnh phù hợp" hoặc "📭 Không có tập lệnh nào được lưu",
            BackgroundTransparency=1, TextColor3=C.GRAY, Font=Enum.Font.GothamMedium, TextSize=11,
            TextXAlignment=Enum.TextXAlignment.Center, TextYAlignment=Enum.TextYAlignment.Center, ZIndex=7,
        }, scriptList)
    kết thúc

    local totalHeight = 0

    for _, d in ipairs(disp) do
        local isExpanded = d.expanded or false
        local rowH = isExpanded and 160 or 42

        hàng cục bộ = New("Khung", {
            Size=UDim2.new(1,0,0,rowH), BackgroundColor3=Color3.fromRGB(26, 29, 38),
            BackgroundTransparency=0.1, BorderSizePixel=0, ZIndex=6,
            ClipsDescendants=true,
        }, scriptList)
        Góc(hàng,UDim.new(0,6)); Đường viền(hàng)

        local arrowBtn = New("TextButton", {
            Kích thước=UDim2.new(0,24,0,24), Vị trí=UDim2.new(0,6,0,9),
            Văn bản = isExpanded và "▲" hoặc "▼",
            BackgroundColor3=Color3.fromRGB(32, 36, 47), BackgroundTransparency=0,
            TextColor3=C.BLUE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=8,
        }, hàng ngang)
        Góc(arrowBtn, UDim.new(0,4))

        local nameLbl = New("TextLabel", {
            Kích thước=UDim2.new(1,-175,0,42), Vị trí=UDim2.new(0,36,0,0),
            Văn bản=d.name, Độ trong suốt nền=1, Màu văn bản3=C.DARK,
            Font=Enum.Font.GothamBold, TextSize=11, TextXAlignment=Enum.TextXAlignment.Left,
            TextTruncate=Enum.TextTruncate.AtEnd, ZIndex=8,
        }, hàng ngang)

        local delScriptBtn = New("TextButton", {
            Kích thước=UDim2.new(0,58,0,26), Vị trí=UDim2.new(1,-132,0,8),
            Văn bản="🗑 x", Màu nền 3=Đỏ, Độ trong suốt nền=0.1,
            TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=8,
        }, hàng ngang)
        Góc(delScriptBtn, UDim.new(0,5))

        local runScriptBtn = New("TextButton", {
            Kích thước=UDim2.new(0,62,0,26), Vị trí=UDim2.new(1,-68,0,8),
            Văn bản="▶ Chạy", Màu nền3=Xanh lá cây, Độ trong suốt nền=0.1,
            TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=8,
        }, hàng ngang)
        Góc(runScriptBtn, UDim.new(0,5))

        nếu isExpanded thì
            local codeBoxFrame = New("ScrollingFrame", {
                Kích thước=UDim2.new(1,-12,0,82), Vị trí=UDim2.new(0,6,0,42),
                BackgroundColor3=Color3.fromRGB(24, 27, 35), BackgroundTransparency=0,
                BorderSizePixel=0, ZIndex=8, ScrollBarThickness=4,
                CanvasSize=UDim2.new(0,0,0,0),
                Kích thước Canvas tự động = Enum.Kích thước tự động.Y,
                ScrollingDirection=Enum.ScrollingDirection.Y,
                ScrollingEnabled=true,
                VerticalScrollBarInset=Enum.ScrollBarInset.ScrollBar,
            }, hàng ngang)
            Góc(codeBoxFrame, UDim.new(0,5))
            Stroke(codeBoxFrame, Color3.fromRGB(190,195,210), 1)

            local codeLbl = New("TextBox", {
                Kích thước=UDim2.new(1,-8,0,0), Vị trí=UDim2.new(0,4,0,4),
                Kích thước tự động = Enum.Kích thước tự động.Y,
                Văn bản=d.code, Màu văn bản3=Màu3.fromRGB(226, 230, 240), Độ trong suốt nền=1,
                Font=Enum.Font.Code, TextSize=10, TextXAlignment=Enum.TextXAlignment.Left,
                TextYAlignment=Enum.TextYAlignment.Top, MultiLine=true, TextWrapped=true,
                ClearTextOnFocus=false, TextEditable=false, Active=true, ZIndex=9,
            }, codeBoxFrame)

            local copyBtn = New("TextButton", {
                Kích thước=UDim2.new(0,120,0,24), Vị trí=UDim2.new(0,6,0,128),
                Văn bản="📋 Mã Sao Chép", Màu nền 3=Xanh lam, Độ trong suốt nền=0.1,
                TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=8,
            }, hàng ngang)
            Góc(copyBtn, UDim.new(0,5))

            copyBtn.Activated:Connect(function()
                nếu S.CopyToClipboard(d.code) thì
                    flash(copyBtn, " ✅ Đã Sao Chép!", 1.5)
                khác
                    codeLbl:CaptureFocus()
                    codeLbl.SelectionStart = 1
                    codeLbl.CursorPosition = #d.code + 1
                    flash(copyBtn, "⚠️ Đã Bội Đen Code", 1.5)
                kết thúc
            kết thúc)
        kết thúc

        arrowBtn.Activated:Connect(function()
            d.expanded = không phải d.expanded
            RebuildScripts()
            Store.saveSoon()
        kết thúc)

        runScriptBtn.Activated:Connect(function()
            local prev = runScriptBtn.Text
            cục bộ prevColor = runScriptBtn.TextColor3
            RunCode(d.code, d.name, runScriptBtn, 1, 0)
            runScriptBtn.Text = "⏳ ..."
            task.spawn(function()
                cục bộ chờ = 0
                while runActive and waited < 60 do task.wait(0.1); waited = waited + 0.1 end
                task.wait(0.4) -- chờ chụp/đậu GUI hoàn tất
                local rep = S.lastRunReport
                local txt = S.RunReportText()
                cục bộ xấu = rep và rep.fail > 0 và rep.ok == 0
                nếu xấu thì
                    runScriptBtn.Text = "❌ lỗi"
                    runScriptBtn.TextColor3 = C.RED
                elseif rep and (rep.guis or 0) > 0 then
                    runScriptBtn.Text = "🧩 vào tab"
                nếu rep và rep.parked thì
                    runScriptBtn.Text = "🪟 ngoài MH"
                khác
                    runScriptBtn.Text = " ✅ xong"
                kết thúc
                pcall(function()
                    nếu Store.statusLbl và Store.statusLbl.Parent thì
                        Store.statusLbl.Text = "▶ '" .. tostring(d.name) .. "' · " .. (txt ~= "" and txt or "xong")
                        Store.statusLbl.TextColor3 = bad and C.RED or C.GRAY
                    kết thúc
                kết thúc)
                task.delay(2.2, function()
                    nếu runScriptBtn và runScriptBtn.Parent thì
                        runScriptBtn.Text = prev
                        runScriptBtn.TextColor3 = prevColor
                    kết thúc
                kết thúc)
            kết thúc)
        kết thúc)

        delScriptBtn.Activated:Connect(function()
            local origIdx = nil
            for idx, s in ipairs(scripts) do
                if s == d then origIdx = idx; break end
            kết thúc
            nếu origIdx thì
                table.remove(scripts, origIdx)
                RebuildScripts()
                Store.saveSoon()
            kết thúc
        kết thúc)

        tổng chiều cao = tổng chiều cao + hàngH + 6
    kết thúc

    local listH = math.max(totalHeight, 40)
    scriptList.Size = UDim2.new(1,-16,0,listH)
    savedCodeTab.CanvasSize = UDim2.new(0, 0, 0, sy + listH + 30)
    if Store.refreshStatus then Store.refreshStatus() end
kết thúc

searchIn:GetPropertyChangedSignal("Text"):Connect(function() S.Debounce("savedSearch", 0.18, RebuildScripts) end)
RebuildScripts()

local supportTab = AddTab("Chiến thuật", "🛠", 5) -- v4.15: 4 -> 5 để nhường chỗ cho 👥 Người Chơi

vị trí cục bộ = 8

Label(supportTab, "⚡ Script Nhanh - Nhấn để chạy ngay", posY)
posY = posY + 16

local quickScripts = {
    {n="Dex Explorer", d="Mở Dex Explorer", c=[[loadstring(game:HttpGet("https://raw.githubusercontent.com/infyiff/backup/main/dex.lua"))()]], cl=Color3.fromRGB(72, 148, 248)},
    {n="Infinite Yield", d="Admin Commands", c=[[loadstring(game:HttpGet("https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source"))()]], cl=C.PURPLE},
    {n="SimpleSpy v3", d="Theo dõi RemoteEvent & RemoteFunction", c=[[loadstring(game:HttpGet("https://raw.githubusercontent.com/ex-serum/SimpleSpy/main/SimpleSpy.lua"))()]], cl=Color3.fromRGB(38, 194, 118)},
}

for _, s in ipairs(quickScripts) do
    local btn = New("TextButton", {
        Kích thước=UDim2.new(1,-16,0,28), Vị trí=UDim2.new(0,8,0,posY), Văn bản="",
        BackgroundColor3=s.cl, BackgroundTransparency=0.3, BorderSizePixel=0, ZIndex=6,
    }, supportTab)
    Góc(btn, UDim.new(0,5))
    Stroke(btn, s.cl, 1.2)
    Mới("TextLabel", {
        Kích thước=UDim2.new(1,-10,1,0), Vị trí=UDim2.new(0,10,0,0), Văn bản=sn."\n"..sd,
        BackgroundTransparency=1, TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10,
        TextXAlignment=Enum.TextXAlignment.Left, TextYAlignment=Enum.TextYAlignment.Center, ZIndex=7,
    }, btn)
    btn.Activated:Connect(function() RunCode(sc, sn, nil, 1, 0, true) end)
    posY = posY + 32
kết thúc

posY = posY + 6
Label(supportTab, "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", posY)
posY = posY + 16

Label(supportTab, "🛠 Hỗ Trợ — Phân Tích Độ", posY)
posY = posY + 18
Label(supportTab, "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", posY)
posY = posY + 16

local analyzeObjectEnabled = false
local highlightEnabled = true

local objectAnalyzeBtn = Button(supportTab, "🎯 Phân Tích Vật Thể: TẮT", 8, posY, 372, 26, C.GRAY)
local clearObjectBtn = Button(supportTab, "🧹 KQ", 386, posY, 90, 26, C.RED)
posY = posY + 32

local highlightToggleBtn = Button(supportTab, "💜 Highlight Tím: BẬT", 8, posY, 372, 26, C.PURPLE)
local removeHighlightBtn = Button(supportTab, "❌ bật Highlight", 386, posY, 90, 26, C.RED)
posY = posY + 32

--------- v4.8: PHÂN TÍCH ĐA NỀN TẢNG (📱 điện thoại + 🖥 máy tính) ----------
S.AnaUi = S.AnaUi hoặc {}
S.AnaUi.devLbl = Label(supportTab, "📱/🖥 Đang nhận dạng thiết bị...", posY)
S.AnaUi.devLbl.TextSize = 9
S.AnaUi.devLbl.TextColor3 = C.ACCENT
posY = posY + 16
S.AnaUi.centerBtn = Button(supportTab, "⊕ Vật thể ở GIỮA màn hình", 8, posY, 232, 26, C.BLUE)
S.AnaUi.nearBtn = Button(supportTab, "🧭 Vật thể GẦN nhất", 246, posY, 230, 26, C.ORANGE)
posY = posY + 30
S.AnaUi.skipGuiBtn = Button(supportTab, "🛡 Phân tích xuyên HUD game: BẬT", 8, posY, 300, 24, C.GREEN)
S.AnaUi.scanFbBtn = Button(supportTab, "🧭 Quét dự phòng: BẬT", 314, posY, 162, 24, C.GREEN)
posY = posY + 28
S.AnaUi.whyLbl = Label(supportTab, "🔎 Lý do: — (bật 🎯 Phân Tích Vật Thể rồi Chạm/chuột phải vào vật)", posY)
S.AnaUi.whyLbl.TextSize = 9
posY = posY + 16

Label(supportTab, "💡 Kích hoạt rồi NHẤP CHUỘT PHẢI (lệt) vào vật thể để chọn (chuột trái vẫn bắn/đi bình thường)", posY)
Label(supportTab, " Click xuyên qua nút HUD/menu của game sẽ tự động bỏ qua, không nhấn nhầm vật sau", posY+14)
posY = posY + 30

cục bộ objResultPanel = New("Frame", {
    Kích thước = UDim2.new(1, -16, 0, 190),
    Vị trí = UDim2.new(0, 8, 0, posY),
    BackgroundColor3=Color3.fromRGB(20, 25, 35),
    Độ trong suốt nền = 0,
    BorderSizePixel=0,
    Chỉ số Z = 6,
    Hiển thị = false,
}, supportTab)
Góc(objResultPanel, UDim.new(0,6))
Stroke(objResultPanel, C.PURPLE, 1.5)

New("TextLabel", { -- (objTitleLbl: bien local không dung -> bo de tiet kiem slot local)
    Kích thước=UDim2.new(1,-16,0,16), Vị trí=UDim2.new(0,8,0,4),
    Text="🎯 VẬT THỂ ĐƯỢC CHỌN", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(180, 130, 255),
    Font=Enum.Font.GothamBold, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

cục bộ objNameLbl = New("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,16), Vị trí=UDim2.new(0,8,0,22),
    Văn bản="Tên: ...", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(255, 255, 100),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

cục bộ objClassLbl = New("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,16), Vị trí=UDim2.new(0,8,0,38),
    Văn bản="Lớp: ...", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(200, 200, 255),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

local objPosLbl = New("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,16), Vị trí=UDim2.new(0,8,0,54),
    Văn bản="Vị trí: ...", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(255, 180, 180),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

cục bộ objSizeLbl = New("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,16), Vị trí=UDim2.new(0,8,0,70),
    Văn bản="Kích thước: ...", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(180, 255, 180),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

cục bộ objRotLbl = New("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,16), Vị trí=UDim2.new(0,8,0,86),
    Văn bản="Xoay: ...", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(180, 220, 255),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

cục bộ objLookLbl = New("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,16), Vị trí=UDim2.new(0,8,0,102),
    Văn bản="Nhìn này: ...", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(220, 200, 255),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

cục bộ objMatLbl = New("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,16), Vị trí=UDim2.new(0,8,0,118),
    Văn bản="Chất liệu: ...", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(255, 220, 180),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

cục bộ objColorLbl = New("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,16), Vị trí=UDim2.new(0,8,0,134),
    Văn bản="Màu sắc: ...", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(255, 180, 220),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, objResultPanel)

cục bộ objPathLbl = New("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,16), Vị trí=UDim2.new(0,8,0,150),
    Văn bản="Đường dẫn: ...", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(180, 255, 220),
    Font=Enum.Font.Code, TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
    TextTruncate=Enum.TextTruncate.AtEnd,
}, objResultPanel)

local copyObjBtn = New("TextButton", {
    Kích thước=UDim2.new(0,120,0,20), Vị trí=UDim2.new(0,8,0,168),
    Text="📋 Sao chép độ cao", BackgroundColor3=C.BLUE, BackgroundTransparency=0.1,
    TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=8,
}, objResultPanel)
Góc(copyObjBtn, UDim.new(0,4))

copyPathBtn cục bộ = Mới ("TextButton", {
    Kích thước=UDim2.new(0,120,0,20), Vị trí=UDim2.new(0,134,0,168),
    Văn bản="📋 Sao chép đường dẫn", Màu nền 3 = Tím, Độ trong suốt nền = 0.1,
    TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=8,
}, objResultPanel)
Góc(copyPathBtn, UDim.new(0,4))

posY = posY + 198

Label(supportTab, "📍 thoải mái hiện tại (thời gian thực)", posY)
posY = posY + 16

local coordDisplay = New("Frame", {
    Kích thước=UDim2.new(1,-16,0,290),
    Vị trí = UDim2.new(0, 8, 0, posY),
    BackgroundColor3=Color3.fromRGB(30, 35, 45),
    Độ trong suốt nền = 0,
    BorderSizePixel=0,
    Chỉ số Z = 6,
}, supportTab)
Góc(coordDisplay, UDim.new(0,6))
Stroke(coordDisplay, C.BLUE, 1.5)

hàm cục bộ CreateCoordRow(parent, yPos, labelText, labelColor, valueDefault)
    Mới("TextLabel", {
        Kích thước=UDim2.new(0,90,0,16), Vị trí=UDim2.new(0,8,0,yPos),
        Văn bản=nhãn văn bản, Độ trong suốt nền=1, Màu văn bản=màu nhãn,
        Font=Enum.Font.GothamBold, TextSize=10,
        TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
    }, cha)
    trả về New("TextLabel", {
        Kích thước=UDim2.new(1,-100,0,16), Vị trí=UDim2.new(0,100,0,yPos),
        Văn bản=giá trị mặc định hoặc "...", Độ trong suốt nền=1,
        TextColor3=Color3.fromRGB(255,255,255),
        Font=Enum.Font.Code, TextSize=10,
        TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
    }, cha)
kết thúc

Mới("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,14), Vị trí=UDim2.new(0,8,0,4),
    Text="📍 POSITION (DƯỚI CHÂN)", BackgroundTransparency=1,
    TextColor3=Color3.fromRGB(255, 200, 100),
    Font=Enum.Font.GothamBold, TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local xValLbl = CreateCoordRow(coordDisplay, 20, "X:", Color3.fromRGB(255,100,100), "0.000")
local yValLbl = CreateCoordRow(coordDisplay, 36, "Y:", Color3.fromRGB(100,255,100), "0.000")
local zValLbl = CreateCoordRow(coordDisplay, 52, "Z:", Color3.fromRGB(100,150,255), "0.000")

Mới("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,14), Vị trí=UDim2.new(0,8,0,72),
    Văn bản="📦 KÍCH THƯỚC", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(255, 200, 100),
    Font=Enum.Font.GothamBold, TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local sizeXValLbl = CreateCoordRow(coordDisplay, 88, "Kích thước X:", Color3.fromRGB(255,150,150), "0.000")
local sizeYValLbl = CreateCoordRow(coordDisplay, 104, "Kích thước Y:", Color3.fromRGB(150,255,150), "0.000")
local sizeZValLbl = CreateCoordRow(coordDisplay, 120, "Kích thước Z:", Color3.fromRGB(150,180,255), "0.000")

Mới("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,14), Vị trí=UDim2.new(0,8,0,140),
    Văn bản="🧭 XOAY", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(255, 200, 100),
    Font=Enum.Font.GothamBold, TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local rotPValLbl = CreateCoordRow(coordDisplay, 156, "Góc nghiêng (X):", Color3.fromRGB(255,150,150), "0.0°")
local rotYValLbl = CreateCoordRow(coordDisplay, 172, "Yaw (Y):", Color3.fromRGB(150,255,150), "0.0°")
local rotRValLbl = CreateCoordRow(coordDisplay, 188, "Roll (Z):", Color3.fromRGB(150,180,255), "0.0°")

Mới("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,14), Vị trí=UDim2.new(0,8,0,206),
    Văn bản="👁 NHÌN / TRẠNG THÁI / HP", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(255, 200, 100),
    Font=Enum.Font.GothamBold, TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local lookValLbl = New("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,16), Vị trí=UDim2.new(0,8,0,222),
    Văn bản="Nhìn này: ...", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(200,220,255),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local stateValLbl = New("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,16), Vị trí=UDim2.new(0,8,0,240),
    Văn bản="Trạng thái: ...", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(200,255,200),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local hpValLbl = New("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,16), Vị trí=UDim2.new(0,8,0,258),
    Văn bản="HP: ...", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(255,200,200),
    Font=Enum.Font.Code, TextSize=10,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

local placeLbl = New("TextLabel", {
    Kích thước=UDim2.new(1,-16,0,14), Vị trí=UDim2.new(0,8,0,274),
    Văn bản="Địa điểm: ...", Độ trong suốt nền=1,
    TextColor3=Color3.fromRGB(150, 200, 255),
    Font=Enum.Font.GothamMedium, TextSize=9,
    TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
}, coordDisplay)

posY = posY + 298

local lastPos = Vector3.new()
local lastSize = Vector3.new()
local lastRot = Vector3.new()
địa phương LastLook = Vector3.new()
local lastState = ""
cục bộ lastHp = -1

hàm cục bộ GetRootPart()
    local char = player.Character
    nếu không phải là ký tự thì trả về nil.
    local humanoid = char:FindFirstChildOfClass("Humanoid")
    cục bộ rootPart = (humanoid và humanoid.RootPart)
        hoặc char:FindFirstChild("HumanoidRootPart")
        hoặc char.PrimaryPart
        hoặc char:FindFirstChild("UpperTorso")
        hoặc char:FindFirstChild("Torso")
    trả về phần gốc
kết thúc

hàm cục bộ GetGroundPosition()
    local char = player.Character
    nếu không phải là ký tự thì trả về nil.
    rootPart cục bộ = GetRootPart()
    nếu không phải rootPart thì trả về nil.

    vị trí gốc cục bộ = rootPart.Position
    hướng cục bộ = Vector3.new(0, -500, 0)

    local params = RaycastParams.new()
    params.FilterType = Enum.RaycastFilterType.Exclude
    params.FilterDescendantsInstances = {char}
    params.IgnoreWater = false

    kết quả cục bộ = workspace:Raycast(origin, direction, params)
    nếu kết quả thì
        Trả về result.Position, result.Instance, result.Normal, result.Material
    kết thúc
    trả về nil
kết thúc

local coordAcc = 0
điều phối viên địa phương Lbls
chức năng cục bộ coordNA(all)
    coordLbls = coordLbls hoặc {xValLbl, yValLbl, zValLbl, sizeXValLbl, sizeYValLbl, sizeZValLbl,
                              rotPValLbl, rotYValLbl, rotRValLbl}
    for _, l in ipairs(coordLbls) do pcall(function() l.Text = "N/A" end) end
    nếu tất cả thì
        lookValLbl.Text = "Xem: Không có sẵn"
        stateValLbl.Text = "Tiểu bang: Không áp dụng"
        hpValLbl.Text = "HP: Không có sẵn"
    kết thúc
kết thúc

tọa độ cục bộUpdateConn = RunService.RenderStepped:Connect(function(stepDt)
    coordAcc = coordAcc + (tonumber(stepDt) hoặc 0.016)
    nếu coordAcc < 0.05 thì trả về end
    coordAcc = 0
    nếu không (main và main.Visible) thì trả về end
    if not (supportTab and supportTab.Visible) then return end
    local char = player.Character
    nếu không phải là ký tự thì
        coordNA(true)
        trở lại
    kết thúc

    local humanoid = char:FindFirstChildOfClass("Humanoid")
    rootPart cục bộ = GetRootPart()

    nếu không phải là rootPart thì
        coordNA()
        trở lại
    kết thúc

    local groundPos = GetGroundPosition()
    local displayPos = groundPos or rootPart.CFrame.Position

    local cf = rootPart.CFrame
    kích thước cục bộ = rootPart.Size
    local rx, ry, rz = cf:ToOrientation()
    giao diện cục bộ = cf.LookVector

    nếu (displayPos - lastPos).Magnitude > 0.001 thì
        lastPos = displayPos
        xValLbl.Text = string.format("%.3f", displayPos.X)
        yValLbl.Text = string.format("%.3f", displayPos.Y)
        zValLbl.Text = string.format("%.3f", displayPos.Z)
    kết thúc

    nếu (kích thước - kích thước cuối).Magnitude > 0.001 thì
        kích thước cuối cùng = kích thước
        sizeXValLbl.Text = string.format("%.3f", size.X)
        sizeYValLbl.Text = string.format("%.3f", size.Y)
        sizeZValLbl.Text = string.format("%.3f", size.Z)
    kết thúc

    local newRot = Vector3.new(rx, ry, rz)
    if (newRot - LastRot). Độ lớn > 0,001 thì
        lastRot = newRot
        rotPValLbl.Text = string.format("%.1f°", math.deg(rx))
        rotYValLbl.Text = string.format("%.1f°", math.deg(ry))
        rotRValLbl.Text = string.format("%.1f°", math.deg(rz))
    kết thúc

    nếu (look - lastLook).Magnitude > 0.001 thì
        lastLook = look
        lookValLbl.Text = string.format("Nhìn: %.3f, %.3f, %.3f", look.X, look.Y, look.Z)
    kết thúc

    nếu là hình người thì
        trạng thái cục bộ = humanoid:GetState()
        nếu trạng thái ~= trạng thái cuối cùng thì
            Trạng thái cuối cùng = trạng thái
            stateValLbl.Text = "Trạng thái: "..tostring(state):gsub("Enum.HumanoidStateType.", "")
        kết thúc

        local hp = math.floor(humanoid.Health)
        nếu hp ~= lastHp thì
            lastHp = hp
            hpValLbl.Text = string.format("HP: %d / %d", hp, math.floor(humanoid.MaxHealth))
        kết thúc
    khác
        stateValLbl.Text = "Trạng thái: Không có hình người"
        hpValLbl.Text = "HP: Không có sẵn"
    kết thúc

    if placeLbl.Text == "Địa điểm: ..." and (os.clock() - (D.placeTryAt or -99)) >= 10 then
        D.placeTryAt = os.clock()
        pcall(function()
            thông tin cục bộ = game:GetService("MarketplaceService"):GetProductInfo(game.PlaceId)
            placeLbl.Text = "Địa điểm: "..game.PlaceId.." — "..info.Name
        kết thúc)
    kết thúc
kết thúc)
trackConn(coordUpdateConn)

local currentHighlight = nil

hàm cục bộ RemoveCurrentHighlight()
    nếu currentHighlight thì
        pcall(function() currentHighlight:Destroy() end)
        currentHighlight = nil
    kết thúc
kết thúc

hàm cục bộ CreateHighlight(target)
    RemoveCurrentHighlight()
    nếu không phải là mục tiêu thì trả về end
    nếu không phải target:IsA("BasePart") thì trả về end

    local hl = Instance.new("Highlight")
    hl.Name = "BananaCatHub_Highlight"
    hl.Adornee = mục tiêu
    hl.FillColor = Color3.fromRGB(160, 60, 255)
    hl.FillTransparency = 0.7
    hl.OutlineColor = Color3.fromRGB(200, 100, 255)
    hl.OutlineTransparency = 0
    hl.DepthMode = Enum.HighlightDepthMode.AlwaysOnTop
    hl.Parent = target

    currentHighlight = hl
kết thúc

hàm cục bộ GetFullPath(obj)
    if not obj then return "nil" end
    các bộ phận cục bộ = {}
    local cur = obj
    trong khi cur và cur ~= game do
        table.insert(parts, 1, cur.Name)
        cur = cur.Parent
    kết thúc
    return table.concat(parts, ".")
kết thúc

-- ----------------------------------------------------------------------------
S.AnaCfg = S.AnaCfg hoặc {
    SkipGameGui = true, -- 🛡 bỏ qua HUD/nền của game khi phân tích (nguyên nhân số 1)
    scanFallback = true, -- 🧭 tia trượt thì quét vật gần tia (game dùng CanQuery=false)
    lờWater = true, -- 🌊 không để mặt nước ăn tia
    holdTime = 0,4, -- 📱 cầm ngón tay bao nhiêu giây thì = "chuột phải"
    holdMove = 18, -- 📱 ngón xê dịch tối đa (px) mà vẫn tính là "giữ"
    maxDist = 10000, -- tầm tia
}
S.AnaUi = S.AnaUi hoặc {}
S.AnaLast = S.AnaLast hoặc {ok = false, why = nil, name = nil, how = nil}
S.AnaNote = nil
S.AnaWhyScan = nil

hàm S.AnaCam()
    local cam = workspace.CurrentCamera
    if not cam then pcall(function() cam = camera end) end
    camera trả về
kết thúc

hàm S.AnaSay(msg)
    S.AnaLast.why = tostring(msg or "")
    pcall(function()
        local l = S.AnaUi.whyLbl
        if l and l.Parent then l.Text = "🔎 " .. tostring(msg) end
    kết thúc)
    pcall(function() print("[BananaCatHub] 🔎 " .. tostring(msg)) end)
kết thúc

hàm S.DeviceText()
    cảm ứng cục bộ, chuột = false, false
    pcall(function() touch = (UserInputService.TouchEnabled == true) end)
    pcall(function() mouse = (UserInputService.MouseEnabled == true) end)
    local hold = string.format("%.2f", S.AnaCfg.holdTime)
    nếu dùng cảm ứng và chuột thì
        return "🖥📱 Máy có cảm ứng: CHUỘT PHẢI hoặc GIỮ NGÓN " .. hold .. "s lên vật · hoặc ấn ⊕ Giữa màn hình"
    nếu chạm thì
        return "📱 Điện thoại: GIỮ NGÓN " .. hold .. "s lên vật (chạm nhanh vẫn đi/bắn bình thường) · hoặc ⊕ Giữa màn hình"
    nếu chuột thì
        return "🖥 Máy tính: CHUỘT PHẢI vào vật (chuột trái vẫn chơi bình thường) · hoặc ⊕ Giữa màn hình"
    kết thúc
    return "🎮 Chưa xác định thiết bị: sử dụng ⊕ Giữa màn hình hoặc 🧭 Gần nhất — nền tảng nào cũng chạy"
kết thúc

hàm S.RefreshDevLabel()
    pcall(function()
        local l = S.AnaUi.devLbl
        if l and l.Parent then l.Text = S.DeviceText() end
    kết thúc)
kết thúc

hàm S.GuiBlockAt(x, y)
    cục bộ cứng, mềm = nil, nil
    local vpx, vpy = 1280, 720
    pcall(function()
        local cam2 = S.AnaCam()
        if cam2 then vpx, vpy = cam2.ViewportSize.X, cam2.ViewportSize.Y end
    kết thúc)
    local bigArea = vpx * vpy * 0.36
    cont cục bộ = {}
    pcall(function() conts[#conts+1] = playerGui end)
    pcall(function() conts[#conts+1] = game:GetService("CoreGui") end)
    for _, cont in ipairs(conts) do
        local ok, objs = pcall(function() return cont:GetGuiObjectsAtPosition(x, y) end)
        nếu ok và type(objs) == "table" thì
            for _, o in ipairs(objs) do
                khu vực địa phương, chuyển đổi, isAct = 0, 1, false
                pcall(function() area = o.AbsoluteSize.X * o.AbsoluteSize.Y end)
                pcall(function() trans = o.BackgroundTransparency end)
                pcall(function() isAct = (o.Active == true) end)
                tương tác cục bộ = (o:IsA("GuiButton") hoặc o:IsA("TextBox"))
                thẻ cục bộ = tostring(o.Name) .. " (" .. tostring(o.ClassName) .. ")"
                nếu tương tác và khu vực < bigArea thì
                    cứng = cứng hoặc thẻ
                elseif interactive or isAct or trans < 0.5 then
                    mềm = mềm mại hoặc thẻ
                kết thúc
            kết thúc
        kết thúc
    kết thúc
    trả lại cứng, mềm
kết thúc

hàm S.PickByRayScan(ray, filterList)
    local maxD = 220
    local okOp, parts = pcall(function()
        op cục bộ = OverlapParams.new()
        op.FilterType = Enum.RaycastFilterType.Exclude
        op.FilterDescendantsInstances = filterList or {}
        op.MaxParts = 80
        return workspace:GetPartBoundsInRadius(ray.Origin + ray.Direction * (maxD / 2), maxD / 2, op)
    kết thúc)
    nếu không phải okOp hoặc type(parts) ~= "table" hoặc #parts == 0 thì
        return nil, "không quét được vật nào xung quanh tia (game có thể chặn quét)"
    kết thúc
    tốt nhất cục bộ, bestD = nil, math.huge
    for _, pt in ipairs(parts) do
        local okV, v = pcall(function() return pt.Position - ray.Origin end)
        nếu okV và v thì
            local okT, t = pcall(function() return v:Dot(ray.Direction) end)
            nếu okT và t và t > 0,5 thì
                cục bộ okD, d = pcall(function()
                    cục bộ gần nhất = tia.Nguồn gốc + tia.Hướng * t
                    local dd = (pt.Position - closest).Magnitude
                    cục bộ r = 0
                    pcall(function() r = math.max(pt.Size.X, pt.Size.Y, pt.Size.Z) / 2 end)
                    trả về math.max(0, dd - r)
                kết thúc)
                nếu okD và d và d < bestD thì bestD, best = d, pt end
            kết thúc
        kết thúc
    kết thúc
    nếu không tốt nhất thì return nil, "quét" .. #parts .. " vật nhưng không vật nào nằm trước tia" end
    return best, "quét dự phòng — vật này Raycast không tìm thấy (CanQuery=false), trôi tia "
        .. string.format("%.1f", bestD) .. "m"
kết thúc

hàm S.NearestParts(n)
    local char = player.Character
    cục bộ gốc = char và char:FindFirstChild("HumanoidRootPart")
    nếu không root thì trả về nil, "chưa có nhân vật (đang ở sảnh/menu?)" end
    cục bộ ổn, các bộ phận = pcall(function()
        op cục bộ = OverlapParams.new()
        op.FilterType = Enum.RaycastFilterType.Exclude
        op.FilterDescendantsInstances = {char, gui}
        op.MaxParts = 120
        return workspace:GetPartBoundsInRadius(root.Position, 60, op)
    kết thúc)
    nếu không ổn hoặc kiểu (các bộ phận) ~= "bảng" hoặc #bộ phận == 0 thì
        return nil, "không quét được vật nào trong 60 studs xung quanh bạn"
    kết thúc
    danh sách cục bộ = {}
    for _, pt in ipairs(parts) do
        local okD, d = pcall(function() return (pt.Position - root.Position).Magnitude end)
        nếu okD và d thì list[#list+1] = {p = pt, d = d} kết thúc
    kết thúc
    table.sort(list, function(a, b) return ad < bd end)
    tên địa phương = {}
    for i = 1, math.min(n or 5, #list) do
        names[#names+1] = list[i].p.Name .. " (" .. string.format("%.1f", list[i].d) .. "m)"
    kết thúc
    return (list[1] and list[1].p or nil), table.concat(names, " · "), #list
kết thúc

function S.FillObjPanel(inst, hitPos, hitNormal, hitMat, how)
    nếu không phải là inst thì trả về false.
    objResultPanel.Visible = true

    objNameLbl.Text = "Tên: "..inst.Name
    objClassLbl.Text = "Lớp: "..inst.ClassName
    objPosLbl.Text = string.format("Vị trí: %.3f, %.3f, %.3f", hitPos.X, hitPos.Y, hitPos.Z)

    nếu inst:IsA("BasePart") thì
        kích thước cục bộ = kích thước cài đặt
        local cf = inst.CFrame
        local rx, ry, rz = cf:ToOrientation()
        giao diện cục bộ = cf.LookVector
        màu cục bộ = inst.Color
        vật liệu địa phương = inst.Material

        objSizeLbl.Text = string.format("Kích thước: %.3f, %.3f, %.3f", size.X, size.Y, size.Z)
        objRotLbl.Text = string.format("Rotation: P=%.1f° Y=%.1f° R=%.1f°",
            math.deg(rx), math.deg(ry), math.deg(rz))
        objLookLbl.Text = string.format("Nhìn: %.3f, %.3f, %.3f", look.X, look.Y, look.Z)
        objMatLbl.Text = "Vật liệu: "..tostring(material):gsub("Enum.Material.", "")
        objColorLbl.Text = string.format("Màu: R=%d G=%d B=%d",
            math.floor(color.R*255), math.floor(color.G*255), math.floor(color.B*255))

        nếu highlightEnabled thì CreateHighlight(inst) end
    khác
        objSizeLbl.Text = "Size: N/A (không phải BasePart)"
        objRotLbl.Text = "Xoay: Không áp dụng"
        objLookLbl.Text = "Hình ảnh: Không có sẵn"
        objMatLbl.Text = "Vật liệu: Không có sẵn"
        objColorLbl.Text = "Màu sắc: Không áp dụng"
        RemoveCurrentHighlight()
    kết thúc

    objPathLbl.Text = "Đường dẫn: "..GetFullPath(inst)
    objResultPanel:SetAttribute("LastHitPos", tostring(hitPos))
    objResultPanel:SetAttribute("LastPath", GetFullPath(inst))
    objResultPanel:SetAttribution("LastNormal", tostring(hitNormal))
    objResultPanel:SetAttribution("LastMaterial", tostring(hitMat))

    S.AnaLast.ok = true
    S.AnaLast.name = tostring(inst.Name)
    S.AnaLast.how = tostring(how or "")
    S.AnaSay(tostring(how or "🎯 tia bắn trúng") .. ": " .. inst.Name .. " (" .. inst.ClassName .. ")"
        .. (S.AnaNote và (" · " .. S.AnaNote) hoặc ""))
    trả về giá trị đúng
kết thúc

S.RefreshDevLabel() -- v4.8: hiện đúng cách chọn vật liệu của thiết bị đang dùng

local function PickObjectAt(mousePos, isRightClick, ignoreHubGui)
    local x, y = mousePos.X, mousePos.Y
    S.AnaLast.ok = false
    S.AnaNote = nil
    S.AnaWhyScan = nil

    nếu không bỏ qua HubGui và Hit.onHub(x, y) thì
        S.AnaSay("⏭️ Điểm Đạt nằm trên menu của trung tâm — nhấn ra ngoài trận đấu và thử lại")
        trở lại
    kết thúc
    local hardGui, softGui = S.GuiBlockAt(x, y)
    nếu hardGui thì
        S.AnaSay("🚫 Điểm Đạt là NÚT của trò chơi (" .. hardGui .. ") — chuyển ra chỗ khác để không nhấn nút nhiều lần")
        trở lại
    kết thúc
    nếu softGui và không phải S.AnaCfg.skipGameGui thì
        S.AnaSay("🚫 HUD của game (" .. softGui .. ") đang chặn — BẬT '🛡 Phân tích xuyên HUD game' được sử dụng")
        trở lại
    kết thúc
    nếu softGui thì
        S.AnaNote = "🛡 phân tích xuyên suốt HUD của game (" .. softGui .. ")"
    kết thúc

    local cam2 = S.AnaCam()
    nếu không phải cam2 thì
        S.AnaSay("⚠️ Game chưa có camera (Workspace.CurrentCamera = nil) — vào lại game rồi thử")
        trở lại
    kết thúc
    local unitRay = cam2:ViewportPointToRay(x, y)
    local params = RaycastParams.new()
    params.FilterType = Enum.RaycastFilterType.Exclude
    local filterList = {}
    if player.Character then table.insert(filterList, player.Character) end
    if gui then table.insert(filterList, gui) end
    params.FilterDescendantsInstances = filterList
    params.IgnoreWater = S.AnaCfg.ignoreWater -- v4.8: không để mặt nước ăn tia

    kết quả cục bộ = workspace:Raycast(unitRay.Origin, unitRay.Direction * S.AnaCfg.maxDist, params)
    nếu kết quả và kết quả.Material == Enum.Material.Water thì
        local pw = RaycastParams.new()
        pw.FilterType = Enum.RaycastFilterType.Exclude
        pw.FilterDescendantsInstances = filterList
        pw.IgnoreWater = true
        local rw = workspace:Raycast(unitRay.Origin, unitRay.Direction * S.AnaCfg.maxDist, pw)
        nếu rw và rw.Instance thì
            kết quả = rw
            S.AnaNote = "🌊 đã xuyên qua mặt nước để lấy vật bên dưới"
        kết thúc
    kết thúc

    local inst, hitPos, hitNormal, hitMat, how
    nếu kết quả và kết quả.Instance thì
        inst, hitPosition, hitNormal, hitMat = result.Instance, result.Position, result.Normal, result.Material
        cách thức = "🎯 tia bắn trúng"
    nếu S.AnaCfg.scanFallback thì
        phần cục bộ, why2 = S.PickByRayScan(unitRay, filterList)
        nếu một phần thì
            inst, hitPos, how = part, part.Position, "🧭 " .. tostring(why2)
            pcall(function() hitNormal = part.CFrame.LookVector end)
            pcall(function() hitMat = part.Material end)
        khác
            S.AnaWhyScan = why2
        kết thúc
    kết thúc
    objResultPanel.Visible = true

    nếu inst thì
        S.FillObjPanel(inst, hitPos, hitNormal, hitMat, how)
    khác
        địa phương prevName = objNameLbl.Text
        objNameLbl.Text = "⚠️ Không trúng gì — giữ vật thể"
        S.AnaSay("⚠️ Không tìm thấy vật ở điểm chạm"
            .. (S.Ana WhyScan and (" (" .. S.Ana WhyScan .. ")") hoặc " (tia đi vào khoảng không)")
            .. " — thử ⊕ Giữa màn hình, 🧭 Gần nhất, hoặc lại gần vật hơn")
        task.delay(1.0, function()
            if objNameLbl và objNameLbl.Parent và objNameLbl.Text == "⚠️ Không trúng gì — giữ vật đang chọn" then
                objNameLbl.Text = prevName
            kết thúc
        kết thúc)
    kết thúc
kết thúc

trackConn(UserInputService.InputBegan:Connect(function(input, gp)
    if gp then return end -- Roblox đã xử lý đầu vào này (nút GUI / TextBox focus)
    nếu không phân tích đối tượng được kích hoạt thì trả về kết thúc.

    nếu input.UserInputType == Enum.UserInputType.MouseButton2 thì
        PickObjectAt(input.Position, true)
        trở lại
    kết thúc

    nếu input.UserInputType == Enum.UserInputType.Touch thì
        local startTick = tick()
        local startPos = input.Position
        local holdConn, moveConn
        holdConn = UserInputService.InputEnded:Connect(function(e)
            nếu e == input thì
                holdConn:Disconnect()
                nếu moveConn thì moveConn:Disconnect() kết thúc
                if tick() - startTick >= S.AnaCfg.holdTime then -- v4.8: ngưỡng giữ ngón tay được điều chỉnh
                    task.spawn(function() PickObjectAt(input.Position, false) end)
                kết thúc
            kết thúc
        kết thúc)
        moveConn = UserInputService.InputChanged:Connect(function(e)
            nếu e == input thì
                local d = (e.Position - startPos).Độ lớn
                if d > S.AnaCfg.holdMove then -- v4.8: ngón tay trên mobile hay xê dịch -> 12px lên 18px
                    holdConn:Disconnect()
                    moveConn:Disconnect()
                kết thúc
            kết thúc
        kết thúc)
        trở lại
    kết thúc
kết thúc))

objectAnalyzeBtn.Activated:Connect(function()
    analyzeObjectEnabled = không phân tích đối tượng được bật
    nếu analyzeObjectEnabled thì
        objectAnalyzeBtn.Text = "🎯 Phân Tích Vật: BẬT"
        D.SetBg(objectAnalyzeBtn, C.GREEN) -- v4.5: đổi màu kèm theo chữ tương phản
        S.RefreshDevLabel()
        S.AnaSay(" ✅ Đã BẬT phân tích vật thể · " .. S.DeviceText())
    khác
        objectAnalyzeBtn.Text = "🎯 Phân Tích Vật: TẮT"
        D.SetBg(objectAnalyzeBtn, C.GRAY)
        RemoveCurrentHighlight()
    kết thúc
kết thúc)

highlightToggleBtn.Activated:Connect(function()
    highlightEnabled = không được bật
    nếu highlightEnabled thì
        highlightToggleBtn.Text = "💜 Highlight Tím: BẬT"
        D.SetBg(highlightToggleBtn, C.PURPLE)
    khác
        highlightToggleBtn.Text = "💜 Highlight Tím: TẮT"
        D.SetBg(highlightToggleBtn, C.GRAY)
        RemoveCurrentHighlight()
    kết thúc
kết thúc)

removeHighlightBtn.Activated:Connect(function()
    RemoveCurrentHighlight()
kết thúc)

--------- v4.8: ⊕ VẬT THỂ Ở GIỮA HÌNH THỨC (nền tảng nào cũng có thể nhấn, từ cần chuột phải) ----------
S.AnaUi.centerBtn.Activated:Connect(function()
    local vpx, vpy = 1280, 720
    pcall(function()
        local cam2 = S.AnaCam()
        if cam2 then vpx, vpy = cam2.ViewportSize.X, cam2.ViewportSize.Y end
    kết thúc)
    S.AnaSay("⊕ Ẩn menu 0.35s để lấy vật ở GIỮA màn hình...")
    cục bộ prevEnabled = true
    pcall(function() prevEnabled = gui.Enabled end)
    pcall(function() gui.Enabled = false end) -- ẩn menu để menu chính không có vật cần lấy
    task.wait(0.12)
    PickObjectAt(Vector2.new(vpx / 2, vpy / 2), true, true)
    task.wait(0.25)
    pcall(function() gui.Enabled = prevEnabled end)
kết thúc)

--------- v4.8: 🧭 VẬT GẦN NHẤT (cứu cánh cho game không chọn theo điểm chạm) ----------
S.AnaUi.nearBtn.Activated:Connect(function()
    phần cục bộ, thông tin, tổng = S.NearestParts(5)
    nếu không phải là một phần thì
        S.AnaSay("⚠️ Không thể tìm được vật gần bạn: " .. tostring(info))
        trở lại
    kết thúc
    cục bộ hp = nil
    pcall(function() hp = part.Position end)
    S.FillObjPanel(part, hp, nil, nil, "🧭 vật gần bạn nhất (trong " .. tostring(total) .. " vật quét được)")
    pcall(function()
        local l = S.AnaUi.whyLbl
        if l and l.Parent then l.Text = "🔎 Quanh bạn 60 studs: " .. tostring(info) end
    kết thúc)
kết thúc)

--------- v4.8: 2 công tắc cho game "khóa" (đều mặc định BẬT) ----------
S.AnaUi.skipGuiBtn.Activated:Connect(function()
    S.AnaCfg.skipGameGui = not S.AnaCfg.skipGameGui
    local on = S.AnaCfg.skipGameGui
    S.AnaUi.skipGuiBtn.Text = on và "🛡 Phân tích xuyên HUD game: BẬT"
                                 hoặc "🛡 Xuyên HUD game: TẮT (như bản cũ)"
    D.SetBg(S.AnaUi.skipGuiBtn, bật và C.GREEN hoặc C.GRAY)
    S.AnaSay(on and "🛡 BẬT: bỏ qua HUD/nền bán trong suốt của game (khuyên dùng, nhất là 📱 mobile)"
                hoặc "🛡 BẮT ĐẦU: quay lại kiểu cũ — HUD của game sẽ CHẶN phân tích ở điểm chạm")
kết thúc)
S.AnaUi.scanFbBtn.Activated:Connect(function()
    S.AnaCfg.scanFallback = không phải S.AnaCfg.scanFallback
    local on = S.AnaCfg.scanFallback
    S.AnaUi.scanFbBtn.Text = on và "🧭 Quét dự phòng: BẬT" hoặc "🧭 Quét dự phòng: TẮT"
    D.SetBg(S.AnaUi.scanFbBtn, bật và C.GREEN hoặc C.GRAY)
    S.AnaSay(on and "🧭 BẬT: tia trượt sẽ tự động quét vật gần tia — game đặt CanQuery=false vẫn phân tích được"
                hoặc "🧭 BẮT ĐẦU: chỉ dùng tia raycast (nhanh hơn, nhưng game khó sẽ không ra kết quả)")
kết thúc)

clearObjectBtn.Activated:Connect(function()
    objResultPanel.Visible = false
    RemoveCurrentHighlight()
kết thúc)

copyObjBtn.Activated:Connect(function()
    local pos = objResultPanel:GetAttribute("LastHitPos")
    nếu pos và pos ~= "" thì
        S.CopyToClipboard(pos)
        flash(copyObjBtn, " ✅ Đã sao chép!", 1.2)
    kết thúc
kết thúc)

copyPathBtn.Activated:Connect(function()
    đường dẫn cục bộ = objResultPanel:GetAttribute("LastPath")
    nếu đường dẫn và đường dẫn ~= "" thì
        S.CopyToClipboard(path)
        flash(copyPathBtn, " ✅ Đã sao chép!", 1.2)
    kết thúc
kết thúc)

posY = posY + 6

local copyCoordBtn = Button(supportTab, "📋 Copy Chiều Dưới Chân", 8, posY, 468, 26, C.BLUE)
posY = posY + 32

copyCoordBtn.Activated:Connect(function()
    local groundPos = GetGroundPosition()
    rootPart cục bộ = GetRootPart()
    local finalPos = groundPos or (rootPart and rootPart.CFrame.Position)
    nếu không phải finalPos thì trả về end
    local text = string.format("%.3f, %.3f, %.3f", finalPos.X, finalPos.Y, finalPos.Z)
    S.CopyToClipboard(text)
    flash(copyCoordBtn, " ✅ Đã Copy: " .. text, 2)
kết thúc)

Label(supportTab, "🚀 Dịch chuyển đến nơi ở", posY)
posY = posY + 14

D.tpLblX = Label(supportTab, "X:", posY)
D.tpLblX.Size = UDim2.new(0,14,0,14); D.tpLblX.Position = UDim2.new(0,8,0,posY)
local tpXIn = New("TextBox", {
    Kích thước=UDim2.new(0,136,0,24), Vị trí=UDim2.new(0,24,0,posY-2), Văn bản="0",
    PlaceholderColor3=Color3.fromRGB(122, 130, 148),
    BackgroundColor3=Color3.fromRGB(26, 29, 38), BackgroundTransparency=0,
    TextColor3=Color3.fromRGB(233, 237, 245), Font=Enum.Font.Code, TextSize=11,
    BorderSizePixel=0, ClearTextOnFocus=false, Active=true, Selectable=true, ZIndex=10,
}, supportTab)
Corner(tpXIn, UDim.new(0,4)); Stroke(tpXIn, Color3.fromRGB(255,100,100), 1.2)

D.tpLblY = Label(supportTab, "Y:", posY)
D.tpLblY.Size = UDim2.new(0,14,0,14); D.tpLblY.Position = UDim2.new(0,166,0,posY)
local tpYIn = New("TextBox", {
    Kích thước=UDim2.new(0,136,0,24), Vị trí=UDim2.new(0,182,0,posY-2), Văn bản="0",
    PlaceholderColor3=Color3.fromRGB(122, 130, 148),
    BackgroundColor3=Color3.fromRGB(26, 29, 38), BackgroundTransparency=0,
    TextColor3=Color3.fromRGB(233, 237, 245), Font=Enum.Font.Code, TextSize=11,
    BorderSizePixel=0, ClearTextOnFocus=false, Active=true, Selectable=true, ZIndex=10,
}, supportTab)
Corner(tpYIn, UDim.new(0,4)); Stroke(tpYIn, Color3.fromRGB(100,255,100), 1.2)

D.tpLblZ = Label(supportTab, "Z:", posY)
D.tpLblZ.Size = UDim2.new(0,14,0,14); D.tpLblZ.Position = UDim2.new(0,324,0,posY)
local tpZIn = New("TextBox", {
    Kích thước=UDim2.new(0,136,0,24), Vị trí=UDim2.new(0,340,0,posY-2), Văn bản="0",
    PlaceholderColor3=Color3.fromRGB(122, 130, 148),
    BackgroundColor3=Color3.fromRGB(26, 29, 38), BackgroundTransparency=0,
    TextColor3=Color3.fromRGB(233, 237, 245), Font=Enum.Font.Code, TextSize=11,
    BorderSizePixel=0, ClearTextOnFocus=false, Active=true, Selectable=true, ZIndex=10,
}, supportTab)
Corner(tpZIn, UDim.new(0,4)); Stroke(tpZIn, Color3.fromRGB(100,150,255), 1.2)

posY = posY + 30

local fillCurrentBtn = Button(supportTab, "📍 Lấy Vị Trí Dưới Chân", 8, posY, 372, 24, C.ORANGE)
local tpBtn = Button(supportTab, "🚀 Dịch chuyển tức thời", 386, posY, 90, 24, C.GREEN)
posY = posY + 30

fillCurrentBtn.Activated:Connect(function()
    local groundPos = GetGroundPosition()
    rootPart cục bộ = GetRootPart()
    local p = groundPos or (rootPart and rootPart.CFrame.Position)
    nếu không phải p thì trả về end
    tpXIn.Text = string.format("%.3f", pX)
    tpYIn.Text = string.format("%.3f", pY)
    tpZIn.Text = string.format("%.3f", pZ)
kết thúc)

tpBtn.Activated:Connect(function()
    rootPart cục bộ = GetRootPart()
    nếu không phải là rootPart thì trả về end
    local x = tonumber(tpXIn.Text) or 0
    local y = tonumber(tpYIn.Text) or 0
    local z = tonumber(tpZIn.Text) or 0
    rootPart.CFrame = CFrame.new(Vector3.new(x, y, z))
    flash(tpBtn, " ✅ Đã Teleport!", 1.5)
kết thúc)

S.SpeedMeter = S.SpeedMeter hoặc {}
do -- do..end: main chunk gần cạn 200 slot local -> KHÔNG khai báo local ở phạm vi chunk
cục bộ SV = S.SpeedMeter

SV.on = (SV.on == true)
SV.live = tonumber(SV.live) hoặc 0 -- tốc độ hiện tại (studs/s, đã làm mượt)
SV.max = tonumber(SV.max) hoặc 0 -- đạt được đỉnh cao nhất trong phiên bản
SV.base = tonumber(SV.base) -- mặc định của trò chơi (studs/s) — nil = chưa được dò tìm
SV.src = SV.src hoặc "chưa dò"
SV.ws = tonumber(SV.ws) or 0 -- Hiện tại WalkSpeed ​​của Humanoid
SV._bound = (SV._bound == true)

hàm cục bộ num(v)
    v = tonumber(v)
    if v == nil or v ~= v then return nil end -- NaN -> nil
    trả về v
kết thúc
hàm cục bộ fmt(n) trả về chuỗi.format("%.1f", num(n) hoặc 0) kết thúc
hàm cục bộ say(msg) pcall(function() if D.hubStatus then D.hubStatus.Text = msg end end) end

local function move() return S.Move end
hàm cục bộ myHum()
    cục bộ m = di chuyển()
    nếu m và m.Hum thì
        cục bộ ok, h = pcall(m.Hum)
        nếu ổn và h thì trả về h kết thúc
    kết thúc
    local ch = player.Character
    nếu không phải ch thì trả về nil.
    local ok, h = pcall(function() return ch:FindFirstChildOfClass("Humanoid") end)
    nếu ổn và h thì trả về h kết thúc
    trả về ch:FindFirstChild("Humanoid")
kết thúc
hàm cục bộ myRoot()
    cục bộ m = di chuyển()
    nếu m và m.Root thì
        cục bộ ok, r = pcall(m.Root)
        nếu ổn và r thì trả về r kết thúc
    kết thúc
    local ch = player.Character
    trả về ch và ch:FindFirstChild("HumanoidRootPart") hoặc nil
kết thúc
hàm cục bộ readWS(h)
    nếu không phải h thì trả về nil.
    local ok, v = pcall(function() return h.WalkSpeed ​​end)
    nếu ok thì local n = num(v); nếu n thì trả về n kết thúc
    cục bộ m = di chuyển()
    if m and m.comp then return num(m.comp(h, "WalkSpeed", nil)) end
    trả về nil
kết thúc
hàm cục bộ readPos(r)
    nếu không phải r thì trả về nil.
    cục bộ m = di chuyển()
    tọa độ x, y, z cục bộ
    nếu m và m.comp thì
        địa phương p
        pcall(function() p = r.Position end)
        x, y, z = m.comp(p, "X", nil), m.comp(p, "Y", nil), m.comp(p, "Z", nil)
    khác
        pcall(function() local p = r.Position; x, y, z = pX, pY, pZ end)
    kết thúc
    x, y, z = num(x), num(y), num(z)
    if x == nil or y == nil or z == nil then return nil end
    trả về x, y, z
kết thúc

-- ---------- dòng tốc độ MẶC ĐỊNH của game ----------
hàm SV.Detect()
    cục bộ m = di chuyển()
    local h = myHum()
    local hws = readWS(h)
    baseWS cục bộ = m và num(m._baseWS) hoặc nil
    local applying = (m ~= nil) and (m.speed == true or m.runMode == true)
    nguồn cục bộ
    nếu áp dụng và baseWS thì
        SV.base = baseWS
        src = "game (hub đã học khi 👟 bật)"
    nếu hws và hws > 0 thì
        nếu (không áp dụng) và SV._lastWS và math.abs(hws - SV._lastWS) > 0.01 thì
            src = "game VỪA ĐỔI tốc độ → mặc định mới"
        khác
            src = "game (WalkSpeed ​​của nhân vật)"
        kết thúc
        SV.base = hws
    nếu baseWS thì
        SV.base = baseWS
        src = "hub (đã học)"
    khác
        SV.base = 16
        src = "mặc định Roblox"
    kết thúc
    nếu hws và hws > 0 và không áp dụng thì SV._lastWS = hws end
    nếu hws thì SV.ws = hws end
    SV.src = src
    trả về SV.base, SV.src
kết thúc

---------đo tốc độ HIỆN TAI + giữ đỉnh CAO NHẤT ----------
hàm SV.Step(dt)
    dt = num(dt)
    nếu dt khác hoặc dt <= 0 thì dt = 1 / 60
    nếu dt > 0,5 thì dt = 0,5
    local h = myHum()
    local x, y, z = readPos(myRoot())
    nếu x thì
        nếu SV._px thì
            local dx, dy, dz = x - SV._px, y - SV._py, z - SV._pz
            local d = math.sqrt(dx * dx + dy * dy + dz * dz)
            nếu d <= 25 thì -- > 25 stud/khung hình = dịch chuyển/hồi sinh/lag -> bỏ mẫu
                inst cục bộ = d / dt
                if d > 0.001 then -- chỉ tính mẫu CÓ chuyển đổi (đứng yên không phá số liệu)
                    SV._n = (SV._n hoặc 0) + 1
                    SV.live = (SV._n <= 1) và inst hoặc (SV.live + (inst - SV.live) * 0.35)
                    nếu inst >= 0.5 và inst > SV.max thì SV.max = inst
                kết thúc
            kết thúc
        kết thúc
        SV._px, SV._py, SV._pz = x, y, z
    khác
        SV._px = nil
        SV.live = 0
    kết thúc
    nếu h thì SV.ws = readWS(h) hoặc SV.ws kết thúc
    SV.Detect()
    SV.Sync()
    trả về SV.live
kết thúc

hàm cục bộ setText(lbl, s)
    if lbl and lbl.Text ≥ s then lbl.Text = s end
kết thúc

-- ---------- vẽ số ra widget + HUD ----------
hàm SV.Sync()
    cơ sở cục bộ = num(SV.base) hoặc 0
    tỷ lệ cục bộ = (cơ sở > 0) và (SV.ws / cơ sở) hoặc 0
    tỷ lệ cục bộ = math.max(SV.max, base, 1)
    phần trăm cục bộ = SV.live / quy mô
    if pct < 0 then pct = 0 elseif pct > 1 then pct = 1 end -- KHÔNG dùng math.clamp (chỉ có trong Luau)
    bpct cục bộ = cơ sở / thang đo
    nếu bpct < 0 thì bpct = 0, ngược lại nếu bpct > 1 thì bpct = 1
    setText(SV.baseLbl, string.format("🎯 Trò chơi mặc định: %s studs/s · nguồn: %s", fmt(base), tostring(SV.src)))
    setText(SV.wsLbl, string.format("🚶 WalkSpeed ​​hiện tại: %s%s", fmt(SV.ws),
        (ratio > 0) và string.format(" (×%.2f default)", rate) hoặc ""))
    setText(SV.liveLbl, string.format("⚡ Tốc độ thật: %s studs/s", fmt(SV.live)))
    setText(SV.maxLbl, string.format("🏁 Cao nhất: %s studs/s", fmt(SV.max)))
    nếu SV.btn thì
        setText(SV.btn, SV.on và "🎯 Định tốc độ: BẬT" hoặc "🎯 Định tốc độ: TẮT")
        nếu SV._btnOn ~= SV.on thì
            SV._btnOn = SV.on
            SV.btn.BackgroundColor3 = SV.on và C.GREEN hoặc C.GRAY
        kết thúc
    kết thúc
    nếu SV.barFill và SV._barPct ~= pct thì
        SV._barPct = pct
        SV.barFill.Size = UDim2.new(pct, 0, 1, 0)
    kết thúc
    nếu SV.barBase và SV._barBase ~= bpct thì
        SV._barBase = bpct
        SV.barBase.Position = UDim2.new(bpct, -1, 0, 0)
    kết thúc
    nếu SV.hud thì
        if SV.hud.Visible ~= SV.on then SV.hud.Visible = SV.on end
        setText(SV.hudLbl, string.format("🎯 %s (mặc định trò chơi) · 🚶 %s\n⚡ %s · 🏁 %s đinh tán/s",
            fmt(base), fmt(SV.ws), fmt(SV.live), fmt(SV.max)))
    kết thúc
kết thúc

hàm SV.Status()
    return string.format("🎯 %s · ⚡ %s · 🏁 %s", fmt(SV.base), fmt(SV.live), fmt(SV.max))
kết thúc

-- ---------- bật/tắt vòng đo (chỉ chạy khi BẬT -> không tốn tài nguyên) ----------
hàm SV.Bind(on)
    nếu đang bật và không phải SV._bound thì
        SV._bound = true
        cục bộ ok = pcall(function()
            RunService:BindToRenderStep("BC_SpeedMeter", Enum.RenderPriority.Camera.Value - 6, hàm(dt)
                pcall(function() SV.Step(dt) end)
            kết thúc)
        kết thúc)
        nếu không ổn thì SV._bound = false kết thúc
    nếu không bật và SV._bound thì
        SV._bound = false
        pcall(function() RunService:UnbindFromRenderStep("BC_SpeedMeter") end)
    kết thúc
    trả về SV._bound
kết thúc
hàm SV.Set(on)
    SV.on = (on == true)
    nếu SV.on thì
        SV._px, SV._n = nil, 0
        SV.Detect()
        SV._lastWS = nil
        SV.Bind(true)
        SV.Step(1 / 60) -- có số ngay, không phải đợi khung sau
    khác
        SV.Bind(false)
        SV._px, SV._n = nil, 0
    kết thúc
    SV.Sync()
    trả về SV.on
kết thúc
function SV.Toggle() return SV.Set(not SV.on) end
function SV.Reset() -- xóa chất lượng, vẫn đo tiếp
    SV.max, SV.live = 0, 0
    SV._n = 0
    SV.Sync()
    trả về SV.max
kết thúc

-- ---------- widget trong tab 🛠 Hỗ trợ ----------
Label(supportTab, "🎯 Định vị trò chơi tốc độ (mặc định · hiện tại · cao nhất)", posY)
posY = posY + 18
SV.btn = Button(supportTab, "🎯 Định tốc độ: TẮT", 8, posY, 300, 26, C.GRAY)
SV.resetBtn = Button(supportTab, "🗑 Xóa đỉnh", 314, posY, 162, 26, C.RED)
posY = posY + 30
SV.baseLbl = Label(supportTab, "🎯 Trò chơi mặc định: — studs/s", posY)
SV.baseLbl.TextColor3 = C.ACCENT
SV.baseLbl.TextSize = 9
posY = posY + 16
SV.wsLbl = Label(supportTab, "🚶 WalkSpeed ​​hiện tại: —", posY)
SV.wsLbl.TextSize = 9
posY = posY + 16
SV.liveLbl = Label(supportTab, "⚡ Tốc độ thật: 0.0 studs/s", posY)
SV.liveLbl.TextColor3 = C.GREEN
SV.liveLbl.TextSize = 9
posY = posY + 16
SV.maxLbl = Nhãn(supportTab, "🏁 Cao nhất: 0,0 đinh tán/s", posY)
SV.maxLbl.TextColor3 = C.ORANGE
SV.maxLbl.TextSize = 9
posY = posY + 16

cục bộ smBarBg = New("Khung", {
    Kích thước=UDim2.new(1,-16,0,10), Vị trí=UDim2.new(0,8,0,posY),
    BackgroundColor3=Color3.fromRGB(24, 28, 38), BackgroundTransparency=0.15,
    BorderSizePixel=0, ZIndex=6,
}, supportTab)
Corner(smBarBg, UDim.new(0,5)); Stroke(smBarBg, C.BORDER, 1)
SV.barFill = New("Frame", {
    Kích thước=UDim2.new(0,0,1,0), Vị trí=UDim2.new(0,0,0,0),
    BackgroundColor3=C.BLUE, BackgroundTransparency=0.15, BorderSizePixel=0, ZIndex=7,
}, smBarBg)
Góc(SV.barFill, UDim.new(0,5))
SV.barBase = New("Frame", { -- vạch xanh = tốc độ MẶC ĐỊNH của trò chơi (mốc so sánh)
    Kích thước=UDim2.new(0,2,1,0), Vị trí=UDim2.new(0.25,-1,0,0),
    BackgroundColor3=C.GREEN, BackgroundTransparency=0, BorderSizePixel=0, ZIndex=8,
}, smBarBg)
posY = posY + 16

SV.hintLbl = Label(supportTab, "ℹ️ Chỉ ĐO, không sửa gì · Vạch xanh = mặc định game · Tự học lại khi game đổi.", posY)
SV.hintLbl.TextSize = 9
posY = posY + 18

--------- HUD nổi trong trò chơi trên màn hình (đóng menu vẫn thấy) ----------
SV.hud = New("Frame", {
    Tên = "BC_SpeedHud",
    Kích thước = UDim2.new(0, 214, 0, 44), Vị trí = UDim2.new(0, 12, 0.5, -22),
    BackgroundColor3 = Color3.fromRGB(16, 19, 26), BackgroundTransparency = 0.25,
    BorderSizePixel = 0, Visible = false, ZIndex = 24,
}, gui)
Corner(SV.hud, UDim.new(0,8)); Stroke(SV.hud, C.ACCENT, 1.4)
SV.hudLbl = New("TextLabel", {
    Kích thước = UDim2.new(1,-12,1,0), Vị trí = UDim2.new(0,6,0,0), Văn bản = "🎯 ...",
    BackgroundTransparency = 1, TextColor3 = C.WHITE,
    Phông chữ = Enum.Font.GothamBold, Kích thước chữ = 9,
    TextXAlignment = Enum.TextXAlignment.Left, TextYAlignment = Enum.TextYAlignment.Center,
    ZIndex = 25, TextWrapped = true,
}, SV.hud)

SV.btn.Activated:Connect(function()
    local on = SV.Set(not SV.on)
    say(on and ("🎯 định vị tốc độ: BẬT · mặc định game " .. fmt(SV.base) .. " studs/s")
           hoặc "🎯 định tốc độ: TẮT")
kết thúc)
SV.resetBtn.Activated:Connect(function()
    SV.Reset()
    say("🎯 đã xóa chất · cao nhất = 0")
kết thúc)

SV.Detect()
SV.Sync()
kết thúc
Label(supportTab, "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", posY)
posY = posY + 16
Label(supportTab, "💾 Waypoint Đã Lưu", posY)
posY = posY + 14

local wpNameIn = New("TextBox", {
    Kích thước=UDim2.new(1,-130,0,24), Vị trí=UDim2.new(0,8,0,posY), Văn bản="",
    PlaceholderText=" Tên điểm tham chiếu...",
    PlaceholderColor3=Color3.fromRGB(122, 130, 148),
    BackgroundColor3=Color3.fromRGB(26, 29, 38), BackgroundTransparency=0,
    TextColor3=Color3.fromRGB(233, 237, 245), Font=Enum.Font.GothamMedium, TextSize=11,
    BorderSizePixel=0, ClearTextOnFocus=false, Active=true, Selectable=true, ZIndex=10,
}, supportTab)
Corner(wpNameIn, UDim.new(0,4)); Stroke(wpNameIn, Color3.fromRGB(180,180,200), 1.2)
New("UIPadding", {PaddingLeft=UDim.new(0,6)}, wpNameIn)

local saveWpBtn = Button(supportTab, "💾 Lưu", 0, 0, 100, 24, C.PURPLE)
saveWpBtn.Position = UDim2.new(1, -110, 0, posY)

posY = posY + 32

local wpListFrame = New("Frame", {
    Kích thước=UDim2.new(1,-16,0,0), Vị trí=UDim2.new(0,8,0,posY),
    BackgroundTransparency=1, BorderSizePixel=0, ZIndex=6,
}, supportTab)
New("UIListLayout", {SortOrder=Enum.SortOrder.LayoutOrder, Padding=UDim.new(0,4)}, wpListFrame)

Điểm định vị RebuildWaypoints cục bộ

saveWpBtn.Activated:Connect(function()
    rootPart cục bộ = GetRootPart()
    nếu không phải là rootPart thì trả về end
    tên cục bộ = wpNameIn.Text
    if #name == 0 then name = "WP "..(#waypoints+1) end
    table.insert(waypoints, {name = name, pos = rootPart.CFrame.Position})
    wpNameIn.Text = ""
    nếu RebuildWaypoints thì RebuildWaypoints() kết thúc
    Store.saveSoon()
kết thúc)

RebuildWaypoints = function()
    for _, c in ipairs(wpListFrame:GetChildren()) do
        if not c:IsA("UIListLayout") then c:Destroy() end
    kết thúc

    nếu #waypoints == 0 thì
        Mới("TextLabel", {
            Kích thước = UDim2.new(1, 0, 0, 26),
            Text="📭 Chưa có điểm tham chiếu nào.",
            BackgroundTransparency=1, TextColor3=C.GRAY,
            Font=Enum.Font.GothamMedium, TextSize=10,
            TextXAlignment=Enum.TextXAlignment.Center, ZIndex=7,
        }, wpListFrame)
        supportTab.CanvasSize = UDim2.new(0, 0, 0, posY + 40)
        trở lại
    kết thúc

    tổng cục bộ H = 0
    for i, wp in ipairs(waypoints) do
        hàng cục bộ = New("Khung", {
            Kích thước = UDim2.new(1, 0, 0, 30),
            BackgroundColor3=Color3.fromRGB(26, 29, 38),
            BackgroundTransparency=0.1, BorderSizePixel=0, ZIndex=6,
        }, wpListFrame)
        Góc(hàng, UDim.new(0,5)); Nét(hàng)

        Mới("TextLabel", {
            Kích thước=UDim2.new(1,-120,1,0), Vị trí=UDim2.new(0,8,0,0),
            Văn bản=wp.name.." ("..string.format("%.0f, %.0f, %.0f", wp.pos.X, wp.pos.Y, wp.pos.Z)..")",
            BackgroundTransparency=1, TextColor3=C.DARK,
            Font=Enum.Font.GothamBold, TextSize=9,
            TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
        }, hàng ngang)

        local goBtn = New("TextButton", {
            Kích thước=UDim2.new(0,50,0,22), Vị trí=UDim2.new(1,-84,0,4),
            Văn bản="🚀"", Màu nền 3 = Xanh lá cây, Độ trong suốt nền = 0.1,
            TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=9,
            BorderSizePixel=0, ZIndex=8,
        }, hàng ngang)
        Góc(goBtn, UDim.new(0,4))
        goBtn.Activated:Connect(function()
            rootPart cục bộ = GetRootPart()
            nếu không phải là rootPart thì trả về end
            rootPart.CFrame = CFrame.new(wp.pos)
        kết thúc)

        local delBtn = New("TextButton", {
            Kích thước=UDim2.new(0,26,0,22), Vị trí=UDim2.new(1,-30,0,4),
            Văn bản="🗑", Màu nền 3 = Đỏ đậm, Độ trong suốt nền = 0.1,
            TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10,
            BorderSizePixel=0, ZIndex=8,
        }, hàng ngang)
        Góc(delBtn, UDim.new(0,4))
        delBtn.Activated:Connect(function()
            table.remove(waypoints, i)
            RebuildWaypoints()
Store.restoreWaypoints = RebuildWaypoints
            Store.saveSoon()
        kết thúc)

        tổngH = tổngH + 34
    kết thúc

    wpListFrame.Size = UDim2.new(1,-16,0,totalH)
    supportTab.CanvasSize = UDim2.new(0, 0, 0, posY + TotalH + 20)
kết thúc

RebuildWaypoints()

hàm cục bộ NormalizeCode(c)
    nếu kiểu dữ liệu (c) ~= "string" thì trả về ""
    c = S.SanitizeCode(c) -- v4.4b: cắt trình bao bọc cũ "SIZE WRAPPER" (nó ghi đè GUI của trò chơi)
    trả về S.NormalizeRunnable(c)
kết thúc

local GAME_OWNED_GUI_NAMES = {
    Topbar = true, TopbarContainer = true, PlayerList = true, Chat = true,
    Backpack = true, DevConsoleUI = true, ScriptInvitationUI = true,
    FollowPromptUI = true, TouchControlsFrame = true, Main = true, ExMenu = true,
    Thông báo = true, Menu tạm dừng = true, Trong trò chơi = true, CoreGui = true,
}

hàm cục bộ ScanNewGuis(beforeGuis, mine, allowGuess)
    cục bộ được tìm thấy, đã thấy = {}, {}
    hàm cục bộ take(g)
        nếu không phải g hoặc đã thấy[g] thì trả về end
        đã thấy[g] = đúng
        table.insert(found, g)
    kết thúc
    nếu là của tôi thì
        for _, g in ipairs(mine) do
            if g:IsA("ScreenGui") or g:IsA("Folder") then take(g) end
        kết thúc
    kết thúc
    hàm cục bộ scan(container)
        nếu không phải là container thì trả về end
        for _, g in ipairs(container:GetChildren()) do
            nếu không phải trước Guis[g] thì
                trước khi Guis[g] = đúng
                nếu allowGuess và (g:IsA("ScreenGui") hoặc g:IsA("Folder")) và không phải là GAME_OWNED_GUI_NAMES[g.Name] thì
                    local hasGuiChild = false
                    for _, c in ipairs(g:GetChildren()) do
                        if c:IsA("GuiObject") then hasGuiChild = true break end
                    kết thúc
                    nếu hasGuiChild thì lấy(g) kết thúc
                kết thúc
            kết thúc
        kết thúc
    kết thúc
    quét (playerGui)
    if targetGui ~= playerGui then scan(targetGui) end
    trả về đã tìm thấy
kết thúc

hàm cục bộ ForceStretchToParent(obj, maxDepth)
    nếu không phải là obj thì trả về end
    maxDepth = maxDepth hoặc 0
    pcall(function()
        nếu obj:IsA("GuiObject") thì
            nếu obj:IsA("Frame") hoặc obj:IsA("ScrollingFrame") hoặc obj:IsA("CanvasGroup") thì
                cục bộ s = obj.Size
                nếu sXScale < 0,9 và sXOffset > 0 thì
                    obj.Size = UDim2.new(1, 0, sYScale > 0 and sYScale or 1, 0)
                kết thúc
                nếu obj.Position.X.Offset ≥ 0 hoặc obj.Position.Y.Offset ≥ 0 thì
                    obj.Position = UDim2.new(0, 0, 0, 0)
                kết thúc
            kết thúc
        kết thúc
    kết thúc)
    nếu maxDepth <= 0 thì trả về end
    for _, child in ipairs(obj:GetChildren()) do
        ForceStretchToParent(child, maxDepth - 1)
    kết thúc
kết thúc

hàm S.RegisterEmbed(host, gui, recs)
    mục nhập cục bộ = {host = host, gui = gui, recs = recs hoặc {}, conns = {}}
    pcall(function()
        entry.conns[#entry.conns+1] = gui:GetPropertyChangedSignal("Enabled"):Connect(function()
            pcall(function() host.Visible = gui.Enabled end)
        kết thúc)
    kết thúc)
    pcall(function()
        entry.conns[#entry.conns+1] = gui:GetPropertyChangedSignal("Parent"):Connect(function()
            pcall(function() host.Visible = (gui.Parent ~= nil) and gui.Enabled end)
        kết thúc)
    kết thúc)
    pcall(function()
        entry.conns[#entry.conns+1] = gui.Destroying:Connect(function()
            S.DropEmbed(entry, true)
        kết thúc)
    kết thúc)
    S.embeds[#S.embeds+1] = entry
    mục nhập trả lại
kết thúc

hàm S.FindEmbedByHost(host)
    for i, e in ipairs(S.embeds) do
        if e.host == host then return e, i end
    kết thúc
    trả về nil
kết thúc

hàm S.RemoveEmbedAt(i)
    cục bộ e = S.embeds[i]
    nếu không phải e thì trả về end
    for _, c in ipairs(e.conns) do pcall(function() c:Disconnect() end) end
    table.remove(S.embeds, i)
    trả về e
kết thúc

hàm S.DropEmbed(entry, keepQuiet)
    for i, e in ipairs(S.embeds) do
        if e == entry then S.RemoveEmbedAt(i); break end
    kết thúc
    pcall(function() if entry.host and entry.host.Parent then entry.host:Destroy() end end)
    nếu không giữ im lặng thì
        print("[BananaCatHub] Đã gỡ bỏ máy chủ nhúng khỏi tab")
    kết thúc
kết thúc

hàm S.RestoreEmbed(entry)
    pcall(function() S.RestoreSnap(entry) end)
    entry.snap = nil
    for _, rec in ipairs(entry.recs or {}) do
        pcall(function()
            nếu rec.obj và rec.origParent thì
                rec.obj.Parent = rec.origParent
            kết thúc
        kết thúc)
    kết thúc
    for i, e in ipairs(S.embeds) do
        if e == entry then S.RemoveEmbedAt(i); break end
    kết thúc
    pcall(function() if entry.host and entry.host.Parent then entry.host:Destroy() end end)
kết thúc

hàm S.PruneEmbeds()
    for i = #S.embeds, 1, -1 do
        cục bộ e = S.embeds[i]
        local hostAlive = e.host and e.host.Parent
        local guiAlive = e.gui and e.gui.Parent
        nếu không phải hostAlive hoặc không phải guiAlive thì
            if hostAlive then pcall(function() e.host:Destroy() end) end
            S.RemoveEmbedAt(i)
        kết thúc
    kết thúc
kết thúc

hàm S.MeasureHost(host)
    local hx, hy = host.AbsolutePosition.X, host.AbsolutePosition.Y
    local minX, minY, maxX, maxY = math.huge, math.huge, -math.huge, -math.huge
    cục bộ n = 0
    for _, ch in ipairs(host:GetChildren()) do
        nếu ch:IsA("GuiObject") và ch.Visible ~= false thì
            local p, sz = ch.AbsolutePosition, ch.AbsoluteSize
            nếu p và sz thì
                minX = math.min(minX, pX); minY = math.min(minY, pY)
                maxX = math.max(maxX, pX + sz.X); maxY = math.max(maxY, pY + sz.Y)
                n = n + 1
            kết thúc
        kết thúc
    kết thúc
    if n == 0 or maxX <= minX or maxY <= minY then return nil end
    return { x = minX - hx, y = minY - hy, w = maxX - minX, h = maxY - minY }
kết thúc

hàm S.SnapSubtree(list, node, isTop)
    for _, c in ipairs(node:GetChildren()) do
        nếu c:Là một đối tượng GUI thì
            danh sách[#list+1] = {
                obj = c, top = isTop hoặc nil,
                Vị trí = c.Vị trí, Kích thước = c.Kích thước,
                TextSize = ((c.TextSize and c.TextSize > 0) and not c.TextScaled) and c.TextSize or nil,
            }
            S.SnapSubtree(list, c, false)
        elseif c:IsA("UICorner") then
            list[#list+1] = { obj = c, CornerRadius = c.CornerRadius }
        elseif c:IsA("UIPadding") then
            danh sách[#list+1] = { obj = c,
                PadT = c.PaddingTop, PadB = c.PaddingBottom,
                PadL = c.PaddingLeft, PadR = c.PaddingRight }
        elseif c:IsA("UIStroke") then
            list[#list+1] = { obj = c, Thick = c.Thickness }
        kết thúc
    kết thúc
kết thúc

hàm S.RestoreSnap(entry)
    nếu không phải entry.snap thì trả về end
    for _, rec in ipairs(entry.snap) do
        cục bộ o = rec.obj
        nếu o và o.Parent thì
            pcall(function()
                if rec.Position then o.Position = rec.Position end
                if rec.Size then o.Size = rec.Size end
                if rec.TextSize then o.TextSize = rec.TextSize end
                if rec.CornerRadius then o.CornerRadius = rec.CornerRadius end
                nếu rec.PadT thì
                    o.PaddingTop, o.PaddingBottom = rec.PadT, rec.PadB
                    o.PaddingLeft, o.PaddingRight = rec.PadL, rec.PadR
                kết thúc
                if rec.Thick then o.Thickness = rec.Thick end
            kết thúc)
        kết thúc
    kết thúc
kết thúc

hàm S.FitEmbedded(entry)
    máy chủ cục bộ, gui = entry.host, entry.gui
    nếu không phải máy chủ hoặc không phải máy chủ cha thì trả về kết thúc
    hàm cục bộ mulUDim(u, k)
        return UDim2.new(uXScale, math.floor(uXOffset * k + 0.5),
                         uYScale, math.floor(uYOffset * k + 0.5))
    kết thúc
    hàm cục bộ mulUDimShift(u, k, dx, dy)
        return UDim2.new(uXScale, math.floor(uXOffset * k + 0.5) + dx,
                         uYScale, math.floor(uYOffset * k + 0.5) + dy)
    kết thúc
    hàm cục bộ mulDim(u, k)
        return UDim.new(u.Scale, math.floor(u.Offset * k + 0.5))
    kết thúc

    vùng cục bộ = máy chủ.Cha -- embedHost trong tab
    local aw = area.AbsoluteSize.X - 6
    local ah = area.AbsoluteSize.Y - 6
    nếu aw < 40 hoặc ah < 40 thì trả về end

    pcall(function()
        host.Size = UDim2.new(1, 0, 1, 0)
        host.Position = UDim2.new(0, 0, 0, 0)
        host.BackgroundTransparency = 1
        Host.ClipsDescendants = true -- phần dư (nếu có) vừa vô hình vừa không nhận click
    kết thúc)

    nếu không phải entry.snap thì
        entry.snap = {}
        S.SnapSubtree(entry.snap, host, true)
        if #entry.snap == 0 then return end
    kết thúc

    S.RestoreSnap(entry)
    cơ sở cục bộ = S.MeasureHost(host)
    nếu không phải là cơ sở thì trả về kết thúc

    local s = math.clamp(math.min(aw / base.w, ah / base.h), 0.35, 3.0)

    hàm cục bộ áp dụng(k)
        for _, rec in ipairs(entry.snap) do
            cục bộ o = rec.obj
            nếu o và o.Parent thì
                pcall(function()
                    if rec.Size then o.Size = mulUDim(rec.Size, k) end
                    nếu rec.Position thì
                        nếu rec.top thì
                            o.Position = mulUDimShift(rec.Position, k, rec.dx or 0, rec.dy or 0)
                        khác
                            o.Position = mulUDim(rec.Position, k)
                        kết thúc
                    kết thúc
                    if rec.TextSize then o.TextSize = math.max(8, math.floor(rec.TextSize * k + 0.5)) end
                    nếu rec.CornerRadius thì
                        o.CornerRadius = UDim.new(rec.CornerRadius.Scale,
                            math.floor(rec.CornerRadius.Offset * k + 0.5))
                    kết thúc
                    nếu rec.PadT thì
                        o.PaddingTop = mulDim(rec.PadT, k)
                        o.PaddingBottom = mulDim(rec.PadB, k)
                        o.PaddingLeft = mulDim(rec.PadL, k)
                        o.PaddingRight = mulDim(rec.PadR, k)
                    kết thúc
                    if rec.Thick then o.Thickness = math.max(1, rec.Thick * k) end
                kết thúc)
            kết thúc
        kết thúc
    kết thúc

    local hw, hh = area.AbsoluteSize.X, area.AbsoluteSize.Y
    hàm cục bộ align(k, tries)
        áp dụng(k)
        local m = S.MeasureHost(host)
        nếu không phải m thì trả về k kết thúc
        local dx = math.floor(-mx + math.max(0, (aw - mw) / 2) + 0.5)
        local dy = math.floor(-my + math.max(0, (ah - mh) / 2) + 0.5)
        nếu math.abs(dx) > 0,5 hoặc math.abs(dy) > 0,5 thì
            for _, rec in ipairs(entry.snap) do
                if rec.top then rec.dx, rec.dy = (rec.dx or 0) + dx, (rec.dy or 0) + dy end
            kết thúc
            áp dụng(k)
            m = S.MeasureHost(host) hoặc m
        kết thúc
        nếu m và tries < 2 và (mw > hw + 1 hoặc mh > hh + 1) thì
            local k2 = k * math.min(hw / mw, hh / mh)
            nếu k2 < k * 0,98 thì
                for _, rec in ipairs(entry.snap) do rec.dx, rec.dy = 0, 0 end
                return align(math.max(k2, 0.15), tries + 1)
            kết thúc
        kết thúc
        trả về k
    kết thúc

    s = align(s, 0)
    entry.fitScale = s
    trả về s
kết thúc

hàm S.TabArea(nm)
    khung cục bộ
    nếu type(nm) == "string" và #nm > 0 thì
        for _, ft in ipairs(featureTabs) do
            if ft.name == nm then frame = ft.frame break end
        kết thúc
    kết thúc
    khung = khung hoặc tab đang hoạt động
    nếu không phải là khung thì trả về nil.
    máy chủ cục bộ = frame:FindFirstChild("ScriptHost")
    khu vực cục bộ = máy chủ hoặc khung
    local sz = area.AbsoluteSize
    return Vector2.new(math.max(0, sz.X - 6), math.max(0, sz.Y - 6))
kết thúc

S.resizedCbs = {}
hàm S.OnResized(fn)
    if type(fn) ~= "function" then return nil end
    table.insert(S.resizedCbs, fn)
    return { Disconnect = function()
        for i, f in ipairs(S.resizedCbs) do
            if f == fn then table.remove(S.resizedCbs, i) break end
        kết thúc
    kết thúc }
kết thúc
hàm S.NotifyResize()
    local a = S.TabArea()
    cục bộ cbs = {}
    for _, f in ipairs(S.resizedCbs) do cbs[#cbs+1] = f end
    for _, f in ipairs(cbs) do pcall(f, a) end
kết thúc

hàm S.FeatureTabHost(nm)
    nếu type(nm) == "string" và #nm > 0 thì
        for _, ft in ipairs(featureTabs) do
            nếu ft.name == nm thì
                local h = ft.frame and ft.frame:FindFirstChild("ScriptHost")
                nếu h thì trả về h kết thúc
            kết thúc
        kết thúc
    kết thúc
    trả về activeTab và activeTab:FindFirstChild("ScriptHost")
kết thúc

hàm S.FitToTab(obj, nm)
    nếu không phải là obj thì trả về nil.
    máy chủ cục bộ = S.FeatureTabHost(nm)
    nếu host và obj.Parent ~= host thì
        pcall(function() obj.Parent = host end)
    kết thúc
    pcall(function()
        obj.Size = UDim2.new(1, 0, 1, 0)
        obj.Position = UDim2.new(0, 0, 0, 0)
    kết thúc)
    trả về obj
kết thúc

_G.BananaCatHubAPI = {
    Phiên bản = "4.43",
    HubGui = gui, -- v4.4e: sửa lỗi cũ — biến tên là `gui`, không phải `hubGui` (trước đây là nil)
    Chính = chính,
    TabArea = function(self, nm) return S.TabArea(nm) end,
    OnResize = function(self, fn) return S.OnResized(fn) end, -- API:OnResize(f) -> {Disconnect=}
    FeatureTabHost = function(self, nm) return S.FeatureTabHost(nm) end,
    FitToTab = function(self, obj, nm) return S.FitToTab(obj, nm) end,
    EmbedGui = function(self, guiOrFrame, nm) -- xin hub mượn GUI vào tab
        local scr = guiOrFrame
        if scr and not scr:IsA("ScreenGui") then scr = scr:FindFirstAncestorOfClass("ScreenGui") end
        máy chủ cục bộ = S.FeatureTabHost(nm)
        nếu không phải scr hoặc không phải máy chủ thì trả về nil.
        trả về S.EmbedGui(scr, host)
    kết thúc,
    MakeTemplate = function(self, nm, icon) return S.FeatureTemplate(nm, icon) end,
    ReleaseFocus = function(self) pcall(ReleaseHubFocus) end,
    ExternalGui = function(self, props)
        props = props hoặc {}
        local g = Instance.new("ScreenGui")
        g.Name = props.Name or ("BC_External_" .. tostring(math.random(10000, 99999)))
        g.IgnoreGuiInset = props.IgnoreGuiInset ~= false
        g.ResetOnSpawn = false
        g.ZIndexBehavior = Enum.ZIndexBehavior.Global
        g.DisplayOrder = tonumber(props.DisplayOrder) or 9000
        g:SetAttribution("BCHub_External", true) -- báo cho hub biết đừng nhúng GUI này
        g.Parent = (gethui and gethui()) or game:GetService("CoreGui")
                    hoặc (người chơi và người chơi: Chờ con("PlayerGui"))
        trả lại g
    kết thúc,
    Tâm ngắm = hàm(self, on)
        if on == nil then return S.ToggleCrosshair() end
        S.SetCrosshair(on và true hoặc false)
        trả về S.crosshairOn
    kết thúc,
}

hàm S.FeatureTemplate(nm, icon, stamp)
    nếu type(nm) ~= "string" hoặc #nm == 0 thì nm = " Tính Năng Mới" end
    if type(icon) ~= "string" or #icon == 0 then icon = "⚙️" end
    if type(stamp) ~= "string" then stamp = "" end
    đầu cục bộ = [==[
-- ---------------------------------------------------------------------------

BC cục bộ = { Tên = "__BC_NAME__", Biểu tượng = "__BC_ICON__", Thiết kế chiều rộng = 620, Thiết kế chiều cao = 384 }

local Players = game:GetService("Players")
người chơi cục bộ = Players.LocalPlayer
local pg = player and player:WaitForChild("PlayerGui")
nếu không phải pg thì trả về end

local gui = Instance.new("ScreenGui")
gui.Name = BC.Name
gui.ResetOnSpawn = false
gui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
gui.Parent = pg

gốc cục bộ = Instance.new("Frame")
root.Name = "Root"
root.Size = UDim2.new(0, BC.DesignW, 0, BC.DesignH)
root.Position = UDim2.new(0.5, -BC.DesignW / 2, 0.5, -BC.DesignH / 2)
root.BackgroundColor3 = Color3.fromRGB(24, 26, 38)
root.BorderSizePixel = 0
root.Parent = gui
hàm cục bộ bcCorner(o, r)
    local c = Instance.new("UICorner")
    c.CornerRadius = UDim.new(0, r)
    c.Cha mẹ = o
    trả về c
kết thúc
bcCorner(root, 8)

API cục bộ = _G.BananaCatHubAPI
local bcConn = nil -- kết nối của API:OnResize, bcClose sẽ ngắt để không bị rò rỉ
hàm cục bộ bcHubMain()
    cục bộ ok, m = pcall(function() trả về API và API.Main kết thúc)
    nếu ok và m và m.AbsoluteSize thì trả về m.
    trung tâm cục bộ = pg:FindFirstChild("ExMenu") hoặc pg:FindFirstChild("BananaCatHub")
    nếu là trung tâm thì
        local f = hub:FindFirstChildWhichIsA("Frame")
        nếu f và f.AbsoluteSize.X > 300 thì trả về f.
    kết thúc
kết thúc
hàm cục bộ bcArea()
    local ok, v = pcall(function() return API and API.TabArea and API:TabArea(BC.Name) end)
    Nếu ổn và v và vX và vX > 60 thì trả về v kết thúc.
    cục bộ m = bcHubMain()
    nếu m và m.AbsoluteSize.X > 300 thì
        return Vector2.new(m.AbsoluteSize.X - 30, m.AbsoluteSize.Y - 72)
    kết thúc
    local vp = Vector2.new(1280, 720)
    pcall(function() vp = workspace.CurrentCamera.ViewportSize end)
    local w = math.max(320, math.min(vp.X * 0.55, vp.X - 60))
    return Vector2.new(w, w * BC.DesignH / BC.DesignW)
kết thúc
hàm cục bộ bcFit()
    pcall(function()
        cục bộ par = root.Parent
        nếu par và không phải là par:IsA("ScreenGui") thì
            root.Size = UDim2.new(1, 0, 1, 0)
            root.Position = UDim2.new(0, 0, 0, 0)
            trở lại
        kết thúc
        local a = bcArea()
        root.Size = UDim2.new(0, math.floor(aX), 0, math.floor(aY))
        root.Position = UDim2.new(0.5, -math.floor(aX / 2), 0.5, -math.floor(aY / 2))
    kết thúc)
kết thúc
bcConn = nil
bcFit()
pcall(function()
    if API and API.OnResize then bcConn = API:OnResize(bcFit) end
kết thúc)
local bcHubFrame = bcHubMain()
nếu bcHubFrame thì
    pcall(function()
        bcHubFrame:GetPropertyChangedSignal("AbsoluteSize"):Connect(bcFit)
    kết thúc)
kết thúc
task.delay(0.25, bcFit)
task.delay(1.2, bcFit)

]==]
    cơ thể cục bộ = [==[
-- ---------- giao diện mẫu (thêm/bớt thoải mái, miễn là CON của panel/root) ----
local title = Instance.new("TextLabel")
title.Size = UDim2.new(1, -56, 0, 32)
title.Position = UDim2.new(0, 10, 0, 0)
title.BackgroundTransparency = 1
title.Text = BC.Icon .. " " .. BC.Name
title.Font = Enum.Font.GothamBold
title.TextSize = 15
title.TextXAlignment = Enum.TextXAlignment.Left
title.TextColor3 = Color3.fromRGB(255, 255, 255)
tiêu đề.Cha = gốc

local closeBtn = Instance.new("TextButton")
closeBtn.Name = "CloseBtn"
closeBtn.Size = UDim2.new(0, 26, 0, 26)
closeBtn.Position = UDim2.new(1, -34, 0, 3)
closeBtn.BackgroundColor3 = Color3.fromRGB(210, 70, 70)
closeBtn.Text = "X"
closeBtn.Font = Enum.Font.GothamBold
closeBtn.TextSize = 14
closeBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
closeBtn.AutoButtonColor = true
closeBtn.Parent = root
bcCorner(closeBtn, 6)

bảng cục bộ = Instance.new("ScrollingFrame")
panel.Name = "Panel"
panel.Size = UDim2.new(1, -20, 1, -74)
panel.Position = UDim2.new(0, 10, 0, 38)
panel.BackgroundTransparency = 1
panel.BorderSizePixel = 0
panel.ScrollBarThickness = 4 -- v4.9: đồng bộ
panel.AutomaticCanvasSize = Enum.AutomaticSize.Y
panel.CanvasSize = UDim2.new(0, 0, 0, 0)
panel.Parent = root
local list = Instance.new("UIListLayout")
list.Padding = UDim.new(0, 6)
list.SortOrder = Enum.SortOrder.LayoutOrder
danh sách.Cha = bảng
local pad = Instance.new("UIPadding")
pad.PaddingRight = UDim.new(0, 8)
pad.Parent = panel

local bcStatus = Instance.new("TextLabel")
bcStatus.Name = "Status"
bcStatus.Size = UDim2.new(1, -20, 0, 22)
bcStatus.Position = UDim2.new(0, 10, 1, -30)
bcStatus.BackgroundTransparency = 1
bcStatus.Text = "Chèo"
bcStatus.TextColor3 = Color3.fromRGB(255, 214, 90)
bcStatus.Font = Enum.Font.Gotham
bcStatus.TextSize = 12
bcStatus.TextXAlignment = Enum.TextXAlignment.Left
bcStatus.Parent = root

hàm cục bộ bcButton(txt, color)
    local b = Instance.new("TextButton")
    b.Size = UDim2.new(1, 0, 0, 30)
    b.BackgroundColor3 = color hoặc Color3.fromRGB(60, 120, 220)
    b.Text = txt
    b.Font = Enum.Font.GothamMedium
    b.TextSize = 13
    b.TextColor3 = Color3.fromRGB(255, 255, 255)
    b.AutoButtonColor = true
    b.Cha = bảng
    bcCorner(b, 6)
    trả lại b
kết thúc

bcToggle = bcButton(BC.Icon .. " Kích hoạt " .. BC.Name)

--------- LỚP PHỦ BÊN NGOÀI (vòng tròn niêm tâm / ESP / HUD ngoài màn hình) ------
hàm cục bộ bcMakeExternalGui(name, order)
    số máy lẻ
    cục bộ ok, API = pcall(function() return _G.BananaCatHubAPI end)
    nếu ổn và API và API.ExternalGui thì
        ext = API:ExternalGui({Name = name, DisplayOrder = order})
    khác
        ext = Instance.new("ScreenGui")
        ext.Name = tên
        ext.IgnoreGuiInset = true
        ext.ResetOnSpawn = false
        ext.ZIndexBehavior = Enum.ZIndexBehavior.Global
        ext.DisplayOrder = order or 9500
        ext:SetAttribute("BCHub_External", true)
        local pg2 = game:GetService("Players").LocalPlayer:WaitForChild("PlayerGui")
        local hui = (gethui and gethui()) or game:GetService("CoreGui") or pg2
        ext.Parent = hui
    kết thúc
    trả về phần mở rộng
kết thúc

local extGui = nil -- Lớp phủ ScreenGui ngoài màn hình (có thể tạo khi bật tính năng)
local extCrossOn = false
hàm cục bộ bcToggleCross()
    nếu không phải extGui thì trả về end
    extCrossOn = không phải extCrossOn
    local ring = extGui:FindFirstChild("BC_Ring")
    local dot = extGui:FindFirstChild("BC_Dot")
    if ring then ring.Visible = extCrossOn end
    if dot then dot.Visible = extCrossOn end
    pcall(function()
        nếu _G.BananaCatHubAPI và _G.BananaCatHubAPI.Crosshair thì
        kết thúc
    kết thúc)
kết thúc

local bcCrossBtn = bcButton("🎯 Niêm tâm: TẮT", Color3.fromRGB(160, 60, 255))

pcall(function()
    nếu _G.BananaCatHubAPI và _G.BananaCatHubAPI.OnResize thì
    kết thúc
kết thúc)

]==]
    chân cục bộ = [==[
-- ---------- đóng / trả GUI (KHÔNG xóa khối này) ----------------------------
local bcEnabled = false
local bcConns = {}
hàm cục bộ bcOn(inst, sig, fn)
    table.insert(bcConns, inst[sig]:Connect(fn))
kết thúc

hàm cục bộ bcClose()
    if bcConn then pcall(function() bcConn:Disconnect() end) bcConn = nil end
    for _, c in ipairs(bcConns) do pcall(function() c:Disconnect() end) end
    for i = #bcConns, 1, -1 do bcConns[i] = nil end
    bcEnabled = false
    pcall(function() gui.Enabled = false end)
    task.delay(0.06, function() pcall(function() gui:Destroy() end) end)
kết thúc
bcOn(closeBtn, "MouseButton1Click", bcClose)

_G.BC_FEATURES = _G.BC_FEATURES hoặc {}
_G.BC_FEATURES[BC.Name] = { name = BC.Name, Close = bcClose, Gui = gui, Root = root }

bcOn(bcCrossBtn, "MouseButton1Click", function()
    nếu không được bật thì
        bcToggle:Activate()
        task.wait(0.1)
    kết thúc
    bcToggleCross()
    bcCrossBtn.Text = extCrossOn và "🎯 Niêm tâm: BẬT" hoặc "🎯 Niêm tâm: TẮT"
kết thúc)

bcOn(bcToggle, "MouseButton1Click", function()
    bcEnabled = không bcEnabled
    bcToggle.Text = (bcEnabled và "⏹ " hoặc BC.Icon .. " ") .. BC.Name
    bcStatus.Text = bcEnabled và "Đang chạy..." hoặc "Tắt"
    nếu bcEnabled thì
        nếu không phải extGui hoặc không phải extGui.Parent thì
            extGui = bcMakeExternalGui(BC.Name .. "_Ext", 9500)

            local ring = Instance.new("Frame")
            ring.Name = "BC_Ring"
            ring.Size = UDim2.new(0, 32, 0, 32)
            ring.Position = UDim2.new(0.5, -16, 0.5, -16)
            ring.BackgroundTransparency = 1
            ring.BorderSizePixel = 0
            ring.AnchorPoint = Vector2.new(0.5, 0.5)
            ring.Visible = false
            ring.Parent = extGui
            local rc = Instance.new("UICorner"); rc.CornerRadius = UDim.new(1, 0); rc.Parent = ring
            local rs = Instance.new("UIStroke"); rs.Thickness = 1.5; rs.Color = Color3.fromRGB(255,255,255); rs.Parent = ring

            local dot = Instance.new("Frame")
            dot.Name = "BC_Dot"
            dot.Size = UDim2.new(0, 3, 0, 3)
            dot.Position = UDim2.new(0.5, -2, 0.5, -2)
            dot.BackgroundColor3 = Color3.fromRGB(255,255,255)
            dot.BorderSizePixel = 0
            dot.AnchorPoint = Vector2.new(0.5, 0.5)
            chấm.Visible = false
            dot.Parent = extGui
            local dc = Instance.new("UICorner"); dc.CornerRadius = UDim.new(1, 0); dc.Parent = dot

            khoảng cách cục bộ, ll = 22, 10
            hàm cục bộ ln(w, h, x, y)
                local f = Instance.new("Frame")
                f.Size = UDim2.new(0,w,0,h); f.Position = UDim2.new(0.5,x,0.5,y)
                f.BackgroundColor3 = Color3.fromRGB(255,255,255); f.BorderSizePixel = 0
                f.AnchorPoint = Vector2.new(0.5,0.5); f.BackgroundTransparency = 0.2
                f.Name = "BC_Line"; f.Parent = extGui
            kết thúc
            ln(2, ll, -1, -gap - ll/2)
            ln(2, ll, -1, gap + ll/2)
            ln(ll, 2, -gap - ll/2, -1)
            ln(ll, 2, gap + ll/2, -1)
        kết thúc

        table.insert(bcConns, task.spawn(function()
            trong khi bcEnabled thực hiện
                task.wait(0.2)
                pcall(function()
                kết thúc)
            kết thúc
        kết thúc))
    khác
        extCrossOn = false
        pcall(function() if extGui then extGui:Destroy() end end)
        extGui = nil
        bcCrossBtn.Text = "🎯 Niêm tâm: BẮT ĐẦU"
    kết thúc
kết thúc)

print(" ✅ [" .. BC.Name .. "] đã tải — dán vào tab \"Tạo Tính Năng\" của Banana Cat Hub rồi nhấn vào ► Chạy Script")
Trả về BC.Name
]==]
    đầu ra cục bộ = đầu .. thân .. chân
    out = (out:gsub("__BC_NAME__", function() return nm end))
    out = (out:gsub("__BC_ICON__", function() return icon end))
    out = (out:gsub("__BC_STAMP__", function() return (#stamp > 0) and stamp or "sinh bởi hub" end))
    trở lại
kết thúc

_G.BananaCatHub_SyncEmbeds = function()
    pcall(S.SyncAllEmbeds)
kết thúc
pcall(function()
    trackConn(main:GetPropertyChangedSignal("Size"):Connect(function()
        BcFit() -- GUI đang được nhúng trong tab -> đo & thu nhỏ lại
        pcall(S.NotifyResize) -- script ngoài (tự xin size) -> chạy lại bcFit của nó
    kết thúc))
kết thúc)

hàm S.SyncAllEmbeds()
    for _, e in ipairs(S.embeds) do
        nếu e.host và e.host.Parent thì
            pcall(function() S.FitEmbedded(e) end)
        kết thúc
    kết thúc
kết thúc

hàm S.ClearEmbedsUnder(containerFrame)
    nếu không phải containerFrame thì trả về 0.
    cục bộ n = 0
    for i = #S.embeds, 1, -1 do
        cục bộ e = S.embeds[i]
        nếu e.host và e.host.Parent == containerFrame thì
            S.RestoreEmbed(e)
            n ± 1
        kết thúc
    kết thúc
    for _, child in ipairs(containerFrame:GetChildren()) do
        nếu child.Name:sub(1, 9) == "Embedded_" thì
            pcall(function() child:Destroy() end)
        kết thúc
    kết thúc
    trả về n
kết thúc

hàm S.EmbedGui(scr, containerFrame)
    if not S.embedEnabled then return nil end
    if not scr or not scr.Parent then return nil end
    if not containerFrame or not containerFrame.Parent then return nil end
    if scr == gui or scr:IsDescendantOf(gui) then return nil end
    local isExt = false
    pcall(function() isExt = (scr:GetAttribute("BCHub_External") == true) end)
    nếu isExt thì trả về nil

    Tên máy chủ cục bộ = "Embedded_"..scr.Name
    for _, ex in ipairs(containerFrame:GetChildren()) do
        nếu ex.Name == hostName thì
            local e = S.FindEmbedByHost(ex)
            nếu e thì
                S.RestoreEmbed(e)
            khác
                pcall(function() ex:Destroy() end)
            kết thúc
        kết thúc
    kết thúc

    máy chủ cục bộ = New("Frame", {
        Kích thước = UDim2.new(1,0,1,0),
        Vị trí = UDim2.new(0,0,0,0),
        Độ trong suốt của nền = 1,
        BorderSizePixel = 0,
        Chỉ số Z = 5,
        Tên = hostName,
        ClipsDescendants = true,
    }, containerFrame)

    bản ghi cục bộ = {}
    for _, ch in ipairs(scr:GetChildren()) do
        nếu ch:IsA("GuiObject") thì
            recs[#recs+1] = {obj = ch, origParent = scr, origPosition = ch.Position, origSize = ch.Size}
        kết thúc
    kết thúc
    nếu #recs == 0 thì
        pcall(function() host:Destroy() end)
        trả về nil
    kết thúc
    for _, rec in ipairs(recs) do
        pcall(function() rec.obj.Parent = host end)
    kết thúc

    ForceStretchToParent(host) -- chỉ root (an toàn cho vài frame con)
    mục nhập cục bộ = S.RegisterEmbed(host, scr, recs)
    pcall(function() S.FitEmbedded(entry) end)
    task.delay(0.08, function() pcall(function() S.FitEmbedded(entry) end) end)
    task.delay(0.4, function() pcall(function() S.FitEmbedded(entry) end) end)
    máy chủ trả về
kết thúc

S.crosshairGui = nil
S.crosshairBtns = {} -- danh sách nút 🎯 trên các tab để cập nhật văn bản đồng loạt
S.crosshairOn = false
S.crosshairColor = Color3.fromRGB(255, 255, 255)
S.crosshairSize = 32

hàm S._buildCrosshair()
    if S.crosshairGui and S.crosshairGui.Parent then return S.crosshairGui end
    cục bộ g = New("ScreenGui", {
        Tên = "BananaCatHub_Crosshair",
        IgnoreGuiInset = true,
        ResetOnSpawn = false,
        ZIndexBehavior = Enum.ZIndexBehavior.Global,
        DisplayOrder = 9999,
    }, targetGui)
    g:SetAttribute("BCHub_External", true)

    vòng cục bộ = New("Khung", {
        Tên = "Nhẫn",
        Kích thước = UDim2.new(0, S.crosshairSize, 0, S.crosshairSize),
        Vị trí = UDim2.new(0.5, -S.crosshairSize/2, 0.5, -S.crosshairSize/2),
        Độ trong suốt của nền = 1,
        BorderSizePixel = 0,
        AnchorPoint = Vector2.new(0.5, 0.5),
    }, g)
    New("UICorner", {CornerRadius = UDim.new(1, 0)}, ring)
    New("UIStroke", {Thickness = 1.5, Color = S.crosshairColor, Transparency = 0.1}, ring)

    local dot = New("Frame", {
        Tên = "Dot",
        Kích thước = UDim2.new(0, 3, 0, 3),
        Vị trí = UDim2.new(0.5, -2, 0.5, -2),
        BackgroundColor3 = S.crosshairColor,
        BorderSizePixel = 0,
        AnchorPoint = Vector2.new(0.5, 0.5),
    }, g)
    New("UICorner", {CornerRadius = UDim.new(1, 0)}, dot)

    khoảng cách cục bộ = S.crosshairSize/2 + 6
    local lineLen = 10
    hàm cục bộ line(name, w, h, x, y)
        local ln = New("Frame", {
            Tên = tên, Kích thước = UDim2.new(0, w, 0, h),
            Vị trí = UDim2.new(0.5, x, 0.5, y),
            BackgroundColor3 = S.crosshairColor, BorderSizePixel = 0,
            AnchorPoint = Vector2.new(0.5, 0.5), BackgroundTransparency = 0.15,
        }, g)
        trả về ln
    kết thúc
    line("Top", 2, lineLen, -1, -gap - lineLen/2)
    line("Bottom", 2, lineLen, -1, gap + lineLen/2)
    line("Left", lineLen, 2, -gap - lineLen/2, -1)
    line("Phải", lineLen, 2, gap + lineLen/2, -1)

    S.crosshairGui = g
    trả lại g
kết thúc

hàm S.SetCrosshair(on)
    S.crosshairOn = (on == true)
    nếu S.crosshairOn thì
        S._buildCrosshair()
        if S.crosshairGui then S.crosshairGui.Enabled = true end
    khác
        if S.crosshairGui then S.crosshairGui.Enabled = false end
    kết thúc
    for _, b in ipairs(S.crosshairBtns) do
        pcall(function()
            nếu b và b.Cha thì
                b.Text = S.crosshairOn và "🎯 Tâm: BẬT" hoặc "🎯 Tâm"
                b.BackgroundColor3 = S.crosshairOn và Color3.fromRGB(180, 80, 220) hoặc C.PURPLE
            kết thúc
        kết thúc)
    kết thúc
kết thúc

hàm S.ToggleCrosshair()
    S.SetCrosshair(not S.crosshairOn)
    trả về S.crosshairOn
kết thúc

hàm S.RegisterCrosshairBtn(btn)
    nếu không phải btn thì trả về end
    table.insert(S.crosshairBtns, btn)
    pcall(function()
        btn.Text = S.crosshairOn và "🎯 Tâm: BẬT" hoặc "🎯 Tâm"
        btn.BackgroundColor3 = S.crosshairOn and Color3.fromRGB(180, 80, 220) or C.PURPLE
    kết thúc)
    btn.Activated:Connect(function()
        S.ToggleCrosshair()
    kết thúc)
kết thúc

S.EMBED_TRY_DELAYS = {0.6, 1.8, 4, 7, 10} -- các cột thử lại sau khi nhấn ▶
S.EMBED_HOOK_GRACE = 11 -- giữ hook + watcher đà bao nhiêu giây (bắt GUI sinh đẩu)
S.EMBED_PROBABLE_AGE = 5 -- GUI "không chắc chắn" tự động nhận chỉ nếu sinh trong 5 giây đầu
S.EMBED_CHILD_WAIT = 15 -- GUI chờ "chín" số lần (0,2s/lần = tối đa 3s)
S.activeHook = nil -- chỉ 1 hook sống tại 1 thời điểm (khác hook script đè)

S.SYSTEM_GUI_NAMES = {
    Thanh trên cùng = true, Khung chứa thanh trên cùng = true, Danh sách người chơi = true, Trò chuyện = true, Ba lô = true,
    DevConsoleUI = true, ScriptInvitationUI = true, FollowPromptUI = true,
    TouchControlsFrame = true, PauseMenu = true, CoreGui = true, ExMenu = true,
}
S.GENERIC_GUI_NAMES = { Main = true, InGame = true, Notifications = true }

hàm S.IsEmbeddable(g, containerFrame, trust)
    nếu không phải g thì trả về false, kết thúc "không có GUI"
    nếu không phải g.Parent thì trả về false, "GUI chưa có Parent (script chưa được gắn lên màn hình)" end
    if not (g:IsA("ScreenGui") or g:IsA("Folder")) then return false, "không phải ScreenGui/Folder" end
    if g == gui hoặc g:IsDescendantOf(gui) thì trả về false, "là GUI của hub chính" end
    if g.Name == "ExMenu" thì trả về false, "sử dụng tên GUI của hub (ExMenu)" end
    nếu S.SYSTEM_GUI_NAMES[g.Name] thì
        return false, "là GUI của game/hệ thống (" .. tostring(g.Name) .. ")"
    kết thúc
    nếu độ tin cậy ~= "certain" và độ tin cậy ~= "manual" và S.GENERIC_GUI_NAMES[g.Name] thì
        return false, "tên '" .. tostring(g.Name) .. "' hay là UI của game — bật 🕵 hoặc nhấn 🔁 để ép nhúng"
    kết thúc
    local isExt = false
    pcall(function() isExt = (g:GetAttribute("BCHub_External") == true) end)
    nếu isExt thì trả về false, "là lớp phủ ngoài màn hình (BCHub_External)" end
    if containerFrame and g:IsDescendantOf(containerFrame) then return false, " đã nằm trong tab rồi" end
    for _, e in ipairs(S.embeds) do
        if e.gui == g thì trả về false, "đã được nhúng ở tab khác" end
    kết thúc
    local hasChild = false
    for _, c in ipairs(g:GetChildren()) do
        if c:IsA("GuiObject") then hasChild = true break end
    kết thúc
    nếu không có hasChild thì trả về false, "chưa có frame con (script còn dựng GUI)" end
    trả về giá trị đúng
kết thúc

hàm S.HookInstanceNew()
    if S.activeHook thì pcall(S.activeHook) end -- gỡ hook lần chạy trước, tránh chồng chuỗi
    S.activeHook = nil

    bản ghi cục bộ = {}
    cục bộ st = {
        hooked = false, available = false, viaHookfunction = false,
        realNew = nil, ours = nil, origFromHook = nil,
        thăm dò = false, thăm dò đã thấy = false,
        inRun = true, GraceUntil = nil, t0 = os.clock(),
    }
    local myCo = coroutine.running()

    hàm cục bộ unhook()
        nếu không được móc nối thì trả về end
        st.hooked = false
        nếu st.viaHookfunction thì
            pcall(function()
                nếu kiểu của hookfunction là "function" và st.origFromHook thì
                    hookfunction(Instance.new, st.origFromHook)
                kết thúc
            kết thúc)
        khác
            pcall(function()
                if Instance.new == st.ours then Instance.new = st.realNew end
            kết thúc)
        kết thúc
        if S.activeHook == unhook then S.activeHook = nil end
    kết thúc

    hàm cục bộ recorder(cls, ...)
        local inst = st.realNew(cls, ...)
        nếu st.probing thì
            if cls == "ScreenGui" then st.probeSeen = true end
            trả lại inst
        kết thúc
        nếu st.hooked và cls == "ScreenGui" thì
            local now = os.clock()
            bản ghi[#bản ghi + 1] = {
                inst = inst,
                certain = (coroutine.running() == myCo),
                whileRun = (st.inRun == true) hoặc (st.graceUntil ~= nil và bây giờ là < st.graceUntil),
                tuổi = hiện tại - st.t0,
                nhúng = sai,
                qua = "móc",
            }
        kết thúc
        trả lại inst
    kết thúc

    pcall(function()
        st.realNew = Instance.new
        st.ours = máy ghi âm
        Instance.new = st.ours
        st.hooked = (Instance.new == st.ours)
    kết thúc)

    nếu st.hooked không phải là và kiểu của hookfunction là "function" thì
        pcall(function()
            st.ours = máy ghi âm
            st.origFromHook = hookfunction(Instance.new, st.ours)
            if st.origFromHook then st.realNew = st.origFromHook end
            st.hooked = true
            st.viaHookfunction = true
        kết thúc)
    kết thúc

    nếu st.hooked thì
        pcall(function()
            st.probing, st.probeSeen = true, false
            local thăm dò = Instance.new("ScreenGui") -- không gắn kết Parent, hủy bỏ ngay
            st.probing = false
            st.available = (st.probeSeen == true)
            if probe and probe.Destroy then pcall(function() probe:Destroy() end) end
        kết thúc)
        nếu không có sẵn thì
            pcall(unhook)
        kết thúc
    kết thúc

    S.activeHook = unhook
    trả lại móc, ghi âm, st
kết thúc

hàm S.WatchNewGuis(records, st)
    kết nối cục bộ = {}
    hàm cục bộ đã có(g)
        for _, r in ipairs(records) do if r.inst == g then return true end end
        trả về false
    kết thúc
    hàm cục bộ makeHandler()
        trả về hàm (con)
            if st.watchOn == false then return end
            nếu không phải là con thì trả về end
            local okType, isGui = pcall(function()
                trả về child:IsA("ScreenGui") hoặc child:IsA("Folder")
            kết thúc)
            nếu không (okType và isGui) thì trả về end
            if child == gui or already(child) then return end
            local now = os.clock()
            bản ghi[#bản ghi + 1] = {
                inst = con,
                chắc chắn = sai,
                whileRun = (st.inRun == true) hoặc (st.graceUntil ~= nil và bây giờ là < st.graceUntil),
                tuổi = hiện tại - st.t0,
                nhúng = sai,
                qua = "xem",
            }
        kết thúc
    kết thúc
    local seenCtn, containers = {}, {playerGui, targetGui}
    pcall(function()
        local cg = game:GetService("CoreGui")
        nếu cg thì containers[#containers + 1] = cg end
    kết thúc)
    for _, ctn in ipairs(containers) do
        nếu ctn và không thấyCtn[ctn] thì
            seenCtn[ctn] = true
            pcall(function()
                conns[#conns + 1] = ctn.ChildAdded:Connect(makeHandler())
            kết thúc)
        kết thúc
    kết thúc
    st.watchOn = true
    hàm cục bộ stopWatch()
        st.watchOn = false
        for _, c in ipairs(conns) do pcall(function() c:Disconnect() end) end
    kết thúc
    trả về đồng hồ bấm giờ, conns
kết thúc

hàm S.EmbedRecorded(records, containerFrame, mode, verbose)
    if type(records) ~= "table" or #records == 0 then return 0, nil end
    if not containerFrame or not containerFrame.Parent then return 0, "tab đã bị đóng" end
    if not S.embedEnabled then return 0, "🧩 nhúng đang TẮT" end
    chế độ = chế độ hoặc "chạy"

    thứ tự cục bộ = {}
    for _, r in ipairs(records) do
        nếu r và r.inst và không r.embedded thì order[#order + 1] = r end
    kết thúc
    điểm chức năng cục bộ (r)
        nếu r.certain thì trả về 3 end
        if r.duringRun then return 2 end
        trả về 1
    kết thúc
    table.sort(order, function(a, b) return score(a) > score(b) end)

    cục bộ đã xong, whyTop = 0, nil
    for _, r in ipairs(order) do
        chấp nhận cục bộ = false
        nếu mode == "all" thì
            chấp nhận = đúng
        nếu r.certain thì
            chấp nhận = đúng
        elseif r.duringRun and mode ~= "strict" then
            chấp nhận = đúng
        elseif mode == "any" and (r.age or 0) <= S.EMBED_PROBABLE_AGE then
            chấp nhận = đúng
        kết thúc
        nếu chấp nhận thì
            quỹ tín thác địa phương
            Nếu r.certain thì trust = "certain"
            elseif r.duringRun or mode == "all" then trust = "manual"
            Ngược lại, tin tưởng = "đoán" kết thúc
            local okE, why = S.IsEmbeddable(r.inst, containerFrame, trust)
            nếu okE thì
                nếu S.EmbedGui(r.inst, containerFrame) thì
                    r.embedded = true
                    r.why = nil
                    đã hoàn thành += 1
                khác
                    r.why = "S.EmbedGui từ chối"
                    whyTop = r.why
                kết thúc
            khác
                r.why = why
                nếu tại sao thì whyTop = why end
                nếu chi tiết và không được báo cáo thì
                    r.reported = true
                    pcall(function()
                        print(string.format("[BananaCatHub] 🔍 bỏ qua GUI '%s' (%s, %s): %s",
                            tostring(r.inst and r.inst.Name), tostring(r.via), trust, tostring(why)))
                    kết thúc)
                kết thúc
            kết thúc
        kết thúc
    kết thúc
    Trả về đã xong, tại sao?
kết thúc

hàm S.FindFeatureByHost(host)
    nếu không phải là máy chủ thì trả về nil.
    for _, ft in ipairs(featureTabs) do
        if ft.frame and ft.frame.Parent and ft.frame:FindFirstChild("ScriptHost") == host then return ft end
    kết thúc
    trả về nil
kết thúc

hàm S.FindActiveFeature()
    for _, ft in ipairs(featureTabs) do
        if ft.frame == activeTab then return ft end
    kết thúc
    trả về nil
kết thúc

hàm S.DiagText(st, records)
    local hookTxt = "Không rõ"
    nếu st thì
        nếu st.available thì
            hookTxt = st.viaHookfunction and "OK (qua hookfunction)" or "OK ​​(ghi ngo Instance.new)"
        nếu st.hooked thì
            hookTxt = "cài được nhưng KHÔNG ăn (người thực hiện bỏ qua hook)"
        khác
            hookTxt = "BỊ CHẶN (người thực thi không cho sửa Instance.new)"
        kết thúc
    kết thúc
    cục bộ n, chắc chắn, theo dõi, quét = 0, 0, 0, 0
    for _, r in ipairs(records or {}) do
        n ± 1
        nếu r.certain thì certain += 1 end
        if r.via == "watch" then watch += 1 end
        if r.via == "scan" then scan += 1 end
    kết thúc
    local lastWhy = nil
    for _, r in ipairs(records or {}) do if r.why then lastWhy = r.why end end
    return string.format("hook=%s · ghi nhận %d GUI (chắc chắn %d, watcher %d, quét %d) · nhúng=%s · lý do cuối cùng: %s",
        hookTxt, n, certain, watch, scan, tostring(S.embedEnabled and "BẬT" or "TẮT"), tostring(lastWhy or "—"))
kết thúc

hàm S.RescueScan(ft, host)
    host = host or (ft and ft.frame and ft.frame:FindFirstChild("ScriptHost"))
    nếu không phải là máy chủ hoặc không phải là máy chủ cha thì trả về 0.
    if not S.embedEnabled then return 0 end
    các container cục bộ = {playerGui}
    if targetGui ~= playerGui then containers[#containers + 1] = targetGui end
    pcall(function()
        local cg = game:GetService("CoreGui")
        nếu cg thì containers[#containers + 1] = cg end
    kết thúc)
    cục bộ được nhìn thấy, n = {}, 0
    for _, ctn in ipairs(containers) do
        pcall(function()
            for _, g in ipairs(ctn:GetChildren()) do
                nếu n < 3 và không được nhìn thấy[g] thì
                    đã thấy[g] = đúng
                    local okE = S.IsEmbeddable(g, host, "manual")
                    nếu okE và S.EmbedGui(g, host) thì
                        n ± 1
                        nếu ft thì
                            ft.records = ft.records hoặc {}
                            ft.records[#ft.records + 1] =
                                {inst = g, certain = false, duringRun = true, age = 0, embedded = true, via = "rescue"}
                        kết thúc
                    kết thúc
                kết thúc
            kết thúc
        kết thúc)
        nếu n >= 3 thì thoát
    kết thúc
    trả về n
kết thúc

hàm S.ReembedFeature(ft, allowScan)
    if not ft or not ft.frame or not ft.frame.Parent then return 0, "tab không còn tồn tại" end
    if not S.embedEnabled then return 0, "🧩 nhúng đang TẮT" end
    máy chủ cục bộ = ft.frame:FindFirstChild("ScriptHost")
    if not host then return 0, "tab lack ScriptHost" end
    for _, e in ipairs(S.embeds) do
        nếu e.host và e.host.Parent == hosting thì trả về 0, "tab đã có sẵn GUI nhúng" end
    kết thúc
    local n, why = S.EmbedRecorded(ft.records, host, "all", true)
    nếu n > 0 thì trả về n
    nếu allowScan == true thì
        cục bộ m = S.RescueScan(ft, host)
        nếu m > 0 thì trả về m
        tại sao = "không tìm thấy GUI nào ngoài menu để nhúng"
    kết thúc
    Nếu không thì tại sao?
        tại sao = (số bản ghi ft và số bản ghi ft > 0)
            và (ft.last Why hoặc "GUI chưa sẵn sàng để nhúng")
            hoặc "không ghi được GUI nào (tập lệnh có tạo ScreenGui không?)"
    kết thúc
    trả về 0, tại sao?
kết thúc

hàm S.OnFeatureTabOpened(ft)
    if not ft or not ft.frame or not ft.frame.Parent then return end
    local n = S.ReembedFeature(ft, false)
    nếu n > 0 thì
        pcall(function()
            nếu ft.status và ft.status.Parent thì
                ft.status.Text = string.format(
                    "# vừa tải lại %d GUI vào tab (một lần trước đó bị rớt ngoài menu) — nhấn ✕ để trả về trò chơi", n)
            kết thúc
            if ft.indicator and ft.indicator.Parent then ft.indicator.BackgroundColor3 = C.GREEN end
        kết thúc)
    kết thúc
kết thúc

S.parkTab = nil
S.parkBtn = nil
S.parkList = nil
S.parkCount = 0
S.PARK_MAX = 2 -- mỗi lần chạy chỉ đưa ra tối đa 2 GUI vào menu (tránh cả giao diện người dùng của trò chơi)

hàm S.ParkHost(nhãn)
    nếu không (S.parkList và S.parkList.Parent) thì
        sf cục bộ, btn = AddTab("GUI Ngoài", "🧩", 99)
        S.parkTab, S.parkBtn = sf, btn
        Mới("TextLabel", {
            Kích thước = UDim2.new(1, -140, 0, 30), Vị trí = UDim2.new(0, 8, 0, 4),
            Text = "🧩 GUI chạy tập lệnh ở tab 💻 Tạo mã ra — trung tâm đưa vào đây. Bấm ↩ để trả về màn hình trò chơi. (Dex/IY/SimpleSpy KHÔNG bao giờ vào đây.)",
            BackgroundTransparency = 1, TextColor3 = C.DARK, Font = Enum.Font.GothamMedium,
            Kích thước văn bản = 10, Ngắt dòng văn bản = true, Chỉ số Z = 6,
            TextXAlignment = Enum.TextXAlignment.Left,
        }, S.parkTab)
        local backAll = New("TextButton", {
            Kích thước = UDim2.new(0, 124, 0, 24), Vị trí = UDim2.new(1, -128, 0, 6),
            Text = "↩ Trả tất cả về game", BackgroundColor3 = C.RED, BackgroundTransparency = 0.15,
            TextColor3 = C.WHITE, Font = Enum.Font.GothamBold, TextSize = 9, BorderSizePixel = 0, ZIndex = 7,
        }, S.parkTab)
        Góc(backAll, UDim.new(0, 5))
        backAll.Activated:Connect(function()
            local n = S.RemoveAllParked()
            pcall(function()
                print("[BananaCatHub] ↩ đã trả " .. n .. " GUI về màn hình game")
            kết thúc)
        kết thúc)
        S.parkList = New("Frame", {
            Tên = "ParkList", Kích thước = UDim2.new(1, -16, 1, -42), Vị trí = UDim2.new(0, 8, 0, 38),
            BackgroundTransparency = 1, BorderSizePixel = 0, ZIndex = 5,
        }, S.parkTab)
        New("UIListLayout", {Padding = UDim.new(0, 6), SortOrder = Enum.SortOrder.LayoutOrder}, S.parkList)
    kết thúc

    S.parkCount += 1
    hộp cục bộ = New("Khung", {
        Tên = "ParkBox_" .. tostring(label hoặc "GUI"),
        Kích thước = UDim2.new(1, 0, 0, 240), Thứ tự bố trí = S.parkCount,
        BackgroundColor3 = C.BG, BackgroundTransparency = 0.35, BorderSizePixel = 0, ZIndex = 5,
    }, S.parkList)
    Góc(hộp, UDim.new(0, 8))
    Stroke(box, nil, 1)

    cục bộ back = New("TextButton", {
        Kích thước = UDim2.new(0, 110, 0, 20), Vị trí = UDim2.new(1, -114, 0, 2),
        Text = "↩ Trả về game", BackgroundColor3 = C.GRAY, BackgroundTransparency = 0.2,
        TextColor3 = C.WHITE, Font = Enum.Font.GothamBold, TextSize = 9, BorderSizePixel = 0, ZIndex = 7,
    }, hộp)
    Góc(phía sau, UDim.new(0, 5))
    trở lại.Đã kích hoạt:Kết nối(function()
        S.ClearEmbedsUnder(box) -- return frame con về ScreenGui gốc + abort hosting
        pcall(function() box:Destroy() end)
        S.parkCount = math.max(0, S.parkCount - 1)
        pcall(function() S.parkTab.CanvasSize = UDim2.new(0, 0, 0, S.parkCount * 246 + 10) end)
        pcall(function()
            Nếu S.parkBtn thì S.parkBtn.Text = S.parkCount > 0
                và ("🧩 GUI Ngoài (" .. S.parkCount .. ")") hoặc "🧩 GUI Ngoài" cuối
        kết thúc)
    kết thúc)

    khu vực cục bộ = Mới("Khung", {
        Tên = "ParkArea", Kích thước = UDim2.new(1, -8, 1, -30), Vị trí = UDim2.new(0, 4, 0, 26),
        BackgroundTransparency = 1, BorderSizePixel = 0, ClipsDescendants = true, ZIndex = 5,
    }, hộp)
    pcall(function() S.parkTab.CanvasSize = UDim2.new(0, 0, 0, S.parkCount * 246 + 10) end)
    pcall(function()
        if S.parkBtn then S.parkBtn.Text = "🧩 GUI Ngoài (" .. S.parkCount .. ")" end
    kết thúc)
    khu vực trả hàng, hộp
kết thúc

S.NO_PARK_MARKERS = {
    "dex.lua", "dex explorer", "dexexplorer", "infiniteyield", "infinite yield",
    "Điệp viên đơn giản", "gián điệp đơn giản",
}
hàm S.ShouldSkipPark(code, name)
    local hay = (tostring(code or "") .. "\n" .. tostring(name or "")):lower()
    for _, m in ipairs(S.NO_PARK_MARKERS) do
        if hay:find(m, 1, true) then return true, m end
    kết thúc
    local code_l = tostring(code or ""):lower()
    local hasFetch = code_l:find("httpget", 1, true) or code_l:find("http_request", 1, true)
        hoặc code_l:find("request(", 1, true) hoặc code_l:find("https://", 1, true)
        hoặc code_l:find("http://", 1, true)
    nếu hasFetch và (code_l:find("loadstring", 1, true) hoặc code_l:find("load(", 1, true)) thì
        return true, "tải tập lệnh từ mạng (sang GUI ngoài màn hình như thiết kế tác giả)"
    kết thúc
    trả về false, nil
kết thúc

hàm S.RemoveAllParked()
    if not (S.parkList and S.parkList.Parent) then return 0 end
    cục bộ n = 0
    trẻ em địa phương = S.parkList:GetChildren()
    for i = #kids, 1, -1 do
        hộp cục bộ = trẻ em[i]
        nếu box.Name:sub(1, 8) == "ParkBox_" thì
            S.ClearEmbedsUnder(box)
            pcall(function() box:Destroy() end)
            n ± 1
        kết thúc
    kết thúc
    S.parkCount = 0
    pcall(function() S.parkTab.CanvasSize = UDim2.new(0, 0, 0, 10) end)
    pcall(function() if S.parkBtn then S.parkBtn.Text = "🧩 GUI Bên" end end)
    trả về n
kết thúc

hàm S.BeginRunCapture()
    if not S.embedEnabled then return nil end
    if S.parkCodeGuis == false then return nil end
    cục bộ ok, cap = pcall(function()
        local unhook, recs, st = S.HookInstanceNew()
        local stopWatch = S.WatchNewGuis(recs, st)
        st.stopWatch = đồng hồ bấm giờ
        return {unhook = unhook, recs = recs, st = st, stopWatch = stopWatch, parked = 0, names = {}}
    kết thúc)
    Nếu không ổn thì trả về nil.
    S.activeCap = cap -- để Cancel() được gỡ bỏ hook+watcher nếu người dùng nhấn ⏹ Dừng giữa chừng
    nắp trả lại
kết thúc

hàm S.AbortRunCapture()
    giới hạn cục bộ = S.activeCap
    nếu không phải là cap thì trả về false end
    S.activeCap = nil
    pcall(function() if cap.st then cap.st.watchOn = false cap.st.inRun = false end end)
    pcall(cap.stopWatch)
    pcall(cap.unhook)
    trả về giá trị đúng
kết thúc

hàm S.EndRunCapture(cap, label)
    nếu không phải là cap thì trả về 0 kết thúc
    local st, recs = cap.st, cap.recs
    pcall(function()
        st.inRun = false
        st.graceUntil = os.clock() + 1.0
    kết thúc)

    hàm cục bộ try()
        if cap.parked >= S.PARK_MAX or not S.embedEnabled then return 0 end
        cục bộ được thêm vào = 0
        for _, r in ipairs(recs) do
            nếu cap.parked >= S.PARK_MAX thì dừng lại.
            nếu r và r.inst và không phải r.embedded thì
                quỹ tín thác địa phương
                Nếu r.certain thì trust = "certain"
                elseif r.duringRun then trust = "manual"
                Ngược lại, tin tưởng = "đoán" kết thúc
                nếu S.IsEmbeddable(r.inst, nil, trust) thì
                    khu vực địa phương, hộp = S.ParkHost(nhãn)
                    nếu area và S.EmbedGui(r.inst, area) thì
                        r.embedded = true
                        cap.parked += 1
                        cap.names[#cap.names + 1] = tostring(r.inst.Name)
                        đã thêm ± 1
                        pcall(function()
                            print(string.format("[BananaCatHub] 🧩 đã đưa GUI '%s' vào tab 'GUI Ngoài' (tập lệnh chạy ở tab Code)",
                                tostring(r.inst.Name)))
                        kết thúc)
                    nếu hộp thì
                        pcall(function() box:Destroy() end) -- không được nhúng -> do để ô trống
                        S.parkCount = math.max(0, S.parkCount - 1)
                    kết thúc
                kết thúc
            kết thúc
        kết thúc
        trả lại đã thêm
    kết thúc

    tổng cục bộ = thử()
    for _, d in ipairs(S.EMBED_TRY_DELAYS) do
        task.delay(d, function()
            nếu cap.parked >= S.PARK_MAX thì trả về end
            nếu không phải S.embedEnabled thì trả về end
            thử()
        kết thúc)
    kết thúc
    task.delay(S.EMBED_HOOK_GRACE, function()
        pcall(cap.unhook)
        pcall(cap.stopWatch)
        if S.activeCap == cap then S.activeCap = nil end
    kết thúc)
    pcall(function()
        print("[BananaCatHub] ► tab Code · " .. S.DiagText(st, recs) .. " · đưa vào menu: " .. cap.parked)
    kết thúc)
    tổng số tiền hoàn trả
kết thúc

hàm cục bộ RunFeatureScript(code, name, containerFrame, indicator, statusLabel)
    nếu #code == 0 thì
        if statusLabel thì statusLabel.Text = "⚠️ Vui lòng nhập mã!" kết thúc
        trả về false, "rỗng"
    kết thúc

    mã = Chuẩn hóa mã(mã)
    S.EnsureCompat() -- v4.7: tab ➕ Tính Năng cũng được bù đắp thiếu chức năng thi hành

    nếu chỉ báo thì indicator.BackgroundColor3 = C.RED
    if statusLabel then statusLabel.Text = "⏳ Đang thực thi..." end
    ReleaseHubFocus() -- v4.4b: đang dán code trong TextBox mà chạy luôn thì game vẫn "khóa" input

    local ft = S.FindFeatureByHost(containerFrame)
    if ft then ft.records = nil end -- lần chạy mới -> bỏ danh sách GUI của lần chạy cũ

    local embedCount, lateCandidate = 0, 0
    local featureUnhook, records, lastWhy, hookState = nil, nil, nil, nil
    cục bộ ok, err = pcall(function()
        local fn, lerr = loadstring(code)
        if not fn then error("loadstring thất bại: "..tostring(lerr)) end

        cục bộ beforeGuis = {}
        for _, g in ipairs(playerGui:GetChildren()) do beforeGuis[g] = true end
        for _, g in ipairs(targetGui:GetChildren()) do beforeGuis[g] = true end
        pcall(function()
            for _, g in ipairs(game:GetService("CoreGui"):GetChildren()) do beforeGuis[g] = true end
        kết thúc)

        local unhook, recs, st = S.HookInstanceNew()
        local stopWatch = S.WatchNewGuis(recs, st)
        st.stopWatch = đồng hồ bấm giờ
        featureUnhook, record, hookState = unhook, recs, st
        if ft then ft.records = recs ft.hookState = st end

        cục bộ fnOk, fnErr = pcall(fn)

        st.inRun = false
        st.graceUntil = os.clock() + 1.0

        local hookWorks = (st.available == true)
        local useScan = (not hookWorks) or (S.embedGuessNew == true)
        chế độ cục bộ = (S.embedGuessNew == true) và "bất kỳ" hoặc "chạy"

        for i = 1, S.EMBED_CHILD_WAIT do
            nếu sử dụng quét thì
                local found = ScanNewGuis(beforeGuis, nil, true)
                for _, g in ipairs(found) do
                    local now = os.clock()
                    recs[#recs + 1] = {
                        inst = g, certain = false,
                        duringRun = (st.inRun == true) or (now < (st.graceUntil or 0)),
                        tuổi = hiện tại - st.t0, nhúng = false, thông qua = "quét",
                    }
                kết thúc
            kết thúc
            local d, why = S.EmbedRecorded(recs, containerFrame, useScan and "any" or mode, true)
            embedCount += d
            nếu tại sao thì lastWhy = tại sao kết thúc
            nếu embedCount > 0 thì thoát
            task.wait(0.2)
        kết thúc

        nếu embedCount > 0 thì
            unhook()
            pcall(stopWatch)
        khác
            task.delay(S.EMBED_HOOK_GRACE, function() pcall(unhook) pcall(stopWatch) end)
        kết thúc

        nếu không phải fnOk thì báo lỗi (fnErr) kết thúc

        for _, dly in ipairs(S.EMBED_TRY_DELAYS) do
            task.delay(dly, function()
                nếu embedCount > 0 thì trả về end
                if not (containerFrame and containerFrame.Parent) then return end
                nếu không phải S.embedEnabled thì trả về end
                nếu sử dụng quét thì
                    local found = ScanNewGuis(beforeGuis, nil, true)
                    for _, g in ipairs(found) do
                        local now = os.clock()
                        recs[#recs + 1] = {
                            inst = g, certain = false, duringRun = false,
                            tuổi = hiện tại - st.t0, nhúng = false, thông qua = "quét",
                        }
                    kết thúc
                kết thúc
                local more = S.EmbedRecorded(recs, containerFrame, "any", true)
                nếu lớn hơn 0 thì
                    embedCount += more
                    pcall(function()
                        if indicator and indicator.Parent then indicator.BackgroundColor3 = C.GREEN end
                        nếu statusLabel và statusLabel.Parent thì
                            statusLabel.Text = string.format(
                                " ✅ xong · GUI sinh học đã được nhúng vào tab (%d) — nhấn ✕ để trả về màn hình trò chơi",
                                embedCount)
                        kết thúc
                    kết thúc)
                kết thúc
            kết thúc)
        kết thúc

        nếu embedCount == 0 thì
            local late = ScanNewGuis(beforeGuis, nil, true)
            thực cục bộ = 0
            for _, g in ipairs(late) do
                if g.Parent and not g:IsDescendantOf(containerFrame) then real += 1 end
            kết thúc
            nếu real > 0 thì lateCandidate = real end
        kết thúc
    kết thúc)

    nếu embedCount > 0 thì
        if featureUnhook then pcall(featureUnhook) end
        pcall(function() nếu hookState và hookState.stopWatch thì kết thúc hookState.stopWatch())
    kết thúc
    nếu ft thì
        ft.records = record -- giữ lại để MỞ tab / press 🔁 được nhúng tiếp theo
        ft.lastWhy = lastWhy
        ft.indicator = chỉ báo
        ft.hookState = hookState
    kết thúc
    pcall(function()
        print("[BananaCatHub] ▶ '" .. tostring(name) .. "' · " .. S.DiagText(hookState, records)
            .. " · đã nhúng: " .. embedCount)
    kết thúc)

    nếu được thì
        nếu chỉ báo thì indicator.BackgroundColor3 = C.GREEN
        nếu statusLabel thì
            nếu embedCount > 0 thì
                statusLabel.Text = string.format(
                    " ✅ xong · %d GUI đã được nhúng vào tab (bấm ✕ để trả về màn hình trò chơi)", embedCount)
            nếu không phải S.embedEnabled thì
                statusLabel.Text = " ✅ xong · 🧩 nhúng đang TẮT, GUI nằm ngoài màn hình — BẬT lại rồi nhấn ►"
            nếu hookState và hookState.available ~= true thì
                statusLabel.Text = "⚠️ Executor CHẶN hook Instance.new — hub đã sử dụng chế độ quét dự phòng"
                    .. (lateCandidate > 0 and (" (thấy " .. LateCandidate .. " GUI mới)") hoặc " (không tìm thấy GUI mới nào)")
                    .. " · nhấn 🔁 'Cứu GUI' ở tab Tạo Tính Năng để ép nhúng · chi tiết ở console (F9)"
            nếu lateCandidate > 0 thì
                statusLabel.Text = string.format(
                    " ✅ xong · đã tìm thấy %d mới GUI nhưng chưa được nhúng — MỞ lại tab này hoặc nhấn 🔁 'Cứu GUI'%s",
                    LateCandidate, (S.embedGuessNew == true) và "" hoặc " · hoặc bật 🕵 'Đoán GUI đ'")
            khác
                statusLabel.Text = " ✅ xong · không tìm thấy tập lệnh tạo GUI nào (tập lệnh có tạo ScreenGui không?)"
                    .. (lastWhy và (" · lý do: " .. tostring(lastWhy)) hoặc "")
            kết thúc
        kết thúc
        trả về true, nil, records
    khác
        nếu chỉ báo thì indicator.BackgroundColor3 = C.RED
        if statusLabel then statusLabel.Text = "❌ Lỗi: "..tostring(err) end
        cảnh báo("[BananaCatHub] Lỗi kịch bản tính năng:", err)
        trả về false, lỗi, bản ghi
    kết thúc
kết thúc
hàm cục bộ CreateFeatureTab(name, icon, codeContent)
    if not name or #name == 0 then name = "Tính Năng " .. (#featureTabs + 1) end
    if not icon or #icon == 0 then icon = "⚙️" end

    codeContent = NormalizeCode(codeContent)

    dữ liệu tính năng cục bộ

    local sf = MakeTabFrame()
    local btn = MakeTabButton(name, icon, featureTabIndex + #featureTabs, function()
        task.defer(function() S.OnFeatureTabOpened(featureData) end)
    kết thúc)

    table.insert(tabs, btn)
    table.insert(tabContent, sf)
    tabBar.CanvasSize = UDim2.new(0, 0, 0, #tabs * 44 + 10)

    local tabIdx = #tabs

    featureData = {
        tên = tên,
        biểu tượng = biểu tượng,
        mã = nội dung mã,
        nút = nút,
        khung = sf,
        tabIdx = tabIdx,
    }
    table.insert(featureTabs, featureData)

    local embedHost = New("Frame", {
        Kích thước = UDim2.new(1,0,1,-36),
        Vị trí = UDim2.new(0,0,0,0),
        Độ trong suốt của nền = 1,
        BorderSizePixel = 0,
        Chỉ số Z = 5,
        Tên = "ScriptHost",
        Hiển thị = đúng,
    }, sf)
    featureData.hostFrame = embedhost -- v4.4g

    thanh công cụ cục bộ = Mới("Khung", {
        Kích thước = UDim2.new(1,0,0,36),
        Vị trí = UDim2.new(0,0,1,-36),
        BackgroundColor3 = Color3.fromRGB(230,233,242),
        Độ trong suốt của nền = 0.1,
        BorderSizePixel = 0,
        Chỉ số Z = 20,
    }, sf)
    Góc(thanh công cụ, UDim.new(0,6))
    Stroke(toolbar, Color3.fromRGB(180,185,200), 1)

    local runFeatureBtn = New("TextButton", {
        Kích thước=UDim2.new(0,90,0,26), Vị trí=UDim2.new(0,6,0,5),
        Văn bản="▶ Chạy Script", Màu nền 3=XANH LÁ CÂY, Độ trong suốt nền=0.1,
        TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=21,
    }, thanh công cụ)
    Góc(runFeatureBtn, UDim.new(0,5))

    local saveFeatureBtn = New("TextButton", {
        Kích thước=UDim2.new(0,84,0,26), Vị trí=UDim2.new(0,100,0,5),
        Văn bản="📤 Mã giảm giá", Màu nền 3 = Xanh lam, Độ trong suốt nền = 0.1,
        TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=21,
    }, thanh công cụ)
    Góc(saveFeatureBtn, UDim.new(0,5))

    local editFeatureBtn = New("TextButton", {
        Kích thước=UDim2.new(0,52,0,26), Vị trí=UDim2.new(0,188,0,5),
        Văn bản="✏️ Sửa", Màu nền 3 = Cam, Độ trong suốt nền = 0.1,
        TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=21,
    }, thanh công cụ)
    Góc(editFeatureBtn, UDim.new(0,5))

    local crosshairBtn = New("TextButton", {
        Kích thước=UDim2.new(0,68,0,26), Vị trí=UDim2.new(0,244,0,5),
        Văn bản="🎯 Tâm", Màu nền 3=Tím nhạt, Độ trong suốt nền=0.1,
        TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=21,
    }, thanh công cụ)
    Góc(crosshairBtn, UDim.new(0,5))
    S.RegisterCrosshairBtn(crosshairBtn)

    local closeFeatureBtn = Mới("TextButton", {
        Kích thước=UDim2.new(0,40,0,26), Vị trí=UDim2.new(1,-46,0,5),
        Văn bản="✕", Màu nền 3=Đỏ, Độ trong suốt nền=0.1,
        TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=12, BorderSizePixel=0, ZIndex=21,
    }, thanh công cụ)
    Góc(closeFeatureBtn, UDim.new(0,5))

    local fStatus = New("TextLabel", {
        Kích thước=UDim2.new(1,-52-316,0,26), Vị trí=UDim2.new(0,316,0,5),
        Văn bản="", Độ trong suốt nền=1, Màu văn bản3=Màu3.fromRGB(255, 205, 64),
        Font=Enum.Font.GothamMedium, TextSize=8, TextXAlignment=Enum.TextXAlignment.Left,
        TextTruncate=Enum.TextTruncate.AtEnd, ZIndex=21,
    }, thanh công cụ)
    featureData.status = fStatus -- v4.4g: hub tự sửa nhãn khi nhúng địu thành công

    local editorFrame = New("Frame", {
        Kích thước = UDim2.new(1, 0, 1, -36),
        Vị trí = UDim2.new(0,0,0,0),
        BackgroundColor3=Color3.fromRGB(245,247,252),
        Độ trong suốt nền = 0,
        BorderSizePixel=0,
        Chỉ số Z = 30,
        Hiển thị = false,
    }, sf)

    local editorBox = New("TextBox", {
        Kích thước=UDim2.new(1,-16,1,-70), Vị trí=UDim2.new(0,8,0,8),
        Văn bản=codeContent,
        PlaceholderText="Dán script hoàn chỉnh HOẶC link raw vào đây...\nScript có thể tạo GUI riêng, GUI sẽ được nhúng vào tab này.",
        PlaceholderColor3=Color3.fromRGB(122, 130, 148),
        BackgroundColor3=Color3.fromRGB(26, 29, 38), BackgroundTransparency=0,
        TextColor3=Color3.fromRGB(233, 237, 245),
        Font=Enum.Font.Code, TextSize=11, BorderSizePixel=0, ClearTextOnFocus=false,
        MultiLine=true, TextWrapped=true, TextXAlignment=Enum.TextXAlignment.Left, TextYAlignment=Enum.TextYAlignment.Top,
        Active=true, Selectable=true, ZIndex=31,
    }, editorFrame)
    Góc(editorBox, UDim.new(0,5))
    Stroke(editorBox, Color3.fromRGB(100,120,200), 1.5)
    New("UIPadding", {PaddingLeft=UDim.new(0,6), PaddingTop=UDim.new(0,4)}, editorBox)

    local applyEditBtn = New("TextButton", {
        Kích thước=UDim2.new(0,120,0,26), Vị trí=UDim2.new(0,8,1,-34),
        Text=" ✅ Áp Dụng", BackgroundColor3=C.GREEN, BackgroundTransparency=0.1,
        TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=31,
    }, editorFrame)
    Góc(applyEditBtn, UDim.new(0,5))

    local cancelEditBtn = New("TextButton", {
        Kích thước=UDim2.new(0,120,0,26), Vị trí=UDim2.new(0,134,1,-34),
        Văn bản="❌", Màu nền 3=Đỏ, Độ trong suốt nền=0.1,
        TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=31,
    }, editorFrame)
    Góc(cancelEditBtn, UDim.new(0,5))

    hàm cục bộ ClearHost()
        S.ClearEmbedsUnder(embedHost)
    kết thúc

    runFeatureBtn.Activated:Connect(function()
        ClearHost()
        fStatus.Text = "⏳ Đang chạy..."
        RunFeatureScript(codeContent, name, embedHost, runFeatureBtn, fStatus)
    kết thúc)

    saveFeatureBtn.Activated:Connect(function()
        cục bộ c = codeContent
        nếu #c == 0 thì
            fStatus.Text = "⚠️ Không có mã!"
            trở lại
        kết thúc
        cục bộ n = tên
        cục bộ bn = n
        số lượng cục bộ = 1
        trong khi đúng vậy
            cục bộ ex = false
            for _, s in ipairs(scripts) do
                if s.name == n then ex = true; break end
            kết thúc
            nếu không phải ex thì dừng lại
            cnt ± 1
            n = bn.." ("..cnt..")"
        kết thúc
        table.insert(scripts, {name = n, code = c, expanded = false})
        nếu RebuildScripts thì RebuildScripts() kết thúc
        Store.saveSoon()
        fStatus.Text = " ✅ Đã sao chép sang tab Code!"
    kết thúc)

    editFeatureBtn.Activated:Connect(function()
        editorBox.Text = codeContent
        editorFrame.Visible = true
    kết thúc)

    applyEditBtn.Activated:Connect(function()
        codeContent = NormalizeCode(editorBox.Text)
        featureData.code = codeContent
        editorFrame.Visible = false
        ClearHost()
        Store.saveSoon() -- code đã thay đổi thì bản lưu trên đĩa cũng phải thay đổi theo
        fStatus.Text = "✏️ Đã cập nhật mã"
    kết thúc)

    cancelEditBtn.Activated:Connect(function()
        editorFrame.Visible = false
    kết thúc)

    closeFeatureBtn.Activated:Connect(function()
        ClearHost()
        OpenFirstPage() -- v4.6.2: đóng tab tính năng thì về trang đầu (💾 Code Đã Lưu)
    kết thúc)

    trả về dữ liệu tính năng
kết thúc

task.spawn(function()
    task.wait(1)
    local lastSize = main.AbsoluteSize
    trong khi main và main.Parent thực hiện
        task.wait(0.15)
        nếu main.AbsoluteSize ~= lastSize thì
            lastSize = main.AbsoluteSize
            nếu #S.embeds > 0 thì
                S.SyncAllEmbeds()
            kết thúc
            S.PruneEmbeds()
            nếu _G.BananaCatHub_EmbedHosts thì
                for i = #_G.BananaCatHub_EmbedHosts, 1, -1 do
                    máy chủ cục bộ = _G.BananaCatHub_EmbedHosts[i]
                    nếu không phải máy chủ hoặc không phải máy chủ.Cha thì
                        table.remove(_G.BananaCatHub_EmbedHosts, i)
                    kết thúc
                kết thúc
            kết thúc
        kết thúc
    kết thúc
kết thúc)

local createFeatureTab = AddTab("Tạo Năng", "➕", 7) -- v4.15: 6 -> 7 (👥 chen vào ô 4)

cy cục bộ = 8
Label(createFeatureTab, "➕ Tạo Tab Năng Tính Tích Hợp", cy)
cy = cy + 16
Label(createFeatureTab, "Dán NGUYÊN an script HOẶC link raw.", cy)
cy = cy + 14
Label(createFeatureTab, "Chạy tập lệnh trong tab; GUI của NÓ được nhúng vào menu (không đụng đến trò chơi GUI).", cy)
cy = cy + 14
Label(createFeatureTab, "💾 Tab tạo ra TỰ ĐỘNG được lưu — vẫn thoát game vào lại, thoát khỏi cần nhấn thêm gì.", cy)
cy = cy + 14
Label(createFeatureTab, "🧩 Nhấn 🎯 Chạy tập lệnh xong nhớ nhấn ✕ hoặc kéo menu ra — hub auto-free focus", cy)
cy = cy + 14
Label(createFeatureTab, " để bạn quay chuột/bắn lại bình thường. Nếu script vẫn sử dụng chuột: 🧩 TẮT nhúng.", cy)
cy = cy + 18

Label(createFeatureTab, "🏷️ Tên Tính:", cy)
cy = cy + 14

local featureNameIn = New("TextBox", {
    Kích thước=UDim2.new(1,-16,0,26), Vị trí=UDim2.new(0,8,0,cy), Văn bản="",
    PlaceholderText="VD: Tự động canh tác, Bay, Tốc độ...",
    PlaceholderColor3=Color3.fromRGB(122, 130, 148),
    BackgroundColor3=Color3.fromRGB(26, 29, 38), BackgroundTransparency=0, TextColor3=Color3.fromRGB(233, 237, 245),
    Font=Enum.Font.GothamMedium, TextSize=12, BorderSizePixel=0, ClearTextOnFocus=false,
    Active=true, Selectable=true, ZIndex=10, TextXAlignment=Enum.TextXAlignment.Left,
}, createFeatureTab)
Góc(featureNameIn, UDim.new(0,5))
Stroke(featureNameIn, Color3.fromRGB(100,120,200), 1.5)
New("UIPadding", {PaddingLeft=UDim.new(0,6)}, featureNameIn)

cy = cy + 32
Label(createFeatureTab, "🎨 Icon (1 ký tự, tùy chọn):", cy)
cy = cy + 14

local featureIconIn = New("TextBox", {
    Kích thước=UDim2.new(0,60,0,26), Vị trí=UDim2.new(0,8,0,cy), Văn bản="⚙️",
    PlaceholderColor3=Color3.fromRGB(122, 130, 148),
    BackgroundColor3=Color3.fromRGB(26, 29, 38), BackgroundTransparency=0, TextColor3=Color3.fromRGB(233, 237, 245),
    Font=Enum.Font.GothamBold, TextSize=14, BorderSizePixel=0, ClearTextOnFocus=false,
    Active=true, Selectable=true, ZIndex=10,
}, createFeatureTab)
Góc(featureIconIn, UDim.new(0,5))
Stroke(featureIconIn, Color3.fromRGB(180,180,200), 1.2)

cy = cy + 32
Label(createFeatureTab, "📜 Dán Script Hoàn Chỉnh HOẶC link raw:", cy)
cy = cy + 14

local featureCodeIn = New("TextBox", {
    Kích thước=UDim2.new(1,-16,0,140), Vị trí=UDim2.new(0,8,0,cy), Văn bản="",
    PlaceholderText="Dán script hoặc link raw (https://...) vào đây...\nScript có thể tạo riêng ScreenGui, GUI sẽ được nhúng vào tab.",
    PlaceholderColor3=Color3.fromRGB(122, 130, 148),
    BackgroundColor3=Color3.fromRGB(28, 31, 41), BackgroundTransparency=0, TextColor3=Color3.fromRGB(233, 237, 245),
    Font=Enum.Font.Code, TextSize=11, BorderSizePixel=0, ClearTextOnFocus=false,
    MultiLine=true, TextWrapped=true, TextXAlignment=Enum.TextXAlignment.Left, TextYAlignment=Enum.TextYAlignment.Top,
    Active=true, Selectable=true, ZIndex=10,
}, createFeatureTab)
Góc(featureCodeIn, UDim.new(0,5))
Stroke(featureCodeIn, Color3.fromRGB(100,120,200), 1.5)
New("UIPadding", {PaddingLeft=UDim.new(0,6), PaddingTop=UDim.new(0,4)}, featureCodeIn)

cy = cy + 146

local createTabBtn = Button(createFeatureTab, "➕ Tạo Tab Tính Năng", 8, cy, 210, 28, Color3.fromRGB(0,150,200))
local clearFormBtn = Button(createFeatureTab, "🧹 Form", 224, cy, 116, 28, C.ORANGE)
cy = cy + 34

local embedToggleBtn = Button(createFeatureTab, "🧩 Nhúng vào Tab: BẬT", 346, cy - 34, 130, 28, C.GREEN)
local GuessToggleBtn = Button(createFeatureTab, "🕵 Đoán GUI: TẮT", 8, cy, 176, 26, C.GRAY)
local GrabSizeCodeBtn = Button(createFeatureTab, "📏 Code Tự Co Giãn (an toàn, Auto-Lưu)", 190, cy, 286, 26, C.PURPLE)
cy = cy + 34
local fixMouseBtn = Button(createFeatureTab, "🖱 Kẹt chuột / không được ấn? Bấm vào đây", 8, cy, 468, 24, C.RED)
cy = cy + 30
local copyTemplateBtn = Button(createFeatureTab, "📋 Copy Code Mẫu Cho AI (menu + Kiểm tâm)", 8, cy, 468, 26, C.BLUE)
cy = cy + 32

S.reembedBtn = Button(createFeatureTab,
    "🔁 Cứu GUI: nhúng lại GUI của tab ĐANG MỞ vào menu", 8, cy, 468, 26, C.BLUE)
cy = cy + 32

S.parkToggleBtn = Button(createFeatureTab,
    "🪟 GUI chạy ở tab 💻 Code → đưa vào menu: BẬT", 8, cy, 468, 26, C.GREEN)
cy = cy + 32

S.SyncEmbedToggles = function()
    pcall(function() if D.SyncPageChips then D.SyncPageChips() end end) -- v4.5: chip trên trang tiêu đề
    pcall(function()
        embedToggleBtn.Text = S.embedEnabled và "🧩 Nhúng vào Tab: BẬT" hoặc "🧩 Nhúng vào Tab: TẮT"
        D.SetBg(embedToggleBtn, S.embedEnabled and C.GREEN or C.GRAY) -- v4.5
        đoánToggleBtn.Text = (S.embedGuessNew == true) và "🕵Đoán GUI: BẬT" hoặc "🕵Đoán GUI: TẮT"
        D.SetBg(guessToggleBtn, (S.embedGuessNew == true) and C.ORANGE or C.GRAY) -- v4.5
        nếu S.parkToggleBtn thì
            cục bộ bật = (S.parkCodeGuis ~= false)
            S.parkToggleBtn.Text = bật và "🪟 GUI chạy ở tab 💻 Mã → menu đưa vào: BẬT"
                                     hoặc "🪟 GUI chạy ở tab 💻 Code → để ngoài màn hình: BẮT ĐẦU"
            D.SetBg(S.parkToggleBtn, on and C.GREEN or C.GRAY)
        kết thúc
    kết thúc)
kết thúc
S.SyncEmbedToggles()

local createStatus = Label(createFeatureTab, "", cy)
createStatus.TextColor3=C.YELLOW; createStatus.TextSize=9; createStatus.ZIndex=6
cy = cy + 14

S.DoToggleEmbed = function()
    S.embedEnabled = không phải S.embedEnabled
    nếu S.embedEnabled thì
        embedToggleBtn.Text = "🧩 Nhúng vào Tab: BẬT"
        D.SetBg(embedToggleBtn, C.GREEN)
        createStatus.Text = "🧩 BẬT: GUI của tập lệnh được mượn vào tab. Nhấn ✕ trên tab để trả về như cũ."
    khác
        embedToggleBtn.Text = "🧩 Nhúng vào Tab: BẮT ĐẦU"
        D.SetBg(embedToggleBtn, C.GRAY)
        for _, ft in ipairs(featureTabs) do
            local hostFrame = ft.frame and ft.frame:FindFirstChild("ScriptHost")
            if hostFrame then S.ClearEmbedsUnder(hostFrame) end
        kết thúc
        S.PruneEmbeds()
        createStatus.Text = "🛡 Chế độ an toàn: hub không sửa GUI nữa. Muốn nhúng lại thì nhấn BẬT."
    kết thúc
    Store.saveSoon() -- v4.4g: lưu trạng thái 🧩 xuống đĩa -> thoát game vào lại vẫn được giữ
    pcall(function() if Store.refreshStatus then Store.refreshStatus() end end)
kết thúc
embedToggleBtn.Activated:Connect(S.DoToggleEmbed)

S.DoToggleGuess = function()
    S.embedGuessNew = not (S.embedGuessNew == true)
    nếu S.embedGuessNew thì
        đoánToggleBtn.Text = "🕵Đoán GUI: BẬT"
        D.SetBg(guessToggleBtn, C.ORANGE)
        createStatus.Text = "🕵 BẬT: script tạo GUI mút (sau HttpGet/task.wait) sẽ được nhúng — tiện hơn"
            .. " Nhưng nếu game cũng vừa mở UI đúng lúc thì UI đó có thể được mượn vào tab (bấm ✕ để trả)."
    khác
        đoánToggleBtn.Text = "🕵Đo GUI đị: BẮT ĐẦU"
        D.SetBg(guessToggleBtn, C.GRAY)
        createStatus.Text = "🛡 An toàn nhất: chỉ nhúng GUI mà hub chắc chắn là tập lệnh."
            .. " Script tạo GUI sẽ chạy bình thường bên ngoài màn hình, không được nhúng."
    kết thúc
    Store.saveSoon() -- v4.4g: lưu trạng thái 🕵 xuống đĩa
kết thúc
guessToggleBtn.Activated:Connect(S.DoToggleGuess)

S.DoTogglePark = function()
    S.parkCodeGuis = (S.parkCodeGuis == false) -- đảo trạng thái
    S.SyncEmbedToggles()
    nếu S.parkCodeGuis == false thì
        local n = S.RemoveAllParked() -- hoàn tác ngay: trả GUI về màn hình trò chơi
        createStatus.Text = "🪟 BẮT ĐẦU: script chạy ở tab 💻 Code / 💾 Code Đã lưu sẽ để GUI NGOÀI màn hình trò chơi"
            .. (n > 0 and (" · đã trả " .. n .. " GUI về màn hình") hoặc "")
            .. " · tab ➕ Tính Năng vẫn nhúng GUI vào tab như bình thường."
    khác
        createStatus.Text = "🪟 BẬT: GUI của tập lệnh chạy ở tab 💻 Mã sẽ được đưa vào tab '🧩 GUI Ngoài'"
            .. " (mỗi GUI có nút ↩ trả về màn hình). Dex/IY/SimpleSpy vẫn LUÔN ở ngoài màn hình trò chơi."
    kết thúc
    Store.saveSoon() -- lưu xuống đĩa: thoát trò chơi vào lại vẫn giữ lựa chọn này
kết thúc
S.parkToggleBtn.Activated:Connect(S.DoTogglePark)

grabSizeCodeBtn.Activated:Connect(function()
    local currentCode = featureCodeIn.Text
    nếu #currentCode == 0 thì
        createStatus.Text = "⚠️ Ô code đang trống, không có gì để lấy!"
        trở lại
    kết thúc

    local wrappedCode = [[
local _FIT_WRAPPER = true
local _bcRealNew = Instance.new
cục bộ _bcMine = {}
local _bcHookOn = true
pcall(function()
    Instance.new = function(cls, ...)
        local inst = _bcRealNew(cls, ...)
        if _bcHookOn and cls == "ScreenGui" then _bcMine[#_bcMine + 1] = inst end
        trả lại inst
    kết thúc
kết thúc)

]] .. currentCode .. [[

pcall(function() _bcHookOn = false; Instance.new = _bcRealNew end)

task.delay(4, function()
    pcall(function() _bcHookOn = false; Instance.new = _bcRealNew end)
kết thúc)

task.defer(function()
    task.wait(0.4)
    trung tâm cục bộ = nil
    pcall(function()
        local hubGui = (gethui and gethui()) or game:GetService("Players").LocalPlayer:FindFirstChildOfClass("PlayerGui")
        hub = hubGui và hubGui:FindFirstChild("ExMenu") và hubGui.ExMenu:FindFirstChildWhichIsA("Frame")
        nếu không phải là trung tâm
            local pg = game:GetService("Players").LocalPlayer:FindFirstChildOfClass("PlayerGui")
            hub = pg và pg:FindFirstChild("ExMenu") và pg.ExMenu:FindFirstChildWhichIsA("Frame")
        kết thúc
    kết thúc)
    for _, g in ipairs(_bcMine) do
        pcall(function()
            nếu không phải g hoặc không phải g.Parent thì trả về end
            gốc cục bộ = g:TìmConĐầuLàMột("Khung")
                hoặc g:FindFirstChildWhichIsA("ScrollingFrame")
                hoặc g:FindFirstChildWhichIsA("GuiObject")
            nếu không phải là root thì trả về end
            if root.Size and (root.Size.X.Scale ~= 0 or root.Size.Y.Scale ~= 0) then return end
            local us = root:FindFirstChild("BananaCatFitScale")
            nếu không phải chúng ta thì
                us = _bcRealNew("UIScale")
                us.Name = "BananaCatFitScale"
                chúng ta.Cha mẹ = gốc
            kết thúc
            nếu là trung tâm thì
                hàm cục bộ _bcSync()
                    us.Scale = math.clamp(hub.AbsoluteSize.X / 540, 0.8, 1.6)
                kết thúc
                _bcSync()
                hub:GetPropertyChangedSignal("AbsoluteSize"):Connect(function()
                    pcall(_bcSync)
                kết thúc)
            kết thúc
        kết thúc)
    kết thúc
kết thúc)
]]

    local saveName = "AutoSize_"..os.date("%H%M%S")
    local bn = saveName
    số lượng cục bộ = 1
    trong khi đúng vậy
        cục bộ ex = false
        for _, s in ipairs(scripts) do
            if s.name == saveName then ex = true; break end
        kết thúc
        nếu không phải ex thì dừng lại
        cnt ± 1
        saveName = bn.." ("..cnt..")"
    kết thúc

    table.insert(scripts, {name = saveName, code = wrappedCode, expanded = false})
    nếu RebuildScripts thì RebuildScripts() kết thúc
    Store.saveSoon()

    createStatus.Text = " ✅Đã lưu bản tự động co giãn vào tab 'Code Đã Lưu': "..saveName..
        " · Để tab tính năng co giãn theo menu thì KHÔNG cần bản này, hub sẽ tự động làm khi ấn vào ► Chạy Script."
kết thúc)

S.DoFixMouse = function()
    cục bộ đã hoàn thành = {}
    ReleaseHubFocus()
    đã xong[#done+1] = "nhả tập trung"
    cục bộ được khôi phục = 0
    for _, ft in ipairs(featureTabs) do
        local hostFrame = ft.frame and ft.frame:FindFirstChild("ScriptHost")
        if hostFrame then restored = restored + S.ClearEmbedsUnder(hostFrame) end
    kết thúc
    nếu được khôi phục > 0 thì done[#done+1] = "đã trả " .. được khôi phục .. " GUI về game" end
    for _, e in ipairs(S.embeds) do
        pcall(function() e.host.Visible = e.gui.Enabled end)
    kết thúc
    pcall(function() UserInputService.MouseBehavior = Enum.MouseBehavior.Default end)
    done[#done+1] = "chuột về mặc định"
    createStatus.Text = "🖱 " .. table.concat(done, " · ")
        .. " — vẫn không được? 🧩 KHẮC nhúng rồi ấn vào ► lại (lúc đó hub không xâm phạm GUI nào)"
    return table.concat(done, " · ")
kết thúc
fixMouseBtn.Activated:Connect(S.DoFixMouse)

S.reembedBtn.Activated:Connect(function()
    ReleaseHubFocus()
    local ft = S.FindActiveFeature()
    nếu không phải ft thì
        createStatus.Text = "⚠️ Hãy MỞ tab tính năng cần nghiên trước (bấm vào tab đó cho nó hiện ra) rồi nhấn 🔁."
        trở lại
    kết thúc
    nếu không phải S.embedEnabled thì
        createStatus.Text = "⚠️ 🧩 'Nhúng vào Tab' đang TẮT — BẬT lại rồi mới cứu GUI."
        trở lại
    kết thúc
    createStatus.Text = "⏳ Đang tìm GUI của '" .. ft.name .. "' để nhúng lại vào menu..."
    task.defer(function()
        local n, why = S.ReembedFeature(ft, true)
        nếu n > 0 thì
            createStatus.Text = string.format(
                " ✅ Đã nhúng lại %d GUI vào tab '%s'. Nếu nhầm lẫn một GUI khác, hãy mở tab đó nhấn ✕ để trả về.",
                n, ft.name)
            pcall(function()
                nếu ft.status và ft.status.Parent thì
                    ft.status.Text = string.format("Đã nhúng lại %d GUI vào tab (nút 🔁 Cứu GUI)", n)
                kết thúc
                if ft.indicator and ft.indicator.Parent then ft.indicator.BackgroundColor3 = C.GREEN end
            kết thúc)
        khác
            createStatus.Text = "⚠️ Chưa được nhúng: " .. tostring(why hoặc "không rõ lý do")
                .. " · press ► Chạy lại Script rồi CHỜ 10 giây (hub tự động thử lại 5 lần) · xem bảng điều khiển (F9) để biết hook có bị chặn thực thi không."
        kết thúc
        print(string.format("[BananaCatHub] 🔁 Cứu tab GUI '%s': %d GUI đã nhúng%s",
            tostring(ft.name), n, why and (" · lý do bỏ qua: " .. tostring(why)) or ""))
    kết thúc)
kết thúc)

copyTemplateBtn.Activated:Connect(function()
    ReleaseHubFocus()
    local nm = (featureNameIn.Text or ""):gsub('[\r "]', " "):gsub("^%s+", ""):gsub("%s+$", "")
    if #nm == 0 thì nm = "Tính Năng Mới" end
    local ic = (featureIconIn.Text or ""):gsub('[\r "]', " ")
    if #ic == 0 then ic = "⚙️" end
    tem địa phương
    pcall(function() stamp = os.date("sinh %H:%M %d/%m/%Y") end)
    mã cục bộ = S.FeatureTemplate(nm, ic, stamp)

    local copied = S.CopyToClipboard(code)
    local inBox = false
    nếu #featureCodeIn.Text == 0 thì
        featureCodeIn.Text = mã
        trong hộp thư đến = đúng
    kết thúc
    local saveName = "Mẫu" .. nm
    local baseName = saveName
    số lượng cục bộ = 1
    trong khi đúng vậy
        cục bộ tồn tại = sai
        for _, sc in ipairs(scripts) do
            if sc.name == saveName then exists = true break end
        kết thúc
        nếu không tồn tại thì dừng lại
        cnt = cnt + 1
        saveName = baseName .. " (" .. cnt .. ")"
    kết thúc
    table.insert(scripts, {name = saveName, code = code, expanded = false})
    nếu RebuildScripts thì RebuildScripts() kết thúc
    Store.saveSoon()

    createStatus.Text = (đã sao chép và ("📋 ĐÃ COPY " .. #code .. " ký tự vào clipboard")
        hoặc ("⚠️ Người thực thi không có setclipboard — lấy mã ở tab 'Mã đã lưu'"))
        .. " · đã lưu '" .. saveName .. "'"
        .. (inBox and " · đã điền vào ô code" hoặc " · ô code giữ mã của bạn")
        .. " · gửi mã đoạn NGUYÊN cho AI/người viết script, dán lại rồi nhấn ► Chạy Script."
    local oldLabel = copyTemplateBtn.Text
    copyTemplateBtn.Text = " ✅ Đã sao chép mã mẫu cho: " .. nm
    task.delay(2.6, function()
        if copyTemplateBtn and copyTemplateBtn.Parent then copyTemplateBtn.Text = oldLabel end
    kết thúc)
    print("[BananaCatHub] 📋 Code mẫu '" .. nm .. "' (" .. #code .. " ký tự) — clipboard: "
        .. tostring(copied))
kết thúc)

Label(createFeatureTab, "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", cy)
cy = cy + 16
Label(createFeatureTab, "📋 Danh Sách Tab Tính Đã Tạo:", cy)
cy = cy + 16

local featureListFrame = New("Frame", {
    Kích thước=UDim2.new(1,-16,0,0), Vị trí=UDim2.new(0,8,0,cy),
    BackgroundTransparency=1, BorderSizePixel=0, ZIndex=6,
}, createFeatureTab)
New("UIListLayout", {SortOrder=Enum.SortOrder.LayoutOrder, Padding=UDim.new(0,4)}, featureListFrame)

hàm cục bộ RebuildFeatureList()
    for _, c in ipairs(featureListFrame:GetChildren()) do
        if not c:IsA("UIListLayout") then c:Destroy() end
    kết thúc

    nếu #featureTabs == 0 thì
        Mới("TextLabel", {
            Kích thước = UDim2.new(1, 0, 0, 30),
            Text="📭 Chưa có tính năng tab nào.",
            BackgroundTransparency=1, TextColor3=C.GRAY, Font=Enum.Font.GothamMedium, TextSize=10,
            TextXAlignment=Enum.TextXAlignment.Center, TextYAlignment=Enum.TextYAlignment.Center, ZIndex=7,
        }, featureListFrame)
        createFeatureTab.CanvasSize = UDim2.new(0, 0, 0, cy + 50)
        trở lại
    kết thúc

    tổng cục bộ H = 0
    for i, ft in ipairs(featureTabs) do
        hàng cục bộ = New("Khung", {
            Size=UDim2.new(1,0,0,32), BackgroundColor3=Color3.fromRGB(26, 29, 38),
            BackgroundTransparency=0.1, BorderSizePixel=0, ZIndex=6,
        }, featureListFrame)
        Góc(hàng, UDim.new(0,5)); Nét(hàng)

        Mới("TextLabel", {
            Kích thước=UDim2.new(1,-90,1,0), Vị trí=UDim2.new(0,8,0,0),
            Văn bản=ft.icon.." "..ft.name, Độ trong suốt nền=1, Màu chữ 3=C.DARK,
            Font=Enum.Font.GothamBold, TextSize=10, TextXAlignment=Enum.TextXAlignment.Left, ZIndex=7,
        }, hàng ngang)

        local goBtn = New("TextButton", {
            Kích thước=UDim2.new(0,50,0,22), Vị trí=UDim2.new(1,-78,0,5),
            Văn bản="➡ Mở", Màu nền 3 = Xanh lam, Độ trong suốt nền = 0.1,
            TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=9, BorderSizePixel=0, ZIndex=8,
        }, hàng ngang)
        Góc(goBtn, UDim.new(0,4))
        goBtn.Activated:Connect(function()
            for i, b in ipairs(tabs) do
                if b == ft.btn then SwitchTab(i); break end
            kết thúc
        kết thúc)

        local delBtn = New("TextButton", {
            Kích thước=UDim2.new(0,24,0,22), Vị trí=UDim2.new(1,-26,0,5),
            Văn bản="🗑", Màu nền 3 = Đỏ đậm, Độ trong suốt nền = 0.1,
            TextColor3=C.WHITE, Font=Enum.Font.GothamBold, TextSize=10, BorderSizePixel=0, ZIndex=8,
        }, hàng ngang)
        Góc(delBtn, UDim.new(0,4))
        delBtn.Activated:Connect(function()
            chỉ số cục bộ = nil
            for j, t in ipairs(tabs) do
                if t == ft.btn then idx = j; break end
            kết thúc
            nếu idx thì
                if activeTab == ft.frame then OpenFirstPage() end -- v4.6.2
                local hostFrame = ft.frame and ft.frame:FindFirstChild("ScriptHost")
                if hostFrame then S.ClearEmbedsUnder(hostFrame) end
                ft.btn:Destroy()
                ft.frame:Destroy()
                table.remove(tabs, idx)
                table.remove(tabContent, idx)
                table.remove(featureTabs, i)
                for j, t in ipairs(tabs) do
                    t.LayoutOrder = j
                kết thúc
                for j, ft2 in ipairs(featureTabs) do
                    for k, t in ipairs(tabs) do
                        if t == ft2.btn then ft2.tabIdx = k; break end
                    kết thúc
                kết thúc
                RebuildFeatureList()
                Store.saveSoon() -- ⭐ xóa cũng phải ghi xuống đĩa, nếu không tab sẽ "sống lại" khi tham gia lại
            kết thúc
        kết thúc)

        tổngH = tổngH + 36
    kết thúc

    featureListFrame.Size = UDim2.new(1,-16,0,totalH)
    createFeatureTab.CanvasSize = UDim2.new(0, 0, 0, cy + TotalH + 30)
kết thúc

createTabBtn.Activated:Connect(function()
    local n = featureNameIn.Text
    local ic = featureIconIn.Text
    local c = featureCodeIn.Text

    nếu #n == 0 thì
        createStatus.Text = "⚠️ Vui lòng nhập tên tính năng!"
        trở lại
    kết thúc
    nếu #c == 0 thì
        createStatus.Text = "⚠️ Vui lòng dán script!"
        trở lại
    kết thúc

    for _, ft in ipairs(featureTabs) do
        nếu ft.name == n thì
            createStatus.Text = "⚠️ Tên tính năng đã tồn tại!"
            trở lại
        kết thúc
    kết thúc

    CreateFeatureTab(n, ic, c)
    RebuildFeatureList()
    Store.saveSoon() -- ⭐ lưu ngay vào file để thoát game vào lại vẫn còn tab này

    createStatus.Text = " ✅ Đã tạo tab: "..n.." (đã lưu)"
    featureNameIn.Text = ""
    featureIconIn.Text = "⚙️"
    featureCodeIn.Text = ""

    SwitchTab(#tabs)
kết thúc)

clearFormBtn.Activated:Connect(function()
    featureNameIn.Text = ""
    featureIconIn.Text = "⚙️"
    featureCodeIn.Text = ""
    createStatus.Text = "🧹 Đã xóa biểu mẫu"
kết thúc)

RebuildFeatureList()
pcall(function()
    createFeatureTab.CanvasSize = UDim2.new(0, 0, 0, cy + 40)
kết thúc)

Store.restoreFeatures = function()
    for i = #featureTabs, 1, -1 do
        cục bộ ft = featureTabs[i]
        for j, b in ipairs(tabs) do
            nếu b == ft.btn thì
                table.remove(tabs, j)
                table.remove(tabContent, j)
                phá vỡ
            kết thúc
        kết thúc
        if activeTab == ft.frame then OpenFirstPage() end -- v4.6.2
        local hostFrame = ft.frame and ft.frame:FindFirstChild("ScriptHost")
        if hostFrame then S.ClearEmbedsUnder(hostFrame) end
        pcall(function() ft.btn:Destroy() end)
        pcall(function() ft.frame:Destroy() end)
        table.remove(featureTabs, i)
    kết thúc

    for _, f in ipairs(Store.loadedFeatures) do
        CreateFeatureTab(f.name, f.icon, f.code)
    kết thúc

    for j, t in ipairs(tabs) do t.LayoutOrder = j end
    tabBar.CanvasSize = UDim2.new(0, 0, 0, #tabs * 44 + 10)
    RebuildFeatureList()
    if Store.refreshStatus then Store.refreshStatus() end
kết thúc

nếu #Store.loadedFeatures > 0 thì
    Store.restoreFeatures()
    createStatus.Text = string.format("💾Đã khôi phục %d tính năng của tab từ bộ nhớ", #Store.loadedFeatures)
kết thúc

S.Move = {
    fly = false, noclip = false, infJump = false, speed = false, carpet = false,
    runMode = false, -- 🏃 mode "chạy trên thảm" (gộp thảm + tốc độ + HUD)
    sprint = false, sprintSpeed ​​= 50, -- v4.37: 💨 tốc độ theo camera (mặt đất, không Thường xuyên Tường)
    highJump = false, highJumpSpeed ​​= 80, -- v4.38: 🦘 nhảy cao (công tắc độc lập, chỉnh tốc độ)
    _hud = nil, _hudUp = nil, _hudDown = nil, _hudCarpet = nil, _hudClose = nil, _menuWasOpen = nil,
    Tốc độ bay = 50, tốc độ đi bộ = 16, sức mạnh nhảy = 50,
    speedMode = "x", speedMul = 3, appliedWS = nil,
    thảmW = 6, thảmH = 0.5, thảmL = 6, -- Rộng × Cao(ngày) × Dài
    CarpetGap = 0.2, -- thảm cách bàn chân bao nhiêu stud (0 = áp sát)
    carpetSlack = 0.5, carpetHold = true, carpetEdge = true,
    carpetY = nil,
    _carpet = nil, _bv = nil, _bg = nil, _floor = nil,
    _ncConn = không, _ncDesc = không, _ncChar = không, _ncLast = không,
    _ijConn = không, _ijConn2 = không, _speedThread = không,
    _origCC = {}, -- [part] = CanCollide gốc
    _baseWS = 16, _baseJP = 50, -- tốc độ / lực nhảy GỐC CỦA GAME
    _wd = nil, _lastJump = nil, _ijBaseJP = nil, _ijBaseJH = nil,
    _carpetRetries = 0, -- số lần thảm bị xóa
}
MV cục bộ = S.Move
_G.BananaCatHub_MV = S.Move -- v4.28: hiển thị cho các tham chiếu cũ (HubLoc fly)

hàm MV.comp(v, k, dft)
    if v == nil then return dft end
    cục bộ ok, val = pcall(function() return v[k] end)
    nếu ok và kiểu dữ liệu (val) == "number" thì trả về val end
    trả về dft
kết thúc
hàm cục bộ mvClamp(n, lo, hi, dft)
    n = tonumber(n)
    if n == nil or n ~= n then return dft end
    nếu n < lo thì trả về lo kết thúc
    nếu n > hi thì trả về hi kết thúc
    trả về n
kết thúc

function MV.Char() return player.Character end
hàm MV.Hum()
    local c = player.Character
    trả về c và c:FindFirstChildOfClass("Humanoid") hoặc nil
kết thúc
hàm MV.Root()
    local c = player.Character
    trả về c và c:FindFirstChild("HumanoidRootPart") hoặc nil
kết thúc

--------- 🧱 XUYÊN TƯỜNG (NoClip) ----------
hàm MV._NcPart(p)
    nếu không (p và p.IsA và p:IsA("BasePart")) thì trả về end
    MV._ncParts = MV._ncParts hoặc {}
    nếu MV._origCC[p] == nil thì
        MV._origCC[p] = MV._ncParts[p] và đúng hoặc p.CanCollide
    kết thúc
    nếu p.CanCollide ~= false thì pcall(function() p.CanCollide = false end) end
    MV._ncParts[p] = true
kết thúc
hàm MV._NcScan()
    local c = MV.Char()
    nếu không phải c thì trả về end
    if MV._ncChar ~= c then --đổi nhân vật (respawn) -> up connect old
        if MV._ncDesc then pcall(function() MV._ncDesc:Disconnect() end) end
        MV._ncChar = c
        MV._ncParts = {} -- nhân vật mới -> mới danh sách phần
        MV._ncDesc = trackConn(c.DescendantAdded:Connect(MV._NcPart))
    kết thúc
    for _, p in ipairs(c:GetDescendants()) do MV._NcPart(p) end
kết thúc
hàm MV._NcEnforce()
    if not MV.noclip then return end
    local c = MV.Char()
    các bộ phận cục bộ = MV._ncParts
    nếu không phải c hoặc không phải các bộ phận thì trả về đầu cuối
    for p in pairs(parts) do
        cục bộ ok = pcall(function()
            nếu p:LàHậu duệ của (c) thì
                nếu p.CanCollide ~= false thì p.CanCollide = kết thúc sai
            khác
                parts[p] = nil -- part đã rời khỏi người dùng (game delete) -> theo dõi theo dõi
            kết thúc
        kết thúc)
        nếu không ổn thì parts[p] = nil end
    kết thúc
kết thúc
--------- v4.22: 🧲 ĐẨY XUYÊN khi bị chặn CỨNG ----------
hàm MV._NcAssist()
    nếu MV.fly hoặc không (MV.noclip và MV.ncPass ~= false) thì
        MV._passBlocked, MV._passPX, MV._passPZ, MV._passAt = 0, nil, nil, nil
        trở lại
    kết thúc
    local onCarpet = (MV.carpet == true) or (MV.runMode == true)
    cục bộ h, r = MV.Hum(), MV.Root()
    nếu không phải h hoặc không phải r thì
        MV._passBlocked, MV._passPX, MV._passPZ, MV._passAt = 0, nil, nil, nil
        trở lại
    kết thúc
    local now = os.clock()
    local dt = now - (MV._passAt or now)
    MV._passAt = now
    if dt <= 0 hoặc dt > 0.5 thì dt = 1/60 end -- frame start/lag -> coi như 1 frame
    local okMD, md = pcall(function() return h.MoveDirection end)
    local mx = okMD and MV.comp(md, "X", 0) or 0
    local mz = okMD and MV.comp(md, "Z", 0) or 0
    local want = math.sqrt(mx * mx + mz * mz) -- 0..1: đang nhấn bất kỳ hướng dẫn nào
    local px, pz = MV.comp(r.Position, "X", nil), MV.comp(r.Position, "Z", nil)
    nếu không phải (px và pz) thì trả về end
    cục bộ đã di chuyển = 0
    nếu MV._passPX thì
        local dx, dz = px - MV._passPX, pz - MV._passPZ
        moved = math.sqrt(dx * dx + dz * dz)
    kết thúc
    MV._passPX, MV._passPZ = px, pz
    local spd = mvClamp(tonumber(MV.WantSpeed()) or 16, 6, 120)
    local ws = tonumber(MV.comp(h, "WalkSpeed", nil)) or spd
    local expect = math.min(spd, ws) * want * dt
    nếu muốn <= 0.1 thì
        MV._passBlocked = 0 -- không nhấn gì -> không đưa
    elseif moved < expect * (onCarpet and 0.12 or 0.35) then
        MV._passBlocked = (MV._passBlocked hoặc 0) + dt -- bị chặn -> đếm thời gian khóa
    khác
        MV._passBlocked = (MV._passBlocked hoặc 0) * 0.5 -- đi được -> quên tăng dần
    kết thúc
    if (MV._passBlocked or 0) < (onCarpet and 0.35 or 0.2) or want <= 0.1 then return end
    ux cục bộ, uz = mx / muốn, mz / muốn
    local stepLen = onCarpet và math.min(spd * dt * 0.5, 0.4) -- trên thảm: lang RẤT nhẹ nhàng
                    hoặc math.min(spd * dt * 1.15, 3) -- 1 frame không say quá 3 stud
    local y = MV.comp(r.Position, "Y", nil)
    nếu y == nil thì trả về end
    pcall(function() r.CFrame = CFrame.new(px + ux * stepLen, y, pz + uz * stepLen) end)
kết thúc
hàm MV._NcStep()
    if not MV.noclip then return end
    local c = MV.Char()
    nếu không phải c thì trả về end
    local now = os.clock()
    nếu MV._ncChar ~= c hoặc không phải MV._ncLast hoặc (now - MV._ncLast) > 0.5 thì
        MV._ncLast = bây giờ
        MV._NcScan() -- quét đầy đủ: bắt phần mới / nhân vật mới
    kết thúc
    MV._NcEnforce() -- MỖI FRAME: thắng game bật lại CanCollide
    MV._NcAssist() -- 🧲 bị chặn -> tự đưa xuyên
kết thúc
hàm MV._NcBind(on)
    nếu bật và không phải MV._ncBound thì
        MV._ncBound = true
        cục bộ ok = pcall(function()
            RunService:BindToRenderStep("BC_NoClip", Enum.RenderPriority.Last.Value, function()
                pcall(MV._NcStep)
            kết thúc)
        kết thúc)
        nếu không ổn thì MV._ncBound = false kết thúc
    nếu không bật và MV._ncBound thì
        MV._ncBound = false
        pcall(function() RunService:UnbindFromRenderStep("BC_NoClip") end)
    kết thúc
    trả về MV._ncBound
kết thúc
hàm MV._NcForgetLost()
    for p in pairs(MV._origCC) do
        nếu không (p và p.Parent) thì MV._origCC[p] = nil end
    kết thúc
kết thúc
hàm MV._NcRestore()
    for p, v in pairs(MV._origCC) do
        nếu p và p.Parent thì
            pcall(function() p.CanCollide = v end)
        kết thúc
        MV._origCC[p] = nil
    kết thúc
    MV._origCC = {}
    MV._ncParts = {}
kết thúc
hàm MV.SetNoclip(on)
    bật = (bật == đúng)
    if on == MV.noclip then return MV.noclip end
    MV.noclip = bật
    nếu bật thì
        MV._ncLast = nil
        MV._ncParts = {}
        MV._passBlocked, MV._passPX, MV._passPZ, MV._passAt = 0, nil, nil, nil
        if MV.ncPass == nil thì MV.ncPass = true end -- v4.22: 🧲 mặc định BẬT
        MV._NcScan() -- quét ngay lần đầu cho chắc
        MV._ncConn = trackConn(RunService.Stepped:Connect(MV._NcStep))
        MV._NcBind(true) -- v4.22: thêm khung cuối cùng của lớp ghi
    khác
        for _, c in ipairs({ MV._ncConn, MV._ncDesc }) do
            nếu c thì pcall(function() c:Disconnect() end) end
        kết thúc
        MV._ncConn, MV._ncDesc, MV._ncChar, MV._ncLast = nil, nil, nil, nil
        MV._NcBind(false)
        MV._passBlocked, MV._passPX, MV._passPZ, MV._passAt = 0, nil, nil, nil
        MV._NcRestore()
    kết thúc
    MV._Watchdog()
    if MV.SyncFlyHud then MV.SyncFlyHud() end
    trả về MV.noclip
kết thúc

--------- 🦘 NHẢY VÔ HẠN ----------
hàm MV._JumpGuard()
    local h = MV.Hum()
    nếu không phải h thì trả về end
    pcall(function()
        local jp = mvClamp(MV.jumpPower, 1, 500)
        nếu h.UseJumpPower ~= false thì
            if (tonumber(h.JumpPower) or 0) < 1 then h.JumpPower = jp end
        kết thúc
        nếu (tonumber(h.JumpHeight) hoặc 0) < 0.1 thì
            local g = tonumber(workspace.Gravity) or 0
            nếu g < 1 thì g = 196,2 kết thúc
            h.JumpHeight = mvClamp((jp * jp) / (2 * g), 1, 500)
        kết thúc
    kết thúc)
kết thúc
hàm MV._JumpConfirm(y0)
    if not MV.infJump then return end
    cục bộ r2 = MV.Root()
    nếu không phải r2 thì trả về end
    vị trí cục bộ = r2.Vị trí.Y - y0
    local v = r2.AssemblyLinearVelocity
    local vy = MV.comp(v, "Y", 0)
    if up < 0.4 và vy < 10 then -- chưa nhúc nhích -> game đã bỏ qua lệnh nhảy
        pcall(function()
            r2.AssemblyLinearVelocity = Vector3.new(
                MV.comp(v, "X", 0), MV.WantJumpSpeed(), MV.comp(v, "Z", 0))
        kết thúc)
    kết thúc
kết thúc
hàm MV._DoJump()
    if not MV.infJump then return false end
    cục bộ h, r = MV.Hum(), MV.Root()
    nếu không phải h hoặc không phải r thì trả về false.
    nếu h.Sit hoặc h.PlatformStand thì trả về false end -- ngồi ngồi/xe: không nhảy
    local now = os.clock()
    nếu MV._lastJump và (now - MV._lastJump) < 0.12 thì trả về kết thúc sai -- Chống Bốc Tăng
    MV._lastJump = bây giờ
    MV._JumpGuard()
    local y0 = r.Position.Y
    pcall(function() h:ChangeState(Enum.HumanoidStateType.Jumping) end)
    pcall(function() h.Jump = true end)
    task.delay(0.08, function() pcall(MV._JumpConfirm, y0) end)
    trả về giá trị đúng
kết thúc
hàm MV.SetInfJump(on)
    bật = (bật == đúng)
    if on == MV.infJump then return MV.infJump end
    MV.infJump = bật
    nếu bật thì
        local h = MV.Hum()
        if h then MV._ijBaseJP, MV._ijBaseJH = h.JumpPower, h.JumpHeight end
        MV._JumpGuard()
        MV._ijConn = trackConn(UserInputService.JumpRequest:Connect(function()
            pcall(MV._DoJump)
        kết thúc))
        MV._ijConn2 = trackConn(UserInputService.InputBegan:Connect(function(i, gp)
            if not MV.infJump then return end
            pcall(function()
                local tb = UserInputService:GetFocusedTextBox()
                if tb và tb:IsDescendantOf(gui) then return end -- đang nhập trong hub thì thôi
                cục bộ k = i và i.KeyCode
                if k == Enum.KeyCode.Space or k == Enum.KeyCode.ButtonA then MV._DoJump() end
            kết thúc)
        kết thúc))
    khác
        for _, c in ipairs({ MV._ijConn, MV._ijConn2 }) do
            nếu c thì pcall(function() c:Disconnect() end) end
        kết thúc
        MV._ijConn, MV._ijConn2 = không, không
        local h = MV.Hum()
        nếu h thì
            if MV._ijBaseJP ~= nil then pcall(function() h.JumpPower = MV._ijBaseJP end) end
            if MV._ijBaseJH ~= nil then pcall(function() h.JumpHeight = MV._ijBaseJH end) end
        kết thúc
        MV._ijBaseJP, MV._ijBaseJH = không, không
    kết thúc
    MV._Watchdog()
    trả về MV.infJump
kết thúc

--------- 👟 CHẠY ĐỘ (WalkSpeed ​​/ JumpPower) ----------
hàm MV.WantSpeed()
    nếu MV.speedMode == "x" thì
        cơ sở cục bộ = tonumber(MV._baseWS) hoặc 16
        return mvClamp(base * mvClamp(MV.speedMul, 1, 20), 0, 500)
    kết thúc
    return mvClamp(MV.walkSpeed, 0, 500)
kết thúc
hàm MV.ApplyChar()
    local h = MV.Hum()
    nếu không phải h thì trả về end
    nếu MV.speed thì
        local want = MV.WantSpeed()
        h.WalkSpeed ​​= muốn
        MV.appliedWS = muốn
        nếu không phải MV.highJump thì
            local jp = mvClamp(MV.jumpPower, 0, 500)
            if h.JumpPower ~= jp then h.JumpPower = jp end
        kết thúc
    khác
        h.WalkSpeed ​​= MV._baseWS hoặc 16
        nếu không phải MV.highJump thì
            h.JumpPower = MV._baseJP hoặc 50
        kết thúc
        MV.appliedWS = nil
    kết thúc
kết thúc
hàm MV.SpeedStep()
    local h = MV.Hum()
    nếu không phải h hoặc không phải MV.speed thì trả về end
    nếu MV.appliedWS ~= nil và math.abs((tonumber(h.WalkSpeed) hoặc 0) - MV.appliedWS) > 0.01 thì
        MV._baseWS = tonumber(h.WalkSpeed) hoặc MV._baseWS
    kết thúc
    MV.ApplyChar()
kết thúc
hàm MV.SetSpeed(on)
    bật = (bật == đúng)
    if on == MV.speed then return MV.speed end
    local h = MV.Hum()
    nếu bật chứ không phải MV.speed và h thì -- mặc định nhớ ở lần đầu tiên
        MV._baseWS = h.WalkSpeed ​​hoặc 16
        MV._baseJP = h.JumpPower hoặc 50
    kết thúc
    MV.speed = bật
    MV.ApplyChar()
    MV._Watchdog()
    trả về MV.speed
kết thúc

--------- v4.12.2: VÒNG CANH GÁC (lý do nhiều game "không hoạt động") ----------
hàm MV._NeedWatch()
    trả về (MV.fly hoặc MV.noclip hoặc MV.infJump hoặc MV.speed hoặc MV.carpet hoặc MV.runMode
            hoặc MV.sprint hoặc MV.highJump hoặc (MV.Safe và MV.Safe.on)) == true
kết thúc
hàm MV._KeepAlive()
    if MV.speed or MV.runMode then pcall(MV.SpeedStep) end
    nếu MV.sprint thì
        pcall(MV._EnsureSpeed)
        nếu MV._speedBound không phải là (tick() - (MV._speedFrameAt hoặc 0)) > 0.6 thì
            MV._speedBound = false
            pcall(MV._BindSpeed)
            pcall(MV._SpeedFrame)
        kết thúc
    kết thúc
    if MV.infJump or MV.runMode then pcall(MV._JumpGuard) end
    if MV.highJump then pcall(MV._HighJumpApplyPower) end
    nếu MV.carpet và (không phải MV._carpet hoặc không phải MV._carpet.Parent) thì
        pcall(MV.CreateCarpet, MV.carpetY)
    kết thúc
    nếu MV.fly thì
        pcall(MV._EnsureFly)
        nếu MV._flyBound không phải là (tick() - (MV._flyFrameAt hoặc 0)) > 0.6 thì
            MV._flyBound = false
            pcall(MV._BindFly)
            pcall(MV._FlyFrame)
        kết thúc
    kết thúc
    nếu MV.Safe và MV.Safe.on và (tick() - (MV.Safe._lastFrameAt hoặc 0)) > 0.6 thì
        MV.Safe._bound = false
        pcall(MV.Safe.Bind)
        pcall(MV.Safe.Step, 0.1)
    kết thúc
kết thúc
hàm MV._Watchdog()
    nếu không phải MV._NeedWatch() thì
        MV._wdToken = nil
        luồng cục bộ = MV._wd
        MV._wd = nil
        if type(thread) == "thread" and thread ~= coroutine.running() then pcall(task.cancel, thread) end
        trở lại
    kết thúc
    nếu MV._wdToken thì trả về end
    mã thông báo cục bộ = {}
    MV._wdToken = token
    luồng cục bộ = tác vụ.tạo(hàm()
        trong khi MV._wdToken == token và MV._NeedWatch() thực hiện
            pcall(MV._KeepAlive)
            task.wait(0.3)
        kết thúc
        if MV._wdToken == token then MV._wdToken, MV._wd = nil, nil end
    kết thúc)
    if MV._wdToken == token then MV._wd = thread end
kết thúc

---------- 🚀 BAY THEO CAMERA (v4.36) ----------
LÀM
local FL = { x = 0, z = 0, y = 0, holds = {}, showHud = true, focused = true, conns = {} }
MV.Flight = FL

hàm MV.ClearFlyInput()
    FL.x, FL.z, FL.y = 0, 0, 0
    FL.holds, FL.joyInput, FL.dragInput = {}, nil, nil
    if FL.knob and FL.knob.Parent then FL.knob.Position = UDim2.new(0.5, -14, 0.5, -14) end
kết thúc
hàm MV.SetFlyVirtual(x, z, y)
    FL.x, FL.z, FL.y = mvClamp(x, -1, 1, 0), mvClamp(z, -1, 1, 0), mvClamp(y, -1, 1, 0)
kết thúc
hàm MV._RestoreFlyHum()
    cục bộ h = FL.hum
    nếu h và h.Parent thì
        h.PlatformStand = FL.platformStand
        h.AutoRotate = FL.autoRotate
    kết thúc
    FL.hum = nil
kết thúc
hàm MV._DestroyFlyParts()
    for _, key in ipairs({"_bv", "_bg", "_floor"}) do
        if MV[key] then MV[key]:Destroy(); MV[key] = nil end
    kết thúc
kết thúc
hàm MV._EnsureFly()
    cục bộ r, h = MV.Root(), MV.Hum()
    if not MV.fly then return nil end
    nếu không phải r hoặc không phải h hoặc h.Health <= 0 thì
        MV._DestroyFlyParts()
        MV._RestoreFlyHum()
        MV.ClearFlyInput()
        FL.root = nil
        trả về nil
    kết thúc
    nếu FL.root ~= r thì
        MV._DestroyFlyParts()
        MV._RestoreFlyHum()
        MV.ClearFlyInput()
        FL.root = r
    kết thúc
    nếu FL.hum ~= h thì
        MV._RestoreFlyHum()
        FL.hum, FL.platformStand, FL.autoRotate = h, h.PlatformStand, h.AutoRotate
    kết thúc
    nếu MV._bv hoặc MV._bv.Parent không bằng r thì
        if MV._bv then MV._bv:Destroy() end
        MV._bv = New("BodyVelocity", {
            Tên = "BC_FlyVel", Lực tối đa = Vector3.new(1e9, 1e9, 1e9), Vận tốc = Vector3.zero,
        }, r)
    kết thúc
    nếu MV._bg hoặc MV._bg.Parent không bằng r thì
        if MV._bg then MV._bg:Destroy() end
        MV._bg = New("BodyGyro", {
            Tên = "BC_FlyGyro", Mô-men xoắn cực đại = Vector3.new(1e9, 1e9, 1e9), P = 1e4, D = 50,
        }, r)
    kết thúc
    if h.PlatformStand ~= true then h.PlatformStand = true end
    if h.AutoRotate ~= false then h.AutoRotate = false end
    nếu không phải MV._floor hoặc không phải MV._floor.Parent thì
        MV._floor = New("Part", {
            Tên = "BC_FlyFloor", Kích thước = Vector3.new(6, 0.2, 6), Độ trong suốt = 0.7,
            Màu = Color3.fromRGB(200, 230, 255), Chất liệu = Enum.Material.Glass,
            Cố định = true, CanCollide = false, CanTouch = false, CanQuery = false,
        }, không gian làm việc)
    kết thúc
    trả về r, h
kết thúc

hàm MV._ReadFlyInput(cf, h)
    if not FL.focused or UserInputService:GetFocusedTextBox() then return Vector3.zero end
    cục bộ x, z, y = FL.x, FL.z, FL.y
    local virtualDirection = FL.joyInput ~= nil or math.abs(x) + math.abs(z) > 0
    for _, v in pairs(FL.holds) do
        x ± vX; y ± vY; z ± vZ
        nếu vX ~= 0 hoặc vZ ~= 0 thì virtualDirection = true
    kết thúc
    local w = UserInputService:IsKeyDown(Enum.KeyCode.W)
    local s = UserInputService:IsKeyDown(Enum.KeyCode.S)
    local a = UserInputService:IsKeyDown(Enum.KeyCode.A)
    local d = UserInputService:IsKeyDown(Enum.KeyCode.D)
    nếu w hoặc s hoặc a hoặc d thì
        x, z = (d và 1 hoặc 0) - (a và 1 hoặc 0), (s và 1 hoặc 0) - (w và 1 hoặc 0)
    nếu không phải virtualDirection và h thì
        local md = h.MoveDirection
        local right = Vector3.new(cf.RightVector.X, 0, cf.RightVector.Z)
        if right.Magnitude > 0.001 then right = right.Unit else right = Vector3.new(1, 0, 0) end
        local forward = Vector3.new(right.Z, 0, -right.X)
        x, z = md:Dot(phải), -md:Dot(tiến)
    kết thúc
    local up = UserInputService:IsKeyDown(Enum.KeyCode.Space)
    local down = UserInputService:IsKeyDown(Enum.KeyCode.LeftShift)
        hoặc UserInputService:IsKeyDown(Enum.KeyCode.LeftControl)
    nếu lên hoặc xuống thì y = (lên và 1 hoặc 0) - (xuống và 1 hoặc 0) kết thúc
    trả về Vector3.new(x, y, z)
kết thúc
hàm MV.FlyVelocity(cf, input, speed)
    hướng cục bộ = cf.RightVector * input.X - cf.LookVector * input.Z + Vector3.new(0, input.Y, 0)
    Độ lớn cục bộ = hướng.Độ lớn
    nếu độ lớn < 0.001 thì trả về Vector3.zero
    nếu cường độ > 1 thì hướng = hướng / cường độ kết thúc -- chéo không nhanh hơn, giữ analog
    hướng trả về * mvClamp(tốc độ, 1, 2000, 50)
kết thúc
hàm MV._FlyStep()
    nếu không phải MV.fly thì trả về end
    MV._flyFrameAt = tick()
    local r, h = MV._EnsureFly()
    nếu không phải r thì trả về end
    local cam = workspace.CurrentCamera
    nếu có camera thì
        local cf = cam.CFrame
        MV._bv.Velocity = MV.FlyVelocity(cf, MV._ReadFlyInput(cf, h), MV.flySpeed)
        MV._bg.CFrame = CFrame.new(r.Position) * cf.Rotation
    khác
        MV._bv.Velocity = Vector3.zero
    kết thúc
    MV._floor.Position = r.Position - Vector3.new(0, 3.5, 0)
kết thúc
hàm MV._FlyFrame()
    cục bộ ok, err = pcall(MV._FlyStep)
    nếu không ổn thì
        FL.lastError = tostring(err)
        pcall(function() if MV._bv then MV._bv.Velocity = Vector3.zero end end)
        nếu tick() - (FL.errorAt hoặc -math.huge) > 2 thì
            FL.errorAt = tick()
            Warn("[BananaCatHub] 🚀 Bay: " .. FL.lastError)
        kết thúc
    kết thúc
kết thúc
hàm MV._BindFly()
    if MV._flyBound or not MV.fly then return end
    RunService:UnbindFromRenderStep("Bay")
    RunService:BindToRenderStep("Fly", Enum.RenderPriority.Camera.Value + 1, MV._FlyFrame)
    MV._flyBound = true
    MV._flyFrameAt = tick()
kết thúc
hàm MV._StopFly()
    RunService:UnbindFromRenderStep("Bay")
    MV._flyBound = false
    MV._DestroyFlyParts()
    MV._RestoreFlyHum()
    MV.ClearFlyInput()
    FL.root = nil
kết thúc
hàm MV.SetFly(on)
    bật = (bật == đúng)
    nếu bật thì
        cục bộ r, h = MV.Root(), MV.Hum()
        nếu không r hoặc không h hoặc h.Health <= 0 thì trả về false, "chưa có nhân vật sống để bay" end
        if MV.Safe and MV.Safe.on then MV.Safe.Stop() end
        nếu MV._glassFlyActive thì MV.StopGlassFly() kết thúc
        if MV._playerFlyActive then MV.StopPlayerFly() end
        if MV.runMode then MV.SetRunMode(false) end
        if not MV.fly then MV.ClearFlyInput() end
        MV.fly = true
        MV._EnsureFly()
        MV._BindFly()
        MV._FlyFrame() -- phím tắt được giữ tại chỗ ngay lập tức, không có tốc độ mặc định lúc mới bật
    khác
        MV.fly = false
        MV._StopFly()
    kết thúc
    MV._Watchdog()
    MV.SyncHud()
    if S.SyncTunePanel then pcall(S.SyncTunePanel) end
    trả về MV.fly
kết thúc
hàm MV.SetFlySpeed(n)
    n = tonumber(n)
    if not n or n ≠ n or n == math.huge or n == -math.huge then return false, "n tốc độ 1–2000" end
    MV.flySpeed ​​= mvClamp(n, 1, 2000, 50)
    MV.SyncHud()
    if S.RefreshMovePanel then S.RefreshMovePanel() end
    if S.SyncTunePanel then pcall(S.SyncTunePanel) end
    trả về true, MV.flySpeed
kết thúc
hàm MV.SetFlyHud(on)
    FL.showHud = (on == true)
    if not FL.showHud then MV.ClearFlyInput() end
    MV.SyncHud()
    trả về FL.showHud
kết thúc

hàm MV._BuildFlyHud()
    if FL.hud and FL.hud.Parent then return FL.hud end
    for _, c in ipairs(FL.conns) do c:Disconnect() end
    FL.conns = {}
    MV.ClearFlyInput()
    hàm cục bộ connect(signal, callback)
        cục bộ c = trackConn(signal:Connect(callback))
        FL.conns[#FL.conns + 1] = c
    kết thúc
    cục bộ hud = New("Khung", {
        Tên = "BC_FlyHud", Kích thước = UDim2.new(0, 292, 0, 184), Vị trí = UDim2.new(0, 10, 1, -194),
        BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.18, BorderSizePixel = 0,
        Visible = false, ZIndex = 25,
    }, gui)
    FL.hud = hud
    Góc(hud, UDim.new(0, 12)); Đường viền(hud, C.HAIRLINE, 1)
    D.Shade(hud, Color3.fromRGB(255,255,255), Color3.fromRGB(188,192,205), 90)
    tiêu đề cục bộ = Mới("Nhãn văn bản", {
        Tên = "FlyHudTitle", Kích thước = UDim2.new(1, -76, 0, 22), Vị trí = UDim2.new(0, 10, 0, 2),
        Văn bản = "🚀 Bay theo camera", Active = true, BackgroundTransparency = 1,
        TextColor3 = C.ACCENT, Phông chữ = Enum.Font.GothamBold, TextSize = 11, ZIndex = 26,
        TextXAlignment = Enum.TextXAlignment.Left,
    }, hud)
    nút chức năng cục bộ (tên, văn bản, x, y, w, h, màu sắc)
        cục bộ b = New("TextButton", {
            Tên = tên, Văn bản = văn bản, Kích thước = UDim2.new(0, w, 0, h), Vị trí = UDim2.new(0, x, 0, y),
            BackgroundColor3 = color, TextColor3 = D.BestText(color), BackgroundTransparency = 0.15,
            Font = Enum.Font.GothamBold, TextSize = 11, BorderSizePixel = 0, ZIndex = 28,
        }, hud)
        Góc(b, UDim.new(0, 8))
        trả lại b
    kết thúc
    local hide = button("FlyHudHide", "👁", 226, 2, 28, 22, C.SURFACE3)
    local close = button("FlyHudClose", "✕", 258, 2, 26, 22, C.RED)
    connect(hide.Activated, function() MV.SetFlyHud(false) end)
    hàm cục bộ dừng()
        MV.SetFly(false)
        S.Rebuild()
        D.Say("🚀 Bay: TẮT — công tắc Thường xuyên giữ nguyên", C.YELLOW)
    kết thúc
    kết nối (đóng.Đã kích hoạt, dừng)
    niềm vui cục bộ = Mới("Khung", {
        Tên = "FlyJoystick", Hoạt động = true, Kích thước = UDim2.new(0, 104, 0, 104),
        Vị trí = UDim2.new(0, 10, 0, 32), Màu nền 3 = C.SURFACE2,
        BackgroundTransparency = 0.15, BorderSizePixel = 0, ZIndex = 26,
    }, hud)
    Corner(joy, UDim.new(1, 0)); Stroke(joy, C.BORDER, 1)
    FL.knob = New("Frame", {
        Tên = "FlyKnob", Kích thước = UDim2.new(0, 28, 0, 28), Vị trí = UDim2.new(0.5, -14, 0.5, -14),
        BackgroundColor3 = C.ACCENT, BorderSizePixel = 0, ZIndex = 27,
    }, vui sướng)
    Góc(FL.knob, UDim.new(1, 0))
    con trỏ hàm cục bộ (đầu vào)
        return input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch
    kết thúc
    Hàm cục bộ khớp với (được giữ, đầu vào, di chuyển)
        trả về held == input hoặc (held và held.UserInputType == Enum.UserInputType.MouseButton1)
            và input.UserInputType == (moving và Enum.UserInputType.MouseMovement hoặc Enum.UserInputType.MouseButton1))
    kết thúc
    hàm cục bộ updateJoy(pos)
        local delta = Vector2.new(pos.X, pos.Y) - (joy.AbsolutePosition + joy.AbsoluteSize * 0.5)
        if delta.Magnitude > 38 then delta = delta.Unit * 38 end
        FL.x, FL.z = delta.X/38, delta.Y/38
        FL.knob.Position = UDim2.new(0.5, delta.X - 14, 0.5, delta.Y - 14)
    kết thúc
    kết nối(joy.InputBegan, function(input)
        nếu con trỏ (đầu vào) và MV.fly và FL.showHud và không phải FL.joyInput thì
            FL.joyInput = input; updateJoy(input.Position)
        kết thúc
    kết thúc)
    hàm cục bộ hold(name, text, x, y, w, h, axis, color)
        local b = button(name, text, x, y, w, h, color or C.SURFACE3)
        kết nối(b.InputBegan, function(input)
            if pointer(input) and MV.fly and FL.showHud then FL.holds[input] = axis end
        kết thúc)
        connect(b.InputEnded, function(input) FL.holds[input] = nil end)
    kết thúc
    hold("FlyForward", "↑", 150, 32, 30, 30, Vector3.new(0, 0, -1))
    hold("FlyBack", "↓", 150, 100, 30, 30, Vector3.new(0, 0, 1))
    hold("FlyLeft", "←", 116, 66, 30, 30, Vector3.new(-1, 0, 0))
    hold("FlyRight", "→", 184, 66, 30, 30, Vector3.new(1, 0, 0))
    hold("FlyUp", "⬆", 238, 32, 40, 44, Vector3.new(0, 1, 0), C.GREEN)
    hold("FlyDown", "⬇", 238, 82, 40, 44, Vector3.new(0, -1, 0), C.RED)
    local stopBtn = button("FlyHudStop", "⏹ cột", 198, 144, 80, 28, C.RED)
    kết nối(stopBtn.Activated, dừng)
    FL.status = New("TextLabel", {
        Tên = "FlyHudStatus", Kích thước = UDim2.new(0, 182, 0, 36), Vị trí = UDim2.new(0, 10, 0, 140),
        BackgroundTransparency = 1, TextColor3 = C.MUTED, Font = Enum.Font.GothamMedium,
        Kích thước văn bản = 9, Văn bản xuống dòng = true, Căn chỉnh văn bản theo trục X = Enum.TextXAlignment.Left, Chỉ số Z = 26,
    }, hud)
    kết nối(title.InputBegan, function(input)
        nếu con trỏ (đầu vào) không phải là FL.dragInput thì
            FL.dragInput, FL.dragStart, FL.dragPos = input, input.Position, hud.Position
        kết thúc
    kết thúc)
    kết nối(UserInputService.InputChanged, function(input)
        if matches(FL.joyInput, input, true) then updateJoy(input.Position) end
        nếu khớp với (FL.dragInput, input, true) thì
            delta cục bộ = input.Position - FL.dragStart
            hud.Position = UDim2.new(FL.dragPos.X.Scale, FL.dragPos.X.Offset + delta.X,
                FL.dragPos.Y.Scale, FL.dragPos.Y.Offset + delta.Y)
        kết thúc
    kết thúc)
    kết nối(UserInputService.InputEnded, function(input)
        for held in pairs(FL.holds) do if matches(held, input, false) then FL.holds[held] = nil end end
        nếu khớp với (FL.joyInput, input, false) thì
            FL.joyInput, FL.x, FL.z = nil, 0, 0
            FL.knob.Position = UDim2.new(0.5, -14, 0.5, -14)
        kết thúc
        if matches(FL.dragInput, input, false) then FL.dragInput = nil end
    kết thúc)
    kết nối(UserInputService.WindowFocusReleased, function())
        FL.focused = false
        MV.ClearFlyInput()
        nếu MV._bv thì MV._bv.Velocity = Vector3.zero
    kết thúc)
    connect(UserInputService.WindowFocused, function() FL.focused = true end)
    trả về hud
kết thúc
hàm MV.SyncFlyHud()
    if MV.fly then MV._BuildFlyHud() end
    nếu FL.hud và FL.hud.Parent thì
        FL.hud.Visible = MV.fly và FL.showHud
        FL.status.Text = string.format("💨 %g · 🧱 %s\nThả phím / cần: đứng cân ngang", MV.flySpeed, MV.noclip và "BẬT" hoặc "TẮT")
    kết thúc
    if S.SyncFlyPanel then S.SyncFlyPanel() end
kết thúc
kết thúc -- 🚀 BAY THEO CAMERA

--------- 💨 CAMERA TỐC ĐỘ THEO (v4.37) ----------
LÀM
CS cục bộ = { tập trung = true }
MV.CamSpeed ​​= CS

hàm MV._DestroySpeedParts()
    if MV._sv then MV._sv:Destroy(); MV._sv = nil end
kết thúc
hàm MV._EnsureSpeed()
    cục bộ r, h = MV.Root(), MV.Hum()
    if not MV.sprint then return nil end
    nếu MV.fly hoặc (MV.Safe và MV.Safe.on) thì
        MV._DestroySpeedParts()
        CS.root = nil
        trả về nil
    kết thúc
    nếu không phải r hoặc không phải h hoặc h.Health <= 0 thì
        MV._DestroySpeedParts()
        CS.root = nil
        trả về nil
    kết thúc
    nếu CS.root ~= r thì
        MV._DestroySpeedParts()
        CS.root = r
    kết thúc
    nếu MV._sv hoặc MV._sv.Parent không bằng r thì
        if MV._sv then MV._sv:Destroy() end
        MV._sv = New("BodyVelocity", {
            Tên = "BC_SpeedVel", Lực tối đa = Vector3.new(1e9, 0, 1e9), Vận tốc = Vector3.zero,
        }, r)
    khác
        local mf = MV._sv.MaxForce
        nếu mf và (mf.Y ~= 0) thì
            MV._sv.MaxForce = Vector3.new(1e9, 0, 1e9)
        kết thúc
    kết thúc
    trả về r, h
kết thúc

hàm MV._ReadSpeedInput(cf, h)
    if not CS.focused or UserInputService:GetFocusedTextBox() then return Vector3.zero end
    cục bộ x, z = 0, 0
    local w = UserInputService:IsKeyDown(Enum.KeyCode.W)
    local s = UserInputService:IsKeyDown(Enum.KeyCode.S)
    local a = UserInputService:IsKeyDown(Enum.KeyCode.A)
    local d = UserInputService:IsKeyDown(Enum.KeyCode.D)
    nếu w hoặc s hoặc a hoặc d thì
        x, z = (d và 1 hoặc 0) - (a và 1 hoặc 0), (s và 1 hoặc 0) - (w và 1 hoặc 0)
    nếu h thì
        local md = h.MoveDirection
        local right = Vector3.new(cf.RightVector.X, 0, cf.RightVector.Z)
        if right.Magnitude > 0.001 then right = right.Unit else right = Vector3.new(1, 0, 0) end
        local forward = Vector3.new(right.Z, 0, -right.X)
        x, z = md:Dot(phải), -md:Dot(tiến)
    kết thúc
    return Vector3.new(x, 0, z)
kết thúc
hàm MV.SpeedVelocity(cf, input, speed)
    local look = Vector3.new(cf.LookVector.X, 0, cf.LookVector.Z)
    local right = Vector3.new(cf.RightVector.X, 0, cf.RightVector.Z)
    nếu độ lớn nhìn < 0,001 thì
        if right.Magnitude > 0.001 then right = right.Unit else right = Vector3.new(1, 0, 0) end
        look = Vector3.new(right.Z, 0, -right.X)
    khác
        nhìn = nhìn.Đơn vị
    kết thúc
    if right.Magnitude > 0.001 then right = right.Unit else right = Vector3.new(1, 0, 0) end
    hướng cục bộ = phải * input.X - nhìn * input.Z
    hướng = Vector3.new(hướng.X, 0, hướng.Z)
    Độ lớn cục bộ = hướng.Độ lớn
    nếu độ lớn < 0.001 thì trả về Vector3.zero
    nếu độ lớn > 1 thì hướng = hướng / độ lớn kết thúc
    hướng trả về * mvClamp(tốc độ, 1, 2000, 50)
kết thúc
hàm MV._SpeedStep()
    nếu không phải MV.sprint thì trả về end
    MV._speedFrameAt = tick()
    local r, h = MV._EnsureSpeed()
    nếu không phải r hoặc không phải MV._sv thì trả về end
    local cam = workspace.CurrentCamera
    nếu không phải là camera thì
        MV._sv.MaxForce = Vector3.new(0, 0, 0)
        MV._sv.Velocity = Vector3.zero
        trở lại
    kết thúc
    local vel = MV.SpeedVelocity(cam.CFrame, MV._ReadSpeedInput(cam.CFrame, h), MV.sprintSpeed)
    nếu vận tốc.Magnitude < 0.001 thì
        MV._sv.MaxForce = Vector3.new(0, 0, 0)
        MV._sv.Velocity = Vector3.zero
    khác
        MV._sv.MaxForce = Vector3.new(1e9, 0, 1e9)
        MV._sv.Velocity = Vector3.new(vel.X, 0, vel.Z)
    kết thúc
kết thúc
hàm MV._SpeedFrame()
    cục bộ ok, err = pcall(MV._SpeedStep)
    nếu không ổn thì
        CS.lastError = tostring(err)
        pcall(function() if MV._sv then MV._sv.Velocity = Vector3.zero end end)
        nếu tick() - (CS.errorAt hoặc -math.huge) > 2 thì
            CS.errorAt = tick()
            Warn("[BananaCatHub] 💨 Tốc độ: " .. CS.lastError)
        kết thúc
    kết thúc
kết thúc
hàm MV._BindSpeed()
    if MV._speedBound or not MV.sprint then return end
    RunService:UnbindFromRenderStep("BC_Speed")
    RunService:BindToRenderStep("BC_Speed", Enum.RenderPriority.Camera.Value + 1, MV._SpeedFrame)
    MV._speedBound = true
    MV._speedFrameAt = tick()
kết thúc
hàm MV._StopSpeed()
    RunService:UnbindFromRenderStep("BC_Speed")
    MV._speedBound = false
    MV._DestroySpeedParts()
    CS.root = nil
kết thúc
hàm MV.SetSprint(on)
    bật = (bật == đúng)
    nếu bật thì
        cục bộ r, h = MV.Root(), MV.Hum()
        nếu không r hoặc không h hoặc h.Health <= 0 thì trả về false, "chưa có nhân vật sống để chạy" end
        MV.sprint = true
        MV._EnsureSpeed()
        MV._BindSpeed()
        MV._SpeedFrame()
    khác
        MV.sprint = false
        MV._StopSpeed()
    kết thúc
    MV._Watchdog()
    if S.SyncSpeedPanel then S.SyncSpeedPanel() end
    if S.SyncTunePanel then pcall(S.SyncTunePanel) end
    trả về MV.sprint
kết thúc
hàm MV.SetSprintSpeed(n)
    n = tonumber(n)
    if not n or n ≠ n or n == math.huge or n == -math.huge then return false, "n tốc độ 1–2000" end
    MV.sprintSpeed ​​= mvClamp(n, 1, 2000, 50)
    if S.SyncSpeedPanel then S.SyncSpeedPanel() end
    if S.SyncTunePanel then pcall(S.SyncTunePanel) end
    trả về true, MV.sprintSpeed
kết thúc
end -- 💨 TỐC ĐỘ THEO CAMERA

--------- 🦘 NHẢY CAO (v4.38) ----------
LÀM
cục bộ HJ = { cuối cùng = 0 }
MV.HighJump = HJ

hàm MV.WantJumpSpeed()
    if MV.highJump then return mvClamp(MV.highJumpSpeed, 1, 500, 80) end
    return mvClamp(MV.jumpPower, 1, 500, 50)
kết thúc
hàm MV.HighJumpVelocity(current, speed)
    local vx = MV.comp(current, "X", 0)
    local vz = MV.comp(current, "Z", 0)
    return Vector3.new(vx, mvClamp(speed, 1, 500, 80), vz)
kết thúc
hàm MV._HighJumpApplyPower()
    nếu không phải MV.highJump thì trả về end
    local h = MV.Hum()
    nếu không phải h thì trả về end
    local jp = mvClamp(MV.highJumpSpeed, 1, 500, 80)
    pcall(function()
        nếu h.UseJumpPower ~= false thì
            if (tonumber(h.JumpPower) or 0) ~= jp then h.JumpPower = jp end
        kết thúc
        local g = tonumber(workspace.Gravity) or 0
        nếu g < 1 thì g = 196,2 kết thúc
        local jh = mvClamp((jp * jp) / (2 * g), 1, 500)
        if math.abs((tonumber(h.JumpHeight) or 0) - jh) > 0.05 then h.JumpHeight = jh end
    kết thúc)
kết thúc
hàm MV._DoHighJump()
    if not MV.highJump then return false end
    nếu MV.fly hoặc (MV.Safe và MV.Safe.on) thì trả về false.
    cục bộ h, r = MV.Hum(), MV.Root()
    nếu không phải h hoặc không phải r thì trả về false.
    nếu h.Sit thì trả về false
    local st = h:GetState()
    if st == Enum.HumanoidStateType.Freefall then return false end
    local now = os.clock()
    nếu HJ.last và (now - HJ.last) < 0.12 thì trả về false.
    HJ.last = bây giờ
    MV._HighJumpApplyPower()
    pcall(function() h:ChangeState(Enum.HumanoidStateType.Jumping) end)
    pcall(function() h.Jump = true end)
    pcall(function()
        r.AssemblyLinearVelocity = MV.HighJumpVelocity(r.AssemblyLinearVelocity, MV.highJumpSpeed)
    kết thúc)
    trả về giá trị đúng
kết thúc
hàm MV._HighJumpBind()
    if HJ.conn or not MV.highJump then return end
    HJ.conn = trackConn(UserInputService.JumpRequest:Connect(function()
        pcall(MV._DoHighJump)
    kết thúc))
    HJ.conn2 = trackConn(UserInputService.InputBegan:Connect(function(i, gp)
        nếu không phải MV.highJump thì trả về end
        pcall(function()
            local tb = UserInputService:GetFocusedTextBox()
            nếu tb và tb:IsDescendantOf(gui) thì trả về end
            cục bộ k = i và i.KeyCode
            if k == Enum.KeyCode.Space or k == Enum.KeyCode.ButtonA then MV._DoHighJump() end
        kết thúc)
    kết thúc))
kết thúc
hàm MV._HighJumpUnbind()
    for _, c in ipairs({ HJ.conn, HJ.conn2 }) do
        nếu c thì pcall(function() c:Disconnect() end) end
    kết thúc
    HJ.conn, HJ.conn2 = nil, nil
kết thúc
hàm MV.SetHighJump(on)
    bật = (bật == đúng)
    if on == MV.highJump then return MV.highJump end
    local h = MV.Hum()
    nếu bật thì
        nếu h thì HJ.baseJP, HJ.baseJH = h.JumpPower, h.JumpHeight end
        MV.highJump = true
        MV._HighJumpApplyPower()
        MV._HighJumpBind()
    khác
        MV.highJump = false
        MV._HighJumpUnbind()
        nếu h không phải là MV.infJump thì
            if HJ.baseJP ~= nil then pcall(function() h.JumpPower = HJ.baseJP end) end
            if HJ.baseJH ~= nil then pcall(function() h.JumpHeight = HJ.baseJH end) end
        kết thúc
        HJ.baseJP, HJ.baseJH = không, không
    kết thúc
    MV._Watchdog()
    if S.SyncHighJumpPanel then S.SyncHighJumpPanel() end
    if S.SyncTunePanel then pcall(S.SyncTunePanel) end
    trả về MV.highJump
kết thúc
hàm MV.SetHighJumpSpeed(n)
    n = tonumber(n)
    if not n or n ≠ n or n == math.huge or n == -math.huge then return false, "n tốc độ nhảy 1–500" end
    MV.highJumpSpeed ​​= mvClamp(n, 1, 500, 80)
    if MV.highJump then pcall(MV._HighJumpApplyPower) end
    if S.SyncHighJumpPanel then S.SyncHighJumpPanel() end
    if S.SyncTunePanel then pcall(S.SyncTunePanel) end
    trả về true, MV.highJumpSpeed
kết thúc
kết thúc -- 🦘 NHẢY CAO

LÀM
MV.Safe = {
    bật = false,
    auto = true, -- ➡ auto bay (không nhấn gì vẫn bay theo camera hướng)
    bán kính = 25, -- 📏 cách xác định khoảng cách để né (đinh tán)
    tốc độ = 60, -- 💨 tốc độ bay
    lái = 4, -- 🌀 né gạt (1–10)
    lá chắn = true, -- 🔲 bức tường trong suốt hình vuông bao quanh (nhìn thấy vùng né)
    ShieldThk = 0.4, -- độ dày vách
    ShieldH = 0, -- v4.23: 0 = chiều cao TỰ ĐỘNG theo nhân vật (trước đây cố định 16)
    ShieldSize = 0, -- v4.23: nửa viền viền (đinh tán). 0 = Tự động vật vật; 📏 KHÔNG kéo giãn giãn
    lá chắnT = 0,86, -- độ trong suốt (càng nhỏ càng rõ)
    tránhPlayers = true,-- 👤 né cả NGƯỜI CHƠI khác (dù họ đứng yên)
    Circle = true, -- ⭕ không có mối nguy hiểm nào -> tự bay VÒNG TRÒN
    roundR = 20, -- ⭕ bán kính tròn
    lookTime = 1.0, -- 👁 nhìn trước bao nhiêu giây để né vật ĐANG BAY TỚI mình
    lookMul = 1.6, -- 👁 quét xa hơn vùng né bấy nhiêu lần (bắt vật từ xa lao tới)
    _holdAt = 0, -- thời điểm cuối cùng còn mối nguy hiểm (né more 0,35s cho chắc)
    _myV = Vector3.new(0, 0, 0), -- Vận tốc mình ĐANG định bay ( để tính tốc độ lao vào nhau)
    _ang = 0, _center = nil, -- ⭕ góc + tâm vòng
    noclip = true, -- 🧱 tự bật Xuyên Tường để đưa ra nhiều vật cản
    _ncPrev = nil, -- trạng thái Xuyên Tường TRƯỚC KHI bật 🛡 (để trả lại đúng)
    _shield = nil, -- 4 vách trong suốt
    _shieldPos = nil,
    _root = nil, -- v4.23: nhân vật đang gắn kết (đổi là tự động khôi phục phần bay + xương)
    _bound = false, -- v4.23: unmount "BC_Safe" riêng biệt của vòng lặp
    _lastFrameAt = 0, -- v4.23: vòng lặp cuối cùng 🛡 chạy (watchdog soi còn sống không)
    playerThreats = 0,
    mối đe dọa = 0, gần nhất = nil, -- để hiện trạng thái
    _rep = Vector3.new(0, 0, 0), -- vector Đẩy của lần quét gần nhất
    _seen = {}, _cache = nil, _listAcc = 0, _sc = 0,
    _virtX = 0, _virtZ = 0, _virtY = 0,
    showHud = true,
    _hud = nil,
    _joyBG = nil, _joyKnob = nil, _dragging = false,
    _bv = nil, _bg = nil,
}
SF cục bộ = MV.Safe

hàm cục bộ sfIsPart(d)
    nếu d == nil thì trả về false
    local okA, isPart = pcall(function() return d:IsA("BasePart") end) -- game thật: IsA có sẵn
    if okA and isPart ~= nil then return isPart == true end
    local okC, cls = pcall(function() return tostring(d.ClassName or "") end)
    nếu không phải okC thì trả về false.
    return (cls == "Part" or cls == "MeshPart" or cls == "WedgePart" or cls == "TrussPart")
            hoặc cls == "CornerWedgePart" hoặc cls == "UnionOperation" hoặc cls == "NegateOperation"
            hoặc cls == "IntersectOperation" hoặc cls == "Ball" hoặc cls == "Cylinder"
            hoặc cls == "SpawnLocation" hoặc cls == "Seat" hoặc cls == "VehicleSeat" hoặc cls == "Platform")
kết thúc
hàm cục bộ sfIgnore(d, char)
    local nm = tostring(d.Name or "")
    if nm:sub(1, 3) == "BC_" then return true end
    if char and d:IsDescendantOf(char) then return true end
    if d:IsDescendantOf(MV._floor) then return true end
    trả về false
kết thúc
hàm cục bộ sfOverlap(char)
    if SF._op and SF._opChar == char then return SF._op end
    cục bộ ok, op = pcall(function() return OverlapParams.new() end)
    if not ok or op == nil then return nil end
    pcall(function() op.MaxParts = 0 end) -- 0 = không giới hạn
    pcall(function() op.RespectCanCollide = false end) -- vật không và vi hạt vẫn tính
    pcall(function() op.FilterType = Enum.RaycastFilterType.Exclude end) -- API mới
    pcall(function() op.FilterDescendantsInstances = { char } end) -- bỏ qua một phần của chính mình
    SF._op, SF._opChar = op, char
    trả lại op
kết thúc
hàm cục bộ sfCandidates(pos, dt, reach)
    r0 cục bộ = phạm vi hoặc bán kính SF
    local char0 = MV.Char()
    local op0 = sfOverlap(char0)
    local okL, list = pcall(function() return workspace:GetPartBoundsInRadius(pos, r0, op0) end)
    if not okL then okL, list = pcall(function() return workspace:GetPartBoundsInRadius(pos, r0) end) end
    if okL and type(list) == "table" and #list > 0 then return list end
    SF._listAcc = (SF._listAcc hoặc 0) + (dt hoặc 0,15)
    nếu SF._cache hoặc SF._listAcc không lớn hơn hoặc bằng 2 thì
        SF._listAcc = 0
        đầu ra cục bộ = {}
        local ok2, desc = pcall(function() return workspace:GetDescendants() end)
        nếu ok2 và type(desc) == "table" thì
            for _, d in ipairs(desc) do
                nếu #out >= 600 thì thoát.
                nếu sfIsPart(d) thì out[#out + 1] = d end
            kết thúc
        kết thúc
        SF._cache = out
    kết thúc
    trả về SF._cache hoặc {}
kết thúc
hàm cục bộ sfPlayers(pos, rad, rep0, near0)
    đại diện cục bộ, n, gần = đại diện0, 0, gần0
    nếu không phải SF.avoidPlayers thì trả về rep, n, gần cuối
    local char = MV.Char()
    cục bộ ok, danh sách = pcall(function() return Players:GetPlayers() end)
    Nếu không ổn hoặc kiểu (danh sách) ~= "bảng" thì trả về rep, n, gần cuối.
    for _, pl in ipairs(list) do
        nếu pl ~= player thì
            local ch = pl.Character
            nếu ch và ch ~= char thì
                local hrp = ch:FindFirstChild("HumanoidRootPart") or ch:FindFirstChildOfClass("BasePart")
                pp cục bộ = hrp và hrp.Vị trí
                nếu pp thì
                    delta cục bộ = pp - pos
                    khoảng cách cục bộ = delta.Độ lớn
                    nếu dist <= rad và dist > 0,01 thì
                        n = n + 1
                        if near == nil or dist < near then near = dist end
                        w cục bộ = 1 - (khoảng cách / rad)
                        Rep = Rep - (delta / dist) * (0.5 + w * w * 3) -- TRỪ = Đưa RA XA
                    kết thúc
                kết thúc
            kết thúc
        kết thúc
    kết thúc
    trả lại rep, n, gần
kết thúc
hàm MV.Safe.Scan(pos, dt)
    local char = MV.Char()
    bán kính cục bộ = mvClamp(SF.radius, 1, 300, 25)
    tầm với cục bộ = rad * mvClamp(SF.lookMul, 1, 4, 1.6)
    local lookT = mvClamp(SF.lookTime, 0.1, 3, 1.0)
    local myV = SF._myV hoặc Vector3.new(0, 0, 0) -- vận tốc MÌNH (mình bay tới nó cũng tính)
    local rep = Vector3.new(0, 0, 0)
    cục bộ n, gần = 0, nil
    cục bộ hiện tại = tick()
    cục bộ đã thấy = {}
    cục bộ pchars = {}
    local pls = Players:GetPlayers()
    nếu type(pls) == "table" thì
        for _, pl in ipairs(pls) do
            nếu pl ~= player thì
                local ch2 = pl.Character
                if ch2 ~= nil and ch2 ~= char then pchars[ch2] = true end
            kết thúc
        kết thúc
    kết thúc
    local hasPChar = (next(pchars) ~= nil)
    hàm cục bộ trongPChar(d)
        nếu không có ký tự PChar thì trả về false.
        for ch2 in pairs(pchars) do
            nếu d:IsDescendantOf(ch2) thì trả về true
        kết thúc
        trả về false
    kết thúc
    SF._mvCount = 0 -- v4.20: đếm vật ĐANG CHẠY trong tầm (để soi trạng thái)
    for _, d in ipairs(sfCandidates(pos, dt, reach)) do
        nếu sfIsPart(d) và không phải sfIgnore(d, char) và không phải inPChar(d) thì
            vị trí cục bộ p = d.Vị trí
            nếu p thì
                delta cục bộ = p - pos
                khoảng cách cục bộ = delta.Độ lớn
                rr cục bộ = 0
                local sz = d.Size
                nếu sz thì
                    local mx = math.max(sz.X, sz.Y, sz.Z)
                    if type(mx) == "number" then rr = mx * 0.5 end
                kết thúc
                nếu rr > rad * 0.75 thì rr = rad * 0.75
                sóng cục bộ = khoảng cách - rr
                nếu surf < 0 thì surf = 0
                nếu surf <= reach và dist > 0.01 thì
                    local dir = delta / dist -- hướng TỚI vật
                    di chuyển cục bộ, đóng = false, 0
                    local v = d.AssemblyLinearVelocity
                    nếu v và v.Magnitude thì
                        nếu v.Magnitude > 1.5 thì moving = true end
                        closing = -(vX * dir.X + vY * dir.Y + vZ * dir.Z)
                    kết thúc
                    cục bộ cũ = SF._seen[d]
                    nếu cũ thì
                        local dd = (p - old.p).Magnitude
                        local ddt = math.max(now - old.t, 0.02)
                        nếu dd > 0,35 hoặc (dd / ddt) > 1,5 thì moving = true end
                        nếu closing <= 0.5 và dd > 0.1 thì
                            closing = math.max(closing, dd / ddt)
                        kết thúc
                    kết thúc
                    nếu không di chuyển thì
                        local hum0 = d:FindFirstAncestorOfClass("Humanoid")
                        nếu hum0 == nil thì
                            anc cục bộ = d.Cha
                            if anc then hum0 = anc:FindFirstChildOfClass("Humanoid") end
                        kết thúc
                        nếu hum0 ~= nil thì
                            local md = hum0.MoveDirection
                            local mdMag = 0
                            nếu md thì
                                cục bộ m2 = md.Độ lớn
                                if type(m2) == "number" then mdMag = m2 end
                            kết thúc
                            nếu mdMag > 0.05 thì moving = true end
                        kết thúc
                    kết thúc
                    nếu đang di chuyển và lướt sóng <= đạt tới thì SF._mvCount = (SF._mvCount hoặc 0) + 1 kết thúc
                    đã thấy[d] = { p = p, t = bây giờ }
                    Nguy hiểm cục bộ = (sóng <= bức xạ và đang di chuyển)
                    local tHit = nil
                    nếu giá đóng cửa > 0,5 thì
                        tHit = (surf - rad * 0.35) / đóng -- còn bao lâu thì MẶT vật tới sát mình
                        nếu tHit <= lookT thì danger = true end
                    kết thúc
                    nếu có nguy hiểm thì
                        n = n + 1
                        if near == nil or surf < near then near = surf end
                        local w = mvClamp(1 - (surf / (rad * mvClamp(SF.lookMul, 1, 4, 1.6))), 0.2, 1)
                        myDot cục bộ = mvClamp(myV.X * dir.X + myV.Y * dir.Y + myV.Z * dir.Z, 0, 200)
                        Tăng cường cục bộ = 1 + mvClamp(đóng, 0, 200) / 60 + myDot / 240
                        cục bộ pv = p
                        nếu v và v.Magnitude > 0.1 thì pv = p + v * 0.35
                        local pdir = pv - pos
                        nếu pdir.Magnitude > 0.01 thì
                            pdir = pdir.Unit
                            nếu (pdir.X * dir.X + pdir.Y * dir.Y + pdir.Z * dir.Z) < 0 thì pdir = dir end
                        khác
                            pdir = dir
                        kết thúc
                        rep = rep - pdir * (0.35 + w * w * 3) * boost
                    kết thúc
                kết thúc
            kết thúc
        kết thúc
    kết thúc
    cục bộ pn0 = n
    rep, n, near = sfPlayers(pos, rad, rep, near)
    SF.playerThreats = n
    n = pn0 + n
    SF._seen = đã thấy
    SF._rep = rep
    SF.movers = SF._mvCount hoặc 0
    SF._mvCount = nil
    SF.threats, SF.nearest = n, gần
    nếu n > 0 thì
        SF._holdAt = bây giờ
        SF._lastThreatAt = now -- v4.20: nhớ vừa đủ (để né tiếp)
        if Rep.Magnitude > 0 thì SF._lastRep = Rep end -- nhớ HƯỚNG đang né
    kết thúc
    trả lại n, gần, rep
kết thúc
--------- v4.18: 🔲 BỨC TƯỜNG TRONG SUỐT HÌNH VUÔNG bao quanh mình ----------
hàm MV.Safe.KillShield()
    for i = 1, 4 do
        cục bộ w = SF._shield và SF._shield[i]
        nếu w thì pcall(function() w:Destroy() end) end
    kết thúc
    SF._shield, SF._shieldPos = nil, nil
kết thúc
hàm MV.Safe.ShieldHalf()
    local n = tonumber(SF.shieldSize)
    nếu n và n > 0 thì trả về mvClamp(n, 0.5, 300, 3) kết thúc -- chỉnh tay
    cục bộ w = 2
    cục bộ r = MV.Root()
    if r then pcall(function() w = math.max(tonumber(r.Size.X) or 2, tonumber(r.Size.Z) or 2) end) end
    return mvClamp(w * 0.5 + 1.6, 2, 8, 3) -- người thường: 2,6 stud (cạnh ~5,2)
kết thúc
hàm MV.Safe.ShieldHeight()
    cục bộ n = tonumber(SF.shieldH)
    nếu n và n > 0 thì trả về mvClamp(n, 1, 100, 8) kết thúc
    cục bộ hh = 2
    cục bộ r = MV.Root()
    nếu r thì pcall(function() hh = tonumber(r.Size.Y) or 2 end) end
    return mvClamp(hh * 3 + 2, 4, 14, 8) -- người thường: 8 stud
kết thúc
hàm MV.Safe.BuildShield()
    MV.Safe.KillShield()
    phía cục bộ, h = MV.Safe.ShieldHalf(), MV.Safe.ShieldHeight()
    local thk = SF.shieldThk
    SF._shield = {}
    for i = 1, 4 do
        local long = (i <= 2)
        cục bộ w = New("Phần", {
            Tên = "BC_Shield" .. i,
            Kích thước = long và Vector3.new(side * 2 + thk, h, thk) hoặc Vector3.new(thk, h, side * 2 + thk),
            Độ trong suốt = SF.shieldT,
            Màu = Color3.fromRGB(120, 225, 255),
            Vật liệu = Enum.Material.Glass,
            Cố định = true, CanCollide = false, CastShadow = false,
        }, không gian làm việc)
        SF._shield[i] = w
    kết thúc
kết thúc
hàm MV.Safe.UpdateShield(pos)
    nếu không (SF.on và SF.shield) thì
        if SF._shield then MV.Safe.KillShield() end
        trở lại
    kết thúc
    local side = MV.Safe.ShieldHalf()
    local wallH = MV.Safe.ShieldHeight()
    nhu cầu địa phương = (SF._shield == nil)
    nếu không cần thiết thì
        for i = 1, 4 do
            cục bộ w = SF._shield[i]
            if not w or not w.Parent then need = true break end
        kết thúc
    kết thúc
    nếu cần thì pcall(MV.Safe.BuildShield) end
    nếu không phải SF._shield hoặc không phải SF._shield[1] thì trả về end
    cục bộ q = SF._shieldPos
    nếu q và math.abs(qX - pos.X) < 0.05 và math.abs(qY - pos.Y) < 0.05 và math.abs(qZ - pos.Z) < 0.05
       và math.abs((qS hoặc 0) - side) < 0.01 và math.abs((qH hoặc 0) - wallH) < 0.01 thì
        trở lại
    kết thúc
    SF._shieldPos = { X = vị trí X, Y = vị trí Y, Z = vị trí Z, S = cạnh, H = chiều cao tường }
    for i = 1, 4 do
        cục bộ w = SF._shield[i]
        nếu w thì
            dx, dz cục bộ = 0, 0
            Nếu i == 1 thì dz = cạnh, ngược lại nếu i == 2 thì dz = -cạnh
            elseif i == 3 then dx = side else dx = -side end
            local okS = pcall(function()
                w.Size = (i <= 2) và Vector3.new(side * 2 + SF.shieldThk, wallH, SF.shieldThk)
                                      hoặc Vector3.new(SF.shieldThk, wallH, side * 2 + SF.shieldThk)
                w.CFrame = CFrame.new(pos.X + dx, pos.Y, pos.Z + dz)
            kết thúc)
            if not okS then MV.Safe.KillShield(); return end
        kết thúc
    kết thúc
kết thúc
hàm MV.Safe._EnsureBV()
    cục bộ r = MV.Root()
    nếu không phải r thì trả về nil, nil end
    nếu SF._bv và SF._bv.Parent == r và SF._bg và SF._bg.Parent == r thì
        trả về SF._bv, SF._bg
    kết thúc
    pcall(function() if SF._bv then SF._bv:Destroy() end end)
    pcall(function() if SF._bg then SF._bg:Destroy() end end)
    local bv = New("BodyVelocity", { Name = "BC_SafeFlyVel", MaxForce = Vector3.new(1e9, 1e9, 1e9), Velocity = Vector3.new(0,0,0) }, r)
    local bg = New("BodyGyro", { Name = "BC_SafeFlyGyro", MaxTorque = Vector3.new(1e9, 1e9, 1e9), P = 1e4, D = 50 }, r)
    SF._bv, SF._bg = bv, bg
    local h = MV.Hum()
    nếu h thì
        pcall(function() h.PlatformStand = true end)
        pcall(function() h.AutoRotate = false end)
    kết thúc
    trả về bv, bg
kết thúc

hàm MV.Safe.Repair()
    cục bộ r = MV.Root()
    nếu không phải r thì trả về false kết thúc
    local bv, bg = MV.Safe._EnsureBV()
    nếu không phải bv hoặc MV.Root() ~= r thì
        trả về false
    kết thúc
    MV.flySpeed ​​= mvClamp(SF.speed, 1, 2000, 60)
    trả về giá trị đúng
kết thúc
hàm MV.Safe.Bind()
    nếu SF._bound thì trả về true
    SF._bound = pcall(function() RunService:BindToRenderStep("BC_Safe", 2, MV.Safe._Frame) end)
    trả về SF._bound == true
kết thúc
hàm MV.Safe.Unbind()
    SF._bound = false
    pcall(function() RunService:UnbindFromRenderStep("BC_Safe") end)
kết thúc
function MV.Safe._Frame(dt) pcall(MV.Safe.Step, dt) end
hàm MV.Safe.Step(dt)
    nếu không phải SF.on thì trả về end
    SF._lastFrameAt = tick()
    cục bộ r, h = MV.Root(), MV.Hum()
    nếu không phải r thì
        if SF._shield then pcall(MV.Safe.KillShield) end
        SF._root = nil
        trở lại
    kết thúc
    nếu SF._root ~= r thì
        SF._root = r
        pcall(MV.Safe.Reset)
        SF._shieldPos = nil
        if SF.shield then pcall(MV.Safe.KillShield) end
        pcall(MV.Safe._EnsureBV)
    kết thúc
    nếu không (SF._bv và SF._bv.Parent == r) thì
        pcall(MV.Safe._EnsureBV)
    kết thúc
    local bv = SF._bv
    nếu không (bv và bv.Parent == r) thì trả về end
    local bg = SF._bg
    nếu h thì
        if h.PlatformStand ~= true then pcall(function() h.PlatformStand = true end) end
        if h.AutoRotate ~= false then pcall(function() h.AutoRotate = false end) end
    kết thúc
    local dtv = tonumber(dt) or 0.016
    SF._sc = (SF._sc hoặc 0) + dtv
    local sinceThreat = tick() - (SF._lastThreatAt or 0)
    local ivScan = (((SF.threats or 0) > 0) or sinceThreat < 1.0) and 0.05 or 0.15
    nếu SF._sc >= ivScan thì
        local okS = pcall(MV.Safe.Scan, r.Position, SF._sc)
        SF._sc = 0
        if not okS then SF.threats, SF.nearest = 0, nil end
    kết thúc
    cục bộ hiện tại = tick()
    liên hệ cục bộ = ((SF.threats hoặc 0) > 0) hoặc ((hiện tại - (SF._holdAt hoặc 0)) < 0,35)
    các khóa cục bộ = (h và h.MoveDirection) hoặc Vector3.new(0, 0, 0)
    local vX = tonumber(SF._virtX) or 0
    local vZ = tonumber(SF._virtZ) or 0
    nếu math.abs(vX) > 0.01 hoặc math.abs(vZ) > 0.01 thì
        keys = Vector3.new(vX, 0, vZ)
    kết thúc
    local busy = Keys.Magnitude >= 0.01 -- đang nhấn WASD / joystick Virtual -> nhường quyền cho bạn
    thư mục cục bộ = khóa
    nếu dir.Magnitude < 0.01 và SF.auto thì
        local cam = workspace.CurrentCamera
        nếu có camera thì
            góc nhìn cục bộ = cam.CFrame.LookVector
            dir = Vector3.new(look.X, 0, look.Z)
        kết thúc
    kết thúc
    if dir.Magnitude > 0 then dir = dir.Unit else dir = Vector3.new(0, 0, 0) end
    local up = UserInputService:IsKeyDown(Enum.KeyCode.Space)
    local down = UserInputService:IsKeyDown(Enum.KeyCode.LeftShift)
              hoặc UserInputService:IsKeyDown(Enum.KeyCode.LeftControl)
    local vY = tonumber(SF._virtY) or 0
    địa phương vv
    nếu math.abs(vY) > 0.01 thì
        vv = vY
    khác
        vv = (lên cộng 1 hoặc 0) - (xuống cộng 1 hoặc 0)
    kết thúc
    tốc độ cục bộ = mvClamp(SF.speed, 1, 2000, 60)
    mục tiêu địa phương
    nếu SF.circle và SF.auto và (không bận) và (không liên lạc) thì
        local R = mvClamp(SF.circleR, 3, 300, 20)
        local cx, cy, cz = r.Position.X, r.Position.Y, r.Position.Z
        if SF._center then cx, cy, cz = SF._center.X, SF._center.Y, SF._center.Z end
        local dxz = math.sqrt((r.Position.X - cx) ^ 2 + (r.Position.Z - cz) ^ 2)
        nếu dxz > R * 1.6 thì
            SF._center = nil
            cx, cy, cz = r.Position.X, r.Position.Y, r.Position.Z
        nếu SF._center == nil thì
            SF._center = { X = cx, Y = cy, Z = cz }
        kết thúc
        SF._ang = (SF._ang or 0) + dtv * (spd / math.max(R, 1)) -- bay đều quanh tâm
        local tx = cx + math.cos(SF._ang) * R
        tz địa phương = cz + math.sin(SF._ang) * R
        tang cục bộ = Vector3.new(-math.sin(SF._ang), 0, math.cos(SF._ang)) * spd
        local want = Vector3.new(tx - r.Position.X, cy - r.Position.Y, tz - r.Position.Z)
        mục tiêu = tang + muốn * 2.2 + Vector3.new(0, vv * spd, 0)
        if target.Magnitude > spd then target = target.Unit * spd end
    khác
        SF._center = nil -- rời khỏi vòng tròn chế độ -> tâm mới sau
        mục tiêu = (dir + Vector3.new(0, vv, 0)) * spd
    kết thúc
    đại diện địa phương = SF._rep
    nếu (rep == nil hoặc rep.Magnitude < 0.01) và SF._lastRep ~= nil thì
        local el = now - (SF._lastThreatAt or 0)
        if el < 0.9 then Rep = SF._lastRep * (1 - el / 0.9) end -- tăng tăng, không cô hướng
    kết thúc
    nếu rep và rep.Magnitude > 0 thì
        mục tiêu = mục tiêu + rep * (spd * (0.25 + 0.09 * mvClamp(SF.steer, 1, 10, 4)))
        công suất cục bộ = tốc độ * 2
        if target.Magnitude > cap then target = target.Unit * cap end
    kết thúc
    nếu SF.nearest và SF.nearest < mvClamp(SF.radius, 1, 300, 25) * 0.4 thì
        mục tiêu = mục tiêu + Vector3.new(0, spd * 0.75, 0)
    kết thúc
    SF._myV = mục tiêu
    bv.Vận tốc = mục tiêu
    nếu bg và target.Magnitude > 0.1 thì
        local lookPos = r.Position + Vector3.new(target.X, 0, target.Z)
        nếu (lookPos - r.Position).Magnitude > 0.1 thì
            bg.CFrame = CFrame.new(r.Position, lookPos)
        kết thúc
    kết thúc
    if SF.shield then pcall(MV.Safe.UpdateShield, r.Position) end
    SF._hudAcc = (SF._hudAcc hoặc 0) + dtv
    nếu SF._hudAcc >= 0.3 thì
        SF._hudAcc = 0
        if SF._hudUpdate then pcall(SF._hudUpdate) end
    kết thúc
kết thúc
hàm MV.Safe.Set(on)
    if on == true và MV.fly thì MV.SetFly(false) end -- không để hai BodyVelocity tranh lực
    SF.on = (on == true)
    nếu SF.on thì
        nếu SF.noclip và SF._ncPrev == nil thì
            SF._ncPrev = MV.noclip == true
            pcall(function() MV.SetNoclip(true) end)
        kết thúc
        pcall(MV.Safe._EnsureBV)
        MV.flySpeed ​​= mvClamp(SF.speed, 1, 2000, 60)
        SF._root = MV.Root()
        pcall(MV._Watchdog)
        SF._lastFrameAt = tick()
        pcall(MV.Safe.Bind)
        pcall(function() MV.Safe.UpdateShield(MV.Root() and MV.Root().Position or Vector3.new(0, 0, 0)) end)
        pcall(function() MV.Safe.SyncHud() end)
    khác
        pcall(MV.Safe.Unbind)
        MV.Safe.Reset()
        pcall(function() MV.Safe.ClearVirt() end)
        pcall(function() if SF._bv then SF._bv:Destroy() end end)
        pcall(function() if SF._bg then SF._bg:Destroy() end end)
        SF._bv, SF._bg = nil, nil
        nếu không phải MV.fly thì
            local h = MV.Hum()
            nếu h thì
                pcall(function() h.PlatformStand = false end)
                pcall(function() h.AutoRotate = true end)
            kết thúc
        kết thúc
        MV.Safe.KillShield()
        SF._root = nil
        nếu SF._ncPrev ~= nil thì
            local was = SF._ncPrev
            SF._ncPrev = nil
            local stillFlying = (MV._glassFlyActive == true) hoặc (MV._playerFlyActive == true)
            nếu không còn bay nữa thì
                pcall(function() MV.SetNoclip(was) end)
            kết thúc
        kết thúc
        pcall(function() MV.Safe.SyncHud() end)
    kết thúc
    trả lại SF.on
kết thúc
hàm MV.Safe.SetNoclipAuto(b)
    SF.noclip = (b == true)
    nếu SF.on thì
        nếu SF.noclip thì
            if SF._ncPrev == nil then SF._ncPrev = MV.noclip == true end
            pcall(function() MV.SetNoclip(true) end)
        elseif SF._ncPrev ~= nil then
            local was = SF._ncPrev
            SF._ncPrev = nil
            pcall(function() MV.SetNoclip(was) end)
        kết thúc
    kết thúc
    trả về SF.noclip
kết thúc
hàm MV.Safe.SetShield(b)
    SF.shield = (b == true)
    nếu SF.on và SF.shield thì
        cục bộ r = MV.Root()
        if r then pcall(MV.Safe.UpdateShield, r.Position) end
    khác
        MV.Safe.KillShield()
    kết thúc
    trả lại SF.shield
kết thúc
hàm MV.Safe.SetAvoidPlayers(b)
    SF.avoidPlayers = (b == true)
    MV.Safe.Reset()
    trả về SF.avoidPlayers
kết thúc
function MV.Safe.Reset() -- quên dấu vết cũ (không chắc ma vật biến mất)
    SF._seen, SF._cache = {}, nil
    SF._rep = Vector3.new(0, 0, 0)
    SF.threats, SF.nearest, SF.playerThreats = 0, nil, 0
    SF.movers, SF._lastRep, SF._lastThreatAt, SF._mvCount = 0, nil, nil, nil -- v4.20
    SF._holdAt, SF._center, SF._ang = 0, nil, 0
    SF._myV = Vector3.new(0, 0, 0)
kết thúc
function MV.Safe.Stop() return MV.Safe.Set(false) end
hàm MV.Safe.SetCircle(b)
    SF.circle = (b == true)
    SF._center = nil
    trả về SF.circle
kết thúc
hàm MV.Safe.SetCircleR(n)
    SF.circleR = mvClamp(n, 3, 300, 20)
    SF._center = nil
    trả về SF.circleR
kết thúc
hàm MV.Safe.Recenter()
    SF._center = nil
    trả về giá trị đúng
kết thúc
function MV.Safe.SetLook(t) -- 👁 nhìn trước (giây) để né vật đang bay tới
    SF.lookTime = mvClamp(t, 0.1, 3, 1.0)
    trả về SF.lookTime
kết thúc
hàm MV.Safe.SetRadius(n)
    SF.radius = mvClamp(n, 1, 300, 25)
    MV.Safe.Reset()
    SF._shieldPos = nil --thay đổi kính -> vẽ lại theo kích thước mới
    nếu SF.on và SF.shield thì
        cục bộ r = MV.Root()
        if r then pcall(MV.Safe.UpdateShield, r.Position) end
    kết thúc
    trả về bán kính SF.
kết thúc

hàm MV.Safe.SetShieldSize(n)
    SF.shieldSize = mvClamp(n, 0, 300, 0)
    SF._shieldPos = nil
    nếu SF.on và SF.shield thì
        cục bộ r = MV.Root()
        if r then pcall(MV.Safe.UpdateShield, r.Position) end
    kết thúc
    trả về SF.shieldSize
kết thúc
hàm MV.Safe.SetSpeed(n)
    SF.speed = mvClamp(n, 1, 2000, 60)
    MV.flySpeed ​​= SF.speed -- for frame ⚙ và một số trạng thái tương tự
    trả về SF.speed
kết thúc
function MV.Safe.SetSteer(n) SF.steer = mvClamp(n, 1, 10, 4); return SF.steer end
function MV.Safe.SetAuto(b) SF.auto = (b == true); return SF.auto end
hàm MV.Safe.Status()
    if not SF.on then return "🛡 bay an toàn: đang TẮT (khiên up, Xuyên Tường trả lại như cũ)" end
    local s = string.format("🛡 bay an toàn: BẬT · 💨 %g · 📏 né trong %gm · 🌀 %g",
        SF.speed, SF.radius, SF.steer)
    if SF.auto then s = s .. " · ➡ tự bay" end
    nếu SF.shield thì
        local half = MV.Safe.ShieldHalf()
        s = s .. string.format(" · 🔲 %gm/c%s", half * 2, (tonumber(SF.shieldSize) or 0) > 0 and "" or " (tự)")
    kết thúc
    nếu SF.circle và SF.auto thì
        cục bộ bận = sai
        local hum0 = MV.Hum()
        local md0 = hum0 and hum0.MoveDirection
        if md0 and md0.Magnitude and md0.Magnitude >= 0.01 then busy = true end
        if math.abs(tonumber(SF._virtX) or 0) > 0.01 or math.abs(tonumber(SF._virtZ) or 0) > 0.01 then busy = true end
        nếu (SF.threats hoặc 0) > 0 thì
            s = s .. " · ⭕ tạm dừng (đang né)"
        nếu bận thì
            s = s .. " · ⭕ tạm dừng (đang nhấn phím)"
        khác
            s = s .. " · ⭕ bay vòng tròn " .. tostring(math.floor(SF.circleR + 0.5)) .. "m"
        kết thúc
    kết thúc
    nếu (SF.movers hoặc 0) > 0 và (SF.threats hoặc 0) == 0 thì
        s = s .. string.format(" · 🐾 thấy %d vật thể đang chạy", SF.movers)
    kết thúc
    nếu SF.noclip thì s = s.. " · 🧱 xuyên vật cản" end
    nếu (SF.threats hoặc 0) > 0 thì
        s = s .. string.format(" · ⚠️ đang né %d mối nguy (gần nhất %gm)", SF.threats,
            math.floor((SF.nearest or 0) + 0.5))
        if (SF.playerThreats or 0) > 0 then s = s .. string.format(" — có %d người chơi", SF.playerThreats) end
    khác
        s = s.. " · ✅ quanh đây không có gì lao tới mình"
    kết thúc
    nếu SF.showHud và SF.on thì
        s = s .. " · 📱 nút ảo BẬT"
    kết thúc
    trả về s
kết thúc

hàm MV.Safe.SetVirt(x, z, y)
    SF._virtX = mvClamp(tonumber(x) or 0, -1, 1, 0)
    SF._virtZ = mvClamp(tonumber(z) or 0, -1, 1, 0)
    SF._virtY = mvClamp(tonumber(y) or 0, -1, 1, 0)
    Trả về SF._virtX, SF._virtZ, SF._virtY
kết thúc
hàm MV.Safe.ClearVirt()
    SF._virtX, SF._virtZ, SF._virtY = 0, 0, 0
    trả về giá trị đúng
kết thúc
hàm MV.Safe.SetShowHud(b)
    SF.showHud = (b == true)
    nếu không phải SF.showHud thì
        pcall(function() MV.Safe.ClearVirt() end)
        pcall(function()
            if SF._joyKnob then SF._joyKnob.Position = UDim2.new(0.5, -16, 0.5, -16) end
        kết thúc)
        SF._dragging = false
    kết thúc
    pcall(function() MV.Safe.SyncHud() end)
    trả về SF.showHud
kết thúc
hàm MV.Safe._BuildHud()
    if SF._hud and SF._hud.Parent then return SF._hud end
    cục bộ hud = New("Khung", {
        Tên = "BC_SafeHud",
        Kích thước = UDim2.new(0, 300, 0, 190),
        Vị trí = UDim2.new(0, 10, 1, -200),
        BackgroundColor3 = C.SURFACE,
        Độ trong suốt của nền = 0.18,
        BorderSizePixel = 0,
        Hiển thị = false,
        Chỉ số Z = 25,
    }, gui)
    Góc(hud, UDim.new(0, 12))
    Stroke(hud, C.HAIRLINE, 1)
    D.Shade(hud, Color3.fromRGB(255,255,255), Color3.fromRGB(188,192,205), 90)

    tiêu đề cục bộ = Mới("Nhãn văn bản", {
        Kích thước = UDim2.new(1, -70, 0, 18), Vị trí = UDim2.new(0, 10, 0, 4),
        Text = "🛡 Bay An Toàn - Nút Ảo", BackgroundTransparency = 1,
        TextColor3 = C.ACCENT, Phông chữ = Enum.Font.GothamBold, TextSize = 10,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 26,
    }, hud)

    local hideBtn = New("TextButton", {
        Kích thước = UDim2.new(0, 28, 0, 20), Vị trí = UDim2.new(1, -62, 0, 2),
        Văn bản = "👁", Màu nền 3 = C.SURFACE3, Độ trong suốt nền = 0.15,
        TextColor3 = C.MUTED, Font = Enum.Font.GothamBold, TextSize = 10,
        BorderSizePixel = 0, ZIndex = 26,
    }, hud)
    Góc(hideBtn, UDim.new(0, 6))
    hideBtn.Activated:Connect(function()
        MV.Safe.SetShowHud(false)
        D.Say("📱 đã ẩn nút ảo 🛡 (vào khung 🛡 trong 📚 Script Hub để BẬT lại)", C.MUTED)
    kết thúc)

    local closeBtn = New("TextButton", {
        Kích thước = UDim2.new(0, 28, 0, 20), Vị trí = UDim2.new(1, -32, 0, 2),
        Văn bản = "✕", Màu nền 3 = Đỏ đậm, Độ trong suốt nền = 0.2,
        TextColor3 = C.WHITE, Font = Enum.Font.GothamBold, TextSize = 10,
        BorderSizePixel = 0, ZIndex = 26,
    }, hud)
    Góc(closeBtn, UDim.new(0, 6))
    closeBtn.Activated:Connect(function()
        MV.Safe.Stop()
        D.Say("🚫 đã tắt 🛡 Bảy An Toàn", C.YELLOW)
    kết thúc)

    local joyBG = New("Frame", {
        Tên = "JoyBG",
        Kích thước = UDim2.new(0, 110, 0, 110), Vị trí = UDim2.new(0, 10, 0, 26),
        BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.15,
        BorderSizePixel = 0, ZIndex = 26,
    }, hud)
    Góc(joyBG, UDim.new(0, 14))
    Đột quỵ (joyBG, C.BORDER, 1)
    SF._joyBG = joyBG

    local joyKnob = New("Frame", {
        Tên = "JoyKnob",
        Kích thước = UDim2.new(0, 32, 0, 32), Vị trí = UDim2.new(0.5, -16, 0.5, -16),
        BackgroundColor3 = C.ACCENT, BackgroundTransparency = 0.15,
        BorderSizePixel = 0, ZIndex = 27,
    }, joyBG)
    Góc(joyKnob, UDim.new(1, 0))
    Stroke(joyKnob, C.WHITE, 1)
    SF._joyKnob = joyKnob

    hàm cục bộ dirBtn(txt, x, y, vx, vz)
        cục bộ b = New("TextButton", {
            Kích thước = UDim2.new(0, 28, 0, 28), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = txt, Màu nền 3 = C.SURFACE3, Độ trong suốt nền = 0.2,
            TextColor3 = C.DARK, Font = Enum.Font.GothamBold, TextSize = 12,
            BorderSizePixel = 0, ZIndex = 27,
        }, joyBG)
        Góc(b, UDim.new(1, 0))
        nắm giữ địa phương = sai
        b.InputBegan:Connect(function(inp)
            nếu inp.UserInputType == Enum.UserInputType.MouseButton1 hoặc inp.UserInputType == Enum.UserInputType.Touch thì
                giữ = đúng
                MV.Safe.SetVirt(vx, vz, SF._virtY)
            kết thúc
        kết thúc)
        b.InputEnded:Connect(function(inp)
            nếu inp.UserInputType == Enum.UserInputType.MouseButton1 hoặc inp.UserInputType == Enum.UserInputType.Touch thì
                giữ = sai
                if not SF._dragging then MV.Safe.SetVirt(0, 0, SF._virtY) end
            kết thúc
        kết thúc)
        trả lại b
    kết thúc
    dirBtn("↑", 41, 2, 0, -1)
    dirBtn("↓", 41, 80, 0, 1)
    dirBtn("←", 2, 41, -1, 0)
    dirBtn("→", 80, 41, 1, 0)

    hàm cục bộ updateJoy(inputPos)
        local okPos, absPos = pcall(function() return joyBG.AbsolutePosition end)
        local okSize, absSize = pcall(function() return joyBG.AbsoluteSize end)
        if not (okPos and okSize and absPos and absSize) then return end
        local cx = absPos.X + absSize.X * 0.5
        local cy = absPos.Y + absSize.Y * 0.5
        local dx = inputPos.X - cx
        local dy = inputPos.Y - cy
        giá trị R tối đa cục bộ = 38
        độ lớn cục bộ = math.sqrt(dx*dx + dy*dy)
        nếu mag > maxR thì
            dx = dx / mag * maxR
            dy = dy / mag * maxR
            mag = maxR
        kết thúc
        pcall(function()
            joyKnob.Position = UDim2.new(0.5, dx - 16, 0.5, dy - 16)
        kết thúc)
        nx cục bộ = dx / maxR
        local nz = dy / maxR
        pcall(function() MV.Safe.SetVirt(nx, nz, SF._virtY) end)
    kết thúc
    hàm cục bộ resetJoy()
        SF._dragging = false
        pcall(function()
            joyKnob.Position = UDim2.new(0.5, -16, 0.5, -16)
        kết thúc)
        MV.Safe.SetVirt(0, 0, SF._virtY)
    kết thúc

    joyBG.InputBegan:Connect(function(inp)
        nếu inp.UserInputType == Enum.UserInputType.MouseButton1 hoặc inp.UserInputType == Enum.UserInputType.Touch thì
            SF._dragging = true
            updateJoy(inp.Position)
        kết thúc
    kết thúc)
    joyBG.InputChanged:Connect(function(inp)
        nếu SF._dragging và (inp.UserInputType == Enum.UserInputType.MouseMovement hoặc inp.UserInputType == Enum.UserInputType.Touch) thì
            updateJoy(inp.Position)
        kết thúc
    kết thúc)
    trackConn(UserInputService.InputChanged:Connect(function(inp)
        nếu SF._dragging và (inp.UserInputType == Enum.UserInputType.MouseMovement hoặc inp.UserInputType == Enum.UserInputType.Touch) thì
            local ok, pos = pcall(function() return inp.Position end)
            nếu ok và pos thì cập nhậtJoy(pos) kết thúc
        kết thúc
    kết thúc))
    trackConn(UserInputService.InputEnded:Connect(function(inp)
        nếu inp.UserInputType == Enum.UserInputType.MouseButton1 hoặc inp.UserInputType == Enum.UserInputType.Touch thì
            nếu SF._dragging thì đặt lại Joy()
        kết thúc
    kết thúc))

    hàm cục bộ vBtn(txt, x, y, w, h, color, cb)
        cục bộ b = New("TextButton", {
            Kích thước = UDim2.new(0, w, 0, h), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = txt, Màu nền 3 = màu hoặc C.SURFACE3, Độ trong suốt nền = 0.15,
            TextColor3 = D.BestText(color or C.SURFACE3), Font = Enum.Font.GothamBold, TextSize = 11,
            BorderSizePixel = 0, ZIndex = 27,
        }, hud)
        Góc(b, UDim.new(0, 8))
        Stroke(b, C.BORDER, 1)
        giữ cục bộ = sai
        nếu cb thì
            b.InputBegan:Connect(function(inp)
                nếu inp.UserInputType == Enum.UserInputType.MouseButton1 hoặc inp.UserInputType == Enum.UserInputType.Touch thì
                    giữ = đúng
                    pcall(cb, true)
                kết thúc
            kết thúc)
            b.InputEnded:Connect(function(inp)
                nếu inp.UserInputType == Enum.UserInputType.MouseButton1 hoặc inp.UserInputType == Enum.UserInputType.Touch thì
                    giữ = sai
                    pcall(cb, false)
                kết thúc
            kết thúc)
            b.Activated:Connect(function() pcall(cb, nil) end)
        kết thúc
        trả lại b
    kết thúc

    vBtn("⬆", 130, 26, 40, 36, Color3.fromRGB(0,150,0), function(isDown)
        if isDown == true then MV.Safe.SetVirt(SF._virtX, SF._virtZ, 1)
        elseif isDown == false then MV.Safe.SetVirt(SF._virtX, SF._virtZ, 0)
        khác
            pcall(function() MV.Nudge(2.5) end)
        kết thúc
    kết thúc)
    vBtn("⬇", 130, 66, 40, 36, Color3.fromRGB(150,0,0), function(isDown)
        if isDown == true then MV.Safe.SetVirt(SF._virtX, SF._virtZ, -1)
        elseif isDown == false then MV.Safe.SetVirt(SF._virtX, SF._virtZ, 0)
        khác
            pcall(function() MV.Nudge(-2.5) end)
        kết thúc
    kết thúc)

    vBtn("⏹ cột", 130, 108, 82, 26, C.RED, function() MV.Safe.Stop() end)
    vBtn("⭕ Tâm", 216, 108, 52, 26, C.PURPLE, function() MV.Safe.Recenter() end)

    vBtn("↻", 174, 26, 36, 36, C.SURFACE3, function()
        SF._ang = (SF._ang hoặc 0) + 0,6
    kết thúc)

    local autoTog = vBtn("➡Tự: BẬT", 10, 142, 82, 24, C.GREEN, function()
        MV.Safe.SetAuto(not SF.auto)
        D.Say(SF.auto và "➡ tự bay: BẬT" hoặc "➡ tự bay: TẮT", C.ACCENT)
        pcall(function() if S.SyncSafePanel then S.SyncSafePanel() end end)
        pcall(function() MV.Safe.SyncHud() end)
    kết thúc)
    local CircTog = vBtn("⭕ Vòng: BẬT", 96, 142, 82, 24, C.GREEN, function()
        MV.Safe.SetCircle(not SF.circle)
        D.Say(SF.circle và "⭕ vòng tròn: BẬT" hoặc "⭕ vòng tròn: TẮT", C.ACCENT)
        pcall(function() if S.SyncSafePanel then S.SyncSafePanel() end end)
        pcall(function() MV.Safe.SyncHud() end)
    kết thúc)

    local speedLbl = New("TextLabel", {
        Kích thước = UDim2.new(0, 108, 0, 24), Vị trí = UDim2.new(0, 182, 0, 142),
        Văn bản = "💨 60", Độ trong suốt nền = 1, Màu chữ 3 = C.MUTED,
        Font = Enum.Font.GothamMedium, TextSize = 9, TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 27,
    }, hud)

    LÀM
        kéo cục bộ, vị trí bắt đầu, đầu vào bắt đầu
        tiêu đề.Đầu vàoBắt đầu:Kết nối(hàm(inp)
            nếu inp.UserInputType == Enum.UserInputType.MouseButton1 hoặc inp.UserInputType == Enum.UserInputType.Touch thì
                kéo = đúng
                startInput = inp.Position
                startPos = hud.Position
            kết thúc
        kết thúc)
        trackConn(UserInputService.InputChanged:Connect(function(inp)
            nếu kéo và (inp.UserInputType == Enum.UserInputType.MouseMovement hoặc inp.UserInputType == Enum.UserInputType.Touch) thì
                local delta = inp.Position - startInput
                hud.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
            kết thúc
        kết thúc))
        trackConn(UserInputService.InputEnded:Connect(function(inp)
            nếu inp.UserInputType == Enum.UserInputType.MouseButton1 hoặc inp.UserInputType == Enum.UserInputType.Touch thì
                kéo lê = sai
            kết thúc
        kết thúc))
    kết thúc

    hàm SF._hudUpdate()
        pcall(function()
            nếu autoTog thì
                autoTog.Text = SF.auto và "➡ Tự: BẬT" hoặc "➡ Tự: TẮT"
                autoTog.BackgroundColor3 = SF.auto và C.GREEN hoặc C.SURFACE3
                autoTog.TextColor3 = D.BestText(autoTog.BackgroundColor3)
            kết thúc
            nếu circTog thì
                CircTog.Text = SF.circle và "⭕ Vòng: BẬT" hoặc "⭕ Vòng: TẮT"
                circTog.BackgroundColor3 = SF.circle and C.GREEN or C.SURFACE3
                CircTog.TextColor3 = D.BestText(circTog.BackgroundColor3)
            kết thúc
            nếu tốc độLbl thì
                mối đe dọa cục bộ = SF.threats hoặc 0
                speedLbl.Text = string.format("💨 %g · %s%d", SF.speed or 60, thr>0 and "⚠️" or "✅", thr)
                speedLbl.TextColor3 = thr>0 và C.YELLOW hoặc C.MUTED
            kết thúc
        kết thúc)
    kết thúc

    SF._hud = hud
    trả về hud
kết thúc

hàm MV.Safe.SyncHud()
    pcall(function()
        local hud = MV.Safe._BuildHud()
        nếu hud thì
            local should = (SF.on == true) and (SF.showHud ~= false)
            hud.Visible = nên
            if should and SF._hudUpdate then SF._hudUpdate() end
        kết thúc
        nếu SF.on thì
            cục bộ cũ = MV._hud
            nếu cũ thì old.Visible = false kết thúc
        khác
            pcall(function() MV.SyncHud() end)
        kết thúc
    kết thúc)
kết thúc

end -- hết khối 🛡 BAY AN TOÀN (v4.18)

--------- 🪩 THẢM KÍNH (chỉnh ngắn × Cao × Dài + khoảng cách tới chân) ----------
Hàm MV.SetCarpetSize(w, h, l)
    MV.carpetW = mvClamp(w, 1, 50, MV.carpetW)
    MV.carpetH = mvClamp(h, 0.05, 10, MV.carpetH)
    MV.carpetL = mvClamp(l, 1, 50, MV.carpetL)
    nếu MV._carpet thì
        pcall(function()
            MV._carpet.Size = Vector3.new(MV.carpetW, MV.carpetH, MV.carpetL)
        kết thúc)
    kết thúc
    Trả về MV.carpetW, MV.carpetH, MV.carpetL
kết thúc
hàm MV.SetCarpetGap(g)
    MV.carpetGap = mvClamp(g, 0, 10, MV.carpetGap)
    nếu MV.carpet thì
        cục bộ r = MV.Root()
        nếu r thì MV.carpetY = r.Position.Y - 3.0 - (MV.carpetH / 2) - MV.carpetGap end
    kết thúc
    trả về MV.carpetGap
kết thúc
hàm MV.FootY()
    cục bộ r = MV.Root()
    nếu không phải r thì trả về nil.
    return r.Position.Y - 3.0 - (MV.carpetH / 2) - (MV.carpetGap or 0)
kết thúc
hàm MV._StopCarpet()
    if MV._carpet then pcall(function() MV._carpet:Destroy() end) end
    MV._carpet = nil
    MV.carpetY = nil
    pcall(function() RunService:UnbindFromRenderStep("Carpet") end)
kết thúc
hàm MV.CarpetHost()
    nếu (MV._carpetRetries hoặc 0) >= 3 thì
        local cam = workspace.CurrentCamera
        nếu là cam thì trả về đầu cam
    kết thúc
    trả về không gian làm việc
kết thúc
hàm MV._MakeEdge(cp)
    pcall(function()
        if not cp or cp:FindFirstChild("CarpetEdge") then return end
        Mới("Hộp lựa chọn", {
            Tên = "CarpetEdge", Trang trí = cp,
            Color3 = Color3.fromRGB(120, 225, 255), LineThickness = 0.035,
            Độ trong suốt bề mặt = 0,65, Độ trong suốt = 0,
        }, cp)
    kết thúc)
kết thúc
hàm MV.SetCarpetEdge(on)
    MV.carpetEdge = (on == true)
    local cp = MV._carpet
    nếu cp và cp.Parent thì
        nếu MV.carpetEdge thì
            MV._MakeEdge(cp)
        khác
            pcall(function()
                cục bộ cũ = cp:FindFirstChild("CarpetEdge")
                nếu cũ thì hủy bỏ cũ()
            kết thúc)
        kết thúc
    kết thúc
    trả về MV.carpetEdge
kết thúc
hàm MV.SetCarpetHold(on)
    MV.carpetHold = (on == true)
    trả lại MV.carpetHold
kết thúc
hàm MV.SetCarpetSlack(n)
    MV.carpetSlack = mvClamp(n, 0, 20)
    trả về MV.carpetSlack
kết thúc
hàm MV.CreateCarpet(y)
    cục bộ r = MV.Root()
    nếu không phải r thì trả về end
    if MV._carpet then pcall(function() MV._carpet:Destroy() end) end
    MV.carpetY = y hoặc MV.FootY()
    MV._carpet = New("Part", {
        Tên = "Thảm",
        Kích thước = Vector3.new(MV.carpetW, MV.carpetH, MV.carpetL),
        Độ trong suốt = 0,55,
        Màu = Color3.fromRGB(150, 210, 255),
        Vật liệu = Enum.Material.Glass,
        Cố định = true, CanCollide = true, Ma sát = 1,
        Vị trí = Vector3.new(r.Position.X, MV.carpetY, r.Position.Z),
    }, MV.CarpetHost())
    if MV.carpetEdge ~= false then MV._MakeEdge(MV._carpet) end
    RunService:BindToRenderStep("Carpet", Enum.RenderPriority.Camera.Value - 1, function(dt)
        local curR, cp = MV.Root(), MV._carpet
        nếu không phải MV.carpet hoặc không phải curR thì trả về end
        nếu không cp hay không cp.Parent thì -- v4.12.2: bị xóa -> trải lại ngay
            MV._carpetRetries = (MV._carpetRetries hoặc 0) + 1
            pcall(MV.CreateCarpet, MV.carpetY)
            cp = MV._carpet
            nếu không phải cp hoặc không phải cp.Parent thì trả về end
        kết thúc
        nếu cp.Size.X ~= MV.carpetW hoặc cp.Size.Y ~= MV.carpetH hoặc cp.Size.Z ~= MV.carpetL thì
            cp.Size = Vector3.new(MV.carpetW, MV.carpetH, MV.carpetL)
        kết thúc
        local px, pz = curR.Position.X, curR.Position.Z
        nếu math.abs(cp.Position.X - px) > 0.005 hoặc math.abs(cp.Position.Z - pz) > 0.005
            hoặc cp.Position.Y ~= MV.carpetY thì
            cp.CFrame = CFrame.new(px, MV.carpetY, pz)
        kết thúc
        nếu MV.carpetHold ~= false thì
            local RideY = MV.carpetY + (MV.carpetH / 2) + 3.0 -- cao độ khi đứng trên mặt thảm
            local vel = curR.AssemblyLinearVelocity
            local vx, vz = MV.comp(vel, "X", 0), MV.comp(vel, "Z", 0)
            local vy = MV.comp(vel, "Y", 0)
            local ry = curR.Position.Y
            bay cục bộ = (MV.fly == true) hoặc (MV._glassFlyActive == true)
                hoặc (MV._playerFlyActive == true) hoặc (MV.Safe và MV.Safe.on == true)
            nếu đi máy bay thì
            nếu MV.noclip thì
                dy cục bộ = (rideY + 0,35) - ry
                nếu dy > 12 thì
                    nếu (tick() - (MV._carpetFixAt hoặc 0)) > 0.5 thì
                        MV._carpetFixAt = tick()
                        local fy = MV.FootY()
                        if fy then pcall(MV.CreateCarpet, fy) end
                    kết thúc
                kết thúc
                địa phương lên
                nếu dy > 0,6 và vy < 2 thì
                    up = math.min(dy * 8, 10)
                nếu dy > 0,05 và vy < 0,5 thì
                    lên = math.min(dy * 16, 8)
                kết thúc
                nếu lên và vy < lên thì
                    pcall(function() curR.AssemblyLinearVelocity = Vector3.new(vx, up, vz) end)
                kết thúc
            khác
                độ chùng cục bộ = tonumber(MV.carpetSlack) hoặc 0.5
                nếu ry < rideY - slack và vy <= 0,1 thì
                    curR.CFrame = CFrame.new(curR.Position.X, rideY, curR.Position.Z)
                    nếu vy < 0 thì
                        curR.AssemblyLinearVelocity = Vector3.new(vx, 0, vz)
                    kết thúc
                kết thúc
            kết thúc
        kết thúc
        nếu MV.autoGlass thì
            pcall(MV._AutoGlassTick, curR.Position)
        kết thúc
    kết thúc)
kết thúc
hàm MV.SetCarpet(on)
    bật = (bật == đúng)
    cục bộ r = MV.Root()
    nếu bật chứ không phải r thì trả về false, "chưa có nhân vật để trải thảm" end
    if on và MV.fly thì MV.SetFly(false) end -- bay và thảm không đi cùng (như bản gốc)
    MV.carpet = trên
    nếu bật thì
        MV._carpetRetries = 0
        MV.CreateCarpet(on and MV.FootY() or nil)
    khác
        MV._StopCarpet()
    kết thúc
    MV._Watchdog()
    MV.SyncHud()
    trả lại MV.carpet
kết thúc

--------- v4.24: ĐẶT KÍNH DƯỚI CHÂN (đặt nhiều tấm kính cố định) ----------
MV._placedGlasses = MV._placedGlasses hoặc {}
MV._glassId = MV._glassId hoặc 0
MV.autoGlass = MV.autoGlass hoặc false
MV._lastGlassPos = MV._lastGlassPos hoặc nil

hàm MV.PlaceGlass()
    cục bộ r = MV.Root()
    nếu không r thì trả về false, "chưa có nhân vật để đặt kính" end
    local y = MV.FootY()
    nếu không phải y thì y = r.Position.Y - 3.0 - (MV.carpetH / 2) - (MV.carpetGap hoặc 0) end
    MV._glassId = (MV._glassId hoặc 0) + 1
    tên cục bộ = "BC_Glass_" .. tostring(MV._glassId)
    local sz = Vector3.new(MV.carpetW, MV.carpetH, MV.carpetL)
    local pos = Vector3.new(r.Position.X, y, r.Position.Z)
    phần cục bộ = nil
    cục bộ ok = pcall(function()
        phần = Mới("Phần", {
            Tên = tên,
            Kích thước = sz,
            Độ trong suốt = 0,45,
            Màu = Color3.fromRGB(150, 210, 255),
            Vật liệu = Enum.Material.Glass,
            Cố định = true, CanCollide = true, Ma sát = 1,
            Vị trí = pos,
        }, MV.CarpetHost())
    kết thúc)
    nếu không ok hoặc không part thì trả về false, "không thể tạo kính" end
    nếu MV.carpetEdge ~= false thì
        pcall(function() MV._MakeEdge(part) end)
    kết thúc
    MV._placedGlasses[#MV._placedGlasses + 1] = part
    MV._lastGlassPos = { X = pos.X, Z = pos.Z }
    pcall(function()
        part.AncestryChanged:Connect(function(_, parent)
            nếu không phải là cha mẹ thì
                for i, p in ipairs(MV._placedGlasses) do
                    nếu p == phần thì
                        table.remove(MV._placedGlasses, i)
                        phá vỡ
                    kết thúc
                kết thúc
            kết thúc
        kết thúc)
    kết thúc)
    trả về giá trị đúng, một phần
kết thúc

hàm MV.ClearPlacedGlasses()
    cục bộ n = 0
    nếu MV._placedGlasses thì
        for _, p in ipairs(MV._placedGlasses) do
            nếu p và p.Parent thì
                pcall(function() p:Destroy() end)
                n = n + 1
            kết thúc
        kết thúc
    kết thúc
    MV._placedGlasses = {}
    MV._lastGlassPos = nil
    trả về n
kết thúc

hàm MV.RemoveGlassAt(idx)
    idx = tonumber(idx)
    nếu không phải idx hoặc idx < 1 thì trả về false, kết thúc "không hợp lệ số chỉ"
    danh sách cục bộ = MV._placedGlasses
    nếu không có danh sách hoặc không có danh sách [idx] thì trả về sai, kết thúc "không có kính ở vị trí đó"
    cục bộ p = danh sách[idx]
    pcall(function() if p and p.Parent then p:Destroy() end end)
    table.remove(list, idx)
    if #list == 0 then MV._lastGlassPos = nil end
    trả về true, #list
kết thúc

hàm MV.RemoveGlass(part)
    nếu không phải là một phần thì trả về false end
    danh sách cục bộ = MV._placedGlasses
    nếu không có trong danh sách thì trả về false.
    for i, p in ipairs(list) do
        nếu p == phần thì
            trả về MV.RemoveGlassAt(i)
        kết thúc
    kết thúc
    return false, "không tìm thấy"
kết thúc

hàm MV.GetPlacedGlasses()
    đầu ra cục bộ = {}
    nếu MV._placedGlasses thì
        for i, p in ipairs(MV._placedGlasses) do
            cục bộ ok, pos = pcall(function() return p.Position end)
            local nm = tostring(p.Name or ("Kính " .. i))
            nếu ổn và dương tính thì
                out[#out+1] = { idx = i, name = nm, x = pos.X, y = pos.Y, z = pos.Z, part = p }
            khác
                out[#out+1] = { idx = i, name = nm, x = 0, y = 0, z = 0, part = p }
            kết thúc
        kết thúc
    kết thúc
    trở lại
kết thúc

hàm MV.SetAutoGlass(on)
    MV.autoGlass = (on == true)
    trả về MV.autoGlass
kết thúc

hàm MV._AutoGlassTick(curPos)
    nếu không phải MV.autoGlass thì trả về end
    nếu không phải curPos thì trả về end
    local last = MV._lastGlassPos
    nếu không phải là cuối cùng thì
        pcall(function() MV.PlaceGlass() end)
        trở lại
    kết thúc
    local dx = curPos.X - last.X
    local dz = curPos.Z - last.Z
    khoảng cách cục bộ = math.sqrt(dx*dx + dz*dz)
    nhu cầu cục bộ = math.max(2, (tonumber(MV.carpetW) hoặc 12) * 0.7)
    nếu dist >= need thì
        pcall(function() MV.PlaceGlass() end)
    kết thúc
kết thúc

--------- v4.27: BAY TẤM KÍNH (đổi đặt kính thành bay tới kính, chỉnh tốc độ) ----------
MV.glassFlySpeed ​​= MV.glassFlySpeed ​​hoặc 60
MV._glassFlyTarget = MV._glassFlyTarget hoặc không
MV._glassFlyActive = MV._glassFlyActive hoặc sai
MV._glassFlyIdx = MV._glassFlyIdx hoặc không
MV._glassFlyBV = MV._glassFlyBV hoặc không
MV._glassFlyBG = MV._glassFlyBG hoặc không
MV._glassFlyNcPrev = MV._glassFlyNcPrev hoặc nil

hàm MV.SetGlassFlySpeed(n)
    cục bộ v = tonumber(n)
    nếu không phải v thì trả về MV.glassFlySpeed ​​kết thúc
    MV.glassFlySpeed ​​= mvClamp(v, 1, 500, MV.glassFlySpeed)
    trả về MV.glassFlySpeed
kết thúc

hàm MV._EnsureGlassFlyBV()
    cục bộ r = MV.Root()
    nếu không phải r thì trả về nil, nil end
    nếu MV._glassFlyBV và MV._glassFlyBV.Parent == r thì
        trả về MV._glassFlyBV, MV._glassFlyBG
    kết thúc
    pcall(function() nếu MV._glassFlyBV thì MV._glassFlyBV:Destroy() kết thúc)
    pcall(function() if MV._glassFlyBG then MV._glassFlyBG:Destroy() end end)
    local bv = New("BodyVelocity", { Name = "BC_GlassFlyVel", MaxForce = Vector3.new(1e9, 1e9, 1e9), Velocity = Vector3.new(0,0,0) }, r)
    local bg = New("BodyGyro", { Name = "BC_GlassFlyGyro", MaxTorque = Vector3.new(1e9, 1e9, 1e9), P = 1e4, D = 50 }, r)
    MV._glassFlyBV, MV._glassFlyBG = bv, bg
    local h = MV.Hum()
    nếu h thì
        pcall(function() h.PlatformStand = true end)
        pcall(function() h.AutoRotate = false end)
    kết thúc
    trả về bv, bg
kết thúc

hàm MV.StopGlassFly()
    MV._glassFlyActive = false
    MV._glassFlyTarget = nil
    MV._glassFlyIdx = nil
    pcall(function() RunService:UnbindFromRenderStep("BC_GlassFly") end)
    pcall(function() nếu MV._glassFlyBV thì MV._glassFlyBV:Destroy() kết thúc)
    pcall(function() if MV._glassFlyBG then MV._glassFlyBG:Destroy() end end)
    MV._glassFlyBV, MV._glassFlyBG = không, không
    nếu không phải MV.fly thì
        local h = MV.Hum()
        nếu h thì
            pcall(function() h.PlatformStand = false end)
            pcall(function() h.AutoRotate = true end)
        kết thúc
    kết thúc
    nếu MV._glassFlyNcPrev ~= nil thì
        địa phương là = MV._glassFlyNcPrev
        MV._glassFlyNcPrev = nil
        local stillFlying = (MV._playerFlyActive == true) or (MV.Safe and MV.Safe.on == true)
        nếu không còn bay nữa thì
            nếu là == false thì
                pcall(function() MV.SetNoclip(false) end)
            kết thúc
        kết thúc
    kết thúc
    trả về giá trị đúng
kết thúc

hàm MV._GlassFlyStep(dt)
    if not MV._glassFlyActive then return end
    mục tiêu cục bộ = MV._glassFlyTarget
    nếu không phải là mục tiêu thì
        MV.StopGlassFly()
        trở lại
    kết thúc
    cục bộ r = MV.Root()
    nếu không phải r thì
        MV.StopGlassFly()
        trở lại
    kết thúc
    vị trí cục bộ = r.Vị trí
    local dx = target.X - pos.X
    local dy = target.Y - pos.Y
    local dz = target.Z - pos.Z
    local dist = math.sqrt(dx*dx + dy*dy + dz*dz)
    nếu khoảng cách < 2,5 thì
        MV.StopGlassFly()
        pcall(function() if D.hubStatus then D.hubStatus.Text = "✅ đã bay tới " .. tostring(MV._glassFlyIdx and ("kính " .. MV._glassFlyIdx) or "kính") end end)
        trở lại
    kết thúc
    tốc độ cục bộ = tonumber(MV.glassFlySpeed) hoặc 60
    MV.SetNoclip(true) -- ⚡ v4.34: gọi thẳng (hàm nội bộ, đã tự động bọc pcal)
    local bv, bg = MV._EnsureGlassFlyBV()
    local dir = Vector3.new(dx/dist, dy/dist, dz/dist) -- ⚡ v4.34: tính 1 lần, tránh 3 lần/frame
    nếu bv thì
        bv.Velocity = dir * speed -- ⚡ v4.34: ghi thăng, hỗ trợ 1 đóng + 1 pcall/frame
    kết thúc
    nếu bg thì
        bg.CFrame = CFrame.new(pos, Vector3.new(target.X, pos.Y, target.Z))
    kết thúc
    nếu không phải BV thì
        bước cục bộ = math.min(dist, speed * (tonumber(dt) or 0.05))
        r.CFrame = CFrame.new(pos.X + dir.X*step, pos.Y + dir.Y*step, pos.Z + dir.Z*step)
    kết thúc
kết thúc

chức năng MV.FlyToGlass(idxOrPos)
    pcall(function() MV.StopPlayerFly() end)
    nếu MV._glassFlyNcPrev == nil và MV._playerFlyNcPrev == nil và (không phải MV.Safe hoặc MV.Safe._ncPrev == nil) thì
        MV._glassFlyNcPrev = MV.noclip == true
    kết thúc
    local targetPos = nil
    chỉ số cục bộ = nil
    nếu type(idxOrPos) == "number" thì
        idx = math.floor(idxOrPos)
        danh sách cục bộ = MV._placedGlasses
        nếu không có danh sách hoặc không có danh sách [idx] thì trả về sai, kết thúc "không có kính ở vị trí đó"
        cục bộ p = danh sách[idx]
        cục bộ ok, pos = pcall(function() return p.Position end)
        nếu không ok hoặc không pos thì trả về false, "kính không có vị trí" end
        targetPos = Vector3.new(pos.X, pos.Y + 3.5, pos.Z)
    elseif type(idxOrPos) == "table" and idxOrPos.X and idxOrPos.Y and idxOrPos.Z then
        targetPos = Vector3.new(idxOrPos.X, idxOrPos.Y + 3.5, idxOrPos.Z)
    khác
        trả về sai, "không hợp lệ hoặc sai số chỉ định"
    kết thúc
    nếu không phải MV.Root() thì trả về false, kết thúc "chưa có nhân vật"
    if MV.fly then MV.SetFly(false) end
    MV._glassFlyTarget = targetPos
    MV._glassFlyIdx = idx
    MV._glassFlyActive = true
    pcall(function() MV.SetNoclip(true) end)
    pcall(function() MV._EnsureGlassFlyBV() end)
    pcall(function() RunService:UnbindFromRenderStep("BC_GlassFly") end)
    pcall(function()
        RunService:BindToRenderStep("BC_GlassFly", Enum.RenderPriority.Camera.Value - 2, hàm(dt)
            pcall(MV._GlassFlyStep, dt)
        kết thúc)
    kết thúc)
    MV._Watchdog()
    trả về true, targetPos
kết thúc

--------- v4.28: BAY TỚI NGƯỜI CHƠI (xuyên tường, chỉnh tốc độ, 0=auto lấy tốc độ game) ----------
MV.playerFlySpeed ​​= MV.playerFlySpeed ​​hoặc 0
MV._playerFlyTarget = MV._playerFlyTarget hoặc nil
MV._playerFlyActive = MV._playerFlyActive hoặc false
MV._playerFlyPos = MV._playerFlyPos hoặc nil
MV._playerFlyBV = MV._playerFlyBV hoặc nil
MV._playerFlyBG = MV._playerFlyBG hoặc nil
MV._playerFlyNcPrev = MV._playerFlyNcPrev hoặc nil

hàm MV.SetPlayerFlySpeed(n)
    cục bộ v = tonumber(n)
    if v == nil thì trả về false, "nhập số 0-500 (0=auto)" end
    nếu v == 0 thì
        MV.playerFlySpeed ​​= 0
        trả về true, 0
    kết thúc
    MV.playerFlySpeed ​​= mvClamp(v, 1, 500, MV.playerFlySpeed ​​or 0)
    trả về true, MV.playerFlySpeed
kết thúc

hàm MV.GetPlayerFlySpeed()
    local s = tonumber(MV.playerFlySpeed) or 0
    nếu s == 0 thì
        cơ sở cục bộ = tonumber(MV._baseWS) hoặc 16
        local flySp = tonumber(MV.flySpeed) or 60
        nếu MV._playerFlyActive hoặc MV.fly thì
            trả về flySp
        khác
            trả về cơ sở > 0 và cơ sở hoặc 16
        kết thúc
    kết thúc
    trả về s
kết thúc

hàm MV._EnsurePlayerFlyBV()
    cục bộ r = MV.Root()
    nếu không phải r thì trả về nil, nil end
    nếu MV._playerFlyBV và MV._playerFlyBV.Parent == r thì
        trả về MV._playerFlyBV, MV._playerFlyBG
    kết thúc
    pcall(function() if MV._playerFlyBV then MV._playerFlyBV:Destroy() end end)
    pcall(function() if MV._playerFlyBG then MV._playerFlyBG:Destroy() end end)
    local bv = New("BodyVelocity", { Name = "BC_PlayerFlyVel", MaxForce = Vector3.new(1e9, 1e9, 1e9), Velocity = Vector3.new(0,0,0) }, r)
    local bg = New("BodyGyro", { Name = "BC_PlayerFlyGyro", MaxTorque = Vector3.new(1e9, 1e9, 1e9), P = 1e4, D = 50 }, r)
    MV._playerFlyBV, MV._playerFlyBG = bv, bg
    local h = MV.Hum()
    nếu h thì
        pcall(function() h.PlatformStand = true end)
        pcall(function() h.AutoRotate = false end)
    kết thúc
    trả về bv, bg
kết thúc

hàm MV.StopPlayerFly()
    MV._playerFlyActive = false
    MV._playerFlyTarget = nil
    MV._playerFlyPos = nil
    pcall(function() RunService:UnbindFromRenderStep("BC_PlayerFly") end)
    pcall(function() if MV._playerFlyBV then MV._playerFlyBV:Destroy() end end)
    pcall(function() if MV._playerFlyBG then MV._playerFlyBG:Destroy() end end)
    MV._playerFlyBV, MV._playerFlyBG = nil, nil
    nếu không phải MV.fly thì
        local h = MV.Hum()
        nếu h thì
            pcall(function() h.PlatformStand = false end)
            pcall(function() h.AutoRotate = true end)
        kết thúc
    kết thúc
    nếu MV._playerFlyNcPrev khác nil thì
        cục bộ là = MV._playerFlyNcPrev
        MV._playerFlyNcPrev = nil
        local stillFlying = (MV._glassFlyActive == true) or (MV.Safe and MV.Safe.on == true)
        nếu không còn bay nữa thì
            nếu là == false thì
                pcall(function() MV.SetNoclip(false) end)
            kết thúc
        kết thúc
    kết thúc
    trả về giá trị đúng
kết thúc

hàm MV._PlayerFlyStep(dt)
    if not MV._playerFlyActive then return end
    local targetPlayer = MV._playerFlyTarget
    nếu không phải là targetPlayer hoặc không phải là targetPlayer.Parent thì
        MV.StopPlayerFly()
        trở lại
    kết thúc
    cục bộ c, r = nil, nil
    pcall(function()
        local char = targetPlayer.Character
        nếu char thì
            r = char:FindFirstChild("HumanoidRootPart")
            c = ký tự
        kết thúc
    kết thúc)
    nếu không phải r thì
        trở lại
    kết thúc
    local myRoot = MV.Root()
    nếu không phải là myRoot thì
        MV.StopPlayerFly()
        trở lại
    kết thúc
    local want = r.Position + Vector3.new(0, 3.5, 0)
    MV._playerFlyPos = muốn
    vị trí cục bộ = myRoot.Position
    dx cục bộ = want.X - pos.X
    local dy = want.Y - pos.Y
    local dz = want.Z - pos.Z
    local dist = math.sqrt(dx*dx + dy*dy + dz*dz)
    tốc độ cục bộ = tonumber(MV.GetPlayerFlySpeed()) hoặc 16
    local close = dist < 2
    nếu gần thì
        tốc độ = math.max(2, tốc độ * 0.15)
    nếu dist < 3.5 thì
        tốc độ = math.max(6, tốc độ * 0.45)
    kết thúc
    MV.SetNoclip(true) -- ⚡ v4.34: gọi thẳng (hàm nội bộ, đã tự động bọc pcal)
    local bv, bg = MV._EnsurePlayerFlyBV()
    nếu bv thì
        local dir = Vector3.new(dx/dist, dy/dist, dz/dist)
        nếu gần thì
            local targetVel = (r and r.Velocity) or Vector3.new(0, 0, 0)
            if dist <= 0.1 then dir = Vector3.new(0, 0, 0) end
            bv.Velocity = targetVel + dir * speed
        khác
            Vận tốc bv = hướng * tốc độ
        kết thúc
    kết thúc
    nếu bg thì
        bg.CFrame = CFrame.new(pos, Vector3.new(want.X, pos.Y, want.Z))
    kết thúc
    nếu không phải BV thì
        LÀM
            bước cục bộ = math.min(dist, speed * (tonumber(dt) or 0.05))
            local dir = Vector3.new(dx/dist, dy/dist, dz/dist)
            myRoot.CFrame = CFrame.new(pos.X + dir.X*step, pos.Y + dir.Y*step, pos.Z + dir.Z*step)
        kết thúc
    kết thúc
kết thúc

hàm MV.FlyToPlayer(p)
    nếu không p hoặc không p.Parent thì trả về false, "người chơi không tồn tại" end
    nếu p == player thì trả về false, "không thể bay tới chính mình" end
    nếu không phải MV.Root() thì trả về false, kết thúc "chưa có nhân vật"
    if MV.fly then MV.SetFly(false) end
    pcall(function() MV.StopGlassFly() end)
    nếu MV._playerFlyNcPrev == nil và MV._glassFlyNcPrev == nil và (không phải MV.Safe hoặc MV.Safe._ncPrev == nil) thì
        MV._playerFlyNcPrev = MV.noclip == true
    kết thúc
    MV._playerFlyTarget = p
    MV._playerFlyActive = true
    MV._playerFlyPos = nil
    pcall(function() MV.SetNoclip(true) end)
    pcall(function() MV._EnsurePlayerFlyBV() end)
    pcall(function() RunService:UnbindFromRenderStep("BC_PlayerFly") end)
    pcall(function()
        RunService:BindToRenderStep("BC_PlayerFly", Enum.RenderPriority.Camera.Value - 1, hàm(dt)
            pcall(MV._PlayerFlyStep, dt)
        kết thúc)
    kết thúc)
    MV._Watchdog()
    trả về giá trị đúng, p
kết thúc

--------- ⬆⬇ nâng cao/hạ: thảm thì đổi độ cao, bay thì Đưa người ----------
hàm MV.Nudge(dy)
    nếu MV.carpet thì
        MV.carpetY = (MV.carpetY hoặc MV.FootY() hoặc 0) + dy
        trả về giá trị true, "thảm"
    nếu MV.fly thì
        cục bộ r = MV.Root()
        if r then r.CFrame = CFrame.new(r.Position.X, r.Position.Y + dy, r.Position.Z) end
        trả về giá trị true, "bay"
    kết thúc
    trả về false, nil
kết thúc

--------- HUD: Cụm nút NỔI TRÊN HÌNH THỨC (⬆ 🪩 ⬇ ✕) ----------
hàm MV._HudNudge(dy)
    if MV.runMode and not MV.carpet then MV.SetCarpet(true) end
    cục bộ ổn, cái gì = MV.Nudge(dy)
    MV._HudSay(ok and ((dy > 0 and "⬆ nâng " or "⬇ hạ ") .. tostring(what) .. " 2.5")
                   hoặc "⬆⬇ bật kính hoặc vịnh trước đó")
kết thúc
hàm MV._BuildHud()
    if MV._hud then return MV._hud end
    cục bộ hud = New("Khung", {
        Tên = "BC_MoveHud",
        Kích thước = UDim2.new(0, 180, 0, 160), Vị trí = UDim2.new(1, -190, 0.5, -80),
        BackgroundTransparency = 1, Visible = false, ZIndex = 20,
    }, gui)
    hàm cục bộ obtn(txt, y, size, color, cb)
        cục bộ b = New("TextButton", {
            Kích thước = UDim2.new(0, kích thước, 0, kích thước), Vị trí = UDim2.new(0.5, -kích thước / 2, 0, y),
            Văn bản = txt, Màu nền 3 = màu hoặc C.BLUE, Độ trong suốt nền = 0.3,
            TextColor3 = C.WHITE, Font = Enum.Font.GothamBold, TextSize = 20,
            BorderSizePixel = 0, ZIndex = 21,
        }, hud)
        Góc(b, UDim.new(1, 0))
        Stroke(b, C.WHITE, 2)
        b.Đã kích hoạt:Connect(function() pcall(cb) end)
        trả lại b
    kết thúc
    MV._hudCarpet = obtn("🪩", 0, 50, C.GRAY, function()
        nếu không phải (MV.runMode hoặc MV.carpet hoặc MV.fly) thì
            MV.SetCarpet(true)
        khác
            MV.SetCarpet (không phải MV.carpet)
        kết thúc
        MV._HudSay(MV.carpet và "🪩 thảm: BẬT" hoặc "🪩 thảm: TẮT")
    kết thúc)
    MV._hudUp = obtn("⬆", 60, 50, Color3.fromRGB(0, 150, 0), function() MV._HudNudge(2.5) end)
    MV._hudDown = obtn("⬇", 120, 50, Color3.fromRGB(150, 0, 0), function() MV._HudNudge(-2.5) end)
    MV._hudClose = New("TextButton", {
        Kích thước = UDim2.new(0, 34, 0, 34), Vị trí = UDim2.new(1, -44, 0, 10),
        Văn bản = "✕", Màu nền 3 = Đỏ đậm, Độ trong suốt nền = 0.3,
        TextColor3 = C.WHITE, Font = Enum.Font.GothamBold, TextSize = 18,
        BorderSizePixel = 0, ZIndex = 21,
    }, hud)
    Góc(MV._hudClose, UDim.new(1, 0))
    Stroke(MV._hudClose, C.WHITE, 2)
    MV._hudClose.Activated:Connect(function()
        MV.SetRunMode(false)
        MV._HudSay("🛑 đã tắt chế độ chạy trên thảm")
    kết thúc)
    MV._hud = hud
    trả về hud
kết thúc
hàm MV._HudSay(msg)
    pcall(function() if D.hubStatus then D.hubStatus.Text = msg end end)
kết thúc
hàm MV.SyncHud()
    pcall(function()
        local hud = MV._BuildHud()
        local safeOn = (MV.Safe and MV.Safe.on == true)
        local on = (MV.carpet hoặc MV.fly hoặc MV.runMode)
        if safeOn hoặc MV.fly thì on = false end -- 🚀 dùng HUD điều khiển tay, 🪩/🏃 giữ HUD cũ
        hud.Visible = (on == true)
        if MV._hudCarpet then -- xám như bản gốc, XANH khi thảm bật
            MV._hudCarpet.BackgroundColor3 = MV.carpet và C.GREEN hoặc C.GRAY
        kết thúc
    kết thúc)
    if MV.SyncFlyHud then MV.SyncFlyHud() end
kết thúc

--------- 🏃 CHẠY TRÊN THẢM = "🕹️ BAY CHẠY BỘ" của aiaiaitao3 (v4.12.4: GIỐNG 100%) ----------
hàm MV.SetRunMode(on)
    bật = (bật == đúng)
    cục bộ r = MV.Root()
    if on chứ không phải r thì trả về false, end "chưa có nhân vật để chạy"
    if on == MV.runMode then MV.SyncHud(); return MV.runMode end
    MV.runMode = on
    nếu bật thì
        if MV.fly thì MV.SetFly(false) end -- bay và chạy bộ không đi cùng (như bản gốc)
        MV._menuWasOpen = (main and main.Visible) or false
        pcall(function()
            nếu main thì main.Visible = false end
            if togBtn then togBtn.Text = "⚙" end -- bản gốc dùng "⚙" lúc đang chạy trên thảm
        kết thúc)
        nếu không phải MV.carpet thì MV.SetCarpet(true) end -- 🪩 thảm dưới chân
        MV.SetSpeed(true) -- 👟 tăng tốc (THEO tốc độ game × speedMul)
        MV._JumpGuard() -- 🦘 game Illegal nhảy thì mở lại để NHẢY TRÊN THẢM
    khác
        MV.SetCarpet(false)
        MV.SetSpeed(false)
        if MV.fly then MV.SetFly(false) end
        nếu MV._menuĐãMở thì
            pcall(function() if main then main.Visible = true end end)
        kết thúc
        pcall(function()
            if togBtn then togBtn.Text = (main and main.Visible) and "✕" or "🍌" end
        kết thúc)
        MV._menuWasOpen = nil
    kết thúc
    MV.SyncHud()
    trả về MV.runMode
kết thúc

-- ----------tắt hết / khôi phục sau hồi sinh / trạng thái summ tắt ----------
hàm MV.StopAll()
    if MV.Safe and MV.Safe.on then pcall(function() MV.Safe.Stop() end) end
    pcall(function() MV.StopGlassFly() end)
    pcall(function() MV.StopPlayerFly() end)
    MV.SetFly(false)
    MV.SetCarpet(false)
    MV.SetNoclip(false)
    MV.SetInfJump(false)
    MV.SetHighJump(false) -- v4.38:tắt 🦘 nhảy cao
    MV.SetSpeed(false)
    MV.SetSprint(false) -- v4.37:tắt 💨tốc độ camera
    MV.SetRunMode(false) -- v4.12: thoát chế độ chạy trên thảm (trả lời menu + ẩn HUD)
    MV._Watchdog()
    MV.SyncHud()
    pcall(function() if MV.Safe and MV.Safe.SyncHud then MV.Safe.SyncHud() end end)
kết thúc
S.MoveActionState = {
    fly = function() return S.Move.fly end,
    noclip = function() return S.Move.noclip end,
    infjump = function() return S.Move.infJump end,
    highjump= function() return S.Move.highJump end,
    tốc độ = hàm() trả về S.Move.speed kết thúc,
    camspeed= function() return S.Move.sprint end,
    carpet = function() return S.Move.carpet end,
    runmode = function() return S.Move.runMode end,
    loc_all = function() return S.Loc and S.Loc.on end,
    loc_solo = function() return S.Loc and S.Loc.solo end,
    spec_on = function() return S.Spec and S.Spec.on end,
    glow = function() return S.Glow and S.Glow.on end,
    safefly = function() return S.Move.Safe and S.Move.Safe.on end,
}

hàm MV.Refresh()
    MV._NcForgetLost() -- v4.22: chỉ quên phần đã mất (giữ giá trị gốc của phần đang bật 🧱)
    if MV.speed thì MV.ApplyChar() kết thúc -- không ép mặc định tốc độ mặc dù đang bay chỉ
    if MV.noclip then MV._NcStep() end
    nếu MV.fly thì
        MV._EnsureFly()
        MV._BindFly()
    kết thúc
    nếu MV.sprint thì
        MV._EnsureSpeed()
        MV._BindSpeed()
    kết thúc
    nếu MV.highJump thì
        pcall(MV._HighJumpApplyPower)
        pcall(MV._HighJumpBind)
    kết thúc
    if MV.Safe and MV.Safe.on then pcall(MV.Safe.Step, 0.05) end -- v4.23: 🛡 tự chữa lành sau khi hồi sinh
    nếu MV.carpet và (không phải MV._carpet hoặc không phải MV._carpet.Parent) thì
        MV.CreateCarpet(MV.carpetY)
    kết thúc
    MV.SyncHud()
    pcall(function() if MV.Safe and MV.Safe.SyncHud then MV.Safe.SyncHud() end end)
kết thúc
hàm MV.Status()
    cục bộ t = {}
    if MV.fly then t[#t + 1] = string.format("🚀 bay %d", MV.flySpeed) end
    if MV.noclip thì t[#t + 1] = "🧱Tường tường" end
    nếu MV.infJump thì t[#t + 1] = "🦘 nhảy vô hạn" end
    if MV.highJump then t[#t + 1] = string.format("🦘 nhảy cao %d", MV.highJumpSpeed) end
    if MV.sprint then t[#t + 1] = string.format("💨 tốc độ %d", MV.sprintSpeed) end
    nếu MV.speed thì
        nếu MV.speedMode == "x" thì
            t[#t + 1] = string.format("👟 chạy ×%g (game %g)", MV.speedMul, MV._baseWS or 16)
        khác
            t[#t + 1] = string.format("👟 chạy %g", MV.walkSpeed)
        kết thúc
    kết thúc
    nếu MV.carpet thì
        t[#t + 1] = string.format("🪩 thảm %g×%g×%g", MV.carpetW, MV.carpetH, MV.carpetL)
    kết thúc
    nếu MV._placedGlasses và #MV._placedGlasses > 0 thì
        t[#t + 1] = string.format("🧱 đặt kính %d tấm", #MV._placedGlasses)
    kết thúc
    nếu MV.autoGlass thì t[#t + 1] = "🔄tự đặt kính" end
    nếu MV._glassFlyActive thì
        t[#t + 1] = string.format("🚀 bay tới kính %s %d", tostring(MV._glassFlyIdx or "?"), MV.glassFlySpeed ​​or 60)
    kết thúc
    nếu MV._playerFlyActive thì
        local pn = MV._playerFlyTarget and tostring(MV._playerFlyTarget.Name) or "?"
        local sp = MV.GetPlayerFlySpeed ​​and MV.GetPlayerFlySpeed() or (MV.playerFlySpeed ​​or 0)
        nếu (tonumber(MV.playerFlySpeed) hoặc 0) == 0 thì
            t[#t + 1] = string.format("🚀 bay tới người %s (auto %g)", pn, sp)
        khác
            t[#t + 1] = string.format("🚀 bay tới người %s %g", pn, sp)
        kết thúc
    kết thúc
    if #t == 0 thì return "🚶 di chuyển: đang TẮT" end
    return "🚶 đang BẬT: " .. table.concat(t, " · ")
kết thúc
trackConn(player.CharacterAdded:Connect(function()
    task.spawn(function()
        task.wait(0.3)
        pcall(MV.Refresh)
    kết thúc)
kết thúc))

--------- v4.6.3: NHÓM TÍNH NĂNG 🌐 MÁY CHỦ (Đặt lại · Hop · Lấy mã · Vào theo mã) ----------
hàm S.GetJobId()
    ID cục bộ = game.JobId
    if id == nil then return nil end
    id = tostring(id)
    if id == "" then return nil end
    trả về id
kết thúc

hàm S.CopyToClipboard(text)
    cục bộ đã làm = sai
    pcall(function()
        nếu setclipboard thì setclipboard(text) đã thực hiện = true
        elseif toclipboard then toclipboard(text) did = true
        elseif set_clipboard then set_clipboard(text) did = true end
    kết thúc)
    trả lại
kết thúc

hàm S.FetchServers(cursor)
    URL cục bộ = "https://games.roblox.com/v1/games/" .. tostring(game.PlaceId)
             .. "/servers/Public?sortOrder=Asc&limit=100"
    if cursor and cursor ~= "" then url = url .. "&cursor=" .. tostring(cursor) end
    local raw = game:HttpGet(url)
    dữ liệu cục bộ = HttpService:JSONDecode(raw)
    if type(data) ~= "table" then return {}, nil end
    return (type(data.data) == "table" and data.data or {}), data.nextPageCursor
kết thúc

hàm S.ResetServer()
    local me = S.GetJobId()
    nếu là tôi thì
        TeleportService:TeleportToPlaceInstance(game.PlaceId, me, player)
        return "🔄 Đang vào lại máy chủ ĐÚNG này: " .. me .. " (giữ nguyên người chơi cùng máy chủ)..."
    kết thúc
    Dịch vụ dịch chuyển tức thời:Dịch chuyển tức thời(game.PlaceId, player)
    return "🔄 Không thể đọc máy chủ mã hóa (Studio/server menu) → đang tải lại trò chơi..."
kết thúc

hàm S.JoinServer(jobId)
    TeleportService:TeleportToPlaceInstance(game.PlaceId, tostring(jobId), player)
kết thúc

hàm S.HopServer()
    local me = tostring(S.GetJobId() or "")
    cục bộ cand, con trỏ = {}, ""
    for _ = 1, 3 do
        danh sách cục bộ, nextCursor = S.FetchServers(cursor)
        for _, sv in ipairs(list) do
            local sid = (sv and sv.id) and tostring(sv.id) or nil
            local playing = tonumber(sv and sv.playing) or 0
            local maxp = tonumber(sv and sv.maxPlayers) or 0
            nếu sid và sid ~= me và (maxp <= 0 hoặc đang chơi < maxp) thì
                cand[#cand + 1] = {id = sid, playing = playing, maxPlayers = maxp}
            kết thúc
        kết thúc
        if #cand > 0 then break end -- có ứng viên rồi thì từ cô trang
        if not nextCursor or nextCursor == "" then break end
        con trỏ = con trỏ tiếp theo
    kết thúc
    nếu #cand == 0 thì
        return "⚠️ Không tìm thấy máy chủ nào còn chỗ trống (hoặc trò chơi này không cho xem danh sách máy chủ)"
    kết thúc
    local pick = cand[math.random(1, #cand)]
    S.JoinServer(pick.id)
    return "🔀 Đang nhảy sang server " .. pick.id .. " (" .. pick.playing .. "/" .. pick.maxPlayers
        .. " người) · tìm được " .. #cand .. " server khác để chọn, bỏ qua server hiện tại"
kết thúc

--------- 🔐 CHỐNG BAN (v4.43) ----------
S.AntiBan = S.AntiBan hoặc {
    bật = (_G.BananaCatHub_AntiBan == true),
    bận = false, lastHop = 0, cooldown = 10, hops = 0,
    lastReason = "", armed = false, snaps = 0, snapAt = 0,
}

hàm S.AntiBanIsMsg(msg)
    local s = string.lower(tostring(msg or ""))
    nếu s == "" thì trả về false
    khóa cục bộ = {
        "Bạn đã bị cấm", "Bạn đã bị đuổi khỏi trò chơi", "Bạn đã bị cấm", "Bạn đã bị đuổi khỏi trò chơi",
        "Bị cấm tham gia", "Bị đuổi khỏi trò chơi", "Phát hiện lỗi khai thác", "Phát hiện gian lận",
        "phát hiện gian lận", "chống gian lận", "chống gian lận", "bị đuổi bởi", "bị cấm bởi",
        "Bạn bị cấm", "Tài khoản bị cấm", "Trò chơi bị cấm", "Máy chủ bị cấm", "Người chơi bị đá ra khỏi trò chơi",
    }
    for i = 1, #keys do
        if string.find(s, keys[i], 1, true) then return true end
    kết thúc
    trả về false
kết thúc

hàm S.AntiBanStatus()
    cục bộ a = S.AntiBan
    nếu không phải a.on thì trả về "🔐 Chống cấm: TẮT" kết thúc
    local extra = (a.lastReason ~= "" and (" · lần cuối: " .. a.lastReason)) or ""
    return "🔐 Anti Ban: BẬT · đã nhảy " .. tostring(a.hops) .. " lần · chờ " .. tostring(a.cooldown) .. "s" .. extra
kết thúc

hàm S.AntiBanHop(lý do)
    cục bộ a = S.AntiBan
    if not a or not a.on then return false, "off" end
    if a.busy then return false, "busy" end
    cục bộ hiện tại = 0
    pcall(function() now = tick() end)
    local cd = tonumber(a.cooldown) or 10
    Nếu now > 0 và a.lastHop > 0 và (now - a.lastHop) < cd thì trả về false, "cooldown" end
    a.bận rộn = đúng
    a.lastHop = bây giờ
    a.lastReason = tostring(reason or "suspect")
    a.hops = (tonumber(a.hops) or 0) + 1
    pcall(function() _G.BananaCatHub_AntiBan = true end)
    tin nhắn cục bộ = "⚠️ chưa nhảy"
    local ok = pcall(function() msg ​​= S.HopServer() end)
    nếu không ổn thì
        pcall(function() TeleportService:Teleport(game.PlaceId, player) end)
        msg = "🔐 không lấy được danh sách → rời PlaceId (không đặt lại máy chủ cũ)"
    kết thúc
    a.bận = sai
    pcall(function() if S.SyncAntiBanPanel then S.SyncAntiBanPanel() end end)
    pcall(function() if D.Say then D.Say("🔐 " .. tostring(msg), C.ACCENT) end end)
    trả về true, msg
kết thúc

hàm S.AntiBanSet(on)
    S.AntiBan.on = bật và đúng hoặc sai
    pcall(function() _G.BananaCatHub_AntiBan = S.AntiBan.on end)
    if S.AntiBan.on then S.AntiBanArm() end
    if S.SyncAntiBanPanel then pcall(S.SyncAntiBanPanel) end
    trả về S.AntiBan.on
kết thúc

hàm S.AntiBanArm()
    nếu S.AntiBan.armed thì trả về end
    S.AntiBan.armed = true
    pcall(function()
        nếu kiểu của hookfunction là "function" thì
            người địa phương cũ
            cũ = hàm móc (người chơi.Kick, hàm (...)
                if S.AntiBan.on then S.AntiBanHop("kick") return end
                nếu cũ thì trả về cũ(...) kết thúc
            kết thúc)
        kết thúc
    kết thúc)
    pcall(function()
        trackConn(Players.PlayerRemoving:Connect(function(p)
            if p == player and S.AntiBan.on then S.AntiBanHop("player_removing") end
        kết thúc))
    kết thúc)
    pcall(function()
        local gs = game:GetService("GuiService")
        trackConn(gs.ErrorMessageChanged:Connect(function()
            nếu không phải S.AntiBan.on thì trả về end
            thông báo cục bộ = ""
            pcall(function() msg ​​= tostring(gs.ErrorMessage or "") end)
            if msg == "" then pcall(function() msg ​​= tostring(gs:GetErrorMessage()) end) end
            if S.AntiBanIsMsg(msg) then S.AntiBanHop("gui_error") end
        kết thúc))
    kết thúc)
    pcall(function()
        trackConn(TeleportService.TeleportInitFailed:Connect(function()
            nếu không phải S.AntiBan.on thì trả về end
            task.delay(1.2, function()
                S.AntiBan.busy = false
                S.AntiBanHop("teleport_fail")
            kết thúc)
        kết thúc))
    kết thúc)
    pcall(function()
        trackConn(game:GetService("LogService").MessageOut:Connect(function(msg)
            if S.AntiBan.on and S.AntiBanIsMsg(msg) then S.AntiBanHop("log") end
        kết thúc))
    kết thúc)
    hàm cục bộ watchHum(hum)
        nếu không có tiếng vo ve thì trả về đầu cuối
        pcall(function()
            trackConn(hum:GetPropertyChangedSignal("WalkSpeed"):Connect(function()
                nếu không phải S.AntiBan.on thì trả về end
                cục bộ m = S.Move
                local hot = m and (m.fly or m.noclip or m.sprint or m.infJump or m.highJump or (m.Safe and m.Safe.on))
                nếu không nóng thì trả lại đầu
                cục bộ hiện tại = tick()
                nếu bây giờ - (S.AntiBan.snapAt hoặc 0) > 4 thì S.AntiBan.snaps = 0
                S.AntiBan.snapAt = bây giờ
                S.AntiBan.snaps = (S.AntiBan.snaps hoặc 0) + 1
                nếu S.AntiBan.snaps >= 3 thì
                    S.AntiBan.snaps = 0
                    S.AntiBanHop("speed_reset")
                kết thúc
            kết thúc))
        kết thúc)
    kết thúc
    pcall(function()
        if player.Character then watchHum(player.Character:FindFirstChildOfClass("Humanoid")) end
        trackConn(player.CharacterAdded:Connect(function(ch)
            task.wait(0.25)
            watchHum(ch:FindFirstChildOfClass("Humanoid"))
        kết thúc))
    kết thúc)
kết thúc
if S.AntiBan.on then pcall(S.AntiBanArm) end
--------- HẾT 🔐 CHỐNG BAN ----------

S.ScriptHubList = {
    {icon="🛡", name="Infinite Yield", cat="Admin", ord=1,
     desc="Các lệnh quản trị: kill, speed, jump, noclip, teleport, bring, prefix tùy chỉnh...",
     code=[[loadstring(game:HttpGet("https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source"))()]],
     noPark=true},
    {icon="🧰", name="Dex Explorer", cat="Explorer", ord=2,
     desc="Duyệt toàn bộ instance trong game, xem/sửa thuộc tính, tìm đối tượng theo đường dẫn.",
     code=[[loadstring(game:HttpGet("https://raw.githubusercontent.com/infyiff/backup/main/dex.lua"))()]],
     noPark=true},
    {icon="📡", name="SimpleSpy v3", cat="Spy", ord=3,
     desc="Theo dõi RemoteEvent/RemoteFunction: tên, tham số, sao chép mã để gọi lại y phun.",
     code=[[loadstring(game:HttpGet("https://raw.githubusercontent.com/ex-serum/SimpleSpy/main/SimpleSpy.lua"))()]],
     noPark=true},
    {icon="🎯", name="Niêm tâm (Crosshair)", cat="Tiện ích", ord=4, action="crosshair",
     desc="Bật/tắt vòng tròn niêm tâm + 4 bắn ngắn ở GIỮA màn hình game (menu bên ngoài)."},
    {icon="🧩", name="Trả GUI về màn hình", cat="Tiện ích", ord=5, action="unpark",
     desc="Hoàn tác MỌI GUI hub mượn vào menu: tab tính năng + tab 🧩 GUI Ngoài."},
    {icon="🖱", name="Sửa click chuột", cat="Tiện ích", ord=6, action="fixmouse",
     desc="Nhả focus ô nhập, trả GUI về trò chơi, đặt lại MouseBehavior — hết cảnh không quay chuột/không bắn."},
    {icon="🔄", name="Tải lại hub từ đĩa", cat="Tiện ích", ord=7, action="reload",
     desc="Đọc lại file save: script đã lưu, waypoint, tab tính năng, cài đặt 🧩 / 🕵 / 🪟."},
    {icon="🧹", name="Dọn hosting nhúng rác", cat="Tiện ích", ord=8, action="prune",
     desc="Xóa các khung Embedded_ mồ hôi côi/rỗng còn sót lại trong tab (script tự hủy GUI để quay lại)."},
    {icon="🔄", name="Đặt lại máy chủ", cat="Máy chủ", ord=9, action="đặt lại máy chủ",
     desc="Vào lại ĐÚNG server đang chơi (giữ nguyên bạn bè/người chơi cùng server). Studio thì tải lại game."},
    {icon="🔀", name="Máy chủ Hop", cat="Máy chủ", ord=10, action="máy chủ hop",
     desc="Tự động lấy mã máy chủ: đọc danh sách máy chủ công khai, bỏ hiện tại máy chủ + đầy máy chủ, nhảy sang 1 máy chủ khác."},
    {icon="🔐", name="Chống cấm", cat="Máy chủ", ord=10.5, action="chống cấm",
     desc="Tự nhảy SANG SERVER KHÁC (cùng trò chơi) khi bị kick/cấm hoặc máy chủ nghi hành động (bay/xuyên/tốc độ được đặt lại). Đánh lạc hướng máy chủ chủ. Bấm lại để TẮT."},
    {icon="🌐", name="Lấy mã máy chủ (JobId)", cat="Máy chủ", ord=11, action="getjobid",
     desc="Đọc mã máy chủ hiện tại, sao chép ra clipboard và điền sẵn vào ô 🎟 để gửi cho bạn bè vào cùng."},
    {icon="🚀", name="Bay theo camera", cat="Di chuyển", ord=12, action="fly",
     desc="Bay điều KHIỂN TAY theo camera (khác 🛡 Bay An Toàn). Nhìn xuống 60° + tiến tới = xuống 60°. WASD/joystick; thả phím đứng lơ. Space lên · Shift/Ctrl xuống. 🧱 Thường xuyên bật/tắt riêng khung ở 🚀."},
    {icon="💨", name="Tốc độ theo camera", cat="Di chuyển", ord=12.2, action="camspeed",
     desc="Chạy trên mặt đất 100% kiểu 🚀: WASD/cần điều khiển theo hướng camera. KHÔNG xuyên tường, nhảy bình thường, rơi theo sức mạnh game, không nút ảo. Chỉnh tốc độ ở khung 💨."},
    {icon="🧱", name="Xuyên Tường", cat="Di chuyển", ord=13, action="noclip",
     desc="Đi xuyên mọi vật cản. Tắt đi trả lại ĐÚNG CanCollide gốc của từng phần (không phân cứng như bản cũ)."},
    {icon="🦘", name="Nhảy Vô Hạnh", cat="Di chuyển", ord=14, action="infjump",
     desc="Nhảy mãi không đất. Tự thử 3 cách nhảy (ChangeState · lệnh Jump · Đẩy vận tốc) nên cả game cấm nhảy, để JumpPower=0 hay ăn mất phím Space vẫn nhảy được."},
    {icon="🦘", name="Nhảy Cao", cat="Di chuyển", ord=14.2, action="highjump",
     desc="Công tắc độc lập kiểu 👤 Né người (🛡): BẬT/TẮT +chỉnh tốc độ nhảy. Space là nhảy cao, rơi theo trọng lực game. Không thường xuyên, không nút ảo. Không thay 🦘 Bỏ vô hạn."},
    {icon="🏃", name="Chạy Trên gốc", cat="Di chuyển", ord=15, action="runmode",
     desc="Y HỆT '🕹️ Bay chạy bộ' của aiaiaitao3: thảm kính dưới chân + ẨN MENU + cụm nút tròn ⬆🪩⬇✕ nổi góc phải màn hình (⬆⬇ đưa cả thảm bạn lên/xuống). Thêm 2 cái tốt hơn bản gốc: Không mềm dẻo và tốc độ THEO GAME ×3."},
    {icon="🪩", name="Thảm Kính", cat="Di chuyển", ord=16, action="carpet",
     desc="Thảm kính BÁM THEO chân (chạy trên không). Đặt kính cố định / bay tới kính / bay tới người nằm ở khung ⚙ trên danh sách và tab 👥 Chơi Người — không lặp thẻ."},
    {icon="✨", name="Phát Sáng", cat="Tiện ích", ord=22, action="glow",
     desc="CHÍNH Bạn phát sáng: gái sáng cả nhân vật + đèn toả sáng thật xung quanh người. Chỉnh CHIỀU RỘNG + ĐỘ SÁNG + MÀU ở khung ✨ ngay đầu danh sách. 👁 xuyên (sáng xuyên vật cản) · 💡 đèn không bị cản trở · bị xóa hay hồi sinh thì tự gắn lại."},
    {icon="🛡", name="Bay An Toàn", cat="Di chuyển", ord=23, action="safefly",
     desc="Bật là TỰ BAY + TỰ NÉ NGƯỜI CHƠI và mọi vật có dấu hiệu chuyển động (được cả vật bị script/tween kéo đi) trong bán kính bạn chỉnh: càng gần thúc mạnh, quá gần thì đuổi lên trên. 🔲 Có BỨC TƯỜNG TRỌNG HÌNH VUÔNG bao quanh cho thấy vùng né · 🧱 tự bật Xuyên Tường để cung cấp cho bạn QUA cản. 💨 tốc độ · 📏 khoảng cách né · 🌀 né tránh ở khung 🛡 ngay đầu danh sách."},
    {icon="📍", name="Định Vị Người Chơi", cat="Định Vị", ord=17, action="loc_all",
     desc="Xuyên tường thấy TẤT CẢ người chơi. Bấm lại để TẮT. Chọn từng người / khoảng cách: tab 👥 Chơi Người."},
    {icon="👣", name="Xem Người Chơi", cat="Định vị", ord=19, action="spec_on",
     desc="Bám camera theo người gần nhất. Bấm lại để TRẢ CAMERA. Danh sách người chọn: tab 👥."},
}
S.hubFavs = S.hubFavs hoặc {}
S.hubCat = "Tất cả"
S.hubSearch = ""

hàm S.RunHubAction(id)
    nếu id == "crosshair" thì
        local okC = pcall(function() S.ToggleCrosshair() end)
        nếu không okC thì return "⚠️ chưa bật được niêm tâm" end
        S.Rebuild() -- cập nhật nút nhãn
        return "🎯 Niêm tâm: " .. (S.crosshairOn và "BẬT (giữa màn hình game)" hoặc "TẮT")
    nếu id == "unpark" thì
        cục bộ n = 0
        pcall(function() n = n + (S.RemoveAllParked() or 0) end)
        for _, ft in ipairs(featureTabs) do
            máy chủ cục bộ = ft.frame và ft.frame:FindFirstChild("ScriptHost")
            nếu máy chủ thì pcall(function() n = n + S.ClearEmbedsUnder(host) end) end
        kết thúc
        pcall(S.PruneEmbeds)
        pcall(function() if S.SyncEmbedToggles then S.SyncEmbedToggles() end end)
        return "🧩 đã trả " .. n .. " GUI về màn hình game (GUI gốc giữ nguyên, không Destroy)"
    nếu id == "fixmouse" thì
        nếu kiểu (S.DoFixMouse) == "function" thì
            thông báo cục bộ = nil
            pcall(function() msg ​​= S.DoFixMouse() end)
            return "🖱 " .. tostring(tin nhắn hoặc "đã trả đầu vào cho trò chơi")
        kết thúc
        pcall(ReleaseHubFocus)
        pcall(function() UserInputService.MouseBehavior = Enum.MouseBehavior.Default end)
        return "🖱 đã free focus + đặt lại chuột"
    nếu id == "reload" thì
        nếu kiểu(S.DoReload) == "function" thì
            task.spawn(function() pcall(S.DoReload) end)
            return "🔄 đang tải lại hub từ đĩa..."
        kết thúc
        return "⚠️ hub chưa sẵn sàng để tải lại"
    nếu id == "prune" thì
        pcall(S.PruneEmbeds)
        return "🧹 đã thu dọn các hosting chứa rác"
    nếu id == "resetserver" thì
        tin nhắn cục bộ = "⚠️ chưa được thiết lập lại"
        local okRs = pcall(function() msg ​​= S.ResetServer() end)
        if not okRs then return "⚠️ Reset server thất: " .. tostring(msg) end
        trả về chuỗi(msg)
    nếu id == "hopserver" thì
        tin nhắn cục bộ = "⚠️ chưa được nhảy"
        local okHp = pcall(function() msg ​​= S.HopServer() end)
        nếu không phải okHp thì
            return "⚠️ Máy chủ Hop bị lỗi: " .. tostring(msg)
                .. " — vẫn được sử dụng ô 🎟 máy chủ mã hóa dán bên dưới để vào thủ công"
        kết thúc
        trả về chuỗi(msg)
    nếu id == "antiban" thì
        người địa phương bị truy nã = không phải S.AntiBan.on
        local okAb = pcall(function() S.AntiBanSet(wanted) end)
        nếu không okAb thì return "⚠️ chưa được kích hoạt Anti Ban" end
        S.Rebuild()
        trả về S.AntiBanStatus()
    nếu id == "getjobid" thì
        local jid = S.GetJobId()
        nếu không jid thì return "⚠️ Không thể đọc được máy chủ mã hóa (đang ở Studio / máy chủ đơn)" end
        local okCp = S.CopyToClipboard(jid)
        pcall(function() if D.hubJobIn then D.hubJobIn.Text = jid end end)
        pcall(function() if S.SyncServerPanel then S.SyncServerPanel() end end)
        return (okCp và "🌐 Đã sao chép máy chủ mã hóa: " hoặc "🌐 Máy chủ Mã (người thực thi không cho sao chép, sao chép tay):") .. jid

    --------- v4.12: BỘ DI CHUYỂN ----------
    nếu id == "fly" thì
        local wanted = not S.Move.fly
        local okF, on, err = pcall(S.Move.SetFly, wanted)
        if not okF then return "⚠️ lỗi bay: " .. tostring(on) end
        nếu muốn và không bật thì trả về "⚠️" .. tostring(err) end
        S.Rebuild()
        return S.Move.fly và ("🚀 Bay theo camera: BẬT — WASD/cần điều khiển · thả phím đứng lơ · tốc độ " .. tostring(S.Move.flySpeed))
                            hoặc "🚀 Bay: TẮT — Thường xuyên giữ nguyên theo công tắc 🧱"
    nếu id == "camspeed" thì
        local wanted = not S.Move.sprint
        local okS, on, err = pcall(S.Move.SetSprint, wanted)
        if not okS then return "⚠️ lỗi tốc độ: " .. tostring(on) end
        nếu muốn và không bật thì trả về "⚠️" .. tostring(err) end
        S.Rebuild()
        return S.Move.sprint và ("💨 Tốc độ theo camera: BẬT — WASD/joystick mặt đất · nhảy bình thường · rơi theo game · tốc độ " .. tostring(S.Move.sprintSpeed))
                               hoặc "💨 Tốc độ theo camera: TẮT — năng lượng/nhảy trả về trò chơi"
    nếu id == "noclip" thì
        nếu không phải S.Move.noclip cũng không phải S.Move.Root() thì return "⚠️ chưa có nhân vật (đợi vào game xong hãy nhấn)" end
        pcall(function() S.Move.SetNoclip(not S.Move.noclip) end)
        S.Rebuild()
        return S.Move.noclip và "🧱 Xuyên tường: BẬT (đi xuyên mọi vật cản)"
                              hoặc "🧱 Xuyên tường thuật: TẮT (CanCollide đã trả lại giá trị gốc)"
    elseif id == "infjump" then
        pcall(function() S.Move.SetInfJump(not S.Move.infJump) end)
        S.Rebuild()
        return S.Move.infJump và "🦘 Bỏ vô hạn: BẬT (Space/🐸 A — nhảy được cả game cấm nhảy/không Bốc JumpRequest)"
                               hoặc "🦘 Skip vô hạn: TẮT (JumpPower/JumpHeight đã trả lại trò chơi)"
    nếu id == "highjump" thì
        local wanted = not S.Move.highJump
        local okH, on = pcall(S.Move.SetHighJump, wanted)
        if not okH then return "⚠️ lỗi nhảy cao: " .. tostring(on) end
        S.Rebuild()
        return S.Move.highJump và ("🦘 Skip cao: BẬT — tốc độ " .. tostring(S.Move.highJumpSpeed) .. " · Space nhảy cao · rơi theo game")
                                hoặc "🦘 Skip cao: TẮT — JumpPower trả về trò chơi"
    nếu id == "speed" thì
        pcall(function() S.Move.SetSpeed(not S.Move.speed) end)
        S.Rebuild()
        trả về S.Move.speed và ("👟 Chạy tốc độ: BẬT — " .. (S.Move.speedMode == "x"
                                     và ("theo game ×" .. tostring(S.Move.speedMul)
                                          .. " = " .. tostring(S.Move.WantSpeed()))
                                     hoặc ("cố định " .. tostring(S.Move.walkSpeed)))
                                 .. " · JumpPower " .. tostring(S.Move.jumpPower))
                            hoặc ("👟 Chạy tốc độ: TẮT — về tốc độ trò chơi (" .. tostring(S.Move._baseWS) .. ")")
    nếu id == "carpet" thì
        nếu không phải S.Move.Root() thì return "⚠️ chưa có nhân vật để đặt kính (đợi vào game xong hãy nhấn)" end
        pcall(function() S.Move.SetCarpet(not S.Move.carpet) end)
        S.Rebuild()
        local cnt = S.Move._placedGlasses and #S.Move._placedGlasses or 0
        return S.Move.carpet và string.format("🧱Đặt Kính: THẢM BAY THEO BẬT — %g×%g×%g (Rộng×Cao×Dài) · ⬆⬇chỉnh độ cao · đã đặt %d tấm định hình (dùng nút 🧱 trong khung ⚙ để cài thêm)",
                                               S.Move.carpetW, S.Move.carpetH, S.Move.carpetL, cnt)
                            hoặc string.format("🧱 Đặt Kính: THẢM BAY THEO TẮT (đã lên thảm bay theo) · vẫn còn %d tấm kính cố định đặt (bấm 🧹 Xóa trong khung ⚙ để tăng)", cnt)
    nếu id == "placeglass" thì
        nếu không phải S.Move.Root() thì return "⚠️ chưa có nhân vật để đặt kính (đợi vào game xong hãy nhấn)" end
        local ok, res = S.Move.PlaceGlass()
        S.Rebuild()
        nếu S.GlassRefreshList thì pcall(S.GlassRefreshList) kết thúc
        return ok and ("🧱 đã đặt kính dưới chân · tổng " .. tostring(#(S.Move._placedGlasses or {})) .. " tấm · kích thước " .. string.format("%g×%g×%g", S.Move.carpetW, S.Move.carpetH, S.Move.carpetL))
                    hoặc ("⚠️ " .. tostring(res hoặc "không thể đặt kính"))
    nếu id == "clearglass" thì
        local n = S.Move.ClearPlacedGlasses()
        S.Rebuild()
        nếu S.GlassRefreshList thì pcall(S.GlassRefreshList) kết thúc
        return "🧹 đã xóa " .. tostring(n) .. " tấm kính đã đặt"
    nếu id == "autoglass" thì
        S.Move.SetAutoGlass(not S.Move.autoGlass)
        S.Rebuild()
        nếu S.GlassRefreshList thì pcall(S.GlassRefreshList) kết thúc
        return S.Move.autoGlass và "🔄 tự đặt kính: BẬT — di chuyển là tự động đặt kính dưới chân theo cách thảm"
                                hoặc "🔄tự động đặt kính: TẮT"
    nếu id == "openglasspanel" thì
        cục bộ ok = false
        pcall(function() ok = S.OpenPlayerTab and S.OpenPlayerTab() or false end)
        nếu được thì
            pcall(function()
                nếu D.playerTab thì
                    D.playerTab.CanvasPosition = Vector2.new(0, 600)
                kết thúc
            kết thúc)
            nếu S.GlassRefreshList thì pcall(S.GlassRefreshList) kết thúc
            return "🧱 đã mở trang 👥 Người Chơi → khung 🧱 ĐẶT KÍNH: đặt nhiều tấm, danh sách hiện trong menu để xóa lẻ (🗑), tới (📍), bay tới (🚀), xóa hết, tự đặt"
        khác
            return "⚠️ không mở được trang Người Chơi (thử nhấn tab 👥 Người Chơi ở thanh bên)"
        kết thúc
    nếu id == "flyglass" thì
        nếu không phải S.Move.Root() thì return "⚠️ chưa có nhân vật để bay (đợi vào game xong hãy nhấn)" end
        local glasses = S.Move.GetPlacedGlasses and S.Move.GetPlacedGlasses() or {}
        if #glasses == 0 thì return "⚠️ chưa có kính kính nào để bay — ấn 🧱 tới Đặt Kính trước" end
        local myRoot = S.Move.Root()
        local myPos = myRoot and myRoot.Position or nil
        tốt nhất tại địa phương = kính[1]
        cục bộ tốt nhấtD = 1e9
        nếu myPos thì
            for _, g in ipairs(glasses) do
                local dx = gx - myPos.X
                local dz = gz - myPos.Z
                cục bộ d = dx*dx + dz*dz
                nếu d < bestD thì bestD = d; best = g
            kết thúc
        kết thúc
        địa phương được, res = S.Move.FlyToGlass(best.idx)
        nếu S.GlassRefreshList thì pcall(S.GlassRefreshList) kết thúc
        S.Rebuild()
        return ok and string.format("🚀 đang bay tới kính %d (%s) tốc độ %g — chỉnh tốc độ trong khung 🧱 ở tab 👥 Người Chơi, ⏹ Dừng bay để dừng", best.idx, best.name, S.Move.glassFlySpeed ​​hoặc 60)
                    hoặc ("⚠️ " .. tostring(res))
    nếu id == "stopglassfly" thì
        S.Move.StopGlassFly()
        nếu S.GlassRefreshList thì pcall(S.GlassRefreshList) kết thúc
        S.Rebuild()
        return "⏹ đã dừng bay tới kính"
    nếu id == "flyplayer" thì
        nếu không phải S.Move.Root() thì return "⚠️ chưa có nhân vật để bay (đợi vào game xong hãy nhấn)" end
        mục tiêu cục bộ = nil
        if S.Loc and S.Loc.Nearest then target = S.Loc.Nearest() end
        nếu không đạt mục tiêu thì return "⚠️ không có người chơi nào để bay tới" end
        local ok, res = S.Move.FlyToPlayer(target)
        if S.Loc and S.Loc.RefreshList then pcall(S.Loc.RefreshList) end
        if S.SyncLocPanel then pcall(S.SyncLocPanel) end
        S.Rebuild()
        return ok and string.format("🚀 đang bay tới người %s tốc độ %g (0=tự động lấy tốc độ trò chơi) — ⏹ Dừng bay tới người để dừng, theo dõi mục tiêu chuyển hướng, dừng khi <2 đinh tán", tostring(target.Name), S.Move.GetPlayerFlySpeed ​​và S.Move.GetPlayerFlySpeed() hoặc S.Move.playerFlySpeed ​​hoặc 0)
                    hoặc ("⚠️ " .. tostring(res))
    nếu id == "stopflyplayer" thì
        S.Move.StopPlayerFly()
        if S.Loc and S.Loc.RefreshList then pcall(S.Loc.RefreshList) end
        if S.SyncLocPanel then pcall(S.SyncLocPanel) end
        S.Rebuild()
        return "⏹ đã dừng bay tới người chơi"
    nếu id == "runmode" thì
        nếu không phải S.Move.Root() thì return "⚠️ chưa có nhân vật (đợi vào game xong hãy nhấn)" end
        local okR = pcall(function() S.Move.SetRunMode(not S.Move.runMode) end)
        nếu không okR thì trả về "⚠️ không bật chế độ chạy trên thảm" end
        S.Rebuild()
        trả về S.Move.runMode
            và ("🏃 CHẠY TRÊN THẢM (như 🕹️ Bay chạy bộ): BẬT — thảm " .. string.format("%g×%g×%g",
                    S.Move.carpetW, S.Move.carpetH, S.Move.carpetL)
                 .. " dưới chân · chạy " .. tostring(S.Move.WantSpeed())
                 .. (S.Move.speedMode == "x" và (" (game ×" .. tostring(S.Move.speedMul) .. ")") hoặc "")
                 .. " · use node ⬆⬇ nổi GÓC PHẢI màn hình để lên/xuống, ✕ để tắt")
            hoặc "🏃 CHẠY TRÊN THẢM: TẮT (tốc độ đã tăng, tốc độ về mặc định)"
    --------- v4.13: Định VỊ NGƯỜI CHƠI ----------
    nếu id == "loc_all" thì
        pcall(function() S.Loc.Set(not S.Loc.on) end)
        S.Rebuild()
        return (S.Loc.on và "📍 ĐỊNH VỊ: BẬT — " hoặc "📍 Định VỊ: TẮT —") .. S.Loc.Status()
    nếu id == "loc_solo" thì
        nếu S.Loc.solo thì
            pcall(function() S.Loc.SetSolo(false) end)
        khác
            pcall(function() S.Loc.SetTarget(S.Loc.target or S.Loc.Nearest()) end)
        kết thúc
        S.Rebuild()
        return (S.Loc.solo và "🎯 Định VỊ LẺ: " .. tostring(S.Loc.target và S.Loc.target.Name hay "?")
                .. " — chỉ ra người này (bấm tên khác trong khung 📍 để đổi)")
               hoặc "🎯 ĐỊNH VỊ LẺ: TẮT (trở lại bình thường)"
    --------- v4.17: 🛡 BAY AN TOÀN ----------
    nếu id == "safefly" thì
        nếu không phải S.Move.Root() thì return "⚠️ chưa có nhân vật để bay (đợi vào game xong hãy nhấn)" end
        nếu không phải S.Move.Safe.on thì
            local okf = S.Move.SetFly(true)
            nếu okf == false thì return "⚠️ không bật được" end
        kết thúc
        pcall(function() S.Move.Safe.Set(not S.Move.Safe.on) end)
        pcall(function() if S.SyncSafePanel then S.SyncSafePanel() end end)
        S.Rebuild()
        return S.Move.Safe.Status()
    nếu id == "safefly_off" thì
        pcall(function() S.Move.Safe.Stop() end)
        pcall(function() if S.SyncSafePanel then S.SyncSafePanel() end end)
        S.Rebuild()
        trả về "🚫 " .. S.Move.Safe.Status()

    --------- v4.16: ✨ PHÁT SÁNG ----------
    nếu id == "glow" thì
        pcall(function() S.Glow.Set(not S.Glow.on) end)
        pcall(function() if S.SyncGlowPanel then S.SyncGlowPanel() end end)
        S.Rebuild()
        trả về S.Glow.Status()
    nếu id == "glow_off" thì
        pcall(function() S.Glow.Stop() end)
        pcall(function() if S.SyncGlowPanel then S.SyncGlowPanel() end end)
        S.Rebuild()
        trả về "🚫 " .. S.Glow.Status()

    --------- v4.14: 👣 XEM NGƯỜI CHƠI ----------
    nếu id == "spec_on" thì
        nếu S.Spec và S.Spec.on thì
            pcall(function() S.Spec.Stop() end)
            pcall(function() if S.Spec.RefreshList then S.Spec.RefreshList() end end)
            S.Rebuild()
            trả về "🚫 " .. (S.Spec.Status và S.Spec.Status() hoặc "đã nhảy xem")
        kết thúc
        local p = S.Spec.target or S.Loc.target or S.Loc.Nearest()
        nếu không p thì return "⚠️ chưa có ai để xem (server chỉ có mình bạn)" end
        pcall(function() S.Loc.SetTarget(p) end)
        pcall(function() S.Spec.Set(p) end)
        pcall(function() if S.Spec.RefreshList then S.Spec.RefreshList() end end)
        S.Rebuild()
        return "👣 " .. S.Spec.Status() .. " (bấm lại thẻ để dừng · chọn người ở tab 👥)"
    nếu id == "spec_off" thì
        pcall(function() S.Spec.Stop() end)
        pcall(function() if S.Spec.RefreshList then S.Spec.RefreshList() end end)
        S.Rebuild()
        trả về "🚫 " .. S.Spec.Status()
    nếu id == "loc_stop" thì
        pcall(function() S.Loc.StopAll() end)
        S.Rebuild()
        return "🚫 đã tắt hết định vị: " .. S.Loc.Status()
    nếu id == "movestop" thì
        pcall(function() S.Move.StopAll() end)
        S.Rebuild()
        return "🛑 đã tắt hết: " .. S.Move.Status()
    kết thúc
    return "⚠️ không rõ thao tác: " .. tostring(id)
kết thúc

hàm D.CardBtn(parent, text, posX, w, color)
    cục bộ b = New("TextButton", {
        Kích thước = UDim2.new(0, w, 0, 24), Vị trí = UDim2.new(1, posX, 0, 16),
        Văn bản = văn bản, Màu nền 3 = màu hoặc C.SURFACE3, Độ trong suốt nền = 0.08,
        TextColor3 = D.BestText(color or C.SURFACE3), Font = Enum.Font.GothamBold, TextSize = 9,
        BorderSizePixel = 0, ZIndex = 8,
    }, cha)
    Góc(b, UDim.new(0, 7))
    Stroke(b, D.Edge(color or C.SURFACE3), 1.1)
    D.Shade(b, Color3.fromRGB(255,255,255), Color3.fromRGB(182,187,201), 90) -- v4.9: vát sâu hơn
    D.Cảm giác xúc giác (b, 0,08)
    trả lại b
kết thúc

D.hubTab = AddTab("Script Hub", "📚", 3)

D.hubSearchBox = New("TextBox", {
    Kích thước = UDim2.new(1, -16, 0, 26), Vị trí = UDim2.new(0, 8, 0, 8),
    PlaceholderText = "🔍 Tìm script hoặc tiện ích...", Text = "", ClearTextOnFocus = false,
    BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.08, TextColor3 = C.DARK,
    PlaceholderColor3 = C.GRAY, Font = Enum.Font.GothamMedium, TextSize = 10,
    TextXAlignment = Enum.TextXAlignment.Left, BorderSizePixel = 0, ZIndex = 6,
}, D.hubTab)
Corner(D.hubSearchBox, UDim.new(0, 10))
Stroke(D.hubSearchBox, C.BORDER, 1)
New("UIPadding", {PaddingLeft = UDim.new(0, 9)}, D.hubSearchBox)

D.hubChips = New("Frame", {
    Kích thước = UDim2.new(1, -16, 0, 22), Vị trí = UDim2.new(0, 8, 0, 38),
    BackgroundTransparency = 1, BorderSizePixel = 0, ZIndex = 6,
}, D.hubTab)
Mới("UIListLayout", {
    FillDirection = Enum.FillDirection.Horizontal, Padding = UDim.new(0, 5),
    SortOrder = Enum.SortOrder.LayoutOrder, VerticalAlignment = Enum.VerticalAlignment.Center,
}, D.hubChips)

D.hubList = New("ScrollingFrame", {
    Kích thước = UDim2.new(1, -16, 1, -146), Vị trí = UDim2.new(0, 8, 0, 64), -- v4.6.3: thêm 54px cho khung 🌐 Server
    BackgroundTransparency = 1, BorderSizePixel = 0, CanvasSize = UDim2.new(0, 0, 0, 0),
    ScrollBarThickness = 3, ClipsDescendants = true, ZIndex = 6,
    Kích thước Canvas Tự động = Enum.Kích thước Tự động.Y,
}, D.hubTab)
New("UIListLayout", {Padding = UDim.new(0, 6), SortOrder = Enum.SortOrder.LayoutOrder}, D.hubList)

D.hubStatus = New("TextLabel", {
    Kích thước = UDim2.new(1, -16, 0, 22), Vị trí = UDim2.new(0, 8, 1, -24),
    Text = "📚 Nhấn vào để chạy tập lệnh, ⚡ để thực hiện tiện ích · ⭐ để ghi lên đầu",
    BackgroundTransparency = 1, TextColor3 = C.MUTED, Font = Enum.Font.GothamMedium, TextSize = 9,
    TextWrapped = true, TextXAlignment = Enum.TextXAlignment.Left,
    TextYAlignment = Enum.TextYAlignment.Top, ZIndex = 6,
}, D.hubTab)

--------- v4.6.3: KHUNG 🌐 MÁY CHỦ nằm ngay dưới danh sách thẻ ----------
D.hubSrvPanel = New("Frame", {
    Tên = "HubServerPanel", Kích thước = UDim2.new(1, -16, 0, 54), Vị trí = UDim2.new(0, 8, 1, -80),
    BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.25, BorderSizePixel = 0, ZIndex = 6,
}, D.hubTab)
Corner(D.hubSrvPanel, UDim.new(0, 10))
Stroke(D.hubSrvPanel, C.BORDER, 1)

D.hubJobLbl = New("TextLabel", {
    Kích thước = UDim2.new(1, -44, 0, 14), Vị trí = UDim2.new(0, 8, 0, 5),
    Text = "🌐 Máy chủ Mã: đang đọc...", BackgroundTransparency = 1, TextColor3 = C.MUTED,
    Phông chữ = Enum.Font.GothamMedium, Kích thước chữ = 9,
    TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
}, D.hubSrvPanel)

D.hubJobCopy = New("TextButton", {
    Kích thước = UDim2.new(0, 26, 0, 16), Vị trí = UDim2.new(1, -32, 0, 4), Văn bản = "📋",
    BackgroundColor3 = C.BLUE, BackgroundTransparency = 0.1, TextColor3 = C.INK,
    Font = Enum.Font.GothamBold, TextSize = 9, BorderSizePixel = 0, AutoButtonColor = false, ZIndex = 7,
}, D.hubSrvPanel)
Corner(D.hubJobCopy, UDim.new(0, 6))
D.Tactile(D.hubJobCopy, 0.1)

D.hubJobIn = New("TextBox", {
    Kích thước = UDim2.new(1, -124, 0, 24), Vị trí = UDim2.new(0, 8, 0, 24),
    PlaceholderText = "🎟 Dán máy chủ mã hóa (JobId) vào đây...", Text = "", ClearTextOnFocus = false,
    BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.1, TextColor3 = C.DARK,
    PlaceholderColor3 = C.GRAY, Font = Enum.Font.GothamMedium, TextSize = 9,
    TextXAlignment = Enum.TextXAlignment.Left, BorderSizePixel = 0, ZIndex = 7,
}, D.hubSrvPanel)
Corner(D.hubJobIn, UDim.new(0, 8))
Stroke(D.hubJobIn, C.BORDER, 1)
New("UIPadding", {PaddingLeft = UDim.new(0, 7)}, D.hubJobIn)

D.hubJoinBtn = D.CardBtn(D.hubSrvPanel, "🚀 Vào", -110, 52, C.GREEN)
D.hubJoinBtn.Position = UDim2.new(1, -110, 0, 24)
D.hubHopBtn = D.CardBtn(D.hubSrvPanel, "🔀 Hop", -54, 50, C.PURPLE)
D.hubHopBtn.Position = UDim2.new(1, -54, 0, 24)

hàm S.SyncServerPanel()
    pcall(function()
        nếu không phải D.hubJobLbl thì trả về end
        local jid = S.GetJobId()
        nếu jid thì
            D.hubJobLbl.Text = "🌐 Mã máy chủ: " .. jid
            D.hubJobLbl.TextColor3 = C.DARK
        khác
            D.hubJobLbl.Text = "🌐 Không thể đọc máy chủ mã hóa (Studio/server đơn) — 🔄 Reset vẫn được sử dụng"
            D.hubJobLbl.TextColor3 = C.MUTED
        kết thúc
    kết thúc)
kết thúc

D.hubJobCopy.Activated:Connect(function()
    local jid = S.GetJobId()
    nếu không phải jid thì
        D.Say("⚠️ Không có máy chủ mã hóa để sao chép (đang ở đơn vị Studio / máy chủ)")
        trở lại
    kết thúc
    local okCp = S.CopyToClipboard(jid)
    pcall(function() D.hubJobIn.Text = jid end)
    D.Say(okCp and ("📋 Đã sao chép máy chủ mã hóa: " .. jid)
              hoặc ("⚠️ Executor không cho copy — máy chủ mã hóa là: " .. jid), okCp và C.GREEN hoặc C.YELLOW)
kết thúc)

D.hubJoinBtn.Activated:Connect(function()
    ID cục bộ = tostring(D.hubJobIn.Text hoặc "")
    id = id:gsub("^%s+", ""):gsub("%s+$", "")
    id = id:gsub('^"', ""):gsub('"$', ""):gsub("^'", ""):gsub("'$", "")
    nếu id == "" thì
        D.Say("⚠️ Please DÁN mã hóa máy chủ (JobId) vào ô 🎟 trước khi nhấn 🚀 Vào")
        ReleaseHubFocus()
        trở lại
    kết thúc
    D.Say("🚀 Đang vào máy chủ " .. id .. " ...", C.YELLOW)
    ReleaseHubFocus() -- free focus ô nhập, không thì game chặn input sau khi teleport
    local okJ, errJ = pcall(function() S.JoinServer(id) end)
    nếu không okJ thì
        D.Say("⚠️ Không thể vào máy chủ này (mã sai/hết sức/game block): " .. tostring(errJ))
    kết thúc
kết thúc)

D.hubHopBtn.Activated:Connect(function()
    ReleaseHubFocus()
    D.Say("🔀 Đang đi lấy máy chủ mã hóa...", C.YELLOW)
    D.hubStatus.Text = S.RunHubAction("hopserver")
kết thúc)

hàm S.Rebuild()
    pcall(function() if S.RebuildHubList then S.RebuildHubList() end end)
kết thúc

S.HubPanelCat = {
    HubTune_Panel = "Chuyển",
    HubFly_Panel = "Di chuyển",
    HubSpeed_Panel = "Chuyển",
    HubHighJump_Panel = "Di chuyển",
    HubMove_Panel = "Chuyển",
    HubSafe_Panel = "Chuyển",
    HubGlow_Panel = "Tiện ích",
    HubAntiBan_Panel = "Server",
}
hàm S.SyncHubPanels()
    danh sách cục bộ = D.hubList
    nếu không phải danh sách hoặc không phải danh sách cha thì trả về end
    local cat = S.hubCat hoặc "Tất cả"
    for _, c in ipairs(list:GetChildren()) do
        local want = S.HubPanelCat[c.Name]
        nếu muốn thì
            c.Visible = (cat == "Tất cả") hoặc (cat == muốn)
        kết thúc
    kết thúc
kết thúc

hàm S.RebuildHubList()
    danh sách cục bộ = D.hubList
    nếu không phải danh sách hoặc không phải danh sách cha thì trả về end
    cục bộ cũ = {}
    for _, c in ipairs(list:GetChildren()) do
        if c:IsA("Frame") and c.Name:sub(1, 8) == "HubCard_" then stale[#stale + 1] = c end
    kết thúc
    for _, c in ipairs(stale) do pcall(function() c:Destroy() end) end

    local q = tostring(S.hubSearch or ""):lower()
    local cat = S.hubCat hoặc "Tất cả"
    các mục cục bộ = {}
    for _, it in ipairs(S.ScriptHubList) do
        local okCat = (cat == "Tất cả") hoặc (it.cat == cat)
        local okQ = (q == "")
            hoặc tostring(it.name):lower():find(q, 1, true) ~= nil
            hoặc tostring(it.desc hoặc ""):lower():find(q, 1, true) ~= nil
            hoặc tostring(it.cat hoặc ""):lower():find(q, 1, true) ~= nil
        nếu okCat và okQ thì items[#items + 1] = it end
    kết thúc
    bảng.sắp xếp(các mục, hàm(a, b)
        local fa = S.hubFavs[a.name] and 1 or 0
        local fb = S.hubFavs[b.name] and 1 or 0
        nếu fa ~= fb thì trả về fa > fb
        return (a.ord or 99) < (b.ord or 99)
    kết thúc)

    for i, it in ipairs(items) do
        thẻ cục bộ = New("Khung", {
            Tên = "HubCard_" .. tostring(it.name), Kích thước = UDim2.new(1, 0, 0, 56), Thứ tự bố cục = i + 1,
            BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.12, BorderSizePixel = 0, ZIndex = 6,
        }, danh sách)
        Góc(thẻ, UDim.new(0, 10))
        Stroke(card, S.hubFavs[it.name] and C.ACCENT or C.HAIRLINE, 1) -- v4.9: viền khối rõ ràng hơn
        D.Shade(card, Color3.fromRGB(255,255,255), Color3.fromRGB(188,192,205), 90) -- v4.9: thẻ có khối

        local ico = New("TextLabel", {
            Kích thước = UDim2.new(0, 34, 0, 34), Vị trí = UDim2.new(0, 8, 0, 11), Văn bản = it.icon,
            BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.15, TextColor3 = C.ACCENT,
            Font = Enum.Font.GothamBold, TextSize = 16, BorderSizePixel = 0, ZIndex = 7,
        }, thẻ)
        Góc(ico, UDim.new(0, 9))
        D.Shade(ico, Color3.fromRGB(255,255,255), Color3.fromRGB(176,181,196), 90)
        Stroke(ico, C.HAIRLINE, 1)

        Mới("TextLabel", {
            Kích thước = UDim2.new(1, -214, 0, 14), Vị trí = UDim2.new(0, 50, 0, 8),
            Văn bản = tostring(it.name) .. (S.hubFavs[it.name] và " ⭐" hoặc ""),
            BackgroundTransparency = 1, TextColor3 = C.DARK, Font = Enum.Font.GothamBold, TextSize = 11,
            TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
        }, thẻ)
        Mới("TextLabel", {
            Kích thước = UDim2.new(1, -214, 0, 10), Vị trí = UDim2.new(0, 50, 0, 22),
            Văn bản = chuỗi.chữ hoa(tostring(it.cat hoặc "")), Độ trong suốt của nền = 1,
            TextColor3 = C.ACCENT, Phông chữ = Enum.Font.GothamBold, TextSize = 8,
            TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
        }, thẻ)
        Mới("TextLabel", {
            Kích thước = UDim2.new(1, -214, 0, 20), Vị trí = UDim2.new(0, 50, 0, 33),
            Văn bản = tostring(it.desc hoặc ""), Độ trong suốt nền = 1, Màu văn bản 3 = C.MUTED,
            Font = Enum.Font.GothamMedium, TextSize = 9, TextWrapped = true,
            TextXAlignment = Enum.TextXAlignment.Left, TextYAlignment = Enum.TextYAlignment.Top, ZIndex = 7,
        }, thẻ)

        local isAction = (it.action ~= nil)
        local runText
        nếu isAction thì
            nếu it.action == "crosshair" thì
                runText = (S.crosshairOn và "🎯 TẮT") hoặc "🎯 BẬT"
            elseif S.MoveActionState and S.MoveActionState[it.action] then
                cục bộ bật = false
                pcall(function() on = S.MoveActionState[it.action]() end)
                runText = tostring(it.icon) .. " " .. ((on and "TẮT") or "BẬT")
            khác
                runText = "⚡ Chạy"
            kết thúc
        khác
            runText = "▶ Chạy"
        kết thúc
        local runBtn = D.CardBtn(card, runText, -166, 78, isAction and C.SURFACE3 or C.GREEN)
        runBtn.Activated:Connect(function()
            ReleaseHubFocus()
            nếu nó.code thì
                local okR = RunCode(it.code, it.name, nil, 1, 0, it.noPark == true)
                D.Say((okR and " Vitamin đã chạy '" or "⚠️ không chạy '") .. it.name .. "'"
                    .. (it.noPark và " · 🪟 GUI của nó ở trò chơi NGOÀI màn hình (đúng như tab 🛠)" hoặc "")
                    .. " · xem chi tiết ở tab 💻 Code", C.YELLOW)
            khác
                D.Say(S.RunHubAction(it.action), C.YELLOW)
            kết thúc
        kết thúc)

        nếu nó.code thì
            local copyBtn = D.CardBtn(card, "📋", -84, 24, C.BLUE)
            copyBtn.Activated:Connect(function()
                local did = S.CopyToClipboard(it.code)
                D.Say(đã và ("📋 đã sao chép chuỗi tải của '" .. it.name .. "'")
                           hoặc "⚠️ clipboard này không hỗ trợ trình thực thi", đã làm và C.GREEN hoặc C.RED)
            kết thúc)
            local saveBtn = D.CardBtn(card, "💾", -56, 24, C.PURPLE)
            saveBtn.Activated:Connect(function()
                local nm = it.name
                số lượng cục bộ = 1
                trong khi đúng vậy
                    cục bộ ex = false
                    for _, s in ipairs(scripts) do if s.name == nm then ex = true break end end
                    nếu không phải ex thì dừng lại
                    cnt ± 1
                    nm = it.name .. " (" .. cnt .. ")"
                kết thúc
                table.insert(scripts, {name = nm, code = it.code, expanded = false})
                pcall(function() if RebuildScripts then RebuildScripts() end end)
                pcall(function() Store.saveSoon() end)
                D.Say("💾 đã lưu '" .. nm .. "' sang tab 💾 Code Đã Lưu", C.GREEN)
            kết thúc)
        kết thúc

        local favBtn = D.CardBtn(card, S.hubFavs[it.name] and "⭐" or "☆", -28, 24,
            S.hubFavs[it.name] và C.YELLOW hoặc C.SURFACE3)
        favBtn.Activated:Connect(function()
            if S.hubFavs[it.name] then S.hubFavs[it.name] = nil else S.hubFavs[it.name] = true end
            pcall(function() Store.saveSoon() end) -- lưu yêu thích xuống đĩa
            S.RebuildHubList()
            D.Say(S.hubFavs[it.name] and ("⭐ đã ghim '" .. it.name .. "'lên đầu")
                                      hoặc ("☆ đã bỏ ghim '" .. it.name .. "'"), C.MUTED)
        kết thúc)
    kết thúc

    pcall(function()
        nếu S.SyncHubPanels thì S.SyncHubPanels() kết thúc
        bảng cục bộH = 0
        for _, c in ipairs(list:GetChildren()) do
            nếu c:IsA("Frame") và c.Name:sub(1, 8) ~= "HubCard_" và c.Visible ~= false thì
                panelH = panelH + ((c.Size và c.Size.Y.Offset) hoặc 0) + 6
            kết thúc
        kết thúc
        list.CanvasSize = UDim2.new(0, 0, 0, #items * 62 + 6 + panelH)
    kết thúc)
    if S.SyncFlyPanel thì pcall(S.SyncFlyPanel) end -- v4.36: Bay + Đai Tường độc cài
    if S.SyncSpeedPanel then pcall(S.SyncSpeedPanel) end -- v4.37: 💨 tốc độ theo camera
    if S.SyncHighJumpPanel then pcall(S.SyncHighJumpPanel) end -- v4.38: 🦘 nhảy cao
    if S.SyncTunePanel then pcall(S.SyncTunePanel) end -- v4.40: ⚙ tùy chỉnh gom
    if S.RefreshMovePanel thì pcall(S.RefreshMovePanel) end -- v4.12: nhãn trạng thái di chuyển
    if S.SyncGlowPanel thì pcall(S.SyncGlowPanel) end -- v4.16: nhãn khung ✨ phát sáng
    if S.SyncSafePanel then pcall(S.SyncSafePanel) end -- v4.17: nhãn khung 🛡 bay an toàn
    if S.SyncAntiBanPanel then pcall(S.SyncAntiBanPanel) end -- v4.43: 🔐 chống cấm
    nếu #items == 0 và D.hubStatus thì
        D.Say("🔍 không tìm thấy gì khớp '" .. tostring(S.hubSearch hoặc "") .. "'", C.MUTED)
    kết thúc
kết thúc

--------- v4.40: KHUNG ⚙ TUỲ CHỈNH (Bay · Tốc độ camera · Bỏ qua · Di chuyển) ----------
LÀM
    cục bộ P = New("Khung", {
        Tên = "HubTune_Panel", Kích thước = UDim2.new(1, 0, 0, 172), Thứ tự bố cục = -4,
        BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.12, BorderSizePixel = 0, ZIndex = 6,
    }, D.hubList)
    Corner(P, UDim.new(0, 10)); Stroke(P, C.HAIRLINE, 1)
    D.Shade(P, Color3.fromRGB(255,255,255), Color3.fromRGB(188,192,205), 90)
    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 16), Vị trí = UDim2.new(0, 8, 0, 4),
        Text = "⚙ TUỲ CHỈNH — 🚀 Bay · 💨 Tốc độ camera · 🦘 Bỏ qua cao · 👟 Di chuyển",
        BackgroundTransparency = 1, TextColor3 = C.ACCENT, Font = Enum.Font.GothamBold, TextSize = 10,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)
    nút chức năng cục bộ (tên, văn bản, x, y, w, màu sắc)
        cục bộ b = New("TextButton", {
            Tên = tên, Văn bản = văn bản, Kích thước = UDim2.new(0, w, 0, 22), Vị trí = UDim2.new(0, x, 0, y),
            BackgroundColor3 = color, TextColor3 = D.BestText(color), BorderSizePixel = 0,
            Font = Enum.Font.GothamBold, TextSize = 9, ZIndex = 8,
        }, P)
        Góc(b, UDim.new(0, 6)); D.Tactile(b, 0.08)
        trả lại b
    kết thúc
    hàm cục bộ box(name, x, y, val)
        local b = New("TextBox", {
            Tên = tên, Kích thước = UDim2.new(0, 52, 0, 22), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = tostring(val), Xóa văn bản khi tập trung = false, Màu nền 3 = C.SURFACE2,
            TextColor3 = C.DARK, Font = Enum.Font.GothamMedium, TextSize = 9, BorderSizePixel = 0, ZIndex = 8,
        }, P)
        Góc(b, UDim.new(0, 6))
        trả lại b
    kết thúc
    hàm cục bộ lab(txt, x, y, w)
        Mới("TextLabel", {
            Kích thước = UDim2.new(0, w, 0, 22), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = txt, Độ trong suốt nền = 1, Màu chữ 3 = C.MUTED,
            Font = Enum.Font.GothamMedium, TextSize = 9, TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
        }, P)
    kết thúc

    local flyBtn = nút("TuneFly", "🚀 Bay: TẮT", 8, 24, 110, C.GRAY)
    local flyBox = box("TuneFlySpeed", 122, 24, MV.flySpeed)
    local flyApply = button("TuneFlyApply", "✔", 178, 24, 32, C.GREEN)
    local flyStop = button("TuneFlyStop", "⏹", 214, 24, 32, C.RED)

    local spdBtn = nút("TuneSprint", "💨 Tốc độ: TẮT", 8, 50, 110, C.GRAY)
    local spdBox = box("TuneSprintSpeed", 122, 50, MV.sprintSpeed)
    local spdApply = button("TuneSprintApply", "✔", 178, 50, 32, C.GREEN)
    local spdStop = button("TuneSprintStop", "⏹", 214, 50, 32, C.RED)

    local hjBtn = nút("TuneHighJump", "🦘 Skip cao: TẮT", 8, 76, 110, C.GRAY)
    local hjBox = box("TuneHighJumpSpeed", 122, 76, MV.highJumpSpeed)
    local hjApply = button("TuneHighJumpApply", "✔", 178, 76, 32, C.GREEN)
    local hjStop = button("TuneHighJumpStop", "⏹", 214, 76, 32, C.RED)

    lab("👟Chạy", 254, 24, 48)
    local wsBox = box("TuneWalkSpeed", 304, 24, (MV.speedMode == "x") and ("x" .. tostring(MV.speedMul)) or tostring(MV.walkSpeed))
    lab("🦘 Lực nhảy", 254, 50, 70)
    local jpBox = box("TuneJumpPower", 324, 50, MV.jumpPower)
    local mvApply = nút("TuneMoveApply", " ✔ Di chuyển", 254, 76, 122, C.GREEN)

    trạng thái cục bộ = Mới("Nhãn văn bản", {
        Tên = "TuneStatus", Kích thước = UDim2.new(1, -16, 0, 28), Vị trí = UDim2.new(0, 8, 0, 102),
        Văn bản = "", Độ trong suốt nền = 1, Màu văn bản 3 = C.MUTED, Phông chữ = Enum.Font.GothamMedium,
        Kích thước văn bản = 9, Văn bản xuống dòng = true, Căn chỉnh văn bản theo trục X = Enum.TextXAlignment.Left, Chỉ số Z = 7,
    }, P)
    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 32), Vị trí = UDim2.new(0, 8, 0, 134),
        Text = "💡 ✔ = áp tốc độ dòng đó. 👟 gõ x3 = theo trò chơi ×3, nhập số = cố định. Thân/kính/bay-tới vẫn ở khung ⚙ bên dưới.",
        BackgroundTransparency = 1, TextColor3 = C.MUTED, Font = Enum.Font.GothamMedium, TextSize = 8,
        TextWrapped = true, TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)

    hàm cục bộ paintToggle(b, on, label)
        b. Văn bản = nhãn .. (trên và "BẬT" hoặc "TẮT")
        D.SetBg(b, on and C.GREEN or C.GRAY)
    kết thúc
    hàm cục bộ được tập trung()
        trả về UserInputService:GetFocusedTextBox()
    kết thúc
    hàm S.SyncTunePanel()
        nếu không phải (P và P.Parent) thì trả về end
        paintToggle(flyBtn, MV.fly, "🚀 Bay: ")
        PaintToggle(spdBtn, MV.sprint, "💨 Tốc độ: ")
        PaintToggle(hjBtn, MV.highJump, "🦘 Skip cao: ")
        cục bộ tb = tập trung()
        if tb ~= flyBox then flyBox.Text = tostring(MV.flySpeed) end
        if tb ~= spdBox then spdBox.Text = tostring(MV.sprintSpeed) end
        if tb ~= hjBox then hjBox.Text = tostring(MV.highJumpSpeed) end
        nếu tb ~= wsBox thì
            wsBox.Text = (MV.speedMode == "x") and ("x" .. tostring(MV.speedMul)) or tostring(MV.walkSpeed)
        kết thúc
        if tb ~= jpBox then jpBox.Text = tostring(MV.jumpPower) end
        status.Text = (MV.Status and MV.Status()) or ""
    kết thúc

    flyBtn.Activated:Connect(function() ReleaseHubFocus(); D.Say(S.RunHubAction("fly"), C.YELLOW) end)
    spdBtn.Activated:Connect(function() ReleaseHubFocus(); D.Say(S.RunHubAction("camspeed"), C.YELLOW) end)
    hjBtn.Activated:Connect(function() ReleaseHubFocus(); D.Say(S.RunHubAction("highjump"), C.YELLOW) end)
    flyStop.Activated:Connect(function()
        ReleaseHubFocus(); MV.SetFly(false); S.Rebuild()
        D.Say("🚀 Bay: TẮT", C.YELLOW)
    kết thúc)
    spdStop.Activated:Connect(function()
        ReleaseHubFocus(); MV.SetSprint(false); S.Rebuild()
        D.Say("💨 Tốc độ theo camera: TẮT", C.YELLOW)
    kết thúc)
    hjStop.Activated:Connect(function()
        ReleaseHubFocus(); MV.SetHighJump(false); S.Rebuild()
        D.Say("🦘 Bỏ cao: TẮT", C.YELLOW)
    kết thúc)
    hàm cục bộ applyFly()
        ReleaseHubFocus()
        local ok, result = MV.SetFlySpeed(flyBox.Text)
        D.Say(ok and ("💨 Tốc độ bay: " .. tostring(result)) or ("⚠️ " .. tostring(result)), ok and C.GREEN or C.YELLOW)
        S.SyncTunePanel()
    kết thúc
    hàm cục bộ applySprint()
        ReleaseHubFocus()
        local ok, result = MV.SetSprintSpeed(spdBox.Text)
        D.Say(ok and ("💨 Tốc độ chạy camera: " .. tostring(result)) or ("⚠️ " .. tostring(result)), ok and C.GREEN or C.YELLOW)
        S.SyncTunePanel()
    kết thúc
    hàm cục bộ applyHj()
        ReleaseHubFocus()
        local ok, result = MV.SetHighJumpSpeed(hjBox.Text)
        D.Say(ok and ("💨 Tốc độ nhảy cao: " .. tostring(result)) or ("⚠️ " .. tostring(result)), ok and C.GREEN or C.YELLOW)
        S.SyncTunePanel()
    kết thúc
    flyApply.Activated:Connect(applyFly)
    spdApply.Activated:Connect(applySprint)
    hjApply.Activated:Connect(applyHj)
    flyBox.FocusLost:Connect(function(enter) if enter then applyFly() end end)
    spdBox.FocusLost:Connect(function(enter) if enter then applySprint() end end)
    hjBox.FocusLost:Connect(function(enter) if enter then applyHj() end end)
    mvApply.Activated:Connect(function()
        ReleaseHubFocus()
        local wmul = tostring(wsBox.Text or ""):match("^[xX×]%s*([%d%.]+)")
        nếu wmul thì
            MV.speedMode = "x"
            MV.speedMul = mvClamp(tonumber(wmul), 1, 20)
        khác
            local w = tonumber(wsBox.Text)
            nếu w thì
                MV.speedMode = "num"
                MV.walkSpeed ​​= mvClamp(w, 0, 500, 16)
            kết thúc
        kết thúc
        local j = tonumber(jpBox.Text)
        if j then MV.jumpPower = mvClamp(j, 0, 500, 50) end
        pcall(function() if MV.speed then MV.ApplyChar() end end)
        if S.RefreshMovePanel then pcall(S.RefreshMovePanel) end
        S.SyncTunePanel()
        D.Say(string.format("⚙ di chuyển: chạy %s · lực nhảy %d",
            (MV.speedMode == "x") và ("×" .. tostring(MV.speedMul)) hoặc tostring(MV.walkSpeed),
            MV.jumpPower), C.GREEN)
    kết thúc)
    S.tuneBtns = {panel = P, fly = flyBtn, sprint = spdBtn, highjump = hjBtn, flySpeed ​​= flyBox, sprintSpeed ​​= spdBox, highJumpSpeed ​​= hjBox, walk = wsBox, jump = jpBox}
    S.SyncTunePanel()
kết thúc
--------- HẾT KHUNG ⚙ TUỲ CHỈNH ----------

--------- v4.43: KHUNG 🔐 CHỐNG BAN ----------
LÀM
    cục bộ P = New("Khung", {
        Tên = "HubAntiBan_Panel", Kích thước = UDim2.new(1, 0, 0, 88), Thứ tự bố cục = 3,
        BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.12, BorderSizePixel = 0, ZIndex = 6,
    }, D.hubList)
    Corner(P, UDim.new(0, 10)); Stroke(P, C.HAIRLINE, 1)
    D.Shade(P, Color3.fromRGB(255,255,255), Color3.fromRGB(188,192,205), 90)
    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 16), Vị trí = UDim2.new(0, 8, 0, 4),
        Text = "🔐 ANTI BAN — máy chủ tự động khác khi bị nghi / định cấm",
        BackgroundTransparency = 1, TextColor3 = C.ACCENT, Font = Enum.Font.GothamBold, TextSize = 10,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)
    hàm cục bộ abtn(name, text, x, y, w, color)
        cục bộ b = New("TextButton", {
            Tên = tên, Văn bản = văn bản, Kích thước = UDim2.new(0, w, 0, 22), Vị trí = UDim2.new(0, x, 0, y),
            BackgroundColor3 = color, TextColor3 = D.BestText(color), BorderSizePixel = 0,
            Font = Enum.Font.GothamBold, TextSize = 9, ZIndex = 8,
        }, P)
        Góc(b, UDim.new(0, 6)); D.Tactile(b, 0.08)
        trả lại b
    kết thúc
    local onBtn = abtn("AntiBanOn", "🔐 TẮT", 8, 24, 88, C.GRAY)
    local hopBtn = abtn("AntiBanHopNow", "🔀 Hop ngay", 100, 24, 88, C.PURPLE)
    Mới("TextLabel", {
        Kích thước = UDim2.new(0, 52, 0, 22), Vị trí = UDim2.new(0, 194, 0, 24),
        Văn bản = "⏳ chờ s", Độ trong suốt nền = 1, Màu chữ 3 = C.MUTED,
        Font = Enum.Font.GothamMedium, TextSize = 9, TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)
    local cdBox = New("TextBox", {
        Tên = "AntiBanCooldown", Kích thước = UDim2.new(0, 44, 0, 22), Vị trí = UDim2.new(0, 246, 0, 24),
        Văn bản = tostring(S.AntiBan.cooldown), Xóa văn bản khi tập trung = false, Màu nền 3 = C.SURFACE2,
        TextColor3 = C.DARK, Font = Enum.Font.GothamMedium, TextSize = 9, BorderSizePixel = 0, ZIndex = 8,
    }, P)
    Góc(cdBox, UDim.new(0, 6))
    local st = New("TextLabel", {
        Tên = "Trạng thái chống cấm", Kích thước = UDim2.new(1, -16, 0, 32), Vị trí = UDim2.new(0, 8, 0, 50),
        Văn bản = "", Độ trong suốt nền = 1, Màu văn bản 3 = C.MUTED, Phông chữ = Enum.Font.GothamMedium,
        Kích thước văn bản = 9, Văn bản xuống dòng = true, Căn chỉnh văn bản theo trục X = Enum.TextXAlignment.Left, Chỉ số Z = 7,
    }, P)
    hàm S.SyncAntiBanPanel()
        pcall(function()
            onBtn.Text = S.AntiBan.on và "🔐 BẬT" hoặc "🔐 TẮT"
            D.SetBg(onBtn, S.AntiBan.on and C.GREEN or C.GRAY)
            nếu UserInputService:GetFocusedTextBox() khác với cdBox thì
                cdBox.Text = tostring(S.AntiBan.cooldown or 10)
            kết thúc
            st.Text = S.AntiBanStatus() .. " · kick/ban/error → hop. Bay/xuyên được thiết lập lại tốc độ 3 lần/4s → hop. Không nhập lại đúng máy chủ cũ."
        kết thúc)
    kết thúc
    onBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.RunHubAction("antiban")
        S.SyncAntiBanPanel()
    kết thúc)
    hopBtn.Activated:Connect(function()
        ReleaseHubFocus()
        if not S.AntiBan.on then S.AntiBanSet(true) end
        local n = tonumber(cdBox.Text)
        nếu n thì S.AntiBan.cooldown = math.clamp(n, 3, 60) end
        S.AntiBanHop ("thủ công")
        S.SyncAntiBanPanel()
    kết thúc)
    cdBox.FocusLost:Connect(function()
        local n = tonumber(cdBox.Text)
        nếu n thì S.AntiBan.cooldown = math.clamp(n, 3, 60) end
        S.SyncAntiBanPanel()
    kết thúc)
    S.SyncAntiBanPanel()
kết thúc
--------- HẾT KHUNG 🔐 CHỐNG BAN ----------

--------- v4.36: KHUNG 🚀 BAY THEO CAMERA (công tắc 🧱 độc lập) ----------
LÀM
    cục bộ P = New("Khung", {
        Tên = "HubFly_Panel", Kích thước = UDim2.new(1, 0, 0, 154), Thứ tự bố cục = -1,
        BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.12, BorderSizePixel = 0, ZIndex = 6,
    }, D.hubList)
    Corner(P, UDim.new(0, 10)); Stroke(P, C.HAIRLINE, 1)
    D.Shade(P, Color3.fromRGB(255,255,255), Color3.fromRGB(188,192,205), 90)
    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 16), Vị trí = UDim2.new(0, 8, 0, 4),
        Text = "🚀 BAY THEO CAMERA — điều khiển tay", BackgroundTransparency = 1,
        TextColor3 = C.ACCENT, Phông chữ = Enum.Font.GothamBold, TextSize = 10,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)
    nút chức năng cục bộ (tên, văn bản, x, y, w, màu sắc)
        cục bộ b = New("TextButton", {
            Tên = tên, Văn bản = văn bản, Kích thước = UDim2.new(0, w, 0, 24), Vị trí = UDim2.new(0, x, 0, y),
            BackgroundColor3 = color, TextColor3 = D.BestText(color), BorderSizePixel = 0,
            Font = Enum.Font.GothamBold, TextSize = 10, ZIndex = 8,
        }, P)
        Góc(b, UDim.new(0, 6)); D.Tactile(b, 0.08)
        trả lại b
    kết thúc
    local onBtn = button("FlyToggle", "🚀 Bay: TẮT", 8, 24, 100, C.GRAY)
    local ncBtn = nút("FlyNoclip", "🧱 Xuyên tường: TẮT", 114, 24, 158, C.GRAY)
    hudBtn = nút cục bộ("FlyHudToggle", "📱 Nút ảo: BẬT", 278, 24, 124, C.GREEN)
    Mới("TextLabel", {
        Kích thước = UDim2.new(0, 128, 0, 24), Vị trí = UDim2.new(0, 8, 0, 54),
        Văn bản = "💨 Tốc độ (1–2000)", Độ trong suốt nền = 1, Màu chữ 3 = C.MUTED,
        Font = Enum.Font.GothamMedium, TextSize = 10, TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)
    tốc độ cục bộ = New("TextBox", {
        Tên = "FlySpeed", Kích thước = UDim2.new(0, 56, 0, 24), Vị trí = UDim2.new(0, 140, 0, 54),
        Văn bản = tostring(MV.flySpeed), Xóa văn bản khi tập trung = false, Màu nền 3 = C.SURFACE2,
        TextColor3 = C.DARK, Font = Enum.Font.GothamMedium, TextSize = 10, BorderSizePixel = 0, ZIndex = 8,
    }, P)
    Góc(tốc độ, UDim.new(0, 6))
    local apply = nút("FlySpeedApply", " ✔ Áp dụng", 202, 54, 92, C.GREEN)
    local stop = button("FlyStop", "⏹ vịnh", 300, 54, 102, C.RED)
    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 46), Vị trí = UDim2.new(0, 8, 0, 84),
        Text = "WASD / joystick: bay theo camera cả lên và xuống. Nhìn xuống 60° + tiến tới = bay xuống 60°. "
            .. "Space / ⬆: lên; Shift/Ctrl / ⬇: xuống. Thả điều khiển: đứng lơ lửng. "
            .. "🧱 là công tắc riêng, Bay không tự bật/tắt xuyên tường.",
        BackgroundTransparency = 1, TextColor3 = C.MUTED, Font = Enum.Font.GothamMedium, TextSize = 9,
        TextWrapped = true, TextXAlignment = Enum.TextXAlignment.Left, TextYAlignment = Enum.TextYAlignment.Top, ZIndex = 7,
    }, P)
    trạng thái cục bộ = Mới("Nhãn văn bản", {
        Tên = "FlyPanelStatus", Kích thước = UDim2.new(1, -16, 0, 16), Vị trí = UDim2.new(0, 8, 0, 134),
        Văn bản = "", Độ trong suốt nền = 1, Màu văn bản 3 = C.MUTED, Phông chữ = Enum.Font.GothamMedium,
        Kích thước văn bản = 9, Căn chỉnh văn bản theo trục X = Enum.TextXAlignment.Left, Chỉ số Z = 7,
    }, P)
    hàm S.SyncFlyPanel()
        hàm cục bộ paint(b, on, label)
            b. Văn bản = nhãn .. (trên và "BẬT" hoặc "TẮT")
            D.SetBg(b, on and C.GREEN or C.GRAY)
        kết thúc
        paint(onBtn, MV.fly, "🚀 Bay: ")
        Paint(ncBtn, MV.noclip, "🧱 Xuyên Tường: ")
        Paint(hudBtn, MV.Flight.showHud, "📱 Nút ảo: ")
        if UserInputService:GetFocusedTextBox() ~= speed then speed.Text = tostring(MV.flySpeed) end
        status.Text = MV.fly and ("🚀 Đang bay theo camera · tốc độ " .. tostring(MV.flySpeed) .. " · thả phím để dừng tại phòng")
            hoặc "🚀 Đã tắt bay · 🧱Tối Tường " .. (MV.noclip and "BẬT" or "TẮT")
    kết thúc
    onBtn.Activated:Connect(function() ReleaseHubFocus(); D.Say(S.RunHubAction("fly"), C.YELLOW) end)
    ncBtn.Activated:Connect(function() ReleaseHubFocus(); D.Say(S.RunHubAction("noclip"), C.YELLOW) end)
    hudBtn.Activated:Connect(function() ReleaseHubFocus(); MV.SetFlyHud(not MV.Flight.showHud) end)
    hàm cục bộ applySpeed()
        giá trị cục bộ = tốc độ.Text
        ReleaseHubFocus()
        cục bộ ok, kết quả = MV.SetFlySpeed(value)
        nếu được thì D.Say("💨 Tốc độ bay: " .. tostring(result), C.GREEN)
        nếu không thì D.Say("⚠️ " .. tostring(result), C.YELLOW) end
        S.SyncFlyPanel()
    kết thúc
    apply.Activated:Connect(applySpeed)
    tốc độ.Mất tiêu điểm:Kết nối(hàm(enter) nếu enter thì applySpeed() kết thúc)
    dừng.Đã kích hoạt:Kết nối(function())
        ReleaseHubFocus(); MV.SetFly(false); S.Rebuild()
        D.Say("🚀 Bay: TẮT — Thường xuyên giảng giữ nguyên theo công tắc 🧱", C.YELLOW)
    kết thúc)
    S.flyBtns = {on = onBtn, noclip = ncBtn, hud = hudBtn, speed = speed, apply = apply, stop = stop, panel = P}
    S.SyncFlyPanel()
kết thúc
--------- HẾT KHUNG 🚀 CAMERA BAY THEO ----------

--------- v4.37: KHUNG 💨 TỐC ĐỘ THEO CAMERA (không xuyên tường, không nút ảo) ----------
LÀM
    cục bộ P = New("Khung", {
        Tên = "HubSpeed_Panel", Kích thước = UDim2.new(1, 0, 0, 130), Thứ tự bố cục = -2,
        BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.12, BorderSizePixel = 0, ZIndex = 6,
    }, D.hubList)
    Corner(P, UDim.new(0, 10)); Stroke(P, C.HAIRLINE, 1)
    D.Shade(P, Color3.fromRGB(255,255,255), Color3.fromRGB(188,192,205), 90)
    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 16), Vị trí = UDim2.new(0, 8, 0, 4),
        Text = "💨 TỐC ĐỘ THEO CAMERA — mặt đất, nhảy/rơi theo game", BackgroundTransparency = 1,
        TextColor3 = C.ACCENT, Phông chữ = Enum.Font.GothamBold, TextSize = 10,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)
    nút chức năng cục bộ (tên, văn bản, x, y, w, màu sắc)
        cục bộ b = New("TextButton", {
            Tên = tên, Văn bản = văn bản, Kích thước = UDim2.new(0, w, 0, 24), Vị trí = UDim2.new(0, x, 0, y),
            BackgroundColor3 = color, TextColor3 = D.BestText(color), BorderSizePixel = 0,
            Font = Enum.Font.GothamBold, TextSize = 10, ZIndex = 8,
        }, P)
        Góc(b, UDim.new(0, 6)); D.Tactile(b, 0.08)
        trả lại b
    kết thúc
    local onBtn = nút("SpeedToggle", "💨 Tốc độ: TẮT", 8, 24, 132, C.GRAY)
    local stop = button("SpeedStop", "⏹ cột", 146, 24, 80, C.RED)
    Mới("TextLabel", {
        Kích thước = UDim2.new(0, 128, 0, 24), Vị trí = UDim2.new(0, 8, 0, 54),
        Văn bản = "💨 Tốc độ (1–2000)", Độ trong suốt nền = 1, Màu chữ 3 = C.MUTED,
        Font = Enum.Font.GothamMedium, TextSize = 10, TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)
    tốc độ cục bộ = New("TextBox", {
        Tên = "SprintSpeed", Kích thước = UDim2.new(0, 56, 0, 24), Vị trí = UDim2.new(0, 140, 0, 54),
        Văn bản = tostring(MV.sprintSpeed), Xóa văn bản khi tập trung = false, Màu nền 3 = C.SURFACE2,
        TextColor3 = C.DARK, Font = Enum.Font.GothamMedium, TextSize = 10, BorderSizePixel = 0, ZIndex = 8,
    }, P)
    Góc(tốc độ, UDim.new(0, 6))
    local apply = nút("SpeedApply", " ✔ Áp dụng", 202, 54, 92, C.GREEN)
    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 32), Vị trí = UDim2.new(0, 8, 0, 82),
        Text = "WASD / joystick game: chạy theo camera hướng trên mặt đất. Skip = Space of game."
            .. "Rơi theo sức mạnh game. Không thường xuyên, không nút ảo.",
        BackgroundTransparency = 1, TextColor3 = C.MUTED, Font = Enum.Font.GothamMedium, TextSize = 9,
        TextWrapped = true, TextXAlignment = Enum.TextXAlignment.Left, TextYAlignment = Enum.TextYAlignment.Top, ZIndex = 7,
    }, P)
    trạng thái cục bộ = Mới("Nhãn văn bản", {
        Tên = "SpeedPanelStatus", Kích thước = UDim2.new(1, -16, 0, 14), Vị trí = UDim2.new(0, 8, 0, 112),
        Văn bản = "", Độ trong suốt nền = 1, Màu văn bản 3 = C.MUTED, Phông chữ = Enum.Font.GothamMedium,
        Kích thước văn bản = 9, Căn chỉnh văn bản theo trục X = Enum.TextXAlignment.Left, Chỉ số Z = 7,
    }, P)
    hàm S.SyncSpeedPanel()
        onBtn.Text = "💨 Tốc độ: " .. (MV.sprint và "BẬT" hoặc "TẮT")
        D.SetBg(onBtn, MV.sprint and C.GREEN or C.GRAY)
        if UserInputService:GetFocusedTextBox() ~= speed then speed.Text = tostring(MV.sprintSpeed) end
        status.Text = MV.sprint
            và ("💨 Đang chạy theo camera · tốc độ " .. tostring(MV.sprintSpeed) .. " · nhảy/rơi theo game")
            hoặc "💨 Đã tắt · va chạm tường + nhảy + lực lực = của game"
    kết thúc
    onBtn.Activated:Connect(function() ReleaseHubFocus(); D.Say(S.RunHubAction("camspeed"), C.YELLOW) end)
    hàm cục bộ applySpeed()
        giá trị cục bộ = tốc độ.Text
        ReleaseHubFocus()
        cục bộ ok, kết quả = MV.SetSprintSpeed(value)
        nếu được thì D.Say("💨 Tốc độ chạy: " .. tostring(result), C.GREEN)
        nếu không thì D.Say("⚠️ " .. tostring(result), C.YELLOW) end
        S.SyncSpeedPanel()
    kết thúc
    apply.Activated:Connect(applySpeed)
    tốc độ.Mất tiêu điểm:Kết nối(hàm(enter) nếu enter thì applySpeed() kết thúc)
    dừng.Đã kích hoạt:Kết nối(function())
        ReleaseHubFocus(); MV.SetSprint(false); S.Rebuild()
        D.Say("💨 Tốc độ theo camera: TẮT", C.YELLOW)
    kết thúc)
    S.speedBtns = {on = onBtn, speed = speed, apply = apply, stop = stop, panel = P}
    S.SyncSpeedPanel()
kết thúc
--------- HẾT KHUNG 💨 TỐC ĐỘ THEO CAMERA ----------

--------- v4.38: KHUNG 🦘 NHẢY CAO (công quy độc lập kiểu 👤 Né người) ----------
LÀM
    cục bộ P = New("Khung", {
        Tên = "HubHighJump_Panel", Kích thước = UDim2.new(1, 0, 0, 118), Thứ tự bố cục = -3,
        BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.12, BorderSizePixel = 0, ZIndex = 6,
    }, D.hubList)
    Corner(P, UDim.new(0, 10)); Stroke(P, C.HAIRLINE, 1)
    D.Shade(P, Color3.fromRGB(255,255,255), Color3.fromRGB(188,192,205), 90)
    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 16), Vị trí = UDim2.new(0, 8, 0, 4),
        Text = "🦘 NHẢY CAO — BẬT/TẮT độc lập (kiểu 👤 Né người)", BackgroundTransparency = 1,
        TextColor3 = C.ACCENT, Phông chữ = Enum.Font.GothamBold, TextSize = 10,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)
    nút chức năng cục bộ (tên, văn bản, x, y, w, màu sắc)
        cục bộ b = New("TextButton", {
            Tên = tên, Văn bản = văn bản, Kích thước = UDim2.new(0, w, 0, 24), Vị trí = UDim2.new(0, x, 0, y),
            BackgroundColor3 = color, TextColor3 = D.BestText(color), BorderSizePixel = 0,
            Font = Enum.Font.GothamBold, TextSize = 10, ZIndex = 8,
        }, P)
        Góc(b, UDim.new(0, 6)); D.Tactile(b, 0.08)
        trả lại b
    kết thúc
    local onBtn = nút("HighJumpToggle", "🦘 Skip cao: TẮT", 8, 24, 148, C.GRAY)
    local stop = button("HighJumpStop", "⏹ cột", 162, 24, 80, C.RED)
    Mới("TextLabel", {
        Kích thước = UDim2.new(0, 148, 0, 24), Vị trí = UDim2.new(0, 8, 0, 54),
        Text = "💨 Tốc độ nhảy (1–500)", BackgroundTransparency = 1, TextColor3 = C.MUTED,
        Font = Enum.Font.GothamMedium, TextSize = 10, TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)
    tốc độ cục bộ = New("TextBox", {
        Tên = "HighJumpSpeed", Kích thước = UDim2.new(0, 56, 0, 24), Vị trí = UDim2.new(0, 160, 0, 54),
        Text = tostring(MV.highJumpSpeed), ClearTextOnFocus = false, BackgroundColor3 = C.SURFACE2,
        TextColor3 = C.DARK, Font = Enum.Font.GothamMedium, TextSize = 10, BorderSizePixel = 0, ZIndex = 8,
    }, P)
    Góc(tốc độ, UDim.new(0, 6))
    local apply = nút("HighJumpApply", " ✔ Áp dụng", 222, 54, 92, C.GREEN)
    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 16), Vị trí = UDim2.new(0, 8, 0, 82),
        Text = "BẬT rồi nhấn Space: nhảy cao theo số trên. Rơi theo game. Không xuyên tường, không nút ảo.",
        BackgroundTransparency = 1, TextColor3 = C.MUTED, Font = Enum.Font.GothamMedium, TextSize = 9,
        TextWrapped = true, TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)
    trạng thái cục bộ = Mới("Nhãn văn bản", {
        Tên = "HighJumpStatus", Kích thước = UDim2.new(1, -16, 0, 14), Vị trí = UDim2.new(0, 8, 0, 100),
        Văn bản = "", Độ trong suốt nền = 1, Màu văn bản 3 = C.MUTED, Phông chữ = Enum.Font.GothamMedium,
        Kích thước văn bản = 9, Căn chỉnh văn bản theo trục X = Enum.TextXAlignment.Left, Chỉ số Z = 7,
    }, P)
    hàm S.SyncHighJumpPanel()
        onBtn.Text = "🦘 Bỏ qua cao: " .. (MV.highJump và "BẬT" hoặc "TẮT")
        D.SetBg(onBtn, MV.highJump and C.GREEN or C.GRAY)
        if UserInputService:GetFocusedTextBox() ~= speed then speed.Text = tostring(MV.highJumpSpeed) end
        status.Text = MV.highJump
            và ("🦘 Đang nhảy cao · tốc độ " .. tostring(MV.highJumpSpeed) .. " · rơi theo trọng lực game")
            hoặc "🦘 Đã tắt · nhảy = của game (🦘 vô hạn vẫn độc lập)"
    kết thúc
    onBtn.Activated:Connect(function() ReleaseHubFocus(); D.Say(S.RunHubAction("highjump"), C.YELLOW) end)
    hàm cục bộ applySpeed()
        giá trị cục bộ = tốc độ.Text
        ReleaseHubFocus()
        cục bộ ok, kết quả = MV.SetHighJumpSpeed(value)
        nếu được thì D.Say("💨 Tốc độ nhảy cao: " .. tostring(result), C.GREEN)
        nếu không thì D.Say("⚠️ " .. tostring(result), C.YELLOW) end
        S.SyncHighJumpPanel()
    kết thúc
    apply.Activated:Connect(applySpeed)
    tốc độ.Mất tiêu điểm:Kết nối(hàm(enter) nếu enter thì applySpeed() kết thúc)
    dừng.Đã kích hoạt:Kết nối(function())
        ReleaseHubFocus(); MV.SetHighJump(false); S.Rebuild()
        D.Say("🦘 Bỏ cao: TẮT", C.YELLOW)
    kết thúc)
    S.highJumpBtns = {on = onBtn, speed = speed, apply = apply, stop = stop, panel = P}
    S.SyncHighJumpPanel()
kết thúc
--------- HẾT KHUNG 🦘 NHẢY CAO ----------

--------- v4.12: KHUNG ⚙ TUỲ CHỈNH DI CHUYỂN ----------
--------- v4.12: KHUNG ⚙ TUỲ CHỈNH DI CHUYỂN ----------
LÀM
    Độ pH cục bộ = 300
    cục bộ P = New("Khung", {
        Tên = "HubMove_Panel",
        Kích thước = UDim2.new(1, 0, 0, PH),
        LayoutOrder = 0,
        BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.12, BorderSizePixel = 0, ZIndex = 6,
    }, D.hubList)
    Góc(P, UDim.new(0, 10))
    Stroke(P, C.HAIRLINE, 1)
    D.Shade(P, Color3.fromRGB(255, 255, 255), Color3.fromRGB(188, 192, 205), 90)

    tiêu đề hàm cục bộ(txt)
        Mới("TextLabel", {
            Kích thước = UDim2.new(1, -16, 0, 14), Vị trí = UDim2.new(0, 8, 0, 4),
            Văn bản = txt, Độ trong suốt nền = 1, Màu chữ 3 = C.ACCENT,
            Phông chữ = Enum.Font.GothamBold, Kích thước chữ = 10,
            TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
        }, P)
    kết thúc
    hàm cục bộ lab(txt, x, y, w)
        Mới("TextLabel", {
            Kích thước = UDim2.new(0, w, 0, 20), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = txt, Độ trong suốt nền = 1, Màu chữ 3 = C.MUTED,
            Phông chữ = Enum.Font.GothamMedium, Kích thước chữ = 9,
            TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
        }, P)
    kết thúc
    hàm cục bộ box(x, y, w, val)
        local b = New("TextBox", {
            Kích thước = UDim2.new(0, w, 0, 20), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = tostring(val), Xóa văn bản khi tập trung = false,
            BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.1, TextColor3 = C.DARK,
            PlaceholderColor3 = C.GRAY, Font = Enum.Font.GothamMedium, TextSize = 9,
            TextXAlignment = Enum.TextXAlignment.Center, BorderSizePixel = 0, ZIndex = 7,
        }, P)
        Góc(b, UDim.new(0, 6))
        Stroke(b, C.BORDER, 1)
        trả lại b
    kết thúc
    hàm cục bộ act(txt, x, y, w, color)
        cục bộ b = New("TextButton", {
            Kích thước = UDim2.new(0, w, 0, 20), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = txt, Màu nền 3 = màu hoặc C.SURFACE3, Độ trong suốt nền = 0.08,
            TextColor3 = D.BestText(color or C.SURFACE3), Font = Enum.Font.GothamBold,
            Kích thước chữ = 9, Kích thước viền pixel = 0, Chỉ số Z = 8,
        }, P)
        Góc(b, UDim.new(0, 6))
        D.Cảm giác xúc giác (b, 0,08)
        trả lại b
    kết thúc
    local function say(msg, good) D.Say(msg, good and C.GREEN or C.RED) end

    title("⚙Ưu chỉnh di chuyển (áp dụng ngay, không cần bật lại)")

    phòng thí nghiệm ("🚀 Vịnh", 8, 22, 52)
    local flyIn = box(62, 22, 44, S.Move.flySpeed)
    lab("👟Chạy", 114, 22, 50)
    local wsIn = box(166, 22, 40, (S.Move.speedMode == "x") and ("x" .. tostring(S.Move.speedMul))
                                                             hoặc tostring(S.Move.walkSpeed))
    lab("🦘Bỏ qua", 214, 22, 46)
    jpIn cục bộ = box(262, 22, 40, S.Move.jumpPower)
    local ap1 = act("✔", 308, 22, 28, C.GREEN)

    lab("🪩gâng×Cao×Dài", 8, 48, 116)
    local cwIn = box(128, 48, 40, S.Move.carpetW)
    local chIn = box(176, 48, 40, S.Move.carpetH)
    local clIn = box(224, 48, 40, S.Move.carpetL)
    local gapIn = New("TextBox", {
        Kích thước = UDim2.new(0, 40, 0, 20), Vị trí = UDim2.new(0, 272, 0, 48),
        Văn bản = tostring(S.Move.carpetGap), Văn bản giữ chỗ = "khoảng trống", Xóa văn bản khi tập trung = false,
        BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.1, TextColor3 = C.DARK,
        PlaceholderColor3 = C.GRAY, Font = Enum.Font.GothamMedium, TextSize = 9,
        TextXAlignment = Enum.TextXAlignment.Center, BorderSizePixel = 0, ZIndex = 7,
    }, P)
    Corner(gapIn, UDim.new(0, 6)); Stroke(gapIn, C.BORDER, 1)
    lab("↕ cách chân", 314, 48, 60)
    local ap2 = act("✔", 374, 48, 28, C.GREEN)

    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 84), Vị trí = UDim2.new(0, 8, 0, 208),
        Text = "💡 👟 Chạy: gõ x3 = TỐC ĐỘ GAME ×3 (mặc định); gõ 50 = cố định 50; gõ x1 = GIỮ NGUYÊN tốc độ game. "
             .. "🦘 Skip auto 3 cách. game Illegal nhảy/ăn phím Space vẫn được nhảy."
             .. "🪩 Thân cây nằm ngay dưới chân, bị xóa sẽ tự trải nghiệm lại. 🧱 Đặt Kính: đặt nhiều tấm kính CỐ ĐỊNH dưới chân để làm cầu/thang, 🔄 Tự Đặt thì đi tới đâu đặt tới đó."
             .. "🚀 Bay tới kính/người: bay mượt Thường Tường, chỉnh tốc độ ở ô 🚀, danh sách chi tiết ở tab 👥 Chơi Người. Game nặng bị GIẬT thì TẮT 🛟 Chống rơi.",
        TextWrapped = true, BackgroundTransparency = 1, TextColor3 = C.MUTED,
        Phông chữ = Enum.Font.GothamMedium, Kích thước chữ = 8,
        TextXAlignment = Enum.TextXAlignment.Left, TextYAlignment = Enum.TextYAlignment.Top,
        Chỉ số Z = 7,
    }, P)

    local upBtn = act("⬆ Nâng cấp", 8, 74, 62, C.BLUE)
    local dnBtn = act("⬇ Hạ", 76, 74, 56, C.BLUE)
    local stopBtn = act("🛑 Tắt hết", 138, 74, 76, C.RED)
    local st = New("TextLabel", {
        Kích thước = UDim2.new(1, -230, 0, 20), Vị trí = UDim2.new(0, 222, 0, 74),
        Văn bản = S.Move.Status(), Độ trong suốt nền = 1, Màu văn bản 3 = C.MUTED,
        Phông chữ = Enum.Font.GothamMedium, Kích thước chữ = 9,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)

    ap1.Activated:Connect(function()
        ReleaseHubFocus()
        địa phương f = tonumber(flyIn.Text); cục bộ w = tonumber(wsIn.Text); địa phương j = tonumber(jpIn.Text)
        nếu f thì
            S.Move.flySpeed ​​= (f >= 1 và f <= 2000) và f hoặc S.Move.flySpeed
            S.Move.SyncFlyHud()
        kết thúc
        local wmul = tostring(wsIn.Text or ""):match("^[xX×]%s*([%d%.]+)")
        nếu wmul thì
            S.Move.speedMode = "x"
            S.Move.speedMul = mvClamp(tonumber(wmul), 1, 20)
        nếu w thì
            S.Move.speedMode = "num"
            S.Move.walkSpeed ​​= (w >= 1 và w <= 500) và w hoặc S.Move.walkSpeed
        kết thúc
        nếu j thì S.Move.jumpPower = (j >= 0 và j <= 500) và j hoặc S.Move.jumpPower kết thúc
        flyIn.Text = tostring(S.Move.flySpeed)
        wsIn.Text = (S.Move.speedMode == "x") and ("x" .. tostring(S.Move.speedMul)) or tostring(S.Move.walkSpeed)
        jpIn.Text = tostring(S.Move.jumpPower)
        pcall(function() if S.Move.speed then S.Move.ApplyChar() end end)
        say(string.format("⚙ đã áp dụng: bay %d · chạy %s · nhảy %d%s",
            S.Move.flySpeed,
            (S.Move.speedMode == "x") và ("×" .. tostring(S.Move.speedMul) .. " (theo game)")
                                       hoặc tostring(S.Move.walkSpeed),
            S.Move.jumpPower,
            (S.Move.speedMode == "x" và S.Move.speed) và (" = " .. tostring(S.Move.WantSpeed())) hoặc ""), true)
    kết thúc)

    ap2.Activated:Connect(function()
        ReleaseHubFocus()
        S.Move.SetCarpetSize(tonumber(cwIn.Text), tonumber(chIn.Text), tonumber(clIn.Text))
        S.Move.SetCarpetGap(tonumber(gapIn.Text))
        cwIn.Text, chIn.Text, clIn.Text = tostring(S.Move.carpetW), tostring(S.Move.carpetH), tostring(S.Move.carpetL)
        gapIn.Text = tostring(S.Move.carpetGap)
        say(string.format("🪩 thảm: Đầm %g × Cao %g × Dài %g · cách chân %g%s",
            S.Move.carpetW, S.Move.carpetH, S.Move.carpetL, S.Move.carpetGap,
            (S.Move.carpet và " (đang bật, đổi ngay)") hoặc " (bật thảm để thấy)"), đúng)
    kết thúc)

    upBtn.Activated:Connect(function()
        ReleaseHubFocus()
        cục bộ ok, cái gì = S.Move.Nudge(2.5)
        say(ok and ("⬆ đã nâng cấp " .. tostring(what) .. " lên 2.5") hoặc "⬆ bật Bay hoặc thảm Kính trước đó",
            ok == true)
        st.Text = S.Move.Status()
    kết thúc)
    dnBtn.Activated:Connect(function()
        ReleaseHubFocus()
        cục bộ ok, cái gì = S.Move.Nudge(-2.5)
        say(ok and ("⬇ đã hạ " .. tostring(what) .. " xuống 2.5") hoặc "⬇ bật Bay hoặc thảm Kính trước đó",
            ok == true)
        st.Text = S.Move.Status()
    kết thúc)
    stopBtn.Activated:Connect(function()
        ReleaseHubFocus()
        D.Say(S.RunHubAction("movestop"), C.YELLOW)
        st.Text = S.Move.Status()
    kết thúc)

    nút pcBtn cục bộ
    local TXT_PASS_ON = "🧲 đẩy khi kẹt: BẬT"
    local TXT_PASS_OFF = "🧲 đẩy khi khóa: TẮT"
    hàm cục bộ paintPass()
        local on = (S.Move.ncPass ~= false)
        pcBtn.Text = bật và TXT_PASS_ON hoặc TXT_PASS_OFF
        pcBtn.BackgroundColor3 = on và C.GREEN hoặc C.GRAY
        pcBtn.TextColor3 = D.BestText(pcBtn.BackgroundColor3)
    kết thúc
    local holdBtn = Act("🛟 Chống rơi: BẬT", 8, 100, 108, C.GREEN)
    local edgeBtn = act("🔲 Viền thảm: BẬT", 122, 100, 108, C.GREEN)
    hàm cục bộ paintHold()
        local on = (S.Move.carpetHold ~= false)
        holdBtn.Text = bật và "🛟 Chống rơi: BẬT" hoặc "🛟 Chống rơi: TẮT"
        holdBtn.BackgroundColor3 = on and C.GREEN or C.SURFACE3
        holdBtn.TextColor3 = D.BestText(holdBtn.BackgroundColor3)
    kết thúc
    hàm cục bộ paintEdge()
        cục bộ trên = (S.Move.carpetEdge ~= false)
        edgeBtn.Text = on và "🔲 Viền thảm: BẬT" hoặc "🔲 Viền thảm: TẮT"
        edgeBtn.BackgroundColor3 = on và C.GREEN hoặc C.SURFACE3
        edgeBtn.TextColor3 = D.BestText(edgeBtn.BackgroundColor3)
    kết thúc
    holdBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.Move.SetCarpetHold(S.Move.carpetHold == false)
        paintHold()
        say("🛟 hỗ trợ tránh rơi xuyên thảm: " .. ((S.Move.carpetHold ~= false) và "BẬT"
            hoặc “TẮT (y gốc bản gốc — hub không đụng vào nhân vật nữa, hết giật)”), true)
    kết thúc)
    edgeBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.Move.SetCarpetEdge(S.Move.carpetEdge == false)
        paintEdge()
        say("🔲 viền sáng xung quanh thảm: " .. ((S.Move.carpetEdge ~= false) và "BẬT" hoặc "TẮT"), true)
    kết thúc)
    paintHold(); paintEdge()
    pcBtn = act(TXT_PASS_ON, 234, 100, 168, C.GREEN)
    S.Move._passBtn = pcBtn
    pcBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.Move.ncPass = (S.Move.ncPass == false)
        paintPass()
        say(S.Move.ncPass và "🧲 tự diễn xuyên: BẬT (kẹt là tự động xuyên qua)"
                           hoặc “🧲 tự nói xuyên: TẮT (chỉ tắt và chốt như cũ), true)
    kết thúc)

    local placeBtn = act("🧱 Đặt Kính Dưới Chân", 8, 124, 132, C.BLUE)
    local clearBtn = act("🧹 Xóa Kính Đã Đặt", 146, 124, 118, C.RED)
    local autoGlassBtn = act("🔄Tự Đặt Kính: TẮT", 270, 124, 132, C.GRAY)
    local flyGlassBtn = act("🚀 Bay tới kính", 8, 148, 110, C.PURPLE)
    local stopFlyBtn = act("⏹ Dừng bay kính", 124, 148, 76, C.RED)
    local speedGlassBox = box(206, 148, 44, S.Move.glassFlySpeed ​​or 60)
    local applyGlassSpeedBtn = act(" ✔ Tốc độ bay kính kính", 256, 148, 110, C.GREEN)
    local flyPlayerBtn = act("🚀 Bay tới người gần nhất", 8, 172, 150, C.ACCENT)
    local stopPlayerFlyBtn = act("⏹ Dừng bay người", 164, 172, 110, C.RED)
    local speedPlayerBox = box(280, 172, 44, S.Move.playerFlySpeed ​​or 0)
    local applyPlayerSpeedBtn = act(" ✔ Tốc độ bay người", 330, 172, 110, C.GREEN)
    lab("0=auto", 380, 172, 40)
    hàm cục bộ paintGlass()
        local cnt = S.Move._placedGlasses and #S.Move._placedGlasses or 0
        placeBtn.Text = cnt > 0 và ("🧱 Đặt Kính (" .. cnt .. ")") hoặc "🧱 Đặt Kính Dưới Chân"
        clearBtn.Text = cnt > 0 và ("🧹 ​​Xóa (" .. cnt .. ")") hoặc "🧹 Xóa Kính Đã Đặt"
        local on = S.Move.autoGlass == true
        autoGlassBtn.Text = on và "🔄 Tự Đặt Kính: BẬT" hoặc "🔄 Tự Đặt Kính: TẮT"
        autoGlassBtn.BackgroundColor3 = on and C.GREEN or C.GRAY
        autoGlassBtn.TextColor3 = D.BestText(autoGlassBtn.BackgroundColor3)
        local flying = S.Move._glassFlyActive == true
        flyGlassBtn.Text = bay và ("🚀 Đang bay tới " .. tostring(S.Move._glassFlyIdx hoặc "?")) hoặc "🚀 Bay tới kính gần nhất"
        flyGlassBtn.BackgroundColor3 = flying and C.GREEN or C.PURPLE
        flyGlassBtn.TextColor3 = D.BestText(flyGlassBtn.BackgroundColor3)
        if speedGlassBox then speedGlassBox.Text = tostring(S.Move.glassFlySpeed ​​or 60) end
        local pFlying = S.Move._playerFlyActive == true
        flyPlayerBtn.Text = pFlying and ("🚀 Đang bay " .. tostring(S.Move._playerFlyTarget và S.Move._playerFlyTarget.Name hoặc "?")) hoặc "🚀 Bay tới người gần nhất"
        flyPlayerBtn.BackgroundColor3 = pFlying và C.GREEN hoặc C.ACCENT
        flyPlayerBtn.TextColor3 = D.BestText(flyPlayerBtn.BackgroundColor3)
        if speedPlayerBox then speedPlayerBox.Text = tostring(S.Move.playerFlySpeed ​​or 0) end
    kết thúc
    placeBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local ok, res = S.Move.PlaceGlass()
        nếu được thì
            say("🧱 đã đặt kính dưới chân tại " .. string.format("%.1f, %.1f", S.Move.Root() and S.Move.Root().Position.X or 0, S.Move.Root() and S.Move.Root().Position.Z or 0) .. " · tổng " .. tostring(#(S.Move._placedGlasses or {})) .. " tấm", true)
        khác
            say("⚠️ " .. tostring(res hoặc "không thể đặt kính"), false)
        kết thúc
        st.Text = S.Move.Status()
        sơn kính()
        nếu S.GlassRefreshList thì pcall(S.GlassRefreshList) kết thúc
    kết thúc)
    clearBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local n = S.Move.ClearPlacedGlasses()
        pcall(function() S.Move.StopGlassFly() end)
        say("🧹 đã xóa " .. tostring(n) .. " tấm kính đã đặt", true)
        st.Text = S.Move.Status()
        sơn kính()
        nếu S.GlassRefreshList thì pcall(S.GlassRefreshList) kết thúc
    kết thúc)
    autoGlassBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.Move.SetAutoGlass(not S.Move.autoGlass)
        sơn kính()
        st.Text = S.Move.Status()
        nếu S.GlassRefreshList thì pcall(S.GlassRefreshList) kết thúc
        say(S.Move.autoGlass và "🔄 tự đặt kính: BẬT — di chuyển là tự động đặt kính dưới chân theo cách thảm"
                               hoặc "🔄tự động đặt kính: TẮT", true)
    kết thúc)
    flyGlassBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local glasses = S.Move.GetPlacedGlasses and S.Move.GetPlacedGlasses() or {}
        nếu #glasses == 0 thì
            say("⚠️ chưa có ống kính nào để bay tới — ấn 🧱 Đặt Kính trước", false)
            trở lại
        kết thúc
        local myRoot = S.Move.Root and S.Move.Root()
        local myPos = myRoot and myRoot.Position or nil
        tốt nhất tại địa phương = kính[1]
        cục bộ tốt nhấtD = 1e9
        nếu myPos thì
            for _, g in ipairs(glasses) do
                local dx = gx - myPos.X
                local dz = gz - myPos.Z
                cục bộ d = dx*dx + dz*dz
                nếu d < bestD thì bestD = d; best = g
            kết thúc
        kết thúc
        địa phương được, res = S.Move.FlyToGlass(best.idx)
        st.Text = S.Move.Status()
        sơn kính()
        nếu S.GlassRefreshList thì pcall(S.GlassRefreshList) kết thúc
        say(ok và ("🚀 đang bay tới kính " .. tostring(best.idx) .. " tốc độ " .. tostring(S.Move.glassFlySpeed ​​hoặc 60)) hoặc ("⚠️ " .. tostring(res)), ok==true)
    kết thúc)
    stopFlyBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.Move.StopGlassFly()
        st.Text = S.Move.Status()
        sơn kính()
        nếu S.GlassRefreshList thì pcall(S.GlassRefreshList) kết thúc
        say("⏹ đã dừng bay tới kính", true)
    kết thúc)
    applyGlassSpeedBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local v = tonumber(tostring(speedGlassBox.Text or ""):match("%d+%.?%d*")) or S.Move.glassFlySpeed ​​or 60
        S.Move.SetGlassFlySpeed(v)
        speedGlassBox.Text = tostring(S.Move.glassFlySpeed)
        st.Text = S.Move.Status()
        sơn kính()
        say("🚀 tốc độ bay tới kính: " .. tostring(S.Move.glassFlySpeed), true)
    kết thúc)
    flyPlayerBtn.Activated:Connect(function()
        ReleaseHubFocus()
        mục tiêu cục bộ = nil
        if S.Loc and S.Loc.Nearest then target = S.Loc.Nearest() end
        nếu không phải là mục tiêu thì
            say("⚠️ không có người chơi nào để bay tới", false)
            trở lại
        kết thúc
        local ok, res = S.Move.FlyToPlayer(target)
        st.Text = S.Move.Status()
        sơn kính()
        if S.Loc and S.Loc.RefreshList then pcall(S.Loc.RefreshList) end
        say(ok and ("🚀 đang bay tới " .. tostring(target.Name) .. " tốc độ " .. tostring(S.Move.GetPlayerFlySpeed ​​and S.Move.GetPlayerFlySpeed() or S.Move.playerFlySpeed ​​or 0)) or ("⚠️ " .. tostring(res)), ok==true)
    kết thúc)
    stopPlayerFlyBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.Move.StopPlayerFly()
        st.Text = S.Move.Status()
        sơn kính()
        if S.Loc and S.Loc.RefreshList then pcall(S.Loc.RefreshList) end
        say("⏹ đã dừng bay tới người", true)
    kết thúc)
    applyPlayerSpeedBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local v = tonumber(tostring(speedPlayerBox.Text or ""):match("%-?%d+%.?%d*"))
        if v == nil then v = S.Move.playerFlySpeed ​​or 0 end
        S.Move.SetPlayerFlySpeed(v)
        speedPlayerBox.Text = tostring(S.Move.playerFlySpeed ​​or 0)
        st.Text = S.Move.Status()
        sơn kính()
        local sp = S.Move.GetPlayerFlySpeed ​​and S.Move.GetPlayerFlySpeed() or S.Move.playerFlySpeed ​​or 0
        nếu (tonumber(S.Move.playerFlySpeed) hoặc 0) == 0 thì
            say(string.format("🚀 tốc độ bay tới người: auto (%g = tốc độ game)", sp), true)
        khác
            say("🚀 tốc độ bay tới người: " .. tostring(sp), true)
        kết thúc
        if S.Loc and S.Loc.RefreshList then pcall(S.Loc.RefreshList) end
        if S.SyncLocPanel then pcall(S.SyncLocPanel) end
    kết thúc)
    sơn kính()
    S.Move._glassBtns = { place = placeBtn, clear = clearBtn, auto = autoGlassBtn, fly = flyGlassBtn, stop = stopFlyBtn, speedBox = speedGlassBox, paint = paintGlass,
        flyPlayer = flyPlayerBtn, stopPlayer = stopPlayerFlyBtn, speedPlayerBox = speedPlayerBox }

    hàm S.RefreshMovePanel()
        pcall(function()
            st.Text = S.Move.Status()
            cwIn.Text, chIn.Text, clIn.Text = tostring(S.Move.carpetW), tostring(S.Move.carpetH), tostring(S.Move.carpetL)
            gapIn.Text = tostring(S.Move.carpetGap)
            flyIn.Text = tostring(S.Move.flySpeed)
            wsIn.Text = (S.Move.speedMode == "x") and ("x" .. tostring(S.Move.speedMul)) or tostring(S.Move.walkSpeed)
            jpIn.Text = tostring(S.Move.jumpPower)
            paintPass()
            if paintHold then pcall(paintHold) end
            if paintEdge then pcall(paintEdge) end
            if S.Move._glassBtns and S.Move._glassBtns.paint then pcall(S.Move._glassBtns.paint) end
        kết thúc)
    kết thúc
kết thúc

Vị trí S = {
    on = false, -- 👁️ định vị TẤT CẢ người chơi
    solo = false, -- 🎯 định vị chỉ ĐÚNG 1 người (S.Loc.target)
    mục tiêu = nil,
    maxDist = 0, -- 0 = không giới hạn; >0 = người được chỉ định trong bán kính này (stud)
    _gui = nil, _items = {}, _friend = {}, _downAt = {},
    _acc = 0, _listAcc = 0, _bound = false,
}
LOC cục bộ = S.Loc
LOCC cục bộ = {
    normal = { fill = Color3.fromRGB(0, 255, 100), out = Color3.fromRGB(255, 255, 255), txt = Color3.fromRGB(0, 255, 100) },
    bạn = { fill = Color3.fromRGB(255, 105, 180), out = Color3.fromRGB(255, 182, 193), txt = Color3.fromRGB(255, 182, 193) },
    down = { fill = Color3.fromRGB(200, 0, 0), out = Color3.fromRGB(255, 100, 100), txt = Color3.fromRGB(255, 100, 100) },
    fdown = { fill = Color3.fromRGB(138, 43, 226), out = Color3.fromRGB(200, 150, 255), txt = Color3.fromRGB(200, 150, 255) },
}
hàm cục bộ locRound(n) trả về math.floor((tonumber(n) hoặc 0) + 0.5) kết thúc
hàm cục bộ locTime(sec) -- số giây -> "mm:ss"
    local v = math.max(0, math.floor(tonumber(sec) or 0))
    return string.format("%02d:%02d", math.floor(v / 60), v % 60)
kết thúc
hàm S.Loc.Root()
    local c = player.Character
    trả về (c và c:FindFirstChild("HumanoidRootPart")) hoặc nil
kết thúc
hàm S.Loc.CharOf(p)
    cục bộ c = p và p.Character
    nếu không phải c thì trả về nil
    local r = c:FindFirstChild("HumanoidRootPart")
    local h = c:FindFirstChildOfClass("Humanoid")
    nếu r và h thì trả về c, r, h kết thúc
    trả về nil
kết thúc
hàm S.Loc.IsFriend(p)
    uid cục bộ = p và p.UserId
    nếu uid == nil thì trả về false.
    nếu LOC._friend[uid] == nil thì
        local ok, res = pcall(function() return player:IsFriendsWith(uid) end)
        LOC._friend[uid] = (ok and res == true) or false
    kết thúc
    trả về LOC._friend[uid] == true
kết thúc
hàm S.Loc.IsDown(h)
    nếu không phải h thì trả về false kết thúc
    if h.PlatformStand == true then return true end
    if (tonumber(h.Health) or 1) <= 0 then return true end
    trả về false
kết thúc
hàm S.Loc.NoteDown(p, down)
    nếu p == nil thì trả về end
    nếu xuống thì
        nếu không phải LOC._downAt[p] thì LOC._downAt[p] = tick() kết thúc
    khác
        LOC._downAt[p] = nil
    kết thúc
kết thúc
hàm S.Loc.DownSecs(p)
    cục bộ st = LOC._downAt[p]
    nếu không phải st thì trả về 0 kết thúc
    trả về tick() - st
kết thúc
hàm S.Loc.Dist(p)
    cục bộ r = LOC.Root()
    cục bộ _, pr = LOC.CharOf(p)
    nếu không phải r hoặc không phải pr thì trả về nil.
    trả về (r.Vị trí - pr.Vị trí).Độ lớn
kết thúc
hàm S.Loc.Nearest()
    tốt nhất địa phương, bd = nil, nil
    for _, p in ipairs(Players:GetPlayers()) do
        nếu p ~= người chơi thì
            local d = LOC.Dist(p)
            nếu d và (bd == nil hoặc d < bd) thì tốt nhất, bd = p, d kết thúc
            nếu không phải là tốt nhất thì tốt nhất = p kết thúc
        kết thúc
    kết thúc
    trả lại tốt nhất
kết thúc
hàm S.Loc.Wanted(p)
    nếu p == nil hoặc p == player thì trả về false.
    if LOC.solo then return LOC.target == p end
    trả về LOC.on == true
kết thúc
hàm S.Loc.Gui()
    if LOC._gui and LOC._gui.Parent then return LOC._gui end
    LOC._gui = New("ScreenGui", {
        Tên = "BC_LocEsp", ResetOnSpawn = false,
        ZIndexBehavior = Enum.ZIndexBehavior.Sibling,
    }, gui)
    trả về LOC._gui
kết thúc
hàm S.Loc.Kill(p)
    local it = LOC._items[p]
    nếu không thì trả về kết thúc
    pcall(function() if it.hl then it.hl:Destroy() end end)
    pcall(function() if it.bb then it.bb:Destroy() end end)
    LOC._items[p] = nil
kết thúc
hàm S.Loc.Clear()
    for p, _ in pairs(LOC._items) do LOC.Kill(p) end
    pcall(function() if LOC._gui then LOC._gui:ClearAllChildren() end end)
kết thúc
hàm S.Loc.Make(p)
    cục bộ c, r = LOC.CharOf(p)
    nếu không phải c thì trả về end
    LOC.Kill(p)
    local g = LOC.Gui()
    local hl = New("Highlight", {
        Tên = tostring(p.Name) .. "_HL", Adornee = c,
        FillColor = LOCC.normal.fill, FillTransparency = 0.55,
        OutlineColor = LOCC.normal.out, OutlineTransparency = 0,
    }, g)
    local bb = New("BillboardGui", {
        Tên = tostring(p.Name) .. "_BB", Adornee = r,
        Kích thước = UDim2.new(0, 170, 0, 46), Độ lệch đinh tán = Vector3.new(0, 3.6, 0),
        AlwaysOnTop = true,
    }, g)
    local lbl = New("TextLabel", {
        Kích thước = UDim2.new(1, 0, 1, 0), Độ trong suốt nền = 1,
        TextColor3 = LOCC.normal.txt, Font = Enum.Font.GothamBold, TextSize = 11,
        TextStrokeColor3 = Color3.fromRGB(0, 0, 0), TextStrokeTransparency = 0,35,
    }, bb)
    LOC._items[p] = { hl = hl, bb = bb, lbl = lbl }
    LOC.TickOne(p)
kết thúc
hàm S.Loc.TickOne(p)
    local it = LOC._items[p]
    nếu không thì trả về kết thúc
    cục bộ c, r, h = LOC.CharOf(p)
    if not c then LOC.Kill(p); return end
    local down, fr = LOC.IsDown(h), LOC.IsFriend(p)
    S.Loc.NoteDown(p, down)
    local col = down and (fr and LOCC.fdown or LOCC.down) or (fr and LOCC.friend or LOCC.normal)
    cục bộ r0 = LOC.Root()
    khoảng cách cục bộ = (r0 và r) và (r0.Vị trí - r.Vị trí).Độ lớn hoặc nil
    local far = (LOC.maxDist > 0 and dist ~= nil and dist > LOC.maxDist)
    it.hl.FillColor = col.fill
    it.hl.OutlineColor = col.out
    it.lbl.TextColor3 = col.txt
    it.hl.Enabled = không xa
    it.bb.Enabled = không xa
    cục bộ giữa = {}
    if down then mid[#mid + 1] = "☠️ Hạ ⏱ " .. locTime(LOC.DownSecs(p)) end
    if h then mid[#mid + 1] = string.format("❤️ %d/%d", locRound(h.Health or 0), locRound(h.MaxHealth or 100)) end
    mid[#mid + 1] = dist and string.format("📏 %dm", locRound(dist)) or "📏 --m"
    it.lbl.Text = p.Name .. (fr và " 💗 Bạn Bé" hoặc "") .. "\n" .. table.concat(mid, " · ") -- v4.34: Tên vốn là chuỗi, từ tostring
kết thúc
hàm S.Loc.Tick()
    for p, _ in pairs(LOC._items) do
        nếu không phải LOC.Wanted(p) thì
            LOC.Kill(p)
        khác
            pcall(LOC.TickOne, p)
        kết thúc
    kết thúc
    nếu không phải (LOC.on hoặc LOC.solo) thì trả về end
    cục bộ ok, danh sách = pcall(function() return Players:GetPlayers() end)
    Nếu không ổn hoặc không nằm trong danh sách thì trả về end.
    for _, p in ipairs(list) do
        nếu LOC.Wanted(p) và không có LOC._items[p] và LOC.CharOf(p) thì
            pcall(function() LOC.Make(p) end)
        kết thúc
    kết thúc
kết thúc
hàm S.Loc.Bind(on)
    nếu đang bật và không phải là LOC._bound thì
        LOC._bound = true
        pcall(function()
            RunService:BindToRenderStep("BC_Loc", Enum.RenderPriority.Camera.Value - 2, hàm(dt)
                LOC._acc = (LOC._acc hoặc 0) + (tonumber(dt) hoặc 0.016)
                nếu LOC._acc < 0.2 thì trả về end
                LOC._acc = 0
                pcall(function() LOC.Tick() end)
                LOC._listAcc = (LOC._listAcc hoặc 0) + 0,2
                nếu LOC._listAcc >= 1 thì
                    LOC._listAcc = 0
                    if LOC.RefreshList then pcall(LOC.RefreshList) end
                kết thúc
            kết thúc)
        kết thúc)
    nếu không bật và LOC._bound thì
        LOC._bound = false
        pcall(function() RunService:UnbindFromRenderStep("BC_Loc") end)
    kết thúc
kết thúc
hàm S.Loc.Refresh()
    nếu không phải (LOC.on hoặc LOC.solo) thì
        LOC.Clear()
        LOC.Bind(false)
        trở lại
    kết thúc
    for p, _ in pairs(LOC._items) do if not LOC.Wanted(p) then LOC.Kill(p) end end
    cục bộ ok, danh sách = pcall(function() return Players:GetPlayers() end)
    nếu ổn và liệt kê thì
        for _, p in ipairs(list) do
            nếu LOC.Wanted(p) và không có LOC._items[p] và LOC.CharOf(p) thì
                pcall(function() LOC.Make(p) end)
            kết thúc
        kết thúc
    kết thúc
    LOC.Bind(true)
kết thúc
hàm S.Loc.Set(on)
    LOC.on = (on == true)
    LOC.Refresh()
    trả lại LOC.on
kết thúc
hàm S.Loc.SetSolo(on)
    LOC.solo = (on == true)
    if not LOC.solo then LOC.target = nil end
    LOC.Refresh()
    trả về LOC.solo
kết thúc
hàm S.Loc.SetTarget(p)
    LOC.target = (p ~= nil và p ~= player) và p hoặc nil
    LOC.solo = (LOC.target ~= nil)
    LOC.Refresh()
    trả về LOC.target
kết thúc
hàm S.Loc.SetMaxDist(n)
    LOC.maxDist = math.max(0, tonumber(n) or 0)
    pcall(LOC.Tick)
    trả về LOC.maxDist
kết thúc
hàm S.Loc.StopAll()
    LỘC.on = sai; LỘC.solo = sai; LOC.target = không
    LOC._downAt = {}
    LOC.Clear()
    LOC.Bind(false)
    trả về giá trị đúng
kết thúc
hàm S.Loc.Status()
    nếu không (LOC.on hoặc LOC.solo) thì return "📍 định vị: đang TẮT (chưa hiện ai)" end
    cục bộ n = 0
    for _ in pairs(LOC._items) do n = n + 1 end
    cục bộ t = {}
    nếu LOC.on thì t[#t + 1] = "👁️ tất cả" end
    if LOC.solo thì t[#t + 1] = "🎯 lẻ: " .. tostring(LOC.target và LOC.target.Name hoặc "chưa chọn") end
    if LOC.maxDist > 0 then t[#t + 1] = string.format("📏 ≤ %dm", locRound(LOC.maxDist)) end
    return string.format("📍 đang định vị %d người (%s)", n, table.concat(t, " · "))
kết thúc
LÀM
    hàm cục bộ hookLoc(p)
        if p == player then return nil end
        trackConn(p.CharacterAdded:Connect(function()
            if LOC.Wanted(p) then pcall(function() LOC.Make(p) end) end
        kết thúc))
        trackConn(p.CharacterRemoving:Connect(function() LOC.Kill(p) end))
        if LOC.Wanted(p) then pcall(function() LOC.Make(p) end) end
    kết thúc
    for _, p in ipairs(Players:GetPlayers()) do if p ~= player then pcall(hookLoc, p) end end
    trackConn(Players.PlayerAdded:Connect(function(p) pcall(hookLoc, p) end))
    trackConn(Players.PlayerRemoving:Connect(function(p)
        LOC._friend[p.UserId] = nil
        LOC._downAt[p] = nil
        if LOC.target == p then LOC.target = nil end
        LOC.Kill(p)
    kết thúc))
kết thúc

LÀM
    local tab = AddTab("Người Chơi", "👥", 4) -- 4 = ngay sau 📚 Script Hub (3), trước ➕ (7)
    D.playerTab = tab
    hàm S.OpenPlayerTab()
        for i, tc in ipairs(tabContent) do
            nếu tc == D.playerTab thì
                SwitchTab(i)
                trả về giá trị đúng
            kết thúc
        kết thúc
        trả về false
    kết thúc
    Mới("TextLabel", {
        Tên = "PlayerTitle",
        Kích thước = UDim2.new(1, -16, 0, 18), Vị trí = UDim2.new(0, 8, 0, 8),
        Text = "👥 NGƯỜI CHƠI — Định VỊ & XEM NGƯỜI CHƠI & ĐẶT KÍNH",
        Độ trong suốt của nền = 1,
        TextColor3 = C.ACCENT, Phông chữ = Enum.Font.GothamBold, TextSize = 11,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, tab)
    Mới("TextLabel", {
        Tên = "PlayerNote",
        Kích thước = UDim2.new(1, -16, 0, 14), Vị trí = UDim2.new(0, 8, 0, 26),
        Text = "📍 = thấy người khác xuyên Tường · 👣 = bám camera theo 1 người để xem họ đang làm gì · 🧱 = đặt kính dưới chân, quản lý xóa lẻ trong menu này."
             .. " ( Các nút tắt/mở nhanh vẫn có thẻ trong 📚 Script Hub.)",
        BackgroundTransparency = 1, TextColor3 = C.MUTED, Font = Enum.Font.GothamMedium, TextSize = 8,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, tab)
    D.playerY = 46
kết thúc

--------- KHUNG 📍 Định VỊ (nằm trong trang 👥 NGƯỜI CHƠI) ----------
LÀM
    Độ pH cục bộ = 380
    cục bộ P = New("Khung", {
        Tên = "HubLoc_Panel",
        Kích thước = UDim2.new(1, -16, 0, PH),
        Vị trí = UDim2.new(0, 8, 0, D.playerY hoặc 46),
        LayoutOrder = 1,
        BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.12, BorderSizePixel = 0, ZIndex = 6,
    }, D.playerTab)
    D.playerY = (D.playerY hoặc 46) + PH + 8
    Góc(P, UDim.new(0, 10))
    Stroke(P, C.HAIRLINE, 1)
    D.Shade(P, Color3.fromRGB(255, 255, 255), Color3.fromRGB(188, 192, 205), 90)

    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 14), Vị trí = UDim2.new(0, 8, 0, 4),
        Text = "📍 ĐỊNH VỊ NGƯỜI CHƠI (xuyên Tường) + 🚀 BAY TỚI NGƯỜI",
        Độ trong suốt của nền = 1,
        TextColor3 = C.ACCENT, Phông chữ = Enum.Font.GothamBold, TextSize = 10,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)

    hàm cục bộ act(txt, x, y, w, color)
        cục bộ b = New("TextButton", {
            Kích thước = UDim2.new(0, w, 0, 20), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = txt, Màu nền 3 = màu, Màu văn bản 3 = D.BestText(màu),
            Font = Enum.Font.GothamBold, TextSize = 9, BorderSizePixel = 0, ZIndex = 8,
        }, P)
        Góc(b, UDim.new(0, 6))
        D.Shade(b, Color3.fromRGB(255, 255, 255), Color3.fromRGB(182, 187, 201), 90)
        D.Cảm giác xúc giác (b, 0,08)
        trả lại b
    kết thúc
    hàm cục bộ lab(txt, x, y, w)
        Mới("TextLabel", {
            Kích thước = UDim2.new(0, w, 0, 20), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = txt, Độ trong suốt nền = 1, Màu chữ 3 = C.MUTED,
            Phông chữ = Enum.Font.GothamMedium, Kích thước chữ = 9,
            TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
        }, P)
    kết thúc

    local allBtn = Act("👁️ Tất cả", 8, 22, 76, C.GRAY)
    local soloBtn = act("🎯 Lẻ", 90, 22, 76, C.GRAY)
    local stopBtn = act("🚫", 172, 22, 56, C.SURFACE3)

    local flyNearBtn = act("🚀 Gần nhất", 234, 22, 76, C.ACCENT)
    local flyStopBtn = act("⏹️ va bay", 316, 22, 76, C.SURFACE3)

    lab("📏 Xa nhất:", 8, 48, 58)
    local distIn = New("TextBox", {
        Kích thước = UDim2.new(0, 50, 0, 20), Vị trí = UDim2.new(0, 66, 0, 48),
        Văn bản = "0", Xóa văn bản khi tập trung = false,
        BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.1, TextColor3 = C.DARK,
        PlaceholderColor3 = C.GRAY, Font = Enum.Font.GothamMedium, TextSize = 9,
        TextXAlignment = Enum.TextXAlignment.Center, BorderSizePixel = 0, ZIndex = 7,
    }, P)
    Góc(distIn, UDim.new(0, 6))
    lab("m (0 = không giới hạn)", 122, 48, 120)

    lab("🚀 Tốc độ bay tới người:", 8, 72, 122)
    local flySpeedIn = New("TextBox", {
        Kích thước = UDim2.new(0, 56, 0, 20), Vị trí = UDim2.new(0, 132, 0, 72),
        Văn bản = "0", Xóa văn bản khi tập trung = false,
        BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.1, TextColor3 = C.DARK,
        PlaceholderColor3 = C.GRAY, Font = Enum.Font.GothamMedium, TextSize = 9,
        TextXAlignment = Enum.TextXAlignment.Center, BorderSizePixel = 0, ZIndex = 7,
    }, P)
    Corner(flySpeedIn, UDim.new(0, 6))
    lab("0=auto (lấy game tốc độ)", 194, 72, 160)
    local flySpeedApply = act(" ✅ Đặt", 354, 72, 38, C.GREEN)

    local searchIn = New("TextBox", {
        Kích thước = UDim2.new(1, -16, 0, 22), Vị trí = UDim2.new(0, 8, 0, 96),
        Text = "", PlaceholderText = "🔍 Tìm tên người chơi...", ClearTextOnFocus = false,
        PlaceholderColor3 = C.GRAY, BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.1,
        TextColor3 = C.DARK, Font = Enum.Font.GothamMedium, TextSize = 9,
        TextXAlignment = Enum.TextXAlignment.Left, BorderSizePixel = 0, ZIndex = 7,
    }, P)
    Góc(searchIn, UDim.new(0, 6))
    New("UIPadding", { PaddingLeft = UDim.new(0, 6) }, searchIn)

    danh sách cục bộ = New("ScrollingFrame", {
        Tên = "LocList", Kích thước = UDim2.new(1, -16, 0, 190), Vị trí = UDim2.new(0, 8, 0, 122),
        BackgroundTransparency = 1, BorderSizePixel = 0, ScrollBarThickness = 4,
        CanvasSize = UDim2.new(0, 0, 0, 0), ZIndex = 7,
    }, P)
    New("UIListLayout", { Padding = UDim.new(0, 4), SortOrder = Enum.SortOrder.LayoutOrder }, list)

    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 56), Vị trí = UDim2.new(0, 8, 0, 316),
        Text = "💡 Bấm NAME = chỉ định người ở đó. 🟢 thường · 💗 bạn bè · 🔴 bị hạ hạ (⏱ đếm giờ) · "
             .. "🟣 bạn bè bị hạ hạ. 📏 Xa nhất: chỉ người trong bán kính đó."
             .. "🚀 Bay tới = xuyên tường (tự bật 🧱 + 🚀), theo dõi mục tiêu di chuyển, dừng khi <2 stud."
             .. "Tốc độ 0 = tự động lấy tốc độ mặc định của trò chơi.",
        TextWrapped = true, BackgroundTransparency = 1, TextColor3 = C.MUTED,
        Font = Enum.Font.GothamMedium, TextSize = 8, TextXAlignment = Enum.TextXAlignment.Left,
        TextYAlignment = Enum.TextYAlignment.Top, ZIndex = 7,
    }, P)

    hàm cục bộ paint()
        allBtn.Text = LOC.on và "👁️ Tất Cả: BẬT" hoặc "👁️ Tất Cả"
        allBtn.BackgroundColor3 = LOC.on và C.GREEN hoặc C.GRAY
        allBtn.TextColor3 = D.BestText(allBtn.BackgroundColor3)
        soloBtn.Text = LOC.solo and ("🎯 " .. tostring(LOC.target and LOC.target.Name or "?")) or "🎯 Lẻ"
        soloBtn.BackgroundColor3 = LOC.solo và C.PURPLE hoặc C.GRAY
        soloBtn.TextColor3 = D.BestText(soloBtn.BackgroundColor3)
        local mv = S.Move
        local sp = mv and mv.playerFlySpeed ​​or 0
        nếu tonumber(sp) == 0 thì
            flySpeedIn.Text = "0"
            flySpeedIn.PlaceholderText = tostring(mv and mv.GetPlayerFlySpeed ​​and mv.GetPlayerFlySpeed() or 16)
        khác
            flySpeedIn.Text = tostring(sp)
        kết thúc
        local active = mv and mv._playerFlyActive
        flyNearBtn.BackgroundColor3 = active và C.GREEN hoặc C.ACCENT
        flyNearBtn.TextColor3 = D.BestText(flyNearBtn.BackgroundColor3)
        flyNearBtn.Text = active and ("🚀 Đang bay " .. tostring(mv._playerFlyTarget and mv._playerFlyTarget.Name or "?")) or "🚀gần nhất"
    kết thúc

    LOC.RefreshList = function(force)
        thuật ngữ cục bộ = tostring(searchIn.Text hoặc ""):lower()
        local ok, players = pcall(function() return Players:GetPlayers() end)
        Nếu không ổn hoặc không phải người chơi thì hãy trả lại.
        mong muốn cục bộ = {}
        tín hiệu cục bộ = thuật ngữ
        for _, p in ipairs(players) do
            nếu p ~= người chơi thì
                local nm = tostring(p.Name)
                if term == "" or nm:lower():find(term, 1, true) then
                    muốn[#muốn + 1] = p
                    local _, _, h0 = LỘC.CharOf(p)
                    sig = sig .. "|" .. nm
                        .. (LOC.IsFriend(p) và "F" hoặc "") .. (LOC.IsDown(h0) và "D" hoặc "")
                        .. (LOC.target == p và "T" hoặc "")
                kết thúc
            kết thúc
        kết thúc
        bộ nhớ đệm cục bộ = LOC._rows
        nếu (force == true) hoặc (sig ~= LOC._rowSig) hoặc (cache == nil) thì
            LOC._rowSig = sig
            LOC._rows = {}
            bộ nhớ đệm = LOC._rows
            for _, c in ipairs(list:GetChildren()) do
                if not c:IsA("UIListLayout") then pcall(function() c:Destroy() end) end
            kết thúc
            thứ tự cục bộ = 0
            for _, p in ipairs(want) do
                local nm = tostring(p.Name)
                đơn hàng = đơn hàng + 1
                cục bộ _, _, h = LOC.CharOf(p)
                local fr, down = LOC.IsFriend(p), LOC.IsDown(h)
                local col = down and (fr and LOCC.fdown or LOCC.down) or (fr and LOCC.friend or LOCC.normal)
                    hàng cục bộ = New("Khung", {
                        Kích thước = UDim2.new(1, 0, 0, 28), Thứ tự bố cục = thứ tự,
                        BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.25,
                        BorderSizePixel = 0, ZIndex = 8,
                    }, danh sách)
                    Góc(hàng, UDim.new(0, 6))
                    cục bộ con = {}
                    if fr thì sub[#sub + 1] = "💗 Bạn Bè" end
                    nếu xuống thì sub[#sub + 1] = "☠️ " .. locTime(LOC.DownSecs(p)) end
                    cục bộ b = New("TextButton", {
                        Kích thước = UDim2.new(1, -162, 1, 0), Vị trí = UDim2.new(0, 6, 0, 0),
                        Văn bản = (LOC.target == p và "🎯 " hoặc "") .. nm
                             .. (#sub > 0 và (" " .. table.concat(sub, " ")) hoặc ""),
                        BackgroundTransparency = 1, TextColor3 = col.txt,
                        Phông chữ = Enum.Font.GothamBold, Kích thước chữ = 9,
                        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 9,
                    }, hàng ngang)
                    b.Đã kích hoạt:Kết nối(function())
                        ReleaseHubFocus()
                        nếu LOC.target == p thì
                            LOC.SetSolo(false)
                            if S.Spec and S.Spec.on and S.Spec.target == p then pcall(function() S.Spec.Stop() end) end
                        khác
                            LOC.SetTarget(p)
                            nếu S.Spec và S.Spec.on thì
                                pcall(function() S.Spec.Set(p) end)
                                pcall(function() if S.Spec.RefreshList then S.Spec.RefreshList() end end)
                            kết thúc
                        kết thúc
                        sơn()
                        nếu LOC.RefreshList thì LOC.RefreshList() kết thúc
                        S.Rebuild()
                    kết thúc)
                    local d = LOC.Dist(p)
                    local distLbl = New("TextLabel", {
                        Kích thước = UDim2.new(0, 56, 1, 0), Vị trí = UDim2.new(1, -156, 0, 0),
                        Văn bản = d và chuỗi.format("📏 %dm", locRound(d)) hoặc "📏 --m",
                        BackgroundTransparency = 1, TextColor3 = col.txt,
                        Phông chữ = Enum.Font.GothamMedium, Kích thước chữ = 9,
                        TextXAlignment = Enum.TextXAlignment.Right, ZIndex = 9,
                    }, hàng ngang)
                    local mv = S.Move
                    local isFlyingToThis = mv and mv._playerFlyActive and mv._playerFlyTarget == p
                    local flyBtn = New("TextButton", {
                        Kích thước = UDim2.new(0, 70, 0, 20), Vị trí = UDim2.new(1, -76, 0, 4),
                        Text = isFlyingToThis và "⏹️ Stop" hoặc "🚀 Bay tới",
                        BackgroundColor3 = isFlyingToThis và C.RED hoặc C.ACCENT,
                        TextColor3 = Color3.fromRGB(255,255,255),
                        Font = Enum.Font.GothamBold, TextSize = 8, BorderSizePixel = 0, ZIndex = 10,
                    }, hàng ngang)
                    Góc(flyBtn, UDim.new(0, 6))
                    D.Shade(flyBtn, Color3.fromRGB(255, 255, 255), Color3.fromRGB(182, 187, 201), 90)
                    D.Tactile(flyBtn, 0.08)
                    cache[p] = { dist = distLbl, fly = flyBtn } -- v4.34: lần sau chỉ cập nhật chữ, không cài đặt lại
                    flyBtn.Activated:Connect(function()
                        ReleaseHubFocus()
                        local mv2 = S.Move
                        nếu không phải mv2 thì trả về end
                        local currentlyFlyingToThis = mv2._playerFlyActive and mv2._playerFlyTarget == p
                        nếu hiện đang bay đến đây thì
                            pcall(function() mv2.StopPlayerFly() end)
                        khác
                            pcall(function() mv2.FlyToPlayer(p) end)
                        kết thúc
                        if S.SyncMovePanel then pcall(S.SyncMovePanel) end
                        nếu D.hubStatus thì
                            nếu mv2._playerFlyActive thì
                                flash(D.hubStatus, "🚀 Bay tới " .. tostring(p.Name) .. " " .. tostring(mv2.GetPlayerFlySpeed ​​and mv2.GetPlayerFlySpeed() or mv2.playerFlySpeed ​​or 0), 1.8, C.ACCENT)
                            khác
                                flash(D.hubStatus, "⏹️ Đã dừng bay tới " .. tostring(p.Name), 1.2, C.GRAY)
                            kết thúc
                        kết thúc
                        if LOC.RefreshList then pcall(LOC.RefreshList) end
                        S.Rebuild()
                    kết thúc)
            kết thúc
            pcall(function() list.CanvasSize = UDim2.new(0, 0, 0, order * 32) end)
        khác
            local mv = S.Move
            for _, p in ipairs(want) do
                cục bộ r = cache[p]
                nếu r thì
                    local d2 = LOC.Dist(p)
                    if r.dist then r.dist.Text = d2 and string.format("📏 %dm", locRound(d2)) or "📏 --m" end
                    nếu r.fly thì
                        local flying = mv and mv._playerFlyActive and mv._playerFlyTarget == p
                        r.fly.Text = đang bay và "⏹️chèo" hoặc "🚀 Bay tới"
                        r.fly.BackgroundColor3 = flying và C.RED hoặc C.ACCENT
                    kết thúc
                kết thúc
            kết thúc
        kết thúc
        sơn()
    kết thúc

    allBtn.Activated:Connect(function()
        ReleaseHubFocus()
        LOC.Set(not LOC.on)
        sơn()
        nếu LOC.RefreshList thì LOC.RefreshList() kết thúc
        S.Rebuild()
        if D.hubStatus then flash(D.hubStatus, "📍 " .. LOC.Status(), 1.8, C.ACCENT) end
    kết thúc)
    soloBtn.Activated:Connect(function()
        ReleaseHubFocus()
        nếu LOC.solo thì
            LOC.SetSolo(false)
        khác
            LOC.SetTarget(LOC.target hoặc LOC.Nearest())
        kết thúc
        sơn()
        nếu LOC.RefreshList thì LOC.RefreshList() kết thúc
        S.Rebuild()
        if D.hubStatus then flash(D.hubStatus, "🎯 " .. LOC.Status(), 1.8, C.ACCENT) end
    kết thúc)
    stopBtn.Activated:Connect(function()
        ReleaseHubFocus()
        LOC.StopAll()
        sơn()
        nếu LOC.RefreshList thì LOC.RefreshList() kết thúc
        S.Rebuild()
        if D.hubStatus then flash(D.hubStatus, "🚫 " .. LOC.Status(), 1.8, C.ACCENT) end
    kết thúc)
    distIn.FocusLost:Connect(function()
        ReleaseHubFocus()
        local n = tonumber(tostring(distIn.Text or ""):match("%-?%d+%.?%d*")) or 0
        LOC.SetMaxDist(n)
        distIn.Text = tostring(LOC.maxDist)
        nếu D.hubStatus thì
            flash(D.hubStatus, (LOC.maxDist > 0 and string.format("📏 only current user in %dm", locRound(LOC.maxDist))
                 hoặc "📏 không giới hạn khoảng cách"), 1.8, C.ACCENT)
        kết thúc
    kết thúc)
    flySpeedApply.Activated:Connect(function()
        ReleaseHubFocus()
        local mv = S.Move
        nếu không phải mv thì trả về end
        local n = tonumber(tostring(flySpeedIn.Text or ""):match("%-?%d+%.?%d*"))
        nếu n == nil thì
            nếu D.hubStatus thì flash(D.hubStatus, "⚠️ Nhập số 0-500 (0=auto)", 1.5, C.RED) end
            trở lại
        kết thúc
        cục bộ ok, msg = mv.SetPlayerFlySpeed(n)
        nếu không ổn và D.hubStatus thì
            flash(D.hubStatus, "⚠️ " .. tostring(msg), 1.5, C.RED)
        khác
            sơn()
            nếu D.hubStatus thì
                local sp = mv.GetPlayerFlySpeed ​​and mv.GetPlayerFlySpeed() or mv.playerFlySpeed ​​or 0
                nếu (tonumber(mv.playerFlySpeed) hoặc 0) == 0 thì
                    flash(D.hubStatus, string.format("🚀 Tốc độ bay người: auto (%g = tốc độ game)", sp), 1.8, C.ACCENT)
                khác
                    flash(D.hubStatus, string.format("🚀 Tốc độ bay người: %g", sp tới), 1.5, C.GREEN)
                kết thúc
            kết thúc
            if S.SyncMovePanel then pcall(S.SyncMovePanel) end
            S.Rebuild()
        kết thúc
    kết thúc)
    flySpeedIn.FocusLost:Connect(function(enter)
        nếu không vào thì trả về kết thúc
        ReleaseHubFocus()
        local mv = S.Move
        nếu không phải mv thì trả về end
        local n = tonumber(tostring(flySpeedIn.Text or ""):match("%-?%d+%.?%d*"))
        nếu n == nil thì trả về end
        local ok = mv.SetPlayerFlySpeed(n)
        nếu được thì
            sơn()
            S.Rebuild()
        kết thúc
    kết thúc)
    flyNearBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local mv = S.Move
        nếu không phải mv thì trả về end
        mục tiêu cục bộ = LOC.Gần nhất()
        nếu không phải là mục tiêu thì
            if D.hubStatus thì flash(D.hubStatus, "⚠️ Không có người chơi nào để bay tới", 1.5, C.RED) end
            trở lại
        kết thúc
        pcall(function() mv.FlyToPlayer(target) end)
        sơn()
        if LOC.RefreshList then pcall(LOC.RefreshList) end
        if S.SyncMovePanel then pcall(S.SyncMovePanel) end
        S.Rebuild()
        nếu D.hubStatus thì flash(D.hubStatus, "🚀 Bay gần nhất: " .. tới tostring(target.Name), 1.8, C.ACCENT) end
    kết thúc)
    flyStopBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local mv = S.Move
        if mv then pcall(function() mv.StopPlayerFly() end) end
        sơn()
        if LOC.RefreshList then pcall(LOC.RefreshList) end
        if S.SyncMovePanel then pcall(S.SyncMovePanel) end
        S.Rebuild()
        nếu D.hubStatus thì flash(D.hubStatus, "⏹️ Đã dừng bay tới người", 1.2, C.GRAY) end
    kết thúc)

    if LOC.RefreshList then pcall(LOC.RefreshList) end
    S.SyncLocPanel = function()
        sơn()
        distIn.Text = tostring(LOC.maxDist)
        local mv = S.Move
        nếu mv thì
            flySpeedIn.Text = tostring(mv.playerFlySpeed ​​or 0)
        kết thúc
        if LOC.RefreshList then pcall(LOC.RefreshList) end
    kết thúc
kết thúc

S.Spec = {
    on = false, target = nil, -- 👣 đang xem ai
    auto = true, -- người đang xem thoát thì tự chuyển sang người gần nhất
    theo dõi = đúng, khoảng cách = 12, chiều cao = 3.2,
    di chuyển = false, nhảy = false, rơi = false, tốc độ = 0, hành động = "",
    LastMove = 0, LastJump = 0, LastFall = 0,
    _prev = nil, _oldType = nil, _oldSubject = nil, _bound = false, _ui = {},
}
SP cục bộ = S.Spec
hàm cục bộ spRound(n) trả về math.floor((tonumber(n) hoặc 0) + 0.5) kết thúc

hàm S.Spec.CamOn()
    local cam = workspace.CurrentCamera
    nếu không phải là cam thì trả về đầu
    nếu SP._oldType == nil thì
        pcall(function()
            local ct = cam.CameraType
            nếu ct ~= Enum.CameraType.Scriptable thì
                SP._oldType = ct
            khác
                SP._oldType = Enum.CameraType.Custom
            kết thúc
        kết thúc)
    kết thúc
    nếu SP._oldSubject == nil thì
        pcall(function() SP._oldSubject = cam.CameraSubject end)
    kết thúc
    if SP._oldType then _G.BananaCatHub_SpecCam = SP._oldType end
    pcall(function() cam.CameraType = Enum.CameraType.Scriptable end)
kết thúc
hàm S.Spec.CamOff()
    local cam = workspace.CurrentCamera
    pcall(function()
        nếu có camera thì
            nếu SP._oldType và SP._oldType ~= Enum.CameraType.Scriptable thì
                cam.CameraType = SP._oldType
            khác
                cam.CameraType = Enum.CameraType.Custom
            kết thúc
        kết thúc
    kết thúc)
    pcall(function()
        nếu không phải là cam thì trả về đầu
        local char = player and player.Character
        local hum = char and char:FindFirstChildOfClass("Humanoid")
        cục bộ gốc = char và char:FindFirstChild("HumanoidRootPart")
        nếu tiếng vo ve thì
            cam.CameraSubject = hum
        nếu SP._oldSubject thì
            pcall(function() cam.CameraSubject = SP._oldSubject end)
        kết thúc
        nếu là root thì
            vị trí cục bộ = gốc.Vị trí
            cam.CFrame = CFrame.new(pos + Vector3.new(0, 3.2, 12), pos + Vector3.new(0, 1.5, 0))
            cam.Focus = CFrame.new(pos)
        kết thúc
    kết thúc)
    SP._oldType = nil
    SP._oldSubject = nil
    _G.BananaCatHub_SpecCam = nil
kết thúc
hàm S.Spec.Acting(p)
    if not p or not SP.on then return "—" end
    cục bộ c, r, h = S.Loc.CharOf(p)
    nếu không c thì return "⏳ đang chờ nhân vật (đang hồi sinh?)" end
    nếu S.Loc.IsDown(h) thì
        local t = S.Loc.DownSecs(p)
        return "☠️ đang BỊ HẠ GỤC" .. (t > 0 và (" (⏱ " .. string.format("%02d:%02d", math.floor(t / 60), math.floor(t % 60)) .. ")") hoặc "")
    kết thúc
    if h and h.Sit == true then return "🪑 đang NGỒI" end
    nếu SP.jumping thì return "🦘 đang NHẢY" end
    if SP.falling then return "🪂 đang RƠI" end
    local sp = tonumber(SP.speed) or 0
    nếu sp > 0,6 thì
        cơ sở cục bộ = (h và tonumber(h.WalkSpeed)) hoặc 16
        if sp >= base * 1.25 thì return "🏃 đang CHẠY NHANH (" .. spRound(sp) .. " m/s)"
        elseif sp >= base * 0.6 then return "🚶 đang CHẠY (" .. spRound(sp) .. " m/s)"
        else return "🐌 đang đi CHẬM (" .. spRound(sp) .. " m/s)" end
    kết thúc
    return "🧍 đang ĐỨNG YÊN"
kết thúc
hàm S.Spec.Step(dt)
    nếu không (SP.on và SP.target) thì trả về end
    cục bộ p = SP.mục tiêu
    nếu p.Parent == nil thì
        SP.target = nil
        nếu SP.auto thì
            local n = S.Loc.Nearest()
            nếu n thì pcall(function() S.Spec.Set(n) end) end
        kết thúc
        if not SP.target then pcall(function() S.Spec.Stop() end) end
        pcall(function() if S.Spec.RefreshList then S.Spec.RefreshList() end end)
        trở lại
    kết thúc
    cục bộ c, r = S.Loc.CharOf(p)
    nếu không phải c hoặc không phải r thì
        nếu SP.auto thì
            local n = S.Loc.Nearest()
            nếu n và n ~= p và S.Loc.CharOf(n) thì
                SP.target = n
                SP._prev = nil
                SP.lastMove, SP.lastJump, SP.lastFall = 0, 0, 0
                S.Spec.RefreshList()
            kết thúc
        kết thúc
        SP.moving, SP.jumping, SP.falling, SP.speed = false, false, false, 0
        S.Loc.NoteDown(p, false)
        S.Spec.Sync()
        trở lại
    kết thúc
    S.Loc.NoteDown(p, S.Loc.IsDown(c:FindFirstChildOfClass("Humanoid")))
    vị trí cục bộ = r.Vị trí
    cục bộ hiện tại = tick()
    cục bộ pv = SP._prev
    nếu pv và pv.p == p thì
        local d = math.max(now - pv.t, 0.001)
        local dx, dz = pos.X - pv.x, pos.Z - pv.z
        local sp = math.sqrt(dx * dx + dz * dz) / d
        if sp > 0.6 then SP.lastMove = now; SP.speed = sp end
        local dy = pos.Y - pv.y
        nếu dy > 0.8 thì SP.lastJump = now end
        nếu dy < -0.8 thì SP.lastFall = now end
    kết thúc
    SP.moving = (SP.lastMove > 0) và (now - SP.lastMove < 0.5) hoặc false
    SP.jumping = (SP.lastJump > 0) và (now - SP.lastJump < 0.9) hoặc false
    SP.falling = (SP.lastFall > 0) và (now - SP.lastFall < 0.6) hoặc false
    nếu SP không di chuyển thì tốc độ của SP bằng 0
    SP._prev = { p = p, t = now, x = pos.X, y = pos.Y, z = pos.Z }
    nếu SP.follow thì
        local cam = workspace.CurrentCamera
        nếu có camera thì
            local look = r.CFrame.LookVector
            local want = pos - look * SP.dist + Vector3.new(0, SP.height, 0)
            cam.CFrame = CFrame.lookAt(want, pos + Vector3.new(0, 1.5, 0)) -- v4.34: ghi thẳng
        kết thúc
    kết thúc
    SP._acc = (SP._acc hoặc 0) + (tonumber(dt) hoặc 0,016)
    nếu SP._acc >= 0.25 thì
        SP._acc = 0
        S.Spec.Sync()
        nếu SP.follow thì
            local cam = workspace.CurrentCamera
            nếu cam và cam.CameraType ~= Enum.CameraType.Scriptable thì
                pcall(function() cam.CameraType = Enum.CameraType.Scriptable end)
            kết thúc
        kết thúc
    kết thúc
kết thúc
hàm S.Spec.Bind(on)
    nếu đang bật và không phải là SP._bound thì
        SP._bound = true
        pcall(function()
            RunService:BindToRenderStep("BC_Spec", Enum.RenderPriority.Camera.Value - 3, hàm(dt)
                pcall(S.Spec.Step, dt)
            kết thúc)
        kết thúc)
    nếu không bật và SP._bound thì
        SP._bound = false
        pcall(function() RunService:UnbindFromRenderStep("BC_Spec") end)
    kết thúc
kết thúc
hàm S.Spec.Set(p)
    nếu p == nil hoặc p == player hoặc p.Parent == nil thì
        SP.on = false; SP.target = nil; SP._prev = nil
        SP.moving, SP.jumping, SP.falling, SP.speed = false, false, false, 0
        SP.lastMove, SP.lastJump, SP.lastFall = 0, 0, 0
        S.Spec.Bind(false)
        S.Spec.CamOff()
        S.Spec.Sync()
        trả về false
    kết thúc
    SP.target, SP.on, SP._prev = p, true, nil
    SP.lastMove, SP.lastJump, SP.lastFall = 0, 0, 0
    SP.moving, SP.jumping, SP.falling, SP.speed = false, false, false, 0
    S.Spec.Bind(true)
    if SP.follow then S.Spec.CamOn() end
    S.Spec.Sync()
    trả về giá trị đúng
kết thúc
function S.Spec.Stop() return S.Spec.Set(nil) end
hàm S.Spec.SetFollow(on)
    SP.follow = (on == true)
    if SP.follow and SP.on then S.Spec.CamOn() else S.Spec.CamOff() end
    S.Spec.Sync()
    trả về SP.follow
kết thúc
function S.Spec.SetAuto(on) SP.auto = (on == true); S.Spec.Sync(); return SP.auto end
function S.Spec.SetDist(n) SP.dist = mvClamp(n, 3, 200); S.Spec.Sync(); return SP.dist end
function S.Spec.SetHeight(n) SP.height = mvClamp(n, -30, 60); S.Spec.Sync(); return SP.height end
hàm S.Spec.Status()
    nếu không (SP.on và SP.target) thì return "👣 xem người chơi: đang TẮT (máy ảnh của bạn bình thường)" end
    return "👣 đang xem " .. tostring(SP.target.Name) .. " — " .. S.Spec.Acting(SP.target)
kết thúc
LÀM
    trackConn(Players.PlayerRemoving:Connect(function(p)
        nếu SP.target == p thì
            SP.target = nil
            nếu SP.on và SP.auto thì
                local n = S.Loc.Nearest()
                nếu n thì pcall(function() S.Spec.Set(n) end) end
            kết thúc
            if not SP.target then pcall(function() S.Spec.Stop() end) end
            pcall(function() S.Spec.RefreshList() end)
        kết thúc
    kết thúc))
    trackConn(player.CharacterAdded:Connect(function()
        task.spawn(function()
            task.wait(0.5)
            nếu không phải SP.on thì
                pcall(function() S.Spec.CamOff() end)
                pcall(function()
                    local cam = workspace.CurrentCamera
                    local char = player.Character
                    local hum = char and char:FindFirstChildOfClass("Humanoid")
                    nếu có camera và tiếng ồn thì
                        cam.CameraSubject = hum
                        cam.CameraType = Enum.CameraType.Custom
                    kết thúc
                kết thúc)
            khác
                pcall(function() S.Spec.CamOn() end)
            kết thúc
            pcall(function() if S.Spec.RefreshList then S.Spec.RefreshList() end end)
        kết thúc)
    kết thúc))
    pcall(function()
        trackConn(workspace:GetPropertyChangedSignal("CurrentCamera"):Connect(function()
            task.spawn(function()
                task.wait(0.1)
                nếu SP.on và SP.follow thì
                    pcall(function() S.Spec.CamOn() end)
                kết thúc
            kết thúc)
        kết thúc))
    kết thúc)
kết thúc

--------- BẢNG NỔI 👣 (hiện trên màn hình game, menu đóng vẫn thấy) ----------
LÀM
    cục bộ g = New("ScreenGui", {
        Tên = "BC_SpecHud", ResetOnSpawn = false,
        ZIndexBehavior = Enum.ZIndexBehavior.Sibling, Enabled = false,
    }, gui)
    cục bộ F = New("Khung", {
        Tên = "SpecBox", Kích thước = UDim2.new(0, 250, 0, 92), Vị trí = UDim2.new(0, 10, 0, 10),
        BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.12, BorderSizePixel = 0, ZIndex = 20,
    }, g)
    Góc(F, UDim.new(0, 10))
    Stroke(F, C.ACCENT, 1.2)
    D.Shade(F, Color3.fromRGB(255, 255, 255), Color3.fromRGB(188, 192, 205), 90)
    SP._ui.gui = g
    SP._ui.title = New("TextLabel", {
        Tên = "chức danh",
        Kích thước = UDim2.new(1, -46, 0, 14), Vị trí = UDim2.new(0, 8, 0, 4),
        Văn bản = "👣 ĐANG XEM", Độ trong suốt nền = 1, Màu chữ 3 = C.ACCENT,
        Font = Enum.Font.GothamBold, TextSize = 10, TextXAlignment = Enum.TextXAlignment.Left,
        Chỉ số Z = 21,
    }, F)
    SP._ui.who = New("TextLabel", {
        Tên = "ai",
        Kích thước = UDim2.new(1, -16, 0, 16), Vị trí = UDim2.new(0, 8, 0, 19),
        Văn bản = "", Độ trong suốt nền = 1, Màu văn bản 3 = C.DARK,
        Font = Enum.Font.GothamBold, TextSize = 11, TextXAlignment = Enum.TextXAlignment.Left,
        TextTruncate = Enum.TextTruncate.AtEnd, ZIndex = 21,
    }, F)
    SP._ui.info = New("TextLabel", {
        Tên = "info",
        Kích thước = UDim2.new(1, -16, 0, 14), Vị trí = UDim2.new(0, 8, 0, 37),
        Văn bản = "", Độ trong suốt nền = 1, Màu văn bản 3 = C.MUTED,
        Font = Enum.Font.GothamMedium, TextSize = 9, TextXAlignment = Enum.TextXAlignment.Left,
        Chỉ số Z = 21,
    }, F)
    SP._ui.act = New("TextLabel", {
        Tên = "hành động",
        Kích thước = UDim2.new(1, -16, 0, 16), Vị trí = UDim2.new(0, 8, 0, 52),
        Văn bản = "", Độ trong suốt nền = 1, Màu chữ 3 = XANH LÁ CÂY,
        Font = Enum.Font.GothamBold, TextSize = 11, TextXAlignment = Enum.TextXAlignment.Left,
        TextTruncate = Enum.TextTruncate.AtEnd, ZIndex = 21,
    }, F)
    local stopBtn = New("TextButton", {
        Tên = "stopBtn",
        Kích thước = UDim2.new(0, 30, 0, 20), Vị trí = UDim2.new(1, -38, 0, 4),
        Văn bản = "🚫", Màu nền 3 = C.RED, Màu chữ 3 = D.BestText(C.RED),
        Font = Enum.Font.GothamBold, TextSize = 11, BorderSizePixel = 0, ZIndex = 22,
    }, F)
    Góc(nút dừng, UDim.new(0, 7))
    D.Tactile(stopBtn, 0.1)
    stopBtn.Activated:Connect(function()
        pcall(function() S.Spec.Stop() end)
        pcall(function() S.Spec.RefreshList() end)
        pcall(S.Rebuild)
    kết thúc)
    local followBtnHud = New("TextButton", {
        Tên = "followBtn",
        Kích thước = UDim2.new(0, 46, 0, 20), Vị trí = UDim2.new(1, -88, 0, 4),
        Văn bản = "🎥 Bám", Màu nền 3 = C.GREEN, Màu chữ 3 = D.BestText(C.GREEN),
        Font = Enum.Font.GothamBold, TextSize = 9, BorderSizePixel = 0, ZIndex = 22,
    }, F)
    Góc(followBtnHud, UDim.new(0, 7))
    D.Tactile(followBtnHud, 0.1)
    followBtnHud.Activated:Connect(function()
        pcall(function() S.Spec.SetFollow(not SP.follow) end)
        pcall(function() S.Spec.RefreshList() end)
    kết thúc)
    SP._ui.followBtn = followBtnHud
    SP._ui.note = New("TextLabel", {
        Tên = "ghi chú",
        Kích thước = UDim2.new(1, -16, 0, 16), Vị trí = UDim2.new(0, 8, 0, 70),
        Text = "💡 ấn 🚫 để trả camera về cho bạn", BackgroundTransparency = 1, TextColor3 = C.GRAY,
        Font = Enum.Font.GothamMedium, TextSize = 8, TextXAlignment = Enum.TextXAlignment.Left,
        Chỉ số Z = 21,
    }, F)
kết thúc
hàm S.Spec.Sync()
    cục bộ u = SP._ui
    nếu không phải u thì trả về end
    cục bộ bật = (SP.on và SP.target ~= nil)
    pcall(function() if u.gui then u.gui.Enabled = on end end)
    nếu không bật thì trả về end
    pcall(function()
        nếu bạn theo dõi nút này thì
            u.followBtn.Text = SP.follow và "🎥 Bám" hoặc "🎥 Thôi"
            u.followBtn.BackgroundColor3 = SP.follow và C.GREEN hoặc C.SURFACE3
            u.followBtn.TextColor3 = D.BestText(u.followBtn.BackgroundColor3)
        kết thúc
    kết thúc)
    cục bộ p = SP.mục tiêu
    cục bộ c, r, h = S.Loc.CharOf(p)
    local fr = S.Loc.IsFriend(p)
    local nm = tostring(p.Name) .. (fr and " 💗 Bạn Bè" or "")
    local dist = S.Loc.Dist(p)
    các dòng cục bộ = {}
    if h then lines[#lines + 1] = string.format("❤️ %d/%d", spRound(h.Health or 0), spRound(h.MaxHealth or 100)) end
    lines[#lines + 1] = dist and ("📏 " .. spRound(dist) .. "m") or "📏 --m"
    lines[#lines + 1] = "💨 " .. spRound(SP.speed) .. " m/s"
    pcall(function()
        if u.who then u.who.Text = "👣 " .. nm end
        if u.info then u.info.Text = table.concat(lines, " ") end
        nếu bạn hành động thì
            local txt = S.Spec.Acting(p)
            u.act.Text = txt
            u.act.TextColor3 = S.Loc.IsDown(h) and Color3.fromRGB(255, 100, 100) or C.GREEN
        kết thúc
        nếu u.title thì
            u.title.Text = "👣 ĐANG XEM" .. (SP.follow và "" hoặc " (KHÔNG quan)") .. (SP.auto và " · 🔄" hoặc "")
        kết thúc
    kết thúc)
kết thúc

S.Glow = {
    bật = false, chiều rộng = 18, độ sáng = 3,
    màu = Color3.fromRGB(120, 220, 255),
    through = true, -- 👁Tường Tường (mặc định BẬT — đúng ý "ánh sáng không bị trói")
    light = true, -- 💡 đèn thật toả sáng xung quanh người
    _hl = nil, _pl = nil, _char = nil, _bound = false, _acc = 0, palIdx = 1,
}
GL cục bộ = S.Glow
local function glowRound(n) return math.floor((tonumber(n) or 0) + 0.5) end
GL.palette = {
    { name = "Xanh băng", c = Color3.fromRGB(120, 220, 255) },
    { name = "Xanh lá", c = Color3.fromRGB(80, 255, 140) },
    { name = "Hồng", c = Color3.fromRGB(255, 120, 210) },
    { name = "Vàng", c = Color3.fromRGB(255, 220, 90) },
    { name = "Đỏ", c = Color3.fromRGB(255, 80, 80) },
    { name = "Tím", c = Color3.fromRGB(170, 120, 255) },
    { name = "Trắng", c = Color3.fromRGB(255, 255, 255) },
}
function S.Glow.FillT() return mvClamp(0.94 - (tonumber(GL.bright) or 0) * 0.088, 0, 1, 1) end
function S.Glow.EdgeT() return mvClamp(0.60 - (tonumber(GL.bright) or 0) * 0.058, 0, 1, 1) end
function S.Glow.Char() return player and player.Character or nil end
hàm S.Glow.Kill()
    pcall(function() if GL._hl then GL._hl:Destroy() end end)
    pcall(function() if GL._pl then GL._pl:Destroy() end end)
    GL._hl, GL._pl, GL._char = nil, nil, nil
kết thúc
hàm S.Glow.Apply()
    nếu không phải GL.on thì trả về end
    local ch = S.Glow.Char()
    nếu không phải ch thì trả về end
    nếu GL._char ~= ch thì S.Glow.Kill(); GL._char = ch end -- hồi sinh -> nhân vật mới
    local hrp = ch:FindFirstChild("HumanoidRootPart") or ch:FindFirstChildOfClass("BasePart")
    chế độ cục bộ = GL.thru và Enum.HighlightDepthMode.AlwaysOnTop hoặc Enum.HighlightDepthMode.Occluded
    máy chủ cục bộ = (gui và gui.Parent và gui) hoặc targetGui hoặc playerGui
    nếu không phải là máy chủ thì trả về end
    nếu không (GL._hl và GL._hl.Parent) thì -- trò chơi bị xóa -> dựng lại
        GL._hl = New("Highlight", {
            Tên = "BC_GlowHL", Adornee = ch,
            FillColor = GL.color, OutlineColor = GL.color,
            FillTransparency = S.Glow.FillT(), OutlineTransparency = S.Glow.EdgeT(),
            DepthMode = chế độ,
        }, chủ nhà)
    kết thúc
    pcall(function()
        if GL._hl.Parent ~= host then GL._hl.Parent = host end
        GL._hl.Adornee = ch
        GL._hl.FillColor = GL.color
        GL._hl.OutlineColor = GL.color
        GL._hl.FillTransparency = S.Glow.FillT()
        GL._hl.OutlineTransparency = S.Glow.EdgeT()
        GL._hl.DepthMode = mode
    kết thúc)
    nếu GL.light và hrp thì
        nếu không (GL._pl và GL._pl.Parent) thì -- bị xóa -> dựng lại
            GL._pl = New("PointLight", {
                Tên = "BC_GlowLight", Độ sáng = GL.bright, Phạm vi = GL.width,
                Màu sắc = GL.color, Bóng đổ = false,
            }, hrp)
        kết thúc
        pcall(function()
            GL._pl.Brightness = GL.bright
            GL._pl.Range = GL.width
            GL._pl.Color = GL.color
            GL._pl.Shadows = false -- không bị chặn
            if GL._pl.Parent ~= hrp then GL._pl.Parent = hrp end
        kết thúc)
    nếu không phải GL.light thì
        pcall(function() if GL._pl then GL._pl:Destroy() end end)
        GL._pl = nil
    kết thúc
kết thúc
hàm S.Glow.Bind(on)
    nếu bật và không phải GL._bound thì
        GL._bound = true
        pcall(function()
            RunService:BindToRenderStep("BC_Glow", Enum.RenderPriority.Camera.Value - 5, hàm(dt)
                GL._acc = (GL._acc hoặc 0) + (tonumber(dt) hoặc 0,016)
                if GL._acc < 0.5 thì return end -- 2 lần/giây là đủ để canh, không tốn kém gì
                GL._acc = 0
                pcall(S.Glow.Apply)
            kết thúc)
        kết thúc)
    nếu không bật và GL._bound thì
        GL._bound = false
        pcall(function() RunService:UnbindFromRenderStep("BC_Glow") end)
    kết thúc
kết thúc
hàm S.Glow.Set(on)
    GL.on = (on == true)
    if GL.on then S.Glow.Bind(true); S.Glow.Apply() else S.Glow.Kill(); S.Glow.Bind(false) end
    trả về GL.on
kết thúc
function S.Glow.SetWidth(n) GL.width = mvClamp(n, 1, 200, GL.width); S.Glow.Apply(); return GL.width end
function S.Glow.SetBright(n) GL.bright = mvClamp(n, 0, 10, GL.bright); S.Glow.Apply(); return GL.bright end
function S.Glow.SetThru(b) GL.thru = (b == true); S.Glow.Apply(); return GL.thru end
function S.Glow.SetLight(b) GL.light = (b == true); S.Glow.Apply(); return GL.light end
hàm S.Glow.SetColor(c)
    nếu typeof(c) == "Color3" thì
        GL.color = c
    elseif type(c) == "number" and GL.palette[c] then
        GL.palIdx = c
        GL.color = GL.palette[c].c
    kết thúc
    S.Glow.Apply()
    trả về GL.color
kết thúc
hàm S.Glow.CycleColor()
    cục bộ n = #GL.palette
    GL.palIdx = ((GL.palIdx hoặc 1) % n) + 1
    GL.color = GL.palette[GL.palIdx].c
    S.Glow.Apply()
    trả về GL.palette[GL.palIdx].name
kết thúc
function S.Glow.Stop() return S.Glow.Set(false) end
hàm S.Glow.ColorName()
    for _, p in ipairs(GL.palette) do
        if pc == GL.color then return p.name end
    kết thúc
    trả về "tự chọn"
kết thúc
hàm S.Glow.Status()
    nếu không phải GL.on thì return "✨ phát sáng: đang TẮT" end
    local t = { string.format("📏 rộng %g", GL.width), string.format("☀ sáng %g", GL.bright),
                "🎨 " .. S.Glow.ColorName() }
    if GL.thru thì t[#t + 1] = "👁 Đam mê tường" end
    nếu GL.light thì t[#t + 1] = "💡 đèn thật" end
    return "✨ phát sáng: BẬT · " .. table.concat(t, " · ")
kết thúc
LÀM
    trackConn(player.CharacterAdded:Connect(function()
        if GL.on then pcall(S.Glow.Apply) end
    kết thúc))
kết thúc

--------- KHUNG ✨ PHÁT SÁNG (trên cùng danh sách thẻ trong 📚 Script Hub) ----------
LÀM
    Độ pH cục bộ = 132
    cục bộ P = New("Khung", {
        Tên = "HubGlow_Panel",
        Kích thước = UDim2.new(1, 0, 0, PH), Thứ tự bố cục = 1,
        BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.12, BorderSizePixel = 0, ZIndex = 6,
    }, D.hubList)
    Góc(P, UDim.new(0, 10))
    Stroke(P, C.HAIRLINE, 1)
    D.Shade(P, Color3.fromRGB(255, 255, 255), Color3.fromRGB(188, 192, 205), 90)

    Mới("TextLabel", {
        Tên = "GlowTitle",
        Kích thước = UDim2.new(1, -16, 0, 14), Vị trí = UDim2.new(0, 8, 0, 4),
        Text = "✨ PHÁT SÁNG (nhân vật của MÌNH)", BackgroundTransparency = 1,
        TextColor3 = C.ACCENT, Phông chữ = Enum.Font.GothamBold, TextSize = 10,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)

    hàm cục bộ act(txt, x, y, w, color, name)
        cục bộ b = New("TextButton", {
            Tên = tên hoặc "GlowBtn",
            Kích thước = UDim2.new(0, w, 0, 20), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = txt, Màu nền 3 = màu, Màu văn bản 3 = D.BestText(màu),
            Font = Enum.Font.GothamBold, TextSize = 9, BorderSizePixel = 0, ZIndex = 8,
        }, P)
        Góc(b, UDim.new(0, 6))
        D.Shade(b, Color3.fromRGB(255, 255, 255), Color3.fromRGB(182, 187, 201), 90)
        D.Cảm giác xúc giác (b, 0,08)
        trả lại b
    kết thúc
    hàm cục bộ lab(txt, x, y, w)
        Mới("TextLabel", {
            Kích thước = UDim2.new(0, w, 0, 20), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = txt, Độ trong suốt nền = 1, Màu chữ 3 = C.MUTED,
            Phông chữ = Enum.Font.GothamMedium, Kích thước chữ = 9,
            TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
        }, P)
    kết thúc
    hàm cục bộ box(x, y, w, val)
        local b = New("TextBox", {
            Kích thước = UDim2.new(0, w, 0, 20), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = tostring(val), Xóa văn bản khi tập trung = false,
            BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.1, TextColor3 = C.DARK,
            PlaceholderColor3 = C.GRAY, Font = Enum.Font.GothamMedium, TextSize = 9,
            TextXAlignment = Enum.TextXAlignment.Center, BorderSizePixel = 0, ZIndex = 7,
        }, P)
        Góc(b, UDim.new(0, 6))
        trả lại b
    kết thúc

    local onBtn = act("✨ BẬT", 8, 22, 92, C.GRAY, "GlowOn")
    local viaBtn = Act("👁 Xuyên Tường: BẬT", 106, 22, 112, C.GREEN, "GlowThru")
    local litBtn = act("💡Đè thật: BẬT", 224, 22, 104, C.GREEN, "GlowLight")

    phòng thí nghiệm ("📏" 8, 48, 44)
    local wIn = box(52, 48, 46, 18)
    lab("☀ Sáng", 106, 48, 44)
    local bIn = box(150, 48, 46, 3)
    colBtn cục bộ = act("🎨 Đổi màu", 204, 48, 124, C.PURPLE, "GlowColor")

    local applyBtn = act(" ✔ Áp dụng", 8, 74, 84, C.SURFACE3, "GlowApply")
    local stopBtn = act("🚫 Tắt", 98, 74, 70, C.RED, "GlowStop")
    local statusLbl = New("TextLabel", {
        Tên = "GlowStatus",
        Kích thước = UDim2.new(1, -188, 0, 20), Vị trí = UDim2.new(0, 174, 0, 74),
        Văn bản = "", Độ trong suốt nền = 1, Màu văn bản 3 = C.MUTED,
        Font = Enum.Font.GothamMedium, TextSize = 8, TextXAlignment = Enum.TextXAlignment.Left,
        TextTruncate = Enum.TextTruncate.AtEnd, ZIndex = 7,
    }, P)

    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 30), Vị trí = UDim2.new(0, 8, 0, 98),
        Text = "💡 📏 Rộng = bán kính toả sáng (1–200) · ☀ Sáng = độ sáng (0–10) "
             .. "👁 Xuyên Tường = thấy mình sáng qua tường · 💡 Đèn thật = ánh sáng KHÔNG bị vật cản."
             .. "Bị game xóa hay respawn thì tự gắn lại; chỉ thêm hiệu ứng, KHÔNG đụng vào di chuyển.",
        TextWrapped = true, BackgroundTransparency = 1, TextColor3 = C.MUTED,
        Font = Enum.Font.GothamMedium, TextSize = 8, TextXAlignment = Enum.TextXAlignment.Left,
        TextYAlignment = Enum.TextYAlignment.Top, ZIndex = 7,
    }, P)

    hàm cục bộ paint()
        onBtn.Text = GL.on và "✨ TẮT" hoặc "✨ BẬT"
        onBtn.BackgroundColor3 = GL.on và C.GREEN hoặc C.GRAY
        onBtn.TextColor3 = D.BestText(onBtn.BackgroundColor3)
        ThrBtn.Text = GL.thru và "👁 Xuyên Tường: BẬT" hoặc "👁 Xuyên Tường: TẮT"
        thruBtn.BackgroundColor3 = GL.thru và C.GREEN hoặc C.SURFACE3
        thruBtn.TextColor3 = D.BestText(thruBtn.BackgroundColor3)
        litBtn.Text = GL.light và "💡 Đèn thật: BẬT" hoặc "💡 Đèn thật: TẮT"
        litBtn.BackgroundColor3 = GL.light và C.GREEN hoặc C.SURFACE3
        litBtn.TextColor3 = D.BestText(litBtn.BackgroundColor3)
        wIn.Text, bIn.Text = tostring(GL.width), tostring(GL.bright)
        colBtn.Text = "🎨 " .. S.Glow.ColorName()
        statusLbl.Text = S.Glow.Status()
    kết thúc
    S.SyncGlowPanel = Paint -- S.RebuildHubList gọi để nhãn luôn đúng
    S.Glow.RefreshPanel = sơn

    onBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.Glow.Set(not GL.on)
        sơn()
        if D.hubStatus then flash(D.hubStatus, S.Glow.Status(), 2, C.ACCENT) end
        pcall(S.Rebuild) --thay đổi thẻ chữ ✨ trong danh sách
    kết thúc)
    thruBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.Glow.SetThru (không phải GL.thru)
        sơn()
        nếu D.hubStatus thì
            flash(D.hubStatus, GL.thru và "👁 Thông Tường: thấy mình sáng qua vật cản"
                 hoặc "👁 chỉ sáng khi không bị vật cản", 2, C.ACCENT)
        kết thúc
    kết thúc)
    litBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.Glow.SetLight (không phải GL.light)
        sơn()
        nếu D.hubStatus thì
            flash(D.hubStatus, GL.light và "💡 đèn thật: toả sáng xung quanh người, không bị vật cản"
                 hoặc "💡 đã tắt đèn (chỉ còn sáng nhân vật)", 2, C.ACCENT)
        kết thúc
    kết thúc)
    colBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local nm = S.Glow.CycleColor()
        sơn()
        nếu D.hubStatus thì flash(D.hubStatus, "🎨 màu phát sáng: " .. nm, 1.8, C.ACCENT) end
    kết thúc)
    applyBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local w = tonumber(tostring(wIn.Text or ""):match("%-?%d+%.?%d*"))
        local b = tonumber(tostring(bIn.Text or ""):match("%-?%d+%.?%d*"))
        nếu w thì S.Glow.SetWidth(w) end
        nếu b thì S.Glow.SetBright(b) kết thúc
        if not GL.on then S.Glow.Set(true) end -- ứng dụng được bật luôn phải nhấn 2 lần
        sơn()
        if D.hubStatus then flash(D.hubStatus, S.Glow.Status(), 2, C.ACCENT) end
        pcall(S.Rebuild)
    kết thúc)
    stopBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.Glow.Stop()
        sơn()
        if D.hubStatus then flash(D.hubStatus, "🚫 " .. S.Glow.Status(), 1.8, C.ACCENT) end
        pcall(S.Rebuild)
    kết thúc)
    sơn()
kết thúc

--------- KHUNG 🛡 BAY AN TOÀN (trên cùng danh sách thẻ, dưới ⚙ và ✨) ----------
LÀM
    Độ pH cục bộ = 200
    cục bộ P = New("Khung", {
        Tên = "HubSafe_Panel",
        Kích thước = UDim2.new(1, 0, 0, PH), Thứ tự bố cục = 2,
        BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.12, BorderSizePixel = 0, ZIndex = 6,
    }, D.hubList)
    Góc(P, UDim.new(0, 10))
    Stroke(P, C.HAIRLINE, 1)
    D.Shade(P, Color3.fromRGB(255, 255, 255), Color3.fromRGB(188, 192, 205), 90)

    Mới("TextLabel", {
        Tên = "SafeTitle",
        Kích thước = UDim2.new(1, -16, 0, 14), Vị trí = UDim2.new(0, 8, 0, 4),
        Text = "🛡 BAY AN TOÀN (tự bay + né vật có dấu hiệu chuyển)", BackgroundTransparency = 1,
        TextColor3 = C.ACCENT, Phông chữ = Enum.Font.GothamBold, TextSize = 10,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)

    hàm cục bộ act(txt, x, y, w, color, name)
        cục bộ b = New("TextButton", {
            Tên = tên hoặc "SafeBtn",
            Kích thước = UDim2.new(0, w, 0, 20), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = txt, Màu nền 3 = màu, Màu văn bản 3 = D.BestText(màu),
            Font = Enum.Font.GothamBold, TextSize = 9, BorderSizePixel = 0, ZIndex = 8,
        }, P)
        Góc(b, UDim.new(0, 6))
        D.Shade(b, Color3.fromRGB(255, 255, 255), Color3.fromRGB(182, 187, 201), 90)
        D.Cảm giác xúc giác (b, 0,08)
        trả lại b
    kết thúc
    hàm cục bộ lab(txt, x, y, w)
        Mới("TextLabel", {
            Kích thước = UDim2.new(0, w, 0, 20), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = txt, Độ trong suốt nền = 1, Màu chữ 3 = C.MUTED,
            Phông chữ = Enum.Font.GothamMedium, Kích thước chữ = 9,
            TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
        }, P)
    kết thúc
    hàm cục bộ box(x, y, w, val)
        local b = New("TextBox", {
            Kích thước = UDim2.new(0, w, 0, 20), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = tostring(val), Xóa văn bản khi tập trung = false,
            BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.1, TextColor3 = C.DARK,
            PlaceholderColor3 = C.GRAY, Font = Enum.Font.GothamMedium, TextSize = 9,
            TextXAlignment = Enum.TextXAlignment.Center, BorderSizePixel = 0, ZIndex = 7,
        }, P)
        Góc(b, UDim.new(0, 6))
        trả lại b
    kết thúc

    local onBtn = act("🛡 BẬT", 8, 22, 92, C.GRAY, "SafeOn")
    phòng thí nghiệm ("📏 Né", 104, 22, 30)
    local radIn = box(132, 22, 44, 25)
    phòng thí nghiệm ("💨 Vịnh", 180, 22, 36)
    local spdIn = box(216, 22, 44, 60)
    lab("🌀 Gắt", 264, 22, 32)
    strIn cục bộ = hộp (296, 22, 38, 4)

    local autoBtn = act("➡ Tự bay: BẬT", 8, 48, 96, C.GREEN, "SafeAuto")
    local shBtn = act("🔲 Khiên: BẬT", 108, 48, 82, C.GREEN, "SafeShield")
    local plBtn = act("👤 Né người: BẬT", 194, 48, 92, C.GREEN, "SafePlayers")
    local ncBtn = act("🧱 Xuyên: BẬT", 290, 48, 44, C.GREEN, "SafeNoclip")

    local ciBtn = act("⭕ Vòng tròn: BẬT", 8, 74, 104, C.GREEN, "SafeCircle")
    lab("⭕ Bán kính", 116, 74, 48)
    local cirIn = box(166, 74, 40, 20)
    lab("👁 Nhìn trước", 210, 74, 54)
    local lookIn = box(266, 74, 34, 1)
    phòng thí nghiệm ("v", 302, 74, 30)

    local applyBtn = act(" ✔ Áp dụng", 8, 100, 84, C.SURFACE3, "SafeApply")
    local stopBtn = act("🚫", 98, 100, 50, C.RED, "SafeStop")
    lab("🔲 Cỡ", 154, 100, 32)
    szIn cục bộ = hộp (188, 100, 34, 0)
    lab("(0 = auto)", 224, 100, 40)
    hudBtn cục bộ = act("📱 Nút ảo: BẬT", 268, 100, 86, C.GREEN, "SafeHud")
    local statusLbl = New("TextLabel", {
        Tên = "SafeStatus",
        Kích thước = UDim2.new(1, -16, 0, 20), Vị trí = UDim2.new(0, 8, 0, 124),
        Văn bản = "", Độ trong suốt nền = 1, Màu văn bản 3 = C.MUTED,
        Font = Enum.Font.GothamMedium, TextSize = 8, TextWrapped = true,
        TextXAlignment = Enum.TextXAlignment.Left, TextYAlignment = Enum.TextYAlignment.Top, ZIndex = 7,
    }, P)
    Mới("TextLabel", {
        Tên = "SafeNote",
        Kích thước = UDim2.new(1, -16, 0, 48), Vị trí = UDim2.new(0, 8, 0, 148),
        Text = "💡 🔲 Khiên = bức tường trong hình vuông ÔM QUANH nhân vật (cỡ hợp lý; muốn/nhỏ "
             .. "thì chỉnh ô 🔲 Cỡ — 0 = tự động. 📏 Né chỉ là khoảng cách né, không kéo dài giãn) · "
             .. "👤 Né người = coi NGƯỜI CHƠI khác là mối nguy dù họ đứng yên · 🧱 Xuyên = tự bật Xuyên "
             .. "Tường để thúc đẩy bạn QUÁ vật cản, tắt 🛡 là trả lại như cũ. ⭕ Vòng tròn = khi KHÔNG "
             .. "có ai/vật nào đang lao tới mình thì tự bay vòng quanh phòng đang đứng (bán kính "
             .. "chỉnh ở ô ⭕), đang né hoặc đang nhấn WASD/joystick virtual thì TẠM DỪNG, né xong tự động quay lại."
             .. "👁 Nhìn trước = quét xa 📏 × 1,6 và bắt vật ĐANG LAO TỚI từ ngoài tầm. 📱 Nút ảo = joystick "
             .. "kéo + ⬆⬇ giữ để lên/xuống, hiện khi 🛡 BẬT. 🛡 tự sống qua hồi sinh / hết trận sang trận mới.",

        BackgroundTransparency = 1, TextColor3 = C.MUTED,
        Font = Enum.Font.GothamMedium, TextSize = 8, TextWrapped = true,
        TextXAlignment = Enum.TextXAlignment.Left, TextYAlignment = Enum.TextYAlignment.Top, ZIndex = 7,
    }, P)

    hàm cục bộ paint()
        onBtn.Text = MV.Safe.on và "🛡 TẮT" hoặc "🛡 BẬT"
        onBtn.BackgroundColor3 = MV.Safe.on và C.GREEN hoặc C.GRAY
        onBtn.TextColor3 = D.BestText(onBtn.BackgroundColor3)
        autoBtn.Text = MV.Safe.auto và "➡ Tự bay: BẬT" hoặc "➡ Tự bay: TẮT"
        autoBtn.BackgroundColor3 = MV.Safe.auto và C.GREEN hoặc C.SURFACE3
        autoBtn.TextColor3 = D.BestText(autoBtn.BackgroundColor3)
        shBtn.Text = MV.Safe.shield và "🔲 Khiên: BẬT" hoặc "🔲 Khiên: TẮT"
        shBtn.BackgroundColor3 = MV.Safe.shield và C.GREEN hoặc C.SURFACE3
        shBtn.TextColor3 = D.BestText(shBtn.BackgroundColor3)
        plBtn.Text = MV.Safe.avoidPlayers và "👤 Né người: BẬT" hoặc "👤 Né người: TẮT"
        plBtn.BackgroundColor3 = MV.Safe.avoidPlayers and C.GREEN or C.SURFACE3
        plBtn.TextColor3 = D.BestText(plBtn.BackgroundColor3)
        ncBtn.Text = MV.Safe.noclip và "🧱 Xuyên: BẬT" hoặc "🧱 Xuyên: TẮT"
        ncBtn.BackgroundColor3 = MV.Safe.noclip and C.GREEN or C.SURFACE3
        ncBtn.TextColor3 = D.BestText(ncBtn.BackgroundColor3)
        ciBtn.Text = MV.Safe.circle và "⭕ Vòng tròn: BẬT" hoặc "⭕ Vòng tròn: TẮT"
        ciBtn.BackgroundColor3 = MV.Safe.circle and C.GREEN or C.SURFACE3
        ciBtn.TextColor3 = D.BestText(ciBtn.BackgroundColor3)
        hudBtn.Text = MV.Safe.showHud và "📱 Nút ảo: BẬT" hoặc "📱 Nút ảo: TẮT"
        hudBtn.BackgroundColor3 = MV.Safe.showHud và C.GREEN hoặc C.SURFACE3
        hudBtn.TextColor3 = D.BestText(hudBtn.BackgroundColor3)
        radIn.Text, spdIn.Text, strIn.Text =
            tostring(MV.Safe.radius), tostring(MV.Safe.speed), tostring(MV.Safe.steer)
        cirIn.Text, lookIn.Text = tostring(MV.Safe.circleR), tostring(MV.Safe.lookTime)
        szIn.Text = tostring(MV.Safe.shieldSize)
        statusLbl.Text = MV.Safe.Status()
        statusLbl.TextColor3 = ((MV.Safe.threats or 0) > 0) and C.YELLOW or C.MUTED
    kết thúc
    S.SyncSafePanel = sơn
    MV.Safe.RefreshPanel = sơn

    onBtn.Activated:Connect(function()
        ReleaseHubFocus()
        MV.Safe.Set(not MV.Safe.on)
        sơn()
        if D.hubStatus then flash(D.hubStatus, MV.Safe.Status(), 2.2, C.ACCENT) end
        pcall(S.Rebuild)
    kết thúc)
    autoBtn.Activated:Connect(function()
        ReleaseHubFocus()
        MV.Safe.SetAuto(not MV.Safe.auto)
        sơn()
        nếu D.hubStatus thì
            flash(D.hubStatus, MV.Safe.auto và "➡ auto bay: không nhấn gì vẫn bay theo camera hướng"
                 hoặc "➡ auto TẮT: bay chỉ khi nhấn WASD (nhưng vẫn tự động tắt)", 2, C.ACCENT)
        kết thúc
    kết thúc)
    shBtn.Activated:Connect(function()
        ReleaseHubFocus()
        MV.Safe.SetShield(not MV.Safe.shield)
        sơn()
        nếu D.hubStatus thì
            flash(D.hubStatus, MV.Safe.shield và ("🔲 trong suốt hình vuông: BẬT · "
                 .. string.format("%gm/c%s", MV.Safe.ShieldHalf() * ​​2,
                      (tonumber(MV.Safe.shieldSize) hoặc 0) > 0 và " (chỉnh tay)" hoặc " (tự động)"))
                 hoặc "🔲 đã ẩn sâu (vẫn né y như cũ)", 2, C.ACCENT)
        kết thúc
    kết thúc)
    plBtn.Activated:Connect(function()
        ReleaseHubFocus()
        MV.Safe.SetAvoidPlayers(not MV.Safe.avoidPlayers)
        sơn()
        nếu D.hubStatus thì
            flash(D.hubStatus, MV.Safe.avoidPlayers và "👤 coi NGƯỜI CHƠI khác là mối nguy (né dù họ đứng yên)"
                 hoặc "👤 đã bỏ qua người chơi (chỉ né vật chuyển động)", 2, C.ACCENT)
        kết thúc
    kết thúc)
    ncBtn.Activated:Connect(function()
        ReleaseHubFocus()
        MV.Safe.SetNoclipAuto(not MV.Safe.noclip)
        sơn()
        nếu D.hubStatus thì
            flash(D.hubStatus, MV.Safe.noclip và "🧱 lực Đưa cho bạn XUYÊN QUA vật cản (Xuyên Tường tự bật)"
                 hoặc "🧱 đã trả Xuyên Tường về như trước", 2, C.ACCENT)
        kết thúc
    kết thúc)
    ciBtn.Activated:Connect(function()
        ReleaseHubFocus()
        MV.Safe.SetCircle(not MV.Safe.circle)
        sơn()
        nếu D.hubStatus thì
            flash(D.hubStatus, MV.Safe.circle và ("⭕ không có gì lao tới mình -> tự bay VÒNG TRÒN bán kính " .. tostring(math.floor(MV.Safe.circleR + 0.5)) .. "m")
                 hoặc "⭕ đã tắt vòng tròn (chỉ bay theo hướng nhìn)", 2, C.ACCENT)
        kết thúc
    kết thúc)
    applyBtn.Activated:Connect(function()
        ReleaseHubFocus()
        MV.Safe.SetRadius(tonumber(tostring(radIn.Text or ""):match("%-?%d+%.?%d*")) or MV.Safe.radius)
        MV.Safe.SetSpeed(tonumber(tostring(spdIn.Text or ""):match("%-?%d+%.?%d*")) or MV.Safe.speed)
        MV.Safe.SetSteer(tonumber(tostring(strIn.Text or ""):match("%-?%d+%.?%d*")) or MV.Safe.steer)
        MV.Safe.SetCircleR(tonumber(tostring(cirIn.Text or ""):match("%-?%d+%.?%d*")) or MV.Safe.circleR)
        MV.Safe.SetLook(tonumber(tostring(lookIn.Text or ""):match("%-?%d+%.?%d*")) or MV.Safe.lookTime)
        MV.Safe.SetShieldSize(tonumber(tostring(szIn.Text or ""):match("%-?%d+%.?%d*")) or MV.Safe.shieldSize)
        nếu không phải MV.Safe.on thì MV.Safe.Set(true) end -- ứng dụng được bật luôn
        sơn()
        if D.hubStatus then flash(D.hubStatus, MV.Safe.Status(), 2.4, C.ACCENT) end
        pcall(S.Rebuild)
    kết thúc)
    stopBtn.Activated:Connect(function()
        ReleaseHubFocus()
        MV.Safe.Stop()
        sơn()
        if D.hubStatus then flash(D.hubStatus, "🚫 " .. MV.Safe.Status(), 1.8, C.ACCENT) end
        pcall(S.Rebuild)
    kết thúc)
    hudBtn.Activated:Connect(function()
        ReleaseHubFocus()
        MV.Safe.SetShowHud(not MV.Safe.showHud)
        sơn()
        nếu D.hubStatus thì
            flash(D.hubStatus, MV.Safe.showHud và "📱 nút ảo 🛡: BẬT — hiện cần điều khiển + ⬆⬇ khi 🛡 đang bật"
                 hoặc "📱 nút ảo 🛡: TẮT — đã ẩn cụm nút nổi", 1.8, C.ACCENT)
        kết thúc
    kết thúc)
    sơn()
kết thúc

--------- TỰ LÀM MỚI 2 DANH SÁCH TRỌNG MENU (📍 + 👣) ----------
LÀM
    gia tốc cục bộ = 0
    RunService:BindToRenderStep("BC_HubList", Enum.RenderPriority.Camera.Value - 4, hàm(dt)
        acc = acc + (tonumber(dt) hoặc 0,016)
        nếu acc < 2 thì trả về end
        gia tốc = 0
        pcall(function()
            cục bộ hiển thị = false
            local function open(t) if t and t.Visible == true then return true end return false end
            nếu mở(D.playerTab) hoặc mở(D.hubTab) thì hiển thị = true
            nếu không nhìn thấy thì trả về end
            nếu S.Loc.RefreshList thì S.Loc.RefreshList() kết thúc
            nếu S.Spec.RefreshList thì S.Spec.RefreshList() kết thúc
        kết thúc)
    kết thúc)
kết thúc

--------- KHUNG 👣 XEM NGƯỜI CHƠI (ngay dưới khung 📍 trong trang 👥 NGƯỜI CHƠI) -------
LÀM
    Độ pH cục bộ = 262
    cục bộ P = New("Khung", {
        Tên = "HubSpec_Panel",
        Kích thước = UDim2.new(1, -16, 0, PH),
        Vị trí = UDim2.new(0, 8, 0, D.playerY hoặc 46),
        LayoutOrder = 2,
        BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.12, BorderSizePixel = 0, ZIndex = 6,
    }, D.playerTab)
    D.playerY = (D.playerY hoặc 46) + PH + 8
    Góc(P, UDim.new(0, 10))
    Stroke(P, C.HAIRLINE, 1)
    D.Shade(P, Color3.fromRGB(255, 255, 255), Color3.fromRGB(188, 192, 205), 90)

    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 14), Vị trí = UDim2.new(0, 8, 0, 4),
        Text = "👣 XEM NGƯỜI CHƠI (bám theo — xem họ đang làm gì)", BackgroundTransparency = 1,
        TextColor3 = C.ACCENT, Phông chữ = Enum.Font.GothamBold, TextSize = 10,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)

    hàm cục bộ act(txt, x, y, w, color)
        cục bộ b = New("TextButton", {
            Kích thước = UDim2.new(0, w, 0, 20), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = txt, Màu nền 3 = màu, Màu văn bản 3 = D.BestText(màu),
            Font = Enum.Font.GothamBold, TextSize = 9, BorderSizePixel = 0, ZIndex = 8,
        }, P)
        Góc(b, UDim.new(0, 6))
        D.Shade(b, Color3.fromRGB(255, 255, 255), Color3.fromRGB(182, 187, 201), 90)
        D.Cảm giác xúc giác (b, 0,08)
        trả lại b
    kết thúc
    hàm cục bộ lab(txt, x, y, w)
        Mới("TextLabel", {
            Kích thước = UDim2.new(0, w, 0, 20), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = txt, Độ trong suốt nền = 1, Màu chữ 3 = C.MUTED,
            Phông chữ = Enum.Font.GothamMedium, Kích thước chữ = 9,
            TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
        }, P)
    kết thúc

    local watchBtn = act("👣 Bám theo", 8, 22, 106, C.GRAY)
    local followBtn = act("🎥 Bám: BẬT", 120, 22, 96, C.GREEN)
    local autoBtn = act("🔄Tự chuyển", 222, 22, 66, C.GRAY)

    phòng thí nghiệm ("📏", 8, 48, 14)
    local distIn = New("TextBox", {
        Kích thước = UDim2.new(0, 44, 0, 20), Vị trí = UDim2.new(0, 22, 0, 48),
        Văn bản = "12", Xóa văn bản khi tập trung = false,
        BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.1, TextColor3 = C.DARK,
        PlaceholderColor3 = C.GRAY, Font = Enum.Font.GothamMedium, TextSize = 9,
        TextXAlignment = Enum.TextXAlignment.Center, BorderSizePixel = 0, ZIndex = 7,
    }, P)
    Góc(distIn, UDim.new(0, 6))
    lab("m · ⬆", 70, 48, 30)
    local hiIn = New("TextBox", {
        Kích thước = UDim2.new(0, 44, 0, 20), Vị trí = UDim2.new(0, 100, 0, 48),
        Văn bản = "3.2", Xóa văn bản khi tập trung = false,
        BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.1, TextColor3 = C.DARK,
        PlaceholderColor3 = C.GRAY, Font = Enum.Font.GothamMedium, TextSize = 9,
        TextXAlignment = Enum.TextXAlignment.Center, BorderSizePixel = 0, ZIndex = 7,
    }, P)
    Góc(hiIn, UDim.new(0, 6))
    local applyBtn = act(" ✔ Áp dụng", 150, 48, 70, C.SURFACE3)
    lab("🚫 Dừng", 226, 48, 62)

    local searchIn = New("TextBox", {
        Kích thước = UDim2.new(1, -16, 0, 22), Vị trí = UDim2.new(0, 8, 0, 72),
        Text = "", PlaceholderText = "🔍 Tìm tên người chơi...", ClearTextOnFocus = false,
        PlaceholderColor3 = C.GRAY, BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.1,
        TextColor3 = C.DARK, Font = Enum.Font.GothamMedium, TextSize = 9,
        TextXAlignment = Enum.TextXAlignment.Left, BorderSizePixel = 0, ZIndex = 7,
    }, P)
    Góc(searchIn, UDim.new(0, 6))
    New("UIPadding", { PaddingLeft = UDim.new(0, 6) }, searchIn)

    danh sách cục bộ = New("ScrollingFrame", {
        Tên = "SpecList", Kích thước = UDim2.new(1, -16, 0, 130), Vị trí = UDim2.new(0, 8, 0, 98),
        BackgroundTransparency = 1, BorderSizePixel = 0, ScrollBarThickness = 4,
        CanvasSize = UDim2.new(0, 0, 0, 0), ZIndex = 7,
    }, P)
    New("UIListLayout", { Padding = UDim.new(0, 4), SortOrder = Enum.SortOrder.LayoutOrder }, list)

    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 30), Vị trí = UDim2.new(0, 8, 0, 230),
        Text = "💡 Bấm TÊN = bám theo xem họ đang làm gì (video chạy trong mắt bạn) "
             .. "Chỉ ĐỔI CAMERA — nhân vật bạn không bị dịch chuyển; 🚫 Dừng trả camera về ngay.",
        TextWrapped = true, BackgroundTransparency = 1, TextColor3 = C.MUTED,
        Font = Enum.Font.GothamMedium, TextSize = 8, TextXAlignment = Enum.TextXAlignment.Left,
        TextYAlignment = Enum.TextYAlignment.Top, ZIndex = 7,
    }, P)

    hàm cục bộ paint()
        local nm = (SP.on and SP.target) and tostring(SP.target.Name) or nil
        watchBtn.Text = nm và ("👣 ".. nm) hoặc "👣 Bám theo"
        watchBtn.BackgroundColor3 = SP.on và C.GREEN hoặc C.GRAY
        watchBtn.TextColor3 = D.BestText(watchBtn.BackgroundColor3)
        followBtn.Text = SP.follow và "🎥 Bám: BẬT" hoặc "🎥 Bám: TẮT"
        followBtn.BackgroundColor3 = SP.follow và C.GREEN hoặc C.SURFACE3
        followBtn.TextColor3 = D.BestText(followBtn.BackgroundColor3)
        autoBtn.BackgroundColor3 = SP.auto và C.PURPLE hoặc C.SURFACE3
        autoBtn.TextColor3 = D.BestText(autoBtn.BackgroundColor3)
        distIn.Text, hiIn.Text = tostring(SP.dist), tostring(SP.height)
    kết thúc

    S.Spec.RefreshList = function()
        nếu không phải (list và list.Parent) thì trả về end
        for _, c in ipairs(list:GetChildren()) do
            if not c:IsA("UIListLayout") then pcall(function() c:Destroy() end) end
        kết thúc
        thuật ngữ cục bộ = tostring(searchIn.Text hoặc ""):lower()
        thứ tự cục bộ = 0
        local ok, players = pcall(function() return Players:GetPlayers() end)
        Nếu không ổn hoặc không phải người chơi thì hãy trả lại.
        for _, p in ipairs(players) do
            nếu p ~= người chơi thì
                local nm = tostring(p.Name)
                if term == "" or nm:lower():find(term, 1, true) then
                    đơn hàng = đơn hàng + 1
                    cục bộ c, r, h = S.Loc.CharOf(p)
                    local fr, down = S.Loc.IsFriend(p), S.Loc.IsDown(h)
                    local col = down and Color3.fromRGB(255, 100, 100)
                             hoặc (fr và Color3.fromRGB(255, 182, 193) hoặc C.DARK)
                    hàng cục bộ = New("Khung", {
                        Kích thước = UDim2.new(1, 0, 0, 26), Thứ tự bố cục = thứ tự,
                        BackgroundColor3 = (SP.target == p) và C.SURFACE3 hoặc C.SURFACE2,
                        BackgroundTransparency = (SP.target == p) và 0.05 hoặc 0.25,
                        BorderSizePixel = 0, ZIndex = 8,
                    }, danh sách)
                    Góc(hàng, UDim.new(0, 6))
                    cục bộ con = {}
                    if fr then sub[#sub + 1] = "💗" end
                    nếu xuống thì sub[#sub + 1] = "☠️" kết thúc
                    nếu c thì
                        sub[#sub + 1] = (h and string.format("❤️%d", spRound(h.Health or 0)) or "❤️?")
                    khác
                        sub[#sub + 1] = "⏳ chờ nhân vật"
                    kết thúc
                    cục bộ b = New("TextButton", {
                        Kích thước = UDim2.new(1, -74, 1, 0), Vị trí = UDim2.new(0, 6, 0, 0),
                        Văn bản = (SP.target == p và "👣 " hoặc "") .. nm .. " " .. table.concat(sub, " "),
                        BackgroundTransparency = 1, TextColor3 = col,
                        Phông chữ = Enum.Font.GothamBold, Kích thước chữ = 9,
                        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 9,
                    }, hàng ngang)
                    b.Đã kích hoạt:Kết nối(function())
                        ReleaseHubFocus()
                        pcall(function() S.Loc.SetTarget(p) end) -- vừa định vị phù hợp
                        S.Spec.Set(p)
                        pcall(function() S.Loc.RefreshList() end)
                        sơn()
                        nếu S.Spec.RefreshList thì S.Spec.RefreshList() kết thúc
                        pcall(S.Rebuild)
                    kết thúc)
                    local d = S.Loc.Dist(p)
                    Mới("TextLabel", {
                        Kích thước = UDim2.new(0, 66, 1, 0), Vị trí = UDim2.new(1, -68, 0, 0),
                        Văn bản = d và ("📏 " .. spRound(d) .. "m") hoặc "📏 --m",
                        BackgroundTransparency = 1, TextColor3 = C.MUTED,
                        Phông chữ = Enum.Font.GothamMedium, Kích thước chữ = 9,
                        TextXAlignment = Enum.TextXAlignment.Right, ZIndex = 9,
                    }, hàng ngang)
                kết thúc
            kết thúc
        kết thúc
        pcall(function() list.CanvasSize = UDim2.new(0, 0, 0, order * 30) end)
        sơn()
    kết thúc

    watchBtn.Activated:Connect(function()
        ReleaseHubFocus()
        nếu SP.on thì
            S.Spec.Stop()
        khác
            local p = SP.target or S.Loc.target or S.Loc.Nearest()
            nếu không phải p thì
                if D.hubStatus thì flash(D.hubStatus, "⚠️ chưa có ai để xem (server chỉ có mình bạn)", 2, C.RED) end
            khác
                S.Loc.SetTarget(p)
                S.Spec.Set(p)
            kết thúc
        kết thúc
        sơn()
        nếu S.Spec.RefreshList thì S.Spec.RefreshList() kết thúc
        pcall(function() S.Loc.RefreshList() end)
        pcall(S.Rebuild)
        if D.hubStatus then flash(D.hubStatus, S.Spec.Status(), 2, C.ACCENT) end
    kết thúc)
    followBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.Spec.SetFollow(not SP.follow)
        sơn()
        if D.hubStatus thì flash(D.hubStatus, SP.follow và "🎥 camera theo người đang xem" hoặc "🎥 đã trả camera về cho bạn (vẫn xem được bảng 👣)", 2, C.ACCENT) end
    kết thúc)
    autoBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.Spec.SetAuto(not SP.auto)
        sơn()
        if D.hubStatus thì flash(D.hubStatus, SP.auto và "🔄 người đang xem thoát -> tự chuyển người gần nhất" hoặc "🔄 đã tắt tự động chuyển", 2, C.ACCENT) end
    kết thúc)
    applyBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local d = tonumber(tostring(distIn.Text or ""):match("%-?%d+%.?%d*")) or SP.dist
        local hh = tonumber(tostring(hiIn.Text or ""):match("%-?%d+%.?%d*")) or SP.height
        S.Spec.SetDist(d); S.Spec.SetHeight(hh)
        sơn()
        if D.hubStatus then flash(D.hubStatus, string.format("📏 camera: lùi %gm · cao %gm", SP.dist, SP.height), 1.8, C.ACCENT) end
    kết thúc)
    local stopBtn2 = New("TextButton", {
        Kích thước = UDim2.new(0, 108, 0, 20), Vị trí = UDim2.new(1, -116, 0, 48),
        Văn bản = "🚫 xem", BackgroundColor3 = C.RED, TextColor3 = D.BestText(C.RED),
        Font = Enum.Font.GothamBold, TextSize = 9, BorderSizePixel = 0, ZIndex = 8,
    }, P)
    Góc(stopBtn2, UDim.new(0, 6))
    D.Tactile(stopBtn2, 0.1)
    stopBtn2.Activated:Connect(function()
        ReleaseHubFocus()
        S.Spec.Stop()
        sơn()
        nếu S.Spec.RefreshList thì S.Spec.RefreshList() kết thúc
        pcall(S.Rebuild)
        if D.hubStatus then flash(D.hubStatus, "🚫 " .. S.Spec.Status(), 2, C.ACCENT) end
    kết thúc)
    pcall(function() end)
    sơn()
    if S.Spec.RefreshList then pcall(S.Spec.RefreshList) end
    pcall(function()
        if D.playerTab then D.playerTab.CanvasSize = UDim2.new(0, 0, 0, (D.playerY or 600) + 16) end
    kết thúc)
kết thúc

--------- KHUNG 🧱 ĐẶT KÍNH & 🚀 BAY TỚI KÍNH (trong trang 👥 NGƯỜI CHƠI) ----------
LÀM
    Độ pH cục bộ = 380
    cục bộ P = New("Khung", {
        Tên = "HubGlass_Panel",
        Kích thước = UDim2.new(1, -16, 0, PH),
        Vị trí = UDim2.new(0, 8, 0, D.playerY hoặc 46),
        LayoutOrder = 3,
        BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.12, BorderSizePixel = 0, ZIndex = 6,
    }, D.playerTab)
    D.playerY = (D.playerY hoặc 46) + PH + 8
    Góc(P, UDim.new(0, 10))
    Stroke(P, C.HAIRLINE, 1)
    D.Shade(P, Color3.fromRGB(255, 255, 255), Color3.fromRGB(188, 192, 205), 90)

    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 14), Vị trí = UDim2.new(0, 8, 0, 4),
        Text = "🧱 ĐẶT KÍNH & 🚀 BAY TỚI KÍNH (nhiều tấm, chỉnh tốc độ bay)",
        BackgroundTransparency = 1, TextColor3 = C.ACCENT,
        Phông chữ = Enum.Font.GothamBold, Kích thước chữ = 10,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)

    hàm cục bộ act(txt, x, y, w, color)
        cục bộ b = New("TextButton", {
            Kích thước = UDim2.new(0, w, 0, 20), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = txt, Màu nền 3 = màu, Màu văn bản 3 = D.BestText(màu),
            Font = Enum.Font.GothamBold, TextSize = 9, BorderSizePixel = 0, ZIndex = 8,
        }, P)
        Góc(b, UDim.new(0, 6))
        D.Shade(b, Color3.fromRGB(255, 255, 255), Color3.fromRGB(182, 187, 201), 90)
        D.Cảm giác xúc giác (b, 0,08)
        trả lại b
    kết thúc

    local placeBtn = Act("🧱 Đặt 1 Tấm", 8, 22, 84, C.BLUE)
    local clearBtn = act("🧹 Xóa Hết", 98, 22, 74, C.RED)
    local autoBtn = act("🔄Tự: TẮT", 178, 22, 76, C.GRAY)
    local tpNearBtn = act("📍 Tới Gần", 260, 22, 70, C.SURFACE3)
    local flyNearBtn = act("🚀 Bay", 336, 22, 70, C.PURPLE)

    local statusLbl = New("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 18), Vị trí = UDim2.new(0, 8, 0, 46),
        Văn bản = "🧱 0 tấm", Độ trong suốt nền = 1, Màu chữ 3 = C.MUTED,
        Phông chữ = Enum.Font.GothamMedium, Kích thước chữ = 9,
        TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)

    Mới("TextLabel", {
        Kích thước = UDim2.new(0, 70, 0, 20), Vị trí = UDim2.new(0, 8, 0, 66),
        Text = "🚀 Tốc độ bay tới kính:", BackgroundTransparency = 1, TextColor3 = C.MUTED,
        Font = Enum.Font.GothamMedium, TextSize = 9, TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
    }, P)
    local speedIn = New("TextBox", {
        Kích thước = UDim2.new(0, 50, 0, 20), Vị trí = UDim2.new(0, 130, 0, 66),
        Văn bản = tostring(S.Move.glassFlySpeed ​​hoặc 60), Xóa văn bản khi tập trung = false,
        BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.1, TextColor3 = C.DARK,
        PlaceholderColor3 = C.GRAY, Font = Enum.Font.GothamMedium, TextSize = 9,
        TextXAlignment = Enum.TextXAlignment.Center, BorderSizePixel = 0, ZIndex = 7,
    }, P)
    Góc(speedIn, UDim.new(0, 6))
    local applySpeedBtn = act(" ✔ Áp dụng tốc độ", 186, 66, 110, C.GREEN)
    local stopFlyBtn = Act("⏹ Dừng bay", 302, 66, 70, C.RED)

    local searchIn = New("TextBox", {
        Kích thước = UDim2.new(1, -16, 0, 22), Vị trí = UDim2.new(0, 8, 0, 90),
        Text = "", PlaceholderText = "🔍 Lọc kính (tên / tọa độ)...", ClearTextOnFocus = false,
        PlaceholderColor3 = C.GRAY, BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.1,
        TextColor3 = C.DARK, Font = Enum.Font.GothamMedium, TextSize = 9,
        TextXAlignment = Enum.TextXAlignment.Left, BorderSizePixel = 0, ZIndex = 7,
    }, P)
    Góc(searchIn, UDim.new(0, 6))
    New("UIPadding", { PaddingLeft = UDim.new(0, 6) }, searchIn)

    danh sách cục bộ = New("ScrollingFrame", {
        Tên = "GlassList", Kích thước = UDim2.new(1, -16, 0, 210), Vị trí = UDim2.new(0, 8, 0, 116),
        BackgroundTransparency = 1, BorderSizePixel = 0, ScrollBarThickness = 4,
        CanvasSize = UDim2.new(0, 0, 0, 0), ZIndex = 7,
    }, P)
    New("UIListLayout", { Padding = UDim.new(0, 4), SortOrder = Enum.SortOrder.LayoutOrder }, list)

    Mới("TextLabel", {
        Kích thước = UDim2.new(1, -16, 0, 48), Vị trí = UDim2.new(0, 8, 0, 330),
        Text = "💡 🧱 Đặt = đặt 1 tấm kính CỐ ĐỊNH dưới chân (nhiều tấm thành cầu/thang). "
             .. "🚀 Bay tới = bay mượt tới kính (chỉ tốc độ ở ô trên). "
             .. "📍 = tới ngay (dịch chuyển). Danh sách dưới đây tất cả kính — 🗑 xóa lẻ, 📍 tới ngay, 🚀 bay tới.",
        TextWrapped = true, BackgroundTransparency = 1, TextColor3 = C.MUTED,
        Phông chữ = Enum.Font.GothamMedium, Kích thước chữ = 8,
        TextXAlignment = Enum.TextXAlignment.Left, TextYAlignment = Enum.TextYAlignment.Top, ZIndex = 7,
    }, P)

    hàm cục bộ paint()
        local cnt = S.Move._placedGlasses and #S.Move._placedGlasses or 0
        local flyOn = S.Move._glassFlyActive and (" · 🚀 đang bay tới kính " .. tostring(S.Move._glassFlyIdx or "?") .. " tốc độ " .. tostring(S.Move.glassFlySpeed ​​or 60)) or ""
        statusLbl.Text = string.format("🧱 %d tấm kính đã đặt%s%s", cnt, (S.Move.autoGlass và " · 🔄 tự đặt BẬT" hoặc ""), flyOn)
        autoBtn.Text = S.Move.autoGlass và "🔄 Tự: BẬT" hoặc "🔄 Tự: TẮT"
        autoBtn.BackgroundColor3 = S.Move.autoGlass và C.GREEN hoặc C.GRAY
        autoBtn.TextColor3 = D.BestText(autoBtn.BackgroundColor3)
        placeBtn.Text = cnt > 0 và ("🧱 Đặt (" .. cnt .. ")") hoặc "🧱 Đặt 1 Tấm"
        clearBtn.Text = cnt > 0 và ("🧹 ​​Xóa Hết (".. cnt ..")") hoặc "🧹 Xóa Hết"
        if speedIn then speedIn.Text = tostring(S.Move.glassFlySpeed ​​or 60) end
    kết thúc

    hàm cục bộ refreshGlassList()
        nếu không phải (list và list.Parent) thì trả về end
        for _, c in ipairs(list:GetChildren()) do
            if not c:IsA("UIListLayout") then pcall(function() c:Destroy() end) end
        kết thúc
        thuật ngữ cục bộ = tostring(searchIn.Text hoặc ""):lower()
        local glasses = S.Move.GetPlacedGlasses and S.Move.GetPlacedGlasses() or {}
        thứ tự cục bộ = 0
        local myRoot = S.Move.Root and S.Move.Root()
        local myPos = myRoot and myRoot.Position or nil
        for _, g in ipairs(glasses) do
            local txt = string.format("%s (%.0f, %.0f, %.0f)", g.name, gx, gy, gz)
            nếu term == "" hoặc txt:lower():find(term, 1, true) hoặc g.name:lower():find(term, 1, true) thì
                đơn hàng = đơn hàng + 1
                local distStr = ""
                nếu myPos thì
                    local dx = gx - myPos.X
                    local dz = gz - myPos.Z
                    local d = math.sqrt(dx*dx + dz*dz)
                    distStr = string.format("📏 %dm", math.floor(d+0.5))
                kết thúc
                hàng cục bộ = New("Khung", {
                    Kích thước = UDim2.new(1, 0, 0, 28), Thứ tự bố cục = thứ tự,
                    BackgroundColor3 = C.SURFACE2, BackgroundTransparency = 0.25,
                    BorderSizePixel = 0, ZIndex = 8,
                }, danh sách)
                Góc(hàng, UDim.new(0, 6))

                local nameBtn = New("TextButton", {
                    Kích thước = UDim2.new(1, -170, 1, 0), Vị trí = UDim2.new(0, 6, 0, 0),
                    Văn bản = chuỗi.format("%d. %s %s", g.idx, txt, distStr),
                    BackgroundTransparency = 1, TextColor3 = C.DARK,
                    Phông chữ = Enum.Font.GothamBold, Kích thước chữ = 8,
                    TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 9,
                }, hàng ngang)
                nameBtn.Activated:Connect(function()
                    ReleaseHubFocus()
                    pcall(function()
                        local r = S.Move.Root()
                        nếu r thì
                            r.CFrame = CFrame.new(gx, gy + 3.5, gz)
                        kết thúc
                    kết thúc)
                    nếu D.hubStatus thì flash(D.hubStatus, "📍 đã tới " .. g.name, 1.5, C.ACCENT) end
                kết thúc)

                local tpBtn = New("TextButton", {
                    Kích thước = UDim2.new(0, 30, 0, 20), Vị trí = UDim2.new(1, -138, 0, 4),
                    Văn bản = "📍", Màu nền 3 = C.BLUE, Màu chữ 3 = D.BestText(C.BLUE),
                    Font = Enum.Font.GothamBold, TextSize = 10, BorderSizePixel = 0, ZIndex = 9,
                }, hàng ngang)
                Góc(tpBtn, UDim.new(0, 6))
                D.Tactile(tpBtn, 0.08)
                tpBtn.Activated:Connect(function()
                    ReleaseHubFocus()
                    pcall(function()
                        local r = S.Move.Root()
                        nếu r thì
                            r.CFrame = CFrame.new(gx, gy + 3.5, gz)
                        kết thúc
                    kết thúc)
                    nếu D.hubStatus thì flash(D.hubStatus, "📍 đã tới " .. g.name, 1.5, C.ACCENT) end
                kết thúc)

                local flyBtn = New("TextButton", {
                    Kích thước = UDim2.new(0, 30, 0, 20), Vị trí = UDim2.new(1, -102, 0, 4),
                    Văn bản = "🚀", Màu nền 3 = C.PURPLE, Màu chữ 3 = D.BestText(C.PURPLE),
                    Font = Enum.Font.GothamBold, TextSize = 10, BorderSizePixel = 0, ZIndex = 9,
                }, hàng ngang)
                Góc(flyBtn, UDim.new(0, 6))
                D.Tactile(flyBtn, 0.08)
                flyBtn.Activated:Connect(function()
                    ReleaseHubFocus()
                    địa phương được, res = S.Move.FlyToGlass(g.idx)
                    sơn()
                    nếu D.hubStatus thì
                        flash(D.hubStatus, ok and ("🚀 đang bay tới " .. g.name .. " tốc độ " .. tostring(S.Move.glassFlySpeed ​​or 60)) or ("⚠️ " .. tostring(res)), 1.8, ok and C.ACCENT or C.RED)
                    kết thúc
                kết thúc)

                local delBtn = New("TextButton", {
                    Kích thước = UDim2.new(0, 44, 0, 20), Vị trí = UDim2.new(1, -66, 0, 4),
                    Văn bản = "🗑", Màu nền 3 = C.RED, Màu chữ 3 = D.BestText(C.RED),
                    Font = Enum.Font.GothamBold, TextSize = 10, BorderSizePixel = 0, ZIndex = 9,
                }, hàng ngang)
                Góc(delBtn, UDim.new(0, 6))
                D.Tactile(delBtn, 0.08)
                delBtn.Activated:Connect(function()
                    ReleaseHubFocus()
                    local ok = S.Move.RemoveGlassAt(g.idx)
                    sơn()
                    refreshGlassList()
                    if S.RefreshMovePanel then pcall(S.RefreshMovePanel) end
                    pcall(S.Rebuild)
                    nếu D.hubStatus thì
                        flash(D.hubStatus, ok and ("🗑 đã xóa " .. g.name .. " · còn " .. tostring(#(S.Move._placedGlasses or {})) .. " tấm") hoặc "⚠️ không xóa được", 1.8, ok và C.ACCENT hoặc C.RED)
                    kết thúc
                kết thúc)
            kết thúc
        kết thúc
        pcall(function() list.CanvasSize = UDim2.new(0, 0, 0, order * 32) end)
        sơn()
    kết thúc

    S.GlassRefreshList = RefreshGlassList
    if S.Move then S.Move._glassListRefresh = refreshGlassList end

    placeBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local ok, res = S.Move.PlaceGlass()
        nếu được thì
            if D.hubStatus thì flash(D.hubStatus, "🧱 đã đặt kính dưới chân · tổng " .. tostring(#(S.Move._placedGlasses or {})) .. " tấm", 1.8, C.ACCENT) end
        khác
            nếu D.hubStatus thì flash(D.hubStatus, "⚠️ " .. tostring(res hoặc "không cài được kính"), 1.8, C.RED) end
        kết thúc
        sơn()
        refreshGlassList()
        if S.RefreshMovePanel then pcall(S.RefreshMovePanel) end
        pcall(S.Rebuild)
    kết thúc)

    clearBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local n = S.Move.ClearPlacedGlasses()
        pcall(function() S.Move.StopGlassFly() end)
        sơn()
        refreshGlassList()
        if S.RefreshMovePanel then pcall(S.RefreshMovePanel) end
        pcall(S.Rebuild)
        nếu D.hubStatus thì flash(D.hubStatus, "🧹 đã xóa " .. tostring(n) .. " tấm kính", 1.8, C.ACCENT) end
    kết thúc)

    autoBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.Move.SetAutoGlass(not S.Move.autoGlass)
        sơn()
        refreshGlassList()
        if S.RefreshMovePanel then pcall(S.RefreshMovePanel) end
        nếu D.hubStatus thì
            flash(D.hubStatus, S.Move.autoGlass và "🔄 tự động đặt kính: BẬT — đi tới nơi đặt tới đó" hoặc "🔄 tự đặt kính: TẮT", 1.8, C.ACCENT)
        kết thúc
    kết thúc)

    tpNearBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local glasses = S.Move.GetPlacedGlasses and S.Move.GetPlacedGlasses() or {}
        nếu #glasses == 0 thì
            nếu D.hubStatus thì flash(D.hubStatus, "⚠️ chưa có tấm kính nào để tới", 1.5, C.RED) end
            trở lại
        kết thúc
        local myRoot = S.Move.Root and S.Move.Root()
        local myPos = myRoot and myRoot.Position or nil
        tốt nhất tại địa phương = kính[1]
        cục bộ tốt nhấtD = 1e9
        nếu myPos thì
            for _, g in ipairs(glasses) do
                local dx = gx - myPos.X
                local dz = gz - myPos.Z
                cục bộ d = dx*dx + dz*dz
                nếu d < bestD thì bestD = d; best = g
            kết thúc
        kết thúc
        pcall(function()
            local r = S.Move.Root()
            if r then r.CFrame = CFrame.new(best.x, best.y + 3.5, best.z) end
        kết thúc)
        nếu D.hubStatus thì flash(D.hubStatus, "📍 đã gần nhất: " .. tới best.name, 1.5, C.ACCENT) end
    kết thúc)

    flyNearBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local glasses = S.Move.GetPlacedGlasses and S.Move.GetPlacedGlasses() or {}
        nếu #glasses == 0 thì
            if D.hubStatus thì flash(D.hubStatus, "⚠️ chưa có tấm kính nào để bay tới", 1.5, C.RED) end
            trở lại
        kết thúc
        local myRoot = S.Move.Root and S.Move.Root()
        local myPos = myRoot and myRoot.Position or nil
        tốt nhất tại địa phương = kính[1]
        cục bộ tốt nhấtD = 1e9
        nếu myPos thì
            for _, g in ipairs(glasses) do
                local dx = gx - myPos.X
                local dz = gz - myPos.Z
                cục bộ d = dx*dx + dz*dz
                nếu d < bestD thì bestD = d; best = g
            kết thúc
        kết thúc
        địa phương được, res = S.Move.FlyToGlass(best.idx)
        sơn()
        nếu D.hubStatus thì
            flash(D.hubStatus, ok and ("🚀 đang bay tới gần nhất: " .. best.name .. " tốc độ " .. tostring(S.Move.glassFlySpeed ​​hoặc 60)) hoặc ("⚠️ " .. tostring(res)), 1.8, ok và C.ACCENT hoặc C.RED)
        kết thúc
    kết thúc)

    applySpeedBtn.Activated:Connect(function()
        ReleaseHubFocus()
        local v = tonumber(tostring(speedIn.Text or ""):match("%d+%.?%d*")) or S.Move.glassFlySpeed ​​or 60
        S.Move.SetGlassFlySpeed(v)
        sơn()
        nếu D.hubStatus thì flash(D.hubStatus, "🚀 tốc độ bay tới kính: " .. tostring(S.Move.glassFlySpeed), 1.5, C.ACCENT) end
    kết thúc)

    stopFlyBtn.Activated:Connect(function()
        ReleaseHubFocus()
        S.Move.StopGlassFly()
        sơn()
        if D.hubStatus thì flash(D.hubStatus, "⏹ đã dừng bay tới kính", 1.5, C.YELLOW) end
    kết thúc)

    searchIn:GetPropertyChangedSignal("Text"):Connect(function()
        S.Debounce("glassSearch", 0.2, refreshGlassList)
    kết thúc)

    sơn()
    refreshGlassList()

    pcall(function()
        if D.playerTab then D.playerTab.CanvasSize = UDim2.new(0, 0, 0, (D.playerY or 800) + 16) end
    kết thúc)
kết thúc

D.hubChipBtns = {}
for _, cname in ipairs({"Tất cả", "Admin", "Explorer", "Spy", "Tiện ích", "Server", "Di chuyển", "Định vị"}) do
    local w = (cname == "Tất cả" and 58) or (cname == "Explorer" and 68) or (cname == "Tiên tiện ích" and 64)
              hoặc (cname == "Server" và 56) hoặc (cname == "Admin" và 52) hoặc (cname == "Di chuyển" và 66) hoặc (cname == "Định vị" và 58) hoặc 44
    chip cục bộ = New("TextButton", {
        Kích thước = UDim2.new(0, w, 0, 20), Văn bản = cname,
        BackgroundColor3 = (S.hubCat == cname) và C.ACCENT hoặc C.SURFACE2,
        BackgroundTransparency = (S.hubCat == cname) và 0.08 hoặc 1,
        TextColor3 = (S.hubCat == cname) và C.INK hoặc C.MUTED,
        Font = Enum.Font.GothamBold, TextSize = 9, BorderSizePixel = 0, ZIndex = 7,
    }, D.hubChips)
    Góc(chip, UDim.new(1, 0))
    Stroke(chip, (S.hubCat == cname) and C.ACCENT2 or C.BORDER, 1)
    chip.Activated:Connect(function()
        S.hubCat = cname
        đối với nm, cb theo cặp (D.hubChipBtns) thực hiện
            cục bộ trên = (nm == cname)
            cb.BackgroundColor3 = on và C.ACCENT hoặc C.SURFACE2
            cb.BackgroundTransparency = bật và 0.08 hoặc 1
            cb.TextColor3 = on và C.INK hoặc C.MUTED
            local st = cb:FindFirstChildOfClass("UIStroke")
            if st then st.Color = on and C.ACCENT2 or C.BORDER end
        kết thúc
        S.RebuildHubList()
    kết thúc)
    D.hubChipBtns[cname] = chip
kết thúc

trackConn(D.hubSearchBox:GetPropertyChangedSignal("Text"):Connect(function()
    S.hubSearch = D.hubSearchBox.Text -- ghi nhận ngay (rẻ) để chip/đọc khác đúng
    S.Debounce("hubSearch", 0.18, S.RebuildHubList) -- Nhưng chỉ DỰ KIẾN thẻ 1 lần sau phím cuối
kết thúc))
S.RebuildHubList()

D.SyncPageChips()
S.SyncServerPanel() -- v4.6.3: thực hiện mã hóa máy chủ (JobId) up frame 🌐 SERVER

LÀM
    local setTab = AddTab("Thiết Lập", "⚙️", 6) -- v4.15: 5 -> 6 (👥 chen vào ô 4)

    sy cục bộ = 8
    quy tắc hàm cục bộ (y)
        Mới("TextLabel", {
            Kích thước = UDim2.new(1, -16, 0, 14), Vị trí = UDim2.new(0, 8, 0, y),
            Văn bản = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", Độ trong suốt nền = 1,
            TextColor3 = C.HAIRLINE, Phông chữ = Enum.Font.Gotham, TextSize = 8,
            TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 6,
        }, setTab)
    kết thúc
    thẻ chức năng cục bộ (tiêu đề, h)
        cục bộ f = New("Khung", {
            Kích thước = UDim2.new(1, -16, 0, h), Vị trí = UDim2.new(0, 8, 0, sy),
            BackgroundColor3 = C.SURFACE, BackgroundTransparency = 0.08,
            BorderSizePixel = 0, ZIndex = 6,
        }, setTab)
        Góc(f, UDim.new(0, 10))
        Stroke(f, C.HAIRLINE, 0.18)
        Mới("TextLabel", {
            Kích thước = UDim2.new(1, -16, 0, 16), Vị trí = UDim2.new(0, 8, 0, 6),
            Văn bản = tiêu đề, Độ trong suốt nền = 1, Màu chữ 3 = C.ACCENT,
            Phông chữ = Enum.Font.GothamBold, Kích thước chữ = 10,
            TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
        }, f)
        sy = sy + h + 8
        trả về f
    kết thúc
    hàm cục bộ line(parent, text, y, color, h)
        trả về New("TextLabel", {
            Kích thước = UDim2.new(1, -16, 0, h hoặc 12), Vị trí = UDim2.new(0, 8, 0, y),
            Văn bản = văn bản, Độ trong suốt nền = 1, Màu văn bản = màu hoặc C.MUTED,
            Font = Enum.Font.Gotham, TextSize = 9, TextWrapped = true,
            TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 7,
        }, cha)
    kết thúc
    hàm cục bộ act(parent, text, x, y, w, color)
        cục bộ b = New("TextButton", {
            Kích thước = UDim2.new(0, w, 0, 22), Vị trí = UDim2.new(0, x, 0, y),
            Văn bản = văn bản, Màu nền 3 = màu hoặc C.SURFACE3, Độ trong suốt nền = 0.08,
            TextColor3 = D.BestText(color or C.SURFACE3), Font = Enum.Font.GothamBold,
            Kích thước chữ = 9, Kích thước viền pixel = 0, Chỉ số Z = 8,
        }, cha)
        Góc(b, UDim.new(0, 7))
        Stroke(b, D.Edge(color or C.SURFACE3), 0.22)
        trả lại b
    kết thúc

    --------- [1] TÌNH TRẠNG LƯU TRỮ ----------
    local c1 = card("💾 LƯU TRỮ — dữ liệu của bạn đang ở đâu?", 82)
    local stTitle = line(c1, "", 24, C.GRAY, 12)
    local stBody = line(c1, "", 38, C.MUTED, 26)
    local saveNow = act(c1, "💾 Lưu ngay", 8, 54, 92, C.GREEN)
    local loading = act(c1, "🔄 Đọc lại từ đĩa", 106, 54, 116)

    hàm cục bộ refreshStorage()
        cục bộ ns, nw, nf = #scripts, #waypoints, #featureTabs
        canDisk cục bộ = Store.canWrite()
        stTitle.TextColor3 = canDisk và C.GREEN hoặc C.YELLOW
        nếu canDisk thì
            stTitle.Text = " ✅ ĐANG GHI XUỐNG ĐĨA THẬT"
            stBody.Text = string.format(
                "File: %s\n%d script · %d waypoint · %d tab Tính năng — sống qua cả hai lần tham gia lại.",
                tostring(Store.SAVE_FILE), ns, nw, nf)
        khác
            stTitle.Text = "⚠️ CHỈ GIỮ TRỌNG RAM CỦA PHIÊN CHƠI NÀY"
            stBody.Text = string.format(
                "Executor không có writefile thật (hub đã bù bằng ổ đĩa ảo).\n%d script · %d WP · %d tab — THAM GIA LÀ MẤT. Vui lòng nhấn 📤 Xuất để sao lưu.",
                ns, nw, nf)
        kết thúc
    kết thúc
    refreshStorage()
    saveNow.Activated:Connect(function()
        local ok = Store.save()
        refreshStorage()
        flash(saveNow, ok và " ✅ Đã lưu" hoặc "❌ Error", 1.4)
    kết thúc)
    reload.Activated:Connect(function()
        pcall(function() if S.DoReload then S.DoReload() end end)
        refreshStorage()
    kết thúc)

    -- ---------- [2] XUẤT / NHẬP ----------
    local c2 = card("📤 SAO LƯU & CHUYỂN MÁY", 132)
    line(c2, "Xuất toàn bộ dữ liệu ra clipboard để dán sang máy/người thực thi khác, hoặc nhập lại chuỗi đã lưu. Nhập là GHÉP theo tên — không ghi đè cái đang có.", 24, C.MUTED, 24)
    local expBtn = act(c2, "📤 Xuất ra clipboard", 8, 50, 128, C.BLUE)
    dán cục bộ = Mới("TextBox", {
        Kích thước = UDim2.new(1, -16, 0, 44), Vị trí = UDim2.new(0, 8, 0, 76),
        PlaceholderText = "Dán JSON đã xuất vào đây rồi nhấn 📥 Nhập...",
        Văn bản = "", Màu nền 3 = C.SURFACE2, Độ trong suốt nền = 0.06,
        TextColor3 = C.DARK, PlaceholderColor3 = C.GRAY, Font = Enum.Font.Code,
        Kích thước văn bản = 9, Văn bản xuống dòng = true, Căn chỉnh văn bản theo chiều ngang = Enum.TextXAlignment.Left,
        TextYAlignment = Enum.TextYAlignment.Top, ClearTextOnFocus = false, ZIndex = 7,
    }, c2)
    Góc(dán, UDim.new(0, 7))
    Stroke(paste, C.HAIRLINE, 0.2)
    local impBtn = act(c2, "📥 Nhập", 142, 50, 66, C.GREEN)

    expBtn.Activated:Connect(function()
        local ok, json = pcall(function() return HttpService:JSONEncode(Store.serialize()) end)
        nếu không ổn hoặc kiểu dữ liệu (json) ~= "string" thì
            flash(expBtn, "❌ Lỗi JSON", 1.6)
            trở lại
        kết thúc
        local done = S.CopyToClipboard(json)
        nếu không làm vậy thì
            paste.Text = json
            flash(expBtn, "⚠️ Đã dán vào ô", 1.8)
        khác
            flash(expBtn, " ✅ Đã sao chép", 1.8)
        kết thúc
    kết thúc)

    impBtn.Activated:Connect(function()
        local txt = paste.Text
        nếu type(txt) ~= "string" hoặc #txt < 2 thì
            flash(impBtn, "⚠️ Trống", 1.6); return
        kết thúc
        cục bộ ok, data = pcall(function() return HttpService:JSONDecode(txt) end)
        nếu không ổn hoặc kiểu dữ liệu (data) ~= "table" hoặc kiểu dữ liệu (data.scripts) ~= "table" thì
            flash(impBtn, "❌ JSON sai", 1.8); return
        kết thúc
        cục bộ có = {}
        for _, s in ipairs(scripts) do have[tostring(s.name)] = true end
        cục bộ được thêm vào = 0
        for _, s in ipairs(data.scripts) do
            nếu kiểu dữ liệu == "table" và kiểu dữ liệu của các mã == "string" thì
                local nm = tostring(s.name or ("Script " .. (#scripts + 1)))
                nếu có[nm] thì
                    cơ sở cục bộ, k = nm, 2
                    while have[base .. " (" .. k .. ")"] do k = k + 1 end
                    nm = cơ sở .. " (" .. k .. ")"
                kết thúc
                có[nm] = đúng
                scripts[#scripts + 1] = {name = nm, code = s.code, expanded = false}
                đã thêm = đã thêm + 1
            kết thúc
        kết thúc
        pcall(function() RebuildScripts() end)
        refreshStorage()
        Store.saveSoon()
        paste.Text = ""
        flash(impBtn, "✅ +" .. added, 1.8)
    kết thúc)

    --------- [3] MÔI TRƯỜNG THI CÔNG ----------
    local c3 = card("🖥 MÔI TRƯỜNG EXECUTOR", 74)
    local envTitle = line(c3, "", 24, C.DARK, 12)
    local envBody = line(c3, "", 38, C.MUTED, 26)
    pcall(function()
        nm cục bộ, ver = "không rõ", ""
        nếu xác định người thực thi thì
            cục bộ a, b = xác định người thực thi()
            nm = tostring(a or "không rõ"); ver = tostring(b or "")
        kết thúc
        envTitle.Text = "Người thực thi: " .. nm .. (ver ~= "" và (" · " .. ver) hoặc "")
        lỗi cục bộ = {}
        for _, k in ipairs({"writefile", "readfile", "setclipboard", "gethui", "hookfunction", "Drawing", "request", "queue_on_teleport"}) do
            nếu không phải S.HasGlobal(k) thì miss[#miss + 1] = k end
        kết thúc
        nếu #miss == 0 thì
            envBody.Text = " ✅ Executor đủ mọi hàm hub cần — không phải bù gì."
            envBody.TextColor3 = C.GREEN
        khác
            envBody.Text = "Hub đã tự bù " .. #miss .. " hàm còn thiếu: " .. table.concat(miss, ", ")
            envBody.TextColor3 = C.YELLOW
        kết thúc
    kết thúc)

    --------- [4] VÙNG NGUY HIỂM ----------
    local c4 = card("⚠️ VÙNG NGUY HIỂM", 66)
    line(c4, "Đã lưu tập lệnh Xoá sạch, điểm tham chiếu và tính năng tab. Không hoàn thành.", 24, C.MUTED, 14)
    local clearBtn = act(c4, "🗑 Xóa dữ liệu", 8, 40, 132, C.RED)
    vũ trang địa phương = sai
    clearBtn.Activated:Connect(function()
        nếu không có vũ khí thì
            vũ trang = đúng
            clearBtn.Text = "⚠️ Bấm lần nữa để XÁC NHẬN"
            task.delay(4, function()
                vũ trang = sai
                if clearBtn and clearBtn.Parent then clearBtn.Text = "🗑 Xoá sạch dữ liệu" end
            kết thúc)
            trở lại
        kết thúc
        vũ trang = sai
        for i = #scripts, 1, -1 do scripts[i] = nil end
        for i = #waypoints, 1, -1 do waypoints[i] = nil end
        pcall(function() RebuildScripts() end)
        pcall(function() if Store.restoreWaypoints then Store.restoreWaypoints() end end)
        Store.save()
        refreshStorage()
        flash(clearBtn, "❌ Đã xóa", 1.6)
    kết thúc)

    setTab.CanvasSize = UDim2.new(0, 0, 0, sy + 8)
    S.settingsTab = setTab
    S.settingsBtns = {save = saveNow, reload = reload, export = expBtn, import = impBtn,
                      paste = paste, clear = clearBtn, statusTitle = stTitle, statusBody = stBody,
                      envTitle = envTitle, envBody = envBody, cardStorage = c1, cardEnv = c3}
    S.refreshStorageCard = RefreshStorage -- để chỗ khác gọi lại sau khi thay đổi trạng thái
kết thúc

hàm cục bộ ToggleMainFrame()
    main.Visible = not main.Visible
    togBtn.Text = main.Visible và "✕" hoặc "🍌"
    if not main.Visible then ReleaseHubFocus() end -- v4.4b: close menu là phải trả input cho game
    nếu main.Visible thì
        pcall(function()
            nếu D.openTween thì D.openTween:Cancel() kết thúc
            local ts, tp = main.Size, main.Position
            main.Size = UDim2.new(ts.X.Scale, math.max(160, ts.X.Offset - 24),
                                  ts.Y.Scale, math.max(110, ts.Y.Offset - 16))
            main.Position = UDim2.new(tp.X.Scale, tp.X.Offset + 12, tp.Y.Scale, tp.Y.Offset + 8)
            D.openTween = TweenService:Create(main,
                TweenInfo.new(0.2, Enum.EasingStyle.Quint, Enum.EasingDirection.Out),
                {Kích thước = ts, Vị trí = tp})
            D.openTween:Play()
            D.openTween.Completed:Connect(function()
                D.openTween = nil
                pcall(BcFit) -- đo lại để nhúng GUI vừa phải vào ô
            kết thúc)
        kết thúc)
    kết thúc
kết thúc

closeBtn.Activated:Connect(function()
    pcall(function() if D.openTween then D.openTween:Cancel() D.openTween = nil end end)
    main.Visible = false
    togBtn.Text = "🍌"
    ReleaseHubFocus() -- v4.5: close by ✕ cũng phải trả thông tin đầu vào cho game (trước đây chỉ có nút 🍌 làm)
kết thúc)

dragLockBtn.Activated:Connect(function()
    S.dragMenu = không phải S.dragMenu
    nếu S.dragMenu thì
        dragLockBtn.Text = "🔓"
        dragLockBtn.TextColor3 = C.ACCENT -- v4.5: dấu vàng thay vì màu xanh
    khác
        dragLockBtn.Text = "🔒"
        dragLockBtn.TextColor3 = C.MUTED
    kết thúc
kết thúc)

trackConn(titleBar.InputBegan:Connect(function(i)
    nếu S.dragMenu và (i.UserInputType==Enum.UserInputType.MouseButton1 hoặc i.UserInputType==Enum.UserInputType.Touch) thì
        pcall(function() if D.openTween then D.openTween:Cancel() D.openTween = nil end end) -- v4.5
        S.dragging=true
        S.dragStart=i.Position
        S.startPos=main.Position
    kết thúc
kết thúc))

trackConn(UserInputService.InputChanged:Connect(function(i)
    nếu S.dragging và S.startPos và S.dragStart và (i.UserInputType==Enum.UserInputType.MouseMovement hoặc i.UserInputType==Enum.UserInputType.Touch) thì
        local d=i.Position-S.dragStart
        main.Position=UDim2.new(S.startPos.X.Scale, S.startPos.X.Offset+dX, S.startPos.Y.Scale, S.startPos.Y.Offset+dY)
    kết thúc
kết thúc))

trackConn(UserInputService.InputEnded:Connect(function(i)
    nếu i.UserInputType == Enum.UserInputType.MouseButton1 hoặc i.UserInputType == Enum.UserInputType.Touch thì
        S.dragging=false
    kết thúc
kết thúc))

trackConn(togBtn.InputBegan:Connect(function(i)
    nếu i.UserInputType == Enum.UserInputType.MouseButton1 hoặc i.UserInputType == Enum.UserInputType.Touch thì
        nếu S.dragMenu thì
            S.togDragging = true
            S.togDragStart = i.Position
            S.togStartPos = togBtn.Position
            S.togMoved = false
        kết thúc
    kết thúc
kết thúc))

trackConn(UserInputService.InputChanged:Connect(function(i)
    nếu S.togDragging và S.dragMenu và (i.UserInputType == Enum.UserInputType.MouseMovement hoặc i.UserInputType == Enum.UserInputType.Touch) thì
        delta cục bộ = i.Vị trí - S.togDragStart
        nếu delta.Magnitude > 5 thì
            S.togMoved = true
        kết thúc
        nếu S.togMoved thì
            togBtn.Position = UDim2.new(
                S.togStartPos.X.Scale, S.togStartPos.X.Offset + delta.X,
                S.togStartPos.Y.Scale, S.togStartPos.Y.Offset + delta.Y
            )
        kết thúc
    kết thúc
kết thúc))

trackConn(UserInputService.InputEnded:Connect(function(i)
    nếu i.UserInputType == Enum.UserInputType.MouseButton1 hoặc i.UserInputType == Enum.UserInputType.Touch thì
        nếu S.togDragging thì
            S.togDragging = false
            nếu không phải S.togMoved thì
                ToggleMainFrame()
            kết thúc
        kết thúc
    kết thúc
kết thúc))

togBtn.Activated:Connect(function()
    nếu không phải S.dragMenu thì
        ToggleMainFrame()
    kết thúc
kết thúc)

trackConn(UserInputService.InputBegan:Connect(function(i, gp)
    nếu gp không và i.KeyCode == Enum.KeyCode.RightControl thì
        ToggleMainFrame()
    kết thúc
kết thúc))

main.Visible = true
togBtn.Text = "✕"

in(string.format(
    " ✅ Banana Cat Hub v4.43 — đã sẵn sàng! Đã tải lại %d script + %d waypoint + %d tab Tính năng từ bộ nhớ (chế độ: %s%s)",
    Store.loadedScripts, Store.loadedWp, #Store.loadedFeatures, Store.mode,
    Store.lastError và (" | ⚠️ " .. Store.lastError) hoặc ""
))
print(" 💾 File save: " .. Store.SAVE_FILE .. " (trong không gian làm việc thư mục của người thực thi — tồn tại cả hai lần tham gia lại)")
print(" Tính năng: Code + Code Đã Lưu + Script Hub + Hỗ Trợ (POS+SIZE+ROT+LOOK+VẬT THỂ+HIGHLIGHT TÍM) + Thiết Lập + Tạo Tính Năng")
print(" 🆕 v4.12.2: Di chuyển — 🦘 nhảy được ở MỌI game (3 cách nhảy) · 🏃 chạy trên thảm NHẢY THOẢI MÁI · 👟 tốc độ THEO GAME ×3 (gõ x4 hay 50 ở ô 👟 Chạy) · 🪩 thảm tự động chạy lại khi game xóa")
