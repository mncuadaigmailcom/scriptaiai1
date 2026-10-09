--[[======================================================================================
    AVATAR & OUTFIT VIEWER  —  LocalScript
    --------------------------------------------------------------------------------------
    Chức năng:
      1. Nhập tên người chơi (hoặc UserId) -> tra cứu.
      2. Hiện avatar HIỆN TẠI của họ dạng 3D trong ViewportFrame (xoay được).
      3. Liệt kê TOÀN BỘ outfit công khai họ đã lưu (có thumbnail 2D).
      4. Bấm vào outfit nào -> khung 3D đổi sang outfit đó.
      5. Xuất danh sách asset ID / dump HumanoidDescription.
      6. Dựng model mannequin của outfit đó ngay trong Workspace (dùng cho game của bạn).

    Cài đặt:
      Đặt script này là **LocalScript** trong
        StarterPlayer > StarterPlayerScripts     (hoặc StarterGui)
      Không cần executor. Toàn bộ API dùng ở đây đều là API Roblox chính thức.

    API đã kiểm chứng (create.roblox.com/docs/reference/engine):
      Players:GetUserIdFromNameAsync(userName)                        -> number
      Players:GetUserIdFromNameAsync / GetNameFromUserIdAsync
      Players:GetHumanoidDescriptionFromUserIdAsync(userId)           -> HumanoidDescription
      Players:GetHumanoidDescriptionFromOutfitIdAsync(outfitId)       -> HumanoidDescription
      Players:CreateHumanoidModelFromDescriptionAsync(desc, rig, ver) -> Model   [client-side]
      Enum.AssetTypeVerification  { Default=1, ClientOnly=2, Always=3 }

    Endpoint công khai (không cần khoá):
      https://avatar.roblox.com/v1/users/{userId}/outfits?itemsPerPage=100&pageNumber=N
      Thumbnail: dùng ContentId  rbxthumb://type=Outfit&id={id}&w=150&h=150
                 và            rbxthumb://type=Avatar&id={userId}&w=352&h=352
========================================================================================]]

local Players           = game:GetService("Players")
local HttpService       = game:GetService("HttpService")
local RunService        = game:GetService("RunService")
local UserInputService  = game:GetService("UserInputService")
local TweenService      = game:GetService("TweenService")

local LocalPlayer = Players.LocalPlayer

-- ============================================================================
-- CẤU HÌNH
-- ============================================================================
local CFG = {
    MAX_PAGES   = 5,                                  -- số trang outfit tối đa (100/trang)
    PER_PAGE    = 100,
    RIG_TYPE    = Enum.HumanoidRigType.R15,
    VERIFY      = Enum.AssetTypeVerification.Always,  -- an toàn: chỉ cho asset catalog
    AUTO_ROTATE = 26,                                 -- độ/giây khi tự xoay
    CAM_PADDING = 1.55,                               -- hệ số zoom của camera
    TOGGLE_KEY  = Enum.KeyCode.Semicolon,
    OUTFIT_URL  = "https://avatar.roblox.com/v1/users/%d/outfits?itemsPerPage=%d&pageNumber=%d",
}

-- ============================================================================
-- BẢNG MÀU
-- ============================================================================
local C = {
    BG      = Color3.fromRGB(17, 18, 24),
    SURFACE = Color3.fromRGB(26, 28, 38),
    SURFACE2= Color3.fromRGB(36, 39, 52),
    BORDER  = Color3.fromRGB(58, 63, 82),
    TEXT    = Color3.fromRGB(232, 235, 244),
    MUTED   = Color3.fromRGB(140, 147, 168),
    ACCENT  = Color3.fromRGB(250, 204, 102),
    GREEN   = Color3.fromRGB(74, 222, 128),
    RED     = Color3.fromRGB(248, 113, 113),
}

-- ============================================================================
-- TIỆN ÍCH DỰNG GUI
-- ============================================================================
local function new(className, props, parent)
    local inst = Instance.new(className)
    for k, v in pairs(props or {}) do
        if k ~= "Parent" then
            inst[k] = v
        end
    end
    if parent then
        inst.Parent = parent
    end
    return inst
end

local function corner(obj, radius)
    return new("UICorner", { CornerRadius = UDim.new(0, radius or 8) }, obj)
end

local function stroke(obj, color, thickness)
    return new("UIStroke", {
        Color = color or C.BORDER,
        Thickness = thickness or 1,
        ApplyStrokeMode = Enum.ApplyStrokeMode.Border,
        Transparency = 0.15,
    }, obj)
end

local function label(parent, text, opts)
    opts = opts or {}
    return new("TextLabel", {
        Size = opts.Size or UDim2.new(1, 0, 0, 20),
        Position = opts.Position or UDim2.new(0, 0, 0, 0),
        AnchorPoint = opts.AnchorPoint or Vector2.new(0, 0),
        BackgroundTransparency = 1,
        Font = opts.Font or Enum.Font.GothamMedium,
        Text = text,
        TextColor3 = opts.Color or C.TEXT,
        TextSize = opts.TextSize or 14,
        TextXAlignment = opts.XAlign or Enum.TextXAlignment.Left,
        TextYAlignment = opts.YAlign or Enum.TextYAlignment.Center,
        TextWrapped = opts.Wrapped or false,
        TextTruncate = opts.Truncate or Enum.TextTruncate.None,
        RichText = opts.RichText or false,
        LayoutOrder = opts.Order or 0,
        ZIndex = opts.ZIndex or 1,
    }, parent)
end

local function button(parent, text, opts)
    opts = opts or {}
    local b = new("TextButton", {
        Size = opts.Size or UDim2.new(0, 100, 0, 30),
        Position = opts.Position or UDim2.new(0, 0, 0, 0),
        AnchorPoint = opts.AnchorPoint or Vector2.new(0, 0),
        AutoButtonColor = false,
        BackgroundColor3 = opts.Bg or C.SURFACE2,
        BorderSizePixel = 0,
        Font = Enum.Font.GothamMedium,
        Text = text,
        TextColor3 = opts.Color or C.TEXT,
        TextSize = opts.TextSize or 13,
        LayoutOrder = opts.Order or 0,
    }, parent)
    corner(b, opts.Radius or 7)
    stroke(b, opts.Stroke or C.BORDER)

    b.MouseEnter:Connect(function()
        TweenService:Create(b, TweenInfo.new(0.12), { BackgroundColor3 = opts.Hover or C.BORDER }):Play()
    end)
    b.MouseLeave:Connect(function()
        TweenService:Create(b, TweenInfo.new(0.12), { BackgroundColor3 = opts.Bg or C.SURFACE2 }):Play()
    end)
    return b
end

-- ============================================================================
-- CÂY GUI
-- ============================================================================
local screenGui = new("ScreenGui", {
    Name = "AvatarOutfitViewer",
    ResetOnSpawn = false,
    ZIndexBehavior = Enum.ZIndexBehavior.Sibling,
    DisplayOrder = 50,
    IgnoreGuiInset = true,
}, Players.LocalPlayer:WaitForChild("PlayerGui"))

-- nút mở/đóng nổi
local toggleBtn = button(screenGui, "👕", {
    Size = UDim2.new(0, 44, 0, 44),
    Position = UDim2.new(0, 16, 0.5, -22),
    TextSize = 22,
    Radius = 22,
    Bg = C.SURFACE,
    Stroke = C.ACCENT,
})

local main = new("Frame", {
    Name = "Main",
    Size = UDim2.new(0, 760, 0, 520),
    Position = UDim2.new(0.5, -380, 0.5, -260),
    BackgroundColor3 = C.BG,
    BorderSizePixel = 0,
    Visible = false,
    ClipsDescendants = true,
}, screenGui)
corner(main, 12)
stroke(main, C.BORDER, 1.5)

-- thanh tiêu đề
local titleBar = new("Frame", {
    Size = UDim2.new(1, 0, 0, 38),
    BackgroundColor3 = C.SURFACE,
    BorderSizePixel = 0,
}, main)
corner(titleBar, 12)
new("Frame", { -- che 2 góc dưới của thanh tiêu đề
    Size = UDim2.new(1, 0, 0, 12),
    Position = UDim2.new(0, 0, 1, -12),
    BackgroundColor3 = C.SURFACE,
    BorderSizePixel = 0,
}, titleBar)

label(titleBar, "👕  AVATAR & OUTFIT VIEWER", {
    Size = UDim2.new(1, -80, 0, 38),
    Position = UDim2.new(0, 14, 0, 0),
    TextSize = 14,
    Color = C.ACCENT,
    ZIndex = 2,
})

local closeBtn = button(titleBar, "✕", {
    Size = UDim2.new(0, 30, 0, 26),
    Position = UDim2.new(1, -38, 0.5, -13),
    TextSize = 14,
    Bg = C.SURFACE2,
    ZIndex = 2,
})

-- hàng tìm kiếm
local searchRow = new("Frame", {
    Size = UDim2.new(1, -24, 0, 34),
    Position = UDim2.new(0, 12, 0, 48),
    BackgroundTransparency = 1,
}, main)

local nameBox = new("TextBox", {
    Size = UDim2.new(1, -206, 0, 34),
    BackgroundColor3 = C.SURFACE,
    BorderSizePixel = 0,
    PlaceholderText = "  Nhập tên người chơi hoặc UserId…",
    PlaceholderColor3 = C.MUTED,
    Text = "",
    TextColor3 = C.TEXT,
    Font = Enum.Font.GothamMedium,
    TextSize = 14,
    TextXAlignment = Enum.TextXAlignment.Left,
    ClearTextOnFocus = false,
}, searchRow)
corner(nameBox, 7)
stroke(nameBox, C.BORDER)

local searchBtn = button(searchRow, "🔎  Tìm", {
    Size = UDim2.new(0, 96, 0, 34),
    Position = UDim2.new(1, -198, 0, 0),
    Bg = C.ACCENT,
    Color = Color3.fromRGB(20, 16, 6),
    Stroke = C.ACCENT,
})

local meBtn = button(searchRow, "🙂 Tôi", {
    Size = UDim2.new(0, 94, 0, 34),
    Position = UDim2.new(1, -94, 0, 0),
})

-- thông tin người dùng
local infoRow = new("Frame", {
    Size = UDim2.new(1, -24, 0, 58),
    Position = UDim2.new(0, 12, 0, 90),
    BackgroundColor3 = C.SURFACE,
    BorderSizePixel = 0,
}, main)
corner(infoRow, 8)

local avatarThumb = new("ImageLabel", {
    Size = UDim2.new(0, 46, 0, 46),
    Position = UDim2.new(0, 7, 0.5, -23),
    BackgroundColor3 = C.SURFACE2,
    BorderSizePixel = 0,
    Image = "",
}, infoRow)
corner(avatarThumb, 23)

local infoName = label(infoRow, "Chưa tra cứu ai.", {
    Size = UDim2.new(1, -140, 0, 22),
    Position = UDim2.new(0, 62, 0, 9),
    TextSize = 15,
    Color = C.TEXT,
    Truncate = Enum.TextTruncate.AtEnd,
})
local infoMeta = label(infoRow, "Gõ tên rồi bấm 🔎 Tìm.", {
    Size = UDim2.new(1, -140, 0, 18),
    Position = UDim2.new(0, 62, 0, 31),
    TextSize = 12,
    Color = C.MUTED,
})

-- ============================================================================
-- KHUNG 3D (ViewportFrame)
-- ============================================================================
local previewFrame = new("Frame", {
    Size = UDim2.new(0, 300, 0, 300),
    Position = UDim2.new(0, 12, 0, 156),
    BackgroundColor3 = Color3.fromRGB(12, 13, 18),
    BorderSizePixel = 0,
    ClipsDescendants = true,
}, main)
corner(previewFrame, 8)
stroke(previewFrame, C.BORDER)

local viewport = new("ViewportFrame", {
    Size = UDim2.new(1, 0, 1, 0),
    BackgroundTransparency = 1,
    Ambient = Color3.fromRGB(150, 150, 158),
    LightColor = Color3.fromRGB(255, 250, 235),
    LightDirection = Vector3.new(-0.4, -0.8, -0.5),
    ImageColor3 = Color3.fromRGB(255, 255, 255),
}, previewFrame)

local vpCam = new("Camera", {
    CameraType = Enum.CameraType.Scriptable,
    FieldOfView = 40,
}, viewport)
viewport.CurrentCamera = vpCam

label(previewFrame, "Kéo chuột để xoay  · 滚 để zoom", {
    Size = UDim2.new(1, 0, 0, 16),
    Position = UDim2.new(0, 0, 1, -20),
    TextSize = 11,
    Color = C.MUTED,
    XAlign = Enum.TextXAlignment.Center,
})

local previewStatus = label(previewFrame, "", {
    Size = UDim2.new(1, -12, 0, 20),
    Position = UDim2.new(0, 6, 0, 6),
    TextSize = 12,
    Color = C.ACCENT,
})

-- ============================================================================
-- DANH SÁCH OUTFIT
-- ============================================================================
label(main, "🗂  Outfit đã lưu (bấm để xem 3D)", {
    Size = UDim2.new(0, 420, 0, 20),
    Position = UDim2.new(0, 322, 0, 158),
    TextSize = 13,
    Color = C.ACCENT,
})

local listScroll = new("ScrollingFrame", {
    Size = UDim2.new(1, -334, 1, -260),
    Position = UDim2.new(0, 322, 0, 182),
    BackgroundColor3 = C.SURFACE,
    BorderSizePixel = 0,
    CanvasSize = UDim2.new(0, 0, 0, 0),
    AutomaticCanvasSize = Enum.AutomaticSize.Y,
    ScrollBarThickness = 5,
    ScrollBarImageColor3 = C.BORDER,
    ScrollBarImageTransparency = 0.4,
}, main)
corner(listScroll, 8)

new("UIListLayout", {
    Padding = UDim.new(0, 4),
    SortOrder = Enum.SortOrder.LayoutOrder,
    HorizontalAlignment = Enum.HorizontalAlignment.Center,
}, listScroll)
new("UIPadding", {
    PaddingTop = UDim.new(0, 6),
    PaddingBottom = UDim.new(0, 6),
    PaddingLeft = UDim.new(0, 6),
    PaddingRight = UDim.new(0, 6),
}, listScroll)

local listEmpty = label(listScroll, "Chưa có dữ liệu.", {
    Size = UDim2.new(1, -16, 0, 60),
    TextSize = 12,
    Color = C.MUTED,
    XAlign = Enum.TextXAlignment.Center,
    Wrapped = true,
    Order = 0,
})

-- ============================================================================
-- KHU XUẤT DỮ LIỆU
-- ============================================================================
local outBox = new("TextBox", {
    Size = UDim2.new(0, 300, 0, 62),
    Position = UDim2.new(0, 12, 1, -72),
    BackgroundColor3 = C.SURFACE,
    BorderSizePixel = 0,
    Text = "",
    PlaceholderText = "  Dữ liệu sẽ hiện ở đây (bôi đen rồi Ctrl+C để copy)",
    PlaceholderColor3 = C.MUTED,
    TextColor3 = C.GREEN,
    Font = Enum.Font.Code,
    TextSize = 10,
    TextXAlignment = Enum.TextXAlignment.Left,
    TextYAlignment = Enum.TextYAlignment.Top,
    MultiLine = true,
    TextWrapped = true,
    ClearTextOnFocus = false,
    ScrollBarThickness = 3,
    Selectable = true,
}, main)
corner(outBox, 7)
stroke(outBox, C.BORDER)

local actionRow = new("Frame", {
    Size = UDim2.new(1, -336, 0, 62),
    Position = UDim2.new(0, 324, 1, -72),
    BackgroundTransparency = 1,
}, main)

new("UIGridLayout", {
    CellSize = UDim2.new(0.5, -4, 0, 28),
    CellPadding = UDim2.new(0, 8, 0, 6),
    SortOrder = Enum.SortOrder.LayoutOrder,
}, actionRow)

local btnIds      = button(actionRow, "📋 Asset IDs",     { Order = 1 })
local btnDump     = button(actionRow, "🧬 Dump Desc",     { Order = 2 })
local btnMannequin= button(actionRow, "🧍 Tạo mannequin",  { Order = 3, Bg = Color3.fromRGB(38, 74, 52) })
local btnClear    = button(actionRow, "🗑 Xoá mannequin",  { Order = 4 })

-- trạng thái
local statusLbl = label(main, "Sẵn sàng.", {
    Size = UDim2.new(1, -24, 0, 16),
    Position = UDim2.new(0, 12, 1, -4),
    TextSize = 11,
    Color = C.MUTED,
    Truncate = Enum.TextTruncate.AtEnd,
})

-- ============================================================================
-- TRẠNG THÁI ỨNG DỤNG
-- ============================================================================
local State = {
    requestToken = 0,     -- chống race: request cũ tự huỷ khi có request mới
    userId       = nil,
    userName     = nil,
    outfits      = {},    -- { {id=, name=}, ... }
    selected     = nil,   -- outfit đang xem, hoặc "CURRENT"
    desc         = nil,   -- HumanoidDescription đang xem
    previewModel = nil,
    mannequins   = {},
    camYaw       = 20,
    camPitch     = -6,
    camDist      = 9,
    camTarget    = Vector3.new(0, 2.6, 0),
    autoRotate   = true,
}

local function setStatus(text, color)
    statusLbl.Text = text
    statusLbl.TextColor3 = color or C.MUTED
end

-- ============================================================================
-- CAMERA TRONG VIEWPORT
-- ============================================================================
local function updateCam()
    local yaw, pitch = math.rad(State.camYaw), math.rad(State.camPitch)
    pitch = math.clamp(pitch, math.rad(-70), math.rad(70))
    local dir = Vector3.new(
        math.sin(yaw) * math.cos(pitch),
        math.sin(pitch),
        math.cos(yaw) * math.cos(pitch)
    )
    vpCam.CFrame = CFrame.lookAt(State.camTarget + dir * State.camDist, State.camTarget)
end

-- tự xoay
local rotateConn
local function startAutoRotate()
    if rotateConn then return end
    local last = os.clock()
    rotateConn = RunService.RenderStepped:Connect(function()
        local now = os.clock()
        local dt = now - last
        last = now
        if State.autoRotate and main.Visible then
            State.camYaw = (State.camYaw + CFG.AUTO_ROTATE * dt) % 360
            updateCam()
        end
    end)
end

-- kéo để xoay
local dragging = false
viewport.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1
        or input.UserInputType == Enum.UserInputType.Touch then
        dragging = true
        State.autoRotate = false
    end
end)
viewport.InputChanged:Connect(function(input)
    if dragging and input.UserInputType == Enum.UserInputType.MouseMovement then
        State.camYaw = State.camYaw - input.Delta.X * 0.6
        State.camPitch = math.clamp(State.camPitch - input.Delta.Y * 0.4, -70, 70)
        updateCam()
    end
end)
UserInputService.InputEnded:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1
        or input.UserInputType == Enum.UserInputType.Touch then
        dragging = false
    end
end)
viewport.InputChanged:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseWheel then
        State.camDist = math.clamp(State.camDist - input.Position.Z * 1.2, 3, 30)
        updateCam()
    end
end)

-- ============================================================================
-- DỰNG MODEL 3D TRONG VIEWPORT
-- ============================================================================
local function clearPreview()
    if State.previewModel then
        pcall(function() State.previewModel:Destroy() end)
        State.previewModel = nil
    end
end

-- Dọn script + ẩn HUD để model thành "ma-nơ-canh" tĩnh.
local function prepMannequin(model)
    for _, d in ipairs(model:GetDescendants()) do
        if d:IsA("LuaSourceContainer") then
            d:Destroy()
        end
    end
    local hum = model:FindFirstChildOfClass("Humanoid")
    if hum then
        hum.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None
        pcall(function() hum.HealthDisplayType = Enum.HealthDisplayType.DisplayWhenDamaged end)
        pcall(function() hum:SetStateEnabled(Enum.HumanoidStateType.Physics, false) end)
    end
    return model
end

local function frameModelInViewport(model)
    local ok, cf, size = pcall(function() return model:GetBoundingBox() end)
    if ok and cf and size then
        State.camTarget = cf.Position
        State.camDist = math.max(size.X, size.Y, size.Z) * CFG.CAM_PADDING
        State.camDist = math.clamp(State.camDist, 3, 30)
    else
        State.camTarget = Vector3.new(0, 2.6, 0)
        State.camDist = 9
    end
    State.camYaw = 20
    State.camPitch = -6
    updateCam()
end

-- Tạo model từ HumanoidDescription. Trả về (model, errString).
local function buildModel(desc)
    local ok, model = pcall(function()
        return Players:CreateHumanoidModelFromDescriptionAsync(desc, CFG.RIG_TYPE, CFG.VERIFY)
    end)
    if not ok or not model then
        return nil, tostring(model or "không tạo được model")
    end
    prepMannequin(model)
    return model, nil
end

local function showDescInViewport(desc, statusText)
    clearPreview()
    previewStatus.Text = "⏳ đang dựng 3D…"
    local model, err = buildModel(desc)
    if not model then
        previewStatus.Text = "⚠️ không dựng được"
        previewStatus.TextColor3 = C.RED
        setStatus("Lỗi dựng model: " .. err, C.RED)
        return false
    end
    model.Parent = viewport
    model:PivotTo(CFrame.new(0, 0, 0))
    State.previewModel = model
    frameModelInViewport(model)
    previewStatus.Text = statusText or ""
    previewStatus.TextColor3 = C.ACCENT
    return true
end

-- ============================================================================
-- HTTP
-- ============================================================================
local function httpGet(url)
    local ok, body = pcall(function() return game:HttpGet(url) end)
    if not ok then return nil, tostring(body) end
    return body, nil
end

local function jsonDecode(text)
    local ok, data = pcall(function() return HttpService:JSONDecode(text) end)
    if not ok then return nil end
    return data
end

-- ============================================================================
-- LẤY DANH SÁCH OUTFIT
-- ============================================================================
local function fetchOutfits(userId)
    local all = {}
    for page = 1, CFG.MAX_PAGES do
        local url = string.format(CFG.OUTFIT_URL, userId, CFG.PER_PAGE, page)
        local body, err = httpGet(url)
        if not body then
            return all, "trang " .. page .. " lỗi: " .. err
        end
        local data = jsonDecode(body)
        if type(data) ~= "table" then
            return all, "JSON không đọc được ở trang " .. page
        end
        local rows = data.data
        if type(rows) ~= "table" or #rows == 0 then break end
        for _, row in ipairs(rows) do
            if type(row) == "table" and row.id then
                all[#all + 1] = { id = row.id, name = tostring(row.name or ("Outfit " .. row.id)) }
            end
        end
        if not data.nextPageCursor or data.nextPageCursor == "" then break end
    end
    return all, nil
end

-- ============================================================================
-- RENDER DANH SÁCH OUTFIT
-- ============================================================================
local function makeOutfitRow(order, outfit, isCurrent)
    local imgSrc, title, subtitle
    if isCurrent then
        imgSrc   = ("rbxthumb://type=Avatar&id=%d&w=100&h=100"):format(State.userId)
        title    = "⭐ Avatar hiện tại"
        subtitle = "đang mặc trên Roblox"
    else
        imgSrc   = ("rbxthumb://type=Outfit&id=%d&w=150&h=150"):format(outfit.id)
        title    = outfit.name
        subtitle = "outfit id " .. outfit.id
    end

    local row = button(listScroll, "", {
        Size = UDim2.new(1, -8, 0, 40),
        Bg = C.SURFACE2,
        Order = order,
        Radius = 6,
    })
    row.BackgroundTransparency = 0.25

    new("ImageLabel", {
        Size = UDim2.new(0, 32, 0, 32),
        Position = UDim2.new(0, 4, 0.5, -16),
        BackgroundTransparency = 1,
        Image = imgSrc,
        ScaleType = Enum.ScaleType.Fit,
    }, row)

    label(row, title, {
        Size = UDim2.new(1, -46, 0, 18),
        Position = UDim2.new(0, 42, 0, 5),
        TextSize = 12,
        Color = isCurrent and C.ACCENT or C.TEXT,
        Truncate = Enum.TextTruncate.AtEnd,
    })
    label(row, subtitle, {
        Size = UDim2.new(1, -46, 0, 14),
        Position = UDim2.new(0, 42, 0, 22),
        TextSize = 10,
        Color = C.MUTED,
    })
    return row
end

local function highlightRow(row)
    for _, child in ipairs(listScroll:GetChildren()) do
        if child:IsA("TextButton") then
            child.BackgroundTransparency = 0.25
            local s = child:FindFirstChildOfClass("UIStroke")
            if s then s.Color = C.BORDER end
        end
    end
    if row then
        row.BackgroundTransparency = 0
        local s = row:FindFirstChildOfClass("UIStroke")
        if s then s.Color = C.ACCENT end
    end
end

local selectOutfit   -- forward declaration: rebuildList dùng trước khi hàm được gán

local function rebuildList()
    for _, child in ipairs(listScroll:GetChildren()) do
        if child:IsA("TextButton") then child:Destroy() end
    end
    listEmpty.Visible = (#State.outfits == 0)

    -- dòng "avatar hiện tại"
    local cur = makeOutfitRow(0, nil, true)
    highlightRow(cur)
    cur.Activated:Connect(function()
        selectOutfit("CURRENT", cur)
    end)

    for i, outfit in ipairs(State.outfits) do
        local row = makeOutfitRow(i, outfit, false)
        row.Activated:Connect(function()
            selectOutfit(outfit, row)
        end)
    end
end

-- ============================================================================
-- CHỌN OUTFIT -> DỰNG 3D
-- ============================================================================
selectOutfit = function(outfit, row)
    local token = State.requestToken
    State.requestToken = token + 1
    highlightRow(row)

    local desc, err
    if outfit == "CURRENT" then
        State.selected = "CURRENT"
        setStatus("Đang tải avatar hiện tại của " .. tostring(State.userName) .. "…")
        local ok, d = pcall(function()
            return Players:GetHumanoidDescriptionFromUserIdAsync(State.userId)
        end)
        desc, err = (ok and d) or nil, ok and nil or tostring(d)
    else
        State.selected = outfit
        setStatus(("Đang tải outfit '%s'…"):format(outfit.name))
        local ok, d = pcall(function()
            return Players:GetHumanoidDescriptionFromOutfitIdAsync(outfit.id)
        end)
        desc, err = (ok and d) or nil, ok and nil or tostring(d)
    end

    if token ~= State.requestToken then return end   -- đã có request mới hơn

    if not desc then
        previewStatus.Text = "⚠️ không tải được"
        previewStatus.TextColor3 = C.RED
        setStatus("Không lấy được HumanoidDescription: " .. tostring(err), C.RED)
        return
    end

    State.desc = desc
    local okBuild = showDescInViewport(desc, outfit == "CURRENT" and "⭐ hiện tại" or outfit.name)
    if okBuild then
        local count = 0
        pcall(function() count = #desc:GetAccessories() end)
        setStatus(("✅ %s · %d phụ kiện · id: %s"):format(
            outfit == "CURRENT" and "avatar hiện tại" or outfit.name,
            count,
            outfit == "CURRENT" and ("user " .. State.userId) or tostring(outfit.id)
        ), C.GREEN)
    end
end

-- ============================================================================
-- TRA CỨU NGƯỜI CHƠI
-- ============================================================================
local function resolveUser(input)
    local text = tostring(input or ""):gsub("^%s+", ""):gsub("%s+$", "")
    if text == "" then return nil, "chưa nhập gì" end

    local asNumber = tonumber(text)
    if asNumber then
        local ok, name = pcall(function() return Players:GetNameFromUserIdAsync(asNumber) end)
        if ok and name then return asNumber, name end
        return nil, "không tìm thấy UserId " .. text
    end

    local inGame = Players:FindFirstChild(text)
    if inGame and inGame:IsA("Player") then
        return inGame.UserId, inGame.Name
    end

    local ok, id = pcall(function() return Players:GetUserIdFromNameAsync(text) end)
    if ok and id then return id, text end
    return nil, "không tìm thấy người chơi '" .. text .. "'"
end

local function doSearch(rawInput)
    local token = State.requestToken
    State.requestToken = token + 1
    clearPreview()
    State.outfits = {}
    State.desc = nil
    State.selected = nil
    previewStatus.Text = ""

    setStatus("Đang tra cứu…")
    local userId, nameOrErr = resolveUser(rawInput)
    if not userId then
        infoName.Text = "Không tìm thấy"
        infoMeta.Text = nameOrErr
        avatarThumb.Image = ""
        setStatus("⚠️ " .. nameOrErr, C.RED)
        listEmpty.Text = nameOrErr
        rebuildList()
        return
    end
    if token ~= State.requestToken then return end

    State.userId = userId
    State.userName = nameOrErr
    infoName.Text = tostring(nameOrErr)
    infoMeta.Text = "UserId " .. userId .. "  ·  đang tải danh sách outfit…"
    avatarThumb.Image = ("rbxthumb://type=AvatarHeadShot&id=%d&w=150&h=150"):format(userId)

    local outfits, warnMsg = fetchOutfits(userId)
    if token ~= State.requestToken then return end
    State.outfits = outfits

    local extra = warnMsg and ("  ·  ⚠️ " .. warnMsg) or ""
    infoMeta.Text = ("UserId %d  ·  %d outfit%s"):format(userId, #outfits, extra)
    listEmpty.Text = (#outfits == 0)
        and "Người này không có outfit công khai nào (hoặc để chế độ riêng tư)."
        or "Chưa có dữ liệu."
    rebuildList()

    setStatus(("✅ %s · %d outfit. Bấm một dòng để xem 3D."):format(nameOrErr, #outfits), C.GREEN)
end

-- ============================================================================
-- XUẤT DỮ LIỆU
-- ============================================================================
local function dumpAssetIds()
    local desc = State.desc
    if not desc then
        setStatus("⚠️ Chưa chọn outfit nào để xuất.", C.RED)
        return
    end
    local lines = {}
    lines[#lines + 1] = ("-- %s  (user %s)"):format(
        State.selected == "CURRENT" and "Avatar hiện tại" or tostring(State.selected and State.selected.name or "?"),
        tostring(State.userId)
    )
    local parts = {
        "Face", "Head", "LeftArm", "LeftLeg", "RightArm", "RightLeg", "Torso",
        "Shirt", "Pants", "Graphic", "ClimbAnimation", "FallAnimation",
        "IdleAnimation", "JumpAnimation", "RunAnimation", "SwimAnimation", "WalkAnimation",
    }
    for _, prop in ipairs(parts) do
        local ok, v = pcall(function() return desc[prop] end)
        if ok and type(v) == "number" and v > 0 then
            lines[#lines + 1] = ("%s%s = %d"):format(string.rep(" ", 4), prop, v)
        end
    end
    local okAcc, accessories = pcall(function() return desc:GetAccessories() end)
    if okAcc and type(accessories) == "table" then
        lines[#lines + 1] = "    Accessories:"
        for _, acc in ipairs(accessories) do
            lines[#lines + 1] = ("        %s  %s  %s"):format(
                tostring(acc.AssetId),
                tostring(acc.AccessoryType),
                acc.IsLayered and "layered" or ""
            )
        end
    end
    local okScale, scale = pcall(function() return desc:GetScale() end)
    if okScale and scale then
        lines[#lines + 1] = ("    Scale = { %.3f, %.3f, %.3f, %.3f, %.3f, %.3f }"):format(
            scale.Depth, scale.Head, scale.Height, scale.Proportion, scale.Width, scale.BodyType or 0
        )
    end
    outBox.Text = table.concat(lines, "\n")
    setStatus(("📋 Đã xuất %d dòng asset ID — bôi đen ô rồi Ctrl+C."):format(#lines), C.GREEN)
end

local function dumpDescription()
    local desc = State.desc
    if not desc then
        setStatus("⚠️ Chưa chọn outfit nào để xuất.", C.RED)
        return
    end
    -- HumanoidDescription là một Instance, không JSON hoá trực tiếp được.
    -- Nên ta đọc từng thuộc tính rồi xuất dạng text.
    local out = {}
    for _, prop in ipairs({
        "BackAccessory", "ClimbAnimation", "DepthScale", "Face", "FaceAccessory",
        "FallAnimation", "FrontAccessory", "Graphic", "HairAccessory", "HatAccessory",
        "Head", "HeadColor", "HeadScale", "HeightScale", "IdleAnimation", "JumpAnimation",
        "LeftArm", "LeftArmColor", "LeftLeg", "LeftLegColor", "NeckAccessory",
        "Pants", "ProportionScale", "RightArm", "RightArmColor", "RightLeg",
        "RightLegColor", "RunAnimation", "Shirt", "ShouldersAccessory", "SwimAnimation",
        "Torso", "TorsoColor", "WaistAccessory", "WalkAnimation", "WidthScale", "BodyTypeScale",
    }) do
        local okRead, v = pcall(function() return desc[prop] end)
        if okRead then
            out[#out + 1] = ("%s = %s"):format(prop, tostring(v))
        end
    end
    outBox.Text = table.concat(out, "\n")
    setStatus(("🧬 Đã dump %d thuộc tính HumanoidDescription."):format(#out), C.GREEN)
end

-- ============================================================================
-- MANNEQUIN TRONG WORKSPACE
-- ============================================================================
local function spawnMannequin()
    local desc = State.desc
    if not desc then
        setStatus("⚠️ Chọn một outfit trước đã.", C.RED)
        return
    end
    setStatus("Đang dựng mannequin trong Workspace…")
    local model, err = buildModel(desc)
    if not model then
        setStatus("⚠️ Không dựng được mannequin: " .. tostring(err), C.RED)
        return
    end
    local myChar = LocalPlayer.Character
    local root = myChar and myChar:FindFirstChild("HumanoidRootPart")
    local origin = root and (root.CFrame * CFrame.new(4, 0, -4)) or CFrame.new(0, 10, 0)

    local holder = new("Model", { Name = "Mannequin_" .. tostring(State.userName or "outfit") }, workspace)
    model.Parent = holder
    holder:PivotTo(origin)
    for _, p in ipairs(holder:GetDescendants()) do
        if p:IsA("BasePart") then
            p.Anchored = true
            p.CanCollide = false
        end
    end
    State.mannequins[#State.mannequins + 1] = holder
    setStatus(("✅ Đã đặt mannequin '%s' trước mặt bạn (anchored, không va chạm)."):format(
        State.selected == "CURRENT" and "avatar hiện tại" or tostring(State.selected and State.selected.name or "?")
    ), C.GREEN)
end

local function clearMannequins()
    local n = 0
    for _, m in ipairs(State.mannequins) do
        pcall(function() m:Destroy() end)
        n = n + 1
    end
    State.mannequins = {}
    setStatus(n > 0 and ("🗑 Đã xoá %d mannequin."):format(n) or "Không có mannequin nào.", C.MUTED)
end

-- ============================================================================
-- NỐI SỰ KIỆN
-- ============================================================================
searchBtn.Activated:Connect(function() doSearch(nameBox.Text) end)
nameBox.FocusLost:Connect(function(enterPressed)
    if enterPressed then doSearch(nameBox.Text) end
end)
meBtn.Activated:Connect(function()
    nameBox.Text = LocalPlayer.Name
    doSearch(LocalPlayer.Name)
end)

btnIds.Activated:Connect(dumpAssetIds)
btnDump.Activated:Connect(dumpDescription)
btnMannequin.Activated:Connect(spawnMannequin)
btnClear.Activated:Connect(clearMannequins)

-- mở/đóng
local function setVisible(v)
    main.Visible = v
    toggleBtn.Text = v and "✕" or "👕"
    if v then
        main.Size = UDim2.new(0, 740, 0, 505)
        TweenService:Create(main, TweenInfo.new(0.16, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), {
            Size = UDim2.new(0, 760, 0, 520),
        }):Play()
        nameBox:CaptureFocus()
    end
end

toggleBtn.Activated:Connect(function() setVisible(not main.Visible) end)
closeBtn.Activated:Connect(function() setVisible(false) end)
UserInputService.InputBegan:Connect(function(input, processed)
    if not processed and input.KeyCode == CFG.TOGGLE_KEY then
        setVisible(not main.Visible)
    end
end)

-- kéo cửa sổ
do
    local dragStart, startPos, isDragging
    titleBar.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1
            or input.UserInputType == Enum.UserInputType.Touch then
            isDragging = true
            dragStart = input.Position
            startPos = main.Position
        end
    end)
    UserInputService.InputChanged:Connect(function(input)
        if isDragging and (input.UserInputType == Enum.UserInputType.MouseMovement
            or input.UserInputType == Enum.UserInputType.Touch) then
            local d = input.Position - dragStart
            main.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + d.X,
                                      startPos.Y.Scale, startPos.Y.Offset + d.Y)
        end
    end)
    UserInputService.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1
            or input.UserInputType == Enum.UserInputType.Touch then
            isDragging = false
        end
    end)
end

-- ============================================================================
-- KHỞI ĐỘNG
-- ============================================================================
updateCam()
startAutoRotate()
setStatus(("Sẵn sàng. Phím %s để mở/đóng. Nhập tên người chơi rồi bấm 🔎."):format(
    CFG.TOGGLE_KEY.Name or ";"
))
print("[AvatarOutfitViewer] đã nạp. Bấm nút 👕 hoặc phím ; để mở.")
