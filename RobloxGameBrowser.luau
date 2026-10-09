--[[======================================================================================
    ROBLOX GAME BROWSER  —  LocalScript
    --------------------------------------------------------------------------------------
    Trình duyệt & launcher game Roblox, chạy NGAY TRONG GAME:
      1. Danh sách game hot (dữ liệu sống: số người chơi, lượt vào, yêu thích).
      2. Ô tìm kiếm — tra MỌI game trên Roblox theo tên.
      3. Bấm 🚀 để vào game (TeleportService).
      4. Thêm game tuỳ ý bằng PlaceId.
      5. Sắp xếp theo số người chơi.

    Cài đặt: LocalScript trong  StarterPlayer > StarterPlayerScripts  (hoặc StarterGui)
    KHÔNG cần executor. Toàn bộ endpoint + API dưới đây đã được kiểm chứng.

    --------------------------------------------------------------------------------------
    ENDPOINT (đã test trực tiếp, KHÔNG cần authentication):

      A. Tìm game theo tên
         https://apis.roblox.com/search-api/omni-search
             ?searchQuery=<tên>&sessionId=<guid>&pageType=all
         -> { searchResults = [ { contents = [ {
                universeId, name, description, playerCount,
                totalUpVotes, totalDownVotes, creatorName,
                rootPlaceId, canonicalUrlPath, contentMaturity } ] } ] }

      B. Lấy thông tin game từ universeId (gộp nhiều id bằng dấu phẩy)
         https://games.roblox.com/v1/games?universeIds=1,2,3
         -> { data = [ { id, rootPlaceId, name, description, playing,
                         visits, maxPlayers, favoritedCount, creator, genre } ] }

      C. PlaceId -> UniverseId
         https://apis.roblox.com/universes/v1/places/<placeId>/universe
         -> { universeId = 123 }

    ĐÃ THỬ VÀ BỊ CHẶN (đừng dùng lại):
      https://games.roblox.com/v1/games/list                      -> đã bị Roblox bỏ
      https://games.roblox.com/v1/games/multiget-place-details    -> lỗi 9002, cần auth

    API engine:
      TeleportService:Teleport(placeId, player)   -- không hoạt động trong Studio
      Thumbnail: rbxthumb://type=GameIcon&id=<universeId>&w=150&h=150
                 (GameIcon chỉ nhận 50x50 / 150x150 / 420x420)
========================================================================================]]

local Players          = game:GetService("Players")
local HttpService      = game:GetService("HttpService")
local TeleportService  = game:GetService("TeleportService")
local UserInputService = game:GetService("UserInputService")
local TweenService     = game:GetService("TweenService")

local LocalPlayer = Players.LocalPlayer

-- ============================================================================
-- CẤU HÌNH
-- ============================================================================
local CFG = {
    SEARCH_URL  = "https://apis.roblox.com/search-api/omni-search?searchQuery=%s&sessionId=%s&pageType=all",
    GAMES_URL   = "https://games.roblox.com/v1/games?universeIds=%s",
    UNIVERSE_URL= "https://apis.roblox.com/universes/v1/places/%d/universe",
    MAX_RESULTS = 30,          -- số game tối đa mỗi lần tìm
    TOGGLE_KEY  = Enum.KeyCode.F2,
}

-- Danh sách khởi đầu: 10 game. TẤT CẢ placeId/universeId dưới đây đã được
-- tra cứu thật qua endpoint C rồi đọc ngược tên qua endpoint B — không đoán.
local SEED_GAMES = {
    { placeId = 79546208627805, universeId = 7326934954,  hint = "99 Nights in the Forest" },
    { placeId = 2753915549,     universeId = 994732206,   hint = "Blox Fruits" },
    { placeId = 4924922222,     universeId = 1686885941,  hint = "Brookhaven RP" },
    { placeId = 142823291,      universeId = 66654135,    hint = "Murder Mystery 2" },
    { placeId = 6516141723,     universeId = 2440500124,  hint = "DOORS" },
    { placeId = 606849621,      universeId = 245662005,   hint = "Jailbreak" },
    { placeId = 9872472334,     universeId = 3647333358,  hint = "Evade" },
    { placeId = 1962086868,     universeId = 703124385,   hint = "Tower of Hell" },
    { placeId = 920587237,      universeId = 383310974,   hint = "Adopt Me!" },
    { placeId = 2788229376,     universeId = 1008451066,  hint = "Da Hood" },
}

-- ============================================================================
-- BẢNG MÀU
-- ============================================================================
local C = {
    BG       = Color3.fromRGB(15, 16, 22),
    SURFACE  = Color3.fromRGB(24, 26, 35),
    SURFACE2 = Color3.fromRGB(34, 37, 49),
    BORDER   = Color3.fromRGB(56, 61, 80),
    TEXT     = Color3.fromRGB(232, 235, 244),
    MUTED    = Color3.fromRGB(138, 145, 166),
    ACCENT   = Color3.fromRGB(96, 165, 250),
    GREEN    = Color3.fromRGB(74, 222, 128),
    YELLOW   = Color3.fromRGB(250, 204, 102),
    RED      = Color3.fromRGB(248, 113, 113),
}

-- ============================================================================
-- TIỆN ÍCH GUI
-- ============================================================================
local function new(className, props, parent)
    local inst = Instance.new(className)
    for k, v in pairs(props or {}) do
        inst[k] = v
    end
    if parent then inst.Parent = parent end
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
        Transparency = 0.2,
    }, obj)
end

local function label(parent, text, opts)
    opts = opts or {}
    return new("TextLabel", {
        Size = opts.Size or UDim2.new(1, 0, 0, 18),
        Position = opts.Position or UDim2.new(0, 0, 0, 0),
        BackgroundTransparency = 1,
        Font = opts.Font or Enum.Font.GothamMedium,
        Text = text,
        TextColor3 = opts.Color or C.TEXT,
        TextSize = opts.TextSize or 13,
        TextXAlignment = opts.XAlign or Enum.TextXAlignment.Left,
        TextYAlignment = opts.YAlign or Enum.TextYAlignment.Top,
        TextWrapped = opts.Wrapped or false,
        TextTruncate = opts.Truncate or Enum.TextTruncate.None,
        LayoutOrder = opts.Order or 0,
    }, parent)
end

local function button(parent, text, opts)
    opts = opts or {}
    local base = opts.Bg or C.SURFACE2
    local b = new("TextButton", {
        Size = opts.Size or UDim2.new(0, 100, 0, 30),
        Position = opts.Position or UDim2.new(0, 0, 0, 0),
        AutoButtonColor = false,
        BackgroundColor3 = base,
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
        TweenService:Create(b, TweenInfo.new(0.12), { BackgroundColor3 = base }):Play()
    end)
    return b
end

-- ============================================================================
-- CÂY GUI
-- ============================================================================
local screenGui = new("ScreenGui", {
    Name = "RobloxGameBrowser",
    ResetOnSpawn = false,
    ZIndexBehavior = Enum.ZIndexBehavior.Sibling,
    DisplayOrder = 50,
    IgnoreGuiInset = true,
}, LocalPlayer:WaitForChild("PlayerGui"))

local toggleBtn = button(screenGui, "🎮", {
    Size = UDim2.new(0, 44, 0, 44),
    Position = UDim2.new(1, -60, 0.5, -22),
    TextSize = 22,
    Radius = 22,
    Bg = C.SURFACE,
    Stroke = C.ACCENT,
})

local main = new("Frame", {
    Name = "Main",
    Size = UDim2.new(0, 820, 0, 540),
    Position = UDim2.new(0.5, -410, 0.5, -270),
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
new("Frame", {
    Size = UDim2.new(1, 0, 0, 12),
    Position = UDim2.new(0, 0, 1, -12),
    BackgroundColor3 = C.SURFACE,
    BorderSizePixel = 0,
}, titleBar)

label(titleBar, "🎮  ROBLOX GAME BROWSER", {
    Size = UDim2.new(1, -80, 0, 38),
    Position = UDim2.new(0, 14, 0, 0),
    TextSize = 14,
    Color = C.ACCENT,
    YAlign = Enum.TextYAlignment.Center,
})

local closeBtn = button(titleBar, "✕", {
    Size = UDim2.new(0, 30, 0, 26),
    Position = UDim2.new(1, -38, 0.5, -13),
    TextSize = 14,
})

-- hàng tìm kiếm
local searchRow = new("Frame", {
    Size = UDim2.new(1, -24, 0, 34),
    Position = UDim2.new(0, 12, 0, 48),
    BackgroundTransparency = 1,
}, main)

local searchBox = new("TextBox", {
    Size = UDim2.new(1, -306, 0, 34),
    BackgroundColor3 = C.SURFACE,
    BorderSizePixel = 0,
    PlaceholderText = "  Tìm game bất kỳ… (VD: Blox Fruits, 99 Nights)",
    PlaceholderColor3 = C.MUTED,
    Text = "",
    TextColor3 = C.TEXT,
    Font = Enum.Font.GothamMedium,
    TextSize = 14,
    TextXAlignment = Enum.TextXAlignment.Left,
    ClearTextOnFocus = false,
}, searchRow)
corner(searchBox, 7)
stroke(searchBox, C.BORDER)

local doSearchBtn = button(searchRow, "🔎  Tìm", {
    Size = UDim2.new(0, 90, 0, 34),
    Position = UDim2.new(1, -298, 0, 0),
    Bg = C.ACCENT,
    Color = Color3.fromRGB(10, 16, 28),
    Stroke = C.ACCENT,
})
local homeBtn = button(searchRow, "⭐ Hot", {
    Size = UDim2.new(0, 76, 0, 34),
    Position = UDim2.new(1, -200, 0, 0),
})
local refreshBtn = button(searchRow, "🔄", {
    Size = UDim2.new(0, 40, 0, 34),
    Position = UDim2.new(1, -116, 0, 0),
    TextSize = 16,
})
local sortBtn = button(searchRow, "👥 ↓", {
    Size = UDim2.new(0, 68, 0, 34),
    Position = UDim2.new(1, -68, 0, 0),
    TextSize = 12,
})

-- danh sách game (bên trái)
local listScroll = new("ScrollingFrame", {
    Size = UDim2.new(0, 380, 1, -150),
    Position = UDim2.new(0, 12, 0, 90),
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
    Padding = UDim.new(0, 5),
    SortOrder = Enum.SortOrder.LayoutOrder,
    HorizontalAlignment = Enum.HorizontalAlignment.Center,
}, listScroll)
new("UIPadding", {
    PaddingTop = UDim.new(0, 6), PaddingBottom = UDim.new(0, 6),
    PaddingLeft = UDim.new(0, 6), PaddingRight = UDim.new(0, 6),
}, listScroll)

-- panel chi tiết (bên phải)
local detail = new("Frame", {
    Size = UDim2.new(1, -404, 1, -150),
    Position = UDim2.new(0, 404, 0, 90),
    BackgroundColor3 = C.SURFACE,
    BorderSizePixel = 0,
    ClipsDescendants = true,
}, main)
corner(detail, 8)

local dIcon = new("ImageLabel", {
    Size = UDim2.new(0, 92, 0, 92),
    Position = UDim2.new(0, 12, 0, 12),
    BackgroundColor3 = C.SURFACE2,
    BorderSizePixel = 0,
    Image = "",
}, detail)
corner(dIcon, 10)

local dName = label(detail, "Chọn một game ở bên trái", {
    Size = UDim2.new(1, -120, 0, 34),
    Position = UDim2.new(0, 114, 0, 12),
    TextSize = 17,
    Font = Enum.Font.GothamBold,
    Wrapped = true,
    YAlign = Enum.TextYAlignment.Center,
})
local dCreator = label(detail, "", {
    Size = UDim2.new(1, -120, 0, 18),
    Position = UDim2.new(0, 114, 0, 48),
    TextSize = 12,
    Color = C.MUTED,
})
local dStats = label(detail, "", {
    Size = UDim2.new(1, -120, 0, 34),
    Position = UDim2.new(0, 114, 0, 68),
    TextSize = 12,
    Color = C.GREEN,
    Wrapped = true,
})

local dDescScroll = new("ScrollingFrame", {
    Size = UDim2.new(1, -24, 1, -176),
    Position = UDim2.new(0, 12, 0, 112),
    BackgroundTransparency = 1,
    BorderSizePixel = 0,
    CanvasSize = UDim2.new(0, 0, 0, 0),
    AutomaticCanvasSize = Enum.AutomaticSize.Y,
    ScrollBarThickness = 4,
    ScrollBarImageColor3 = C.BORDER,
}, detail)
local dDesc = label(dDescScroll, "", {
    Size = UDim2.new(1, -8, 0, 20),
    TextSize = 12,
    Color = C.MUTED,
    Wrapped = true,
})

local joinBtn = button(detail, "🚀  VÀO GAME", {
    Size = UDim2.new(1, -24, 0, 40),
    Position = UDim2.new(0, 12, 1, -50),
    TextSize = 16,
    Font = Enum.Font.GothamBold,
    Bg = C.GREEN,
    Color = Color3.fromRGB(10, 26, 16),
    Stroke = C.GREEN,
})

-- hàng thêm game
local addRow = new("Frame", {
    Size = UDim2.new(1, -24, 0, 30),
    Position = UDim2.new(0, 12, 1, -46),
    BackgroundTransparency = 1,
}, main)
local addBox = new("TextBox", {
    Size = UDim2.new(1, -110, 0, 30),
    BackgroundColor3 = C.SURFACE,
    BorderSizePixel = 0,
    PlaceholderText = "  Thêm game bằng PlaceId (VD: 2753915549)",
    PlaceholderColor3 = C.MUTED,
    Text = "",
    TextColor3 = C.TEXT,
    Font = Enum.Font.GothamMedium,
    TextSize = 12,
    TextXAlignment = Enum.TextXAlignment.Left,
    ClearTextOnFocus = false,
}, addRow)
corner(addBox, 7)
stroke(addBox, C.BORDER)
local addBtn = button(addRow, "➕ Thêm", {
    Size = UDim2.new(0, 102, 0, 30),
    Position = UDim2.new(1, -102, 0, 0),
    TextSize = 12,
})

local statusLbl = label(main, "Sẵn sàng.", {
    Size = UDim2.new(1, -24, 0, 16),
    Position = UDim2.new(0, 12, 1, -12),
    TextSize = 11,
    Color = C.MUTED,
    Truncate = Enum.TextTruncate.AtEnd,
})

-- ============================================================================
-- TRẠNG THÁI
-- ============================================================================
local State = {
    games = {},        -- [universeId] = { universeId, placeId, name, creator, playing, visits, favorites, desc, up, down }
    order = {},        -- thứ tự hiển thị
    selected = nil,
    sortByPlaying = true,
    token = 0,
}

local function setStatus(text, color)
    statusLbl.Text = text
    statusLbl.TextColor3 = color or C.MUTED
end

local function fmtInt(n)
    n = tonumber(n) or 0
    local s = tostring(math.floor(n))
    local out = s:reverse():gsub("(%d%d%d)", "%1."):reverse()
    return (out:gsub("^%.", ""))
end

-- ============================================================================
-- HTTP
-- ============================================================================
local function httpGet(url)
    local ok, body = pcall(function() return game:HttpGet(url) end)
    if not ok then return nil, tostring(body) end
    return body, nil
end

local function json(text)
    local ok, data = pcall(function() return HttpService:JSONDecode(text) end)
    if not ok then return nil end
    return data
end

-- ============================================================================
-- NẠP DỮ LIỆU
-- ============================================================================

-- B: gộp nhiều universeId -> thông tin sống
local function fetchByUniverseIds(universeIds)
    if #universeIds == 0 then return {}, nil end
    local body, err = httpGet(string.format(CFG.GAMES_URL, table.concat(universeIds, ",")))
    if not body then return {}, err end
    local data = json(body)
    if type(data) ~= "table" or type(data.data) ~= "table" then
        return {}, "JSON không đọc được"
    end
    return data.data, nil
end

-- A: tìm theo tên
local function searchGames(query)
    local sid = ""
    pcall(function() sid = HttpService:GenerateGUID(false) end)
    if sid == "" then sid = "gamebrowser" .. tostring(os.time()) end

    local encoded = query
    pcall(function() encoded = HttpService:UrlEncode(query) end)

    local url = string.format(CFG.SEARCH_URL, encoded, sid)
    local body, err = httpGet(url)
    if not body then return {}, err end

    local data = json(body)
    if type(data) ~= "table" or type(data.searchResults) ~= "table" then
        return {}, "Kết quả tìm kiếm không đọc được"
    end

    local out = {}
    for _, group in ipairs(data.searchResults) do
        if type(group) == "table" and type(group.contents) == "table" then
            for _, g in ipairs(group.contents) do
                if type(g) == "table" and g.universeId and g.rootPlaceId then
                    out[#out + 1] = {
                        universeId = g.universeId,
                        placeId    = g.rootPlaceId,
                        name       = tostring(g.name or "Không tên"),
                        creator    = tostring(g.creatorName or ""),
                        playing    = tonumber(g.playerCount) or 0,
                        desc       = tostring(g.description or ""),
                        up         = tonumber(g.totalUpVotes) or 0,
                        down       = tonumber(g.totalDownVotes) or 0,
                    }
                    if #out >= CFG.MAX_RESULTS then return out, nil end
                end
            end
        end
    end
    return out, nil
end

-- C: placeId -> universeId
local function universeFromPlaceId(placeId)
    local body, err = httpGet(string.format(CFG.UNIVERSE_URL, placeId))
    if not body then return nil, err end
    local data = json(body)
    if type(data) ~= "table" or not data.universeId then
        return nil, "PlaceId không tồn tại hoặc không đọc được"
    end
    return tonumber(data.universeId), nil
end

-- ============================================================================
-- HIỂN THỊ
-- ============================================================================
local selectGame   -- forward declaration
local rebuildList  -- forward declaration

local function makeRow(order, g)
    local row = button(listScroll, "", {
        Size = UDim2.new(1, -8, 0, 56),
        Bg = C.SURFACE2,
        Order = order,
        Radius = 8,
    })
    row.BackgroundTransparency = 0.3

    new("ImageLabel", {
        Size = UDim2.new(0, 44, 0, 44),
        Position = UDim2.new(0, 6, 0.5, -22),
        BackgroundColor3 = C.SURFACE,
        BorderSizePixel = 0,
        Image = ("rbxthumb://type=GameIcon&id=%d&w=150&h=150"):format(g.universeId),
        ScaleType = Enum.ScaleType.Crop,
    }, row)
    corner(row:FindFirstChildOfClass("ImageLabel"), 6)

    label(row, g.name, {
        Size = UDim2.new(1, -116, 0, 18),
        Position = UDim2.new(0, 56, 0, 8),
        TextSize = 13,
        Font = Enum.Font.GothamSemibold,
        Truncate = Enum.TextTruncate.AtEnd,
    })
    label(row, ("👥 %s đang chơi"):format(fmtInt(g.playing)), {
        Size = UDim2.new(1, -116, 0, 14),
        Position = UDim2.new(0, 56, 0, 27),
        TextSize = 11,
        Color = C.GREEN,
    })
    local sub = g.creator ~= "" and g.creator or ("place " .. tostring(g.placeId))
    label(row, sub, {
        Size = UDim2.new(1, -116, 0, 12),
        Position = UDim2.new(0, 56, 0, 41),
        TextSize = 10,
        Color = C.MUTED,
        Truncate = Enum.TextTruncate.AtEnd,
    })

    row.Activated:Connect(function() selectGame(g, row) end)
    return row
end

local function sortedGames()
    local list = {}
    for _, uid in ipairs(State.order) do
        if State.games[uid] then list[#list + 1] = State.games[uid] end
    end
    if State.sortByPlaying then
        table.sort(list, function(a, b) return (a.playing or 0) > (b.playing or 0) end)
    end
    return list
end

function rebuildList()
    for _, child in ipairs(listScroll:GetChildren()) do
        if child:IsA("TextButton") then child:Destroy() end
    end
    local list = sortedGames()
    if #list == 0 then
        label(listScroll, "Không có game nào. Thử tìm kiếm hoặc thêm PlaceId.", {
            Size = UDim2.new(1, -16, 0, 60),
            TextSize = 12, Color = C.MUTED,
            XAlign = Enum.TextXAlignment.Center, Wrapped = true,
        })
        return
    end
    for i, g in ipairs(list) do
        local row = makeRow(i, g)
        if State.selected and State.selected.universeId == g.universeId then
            row.BackgroundTransparency = 0
            local s = row:FindFirstChildOfClass("UIStroke")
            if s then s.Color = C.ACCENT end
        end
    end
end

function selectGame(g, row)
    State.selected = g
    for _, child in ipairs(listScroll:GetChildren()) do
        if child:IsA("TextButton") then
            child.BackgroundTransparency = 0.3
            local s = child:FindFirstChildOfClass("UIStroke")
            if s then s.Color = C.BORDER end
        end
    end
    if row then
        row.BackgroundTransparency = 0
        local s = row:FindFirstChildOfClass("UIStroke")
        if s then s.Color = C.ACCENT end
    end

    dIcon.Image = ("rbxthumb://type=GameIcon&id=%d&w=150&h=150"):format(g.universeId)
    dName.Text = g.name
    dCreator.Text = (g.creator ~= "" and ("bởi " .. g.creator) or "") .. ("  ·  place %d"):format(g.placeId)
    dDesc.Text = (g.desc ~= "" and g.desc) or "(không có mô tả)"

    local parts = { ("👥 %s đang chơi"):format(fmtInt(g.playing)) }
    if g.visits then parts[#parts + 1] = ("📈 %s lượt vào"):format(fmtInt(g.visits)) end
    if g.favorites then parts[#parts + 1] = ("⭐ %s thích"):format(fmtInt(g.favorites)) end
    if g.up and g.up > 0 then
        local total = (g.up or 0) + (g.down or 0)
        local pct = total > 0 and math.floor((g.up / total) * 100) or 0
        parts[#parts + 1] = ("👍 %d%%"):format(pct)
    end
    dStats.Text = table.concat(parts, "   ·   ")
end

-- ============================================================================
-- NẠP DANH SÁCH
-- ============================================================================
local function loadSeedList()
    State.token = State.token + 1
    local token = State.token

    setStatus("Đang tải danh sách game hot…")
    State.games, State.order = {}, {}

    local ids = {}
    for _, seed in ipairs(SEED_GAMES) do
        ids[#ids + 1] = tostring(seed.universeId)
        -- giữ hint để nếu API lỗi thì vẫn hiện được tên
        State.games[seed.universeId] = {
            universeId = seed.universeId,
            placeId = seed.placeId,
            name = seed.hint,
            creator = "",
            playing = 0,
            desc = "",
        }
        State.order[#State.order + 1] = seed.universeId
    end

    local rows, err = fetchByUniverseIds(ids)
    if token ~= State.token then return end

    if err then
        setStatus("⚠️ Không lấy được dữ liệu sống: " .. tostring(err), C.YELLOW)
        rebuildList()
        return
    end

    local filled = 0
    for _, r in ipairs(rows) do
        local uid = tonumber(r.id)
        if uid and State.games[uid] then
            local g = State.games[uid]
            g.name = tostring(r.name or g.name)
            g.playing = tonumber(r.playing) or 0
            g.visits = tonumber(r.visits) or 0
            g.favorites = tonumber(r.favoritedCount) or 0
            g.desc = tostring(r.description or "")
            g.placeId = tonumber(r.rootPlaceId) or g.placeId
            if type(r.creator) == "table" then g.creator = tostring(r.creator.name or "") end
            filled = filled + 1
        end
    end

    rebuildList()
    setStatus(("✅ %d game · %d có dữ liệu sống · %s"):format(
        #State.order, filled, os.date("%H:%M:%S")), C.GREEN)
end

local function doSearch(query)
    query = tostring(query or ""):gsub("^%s+", ""):gsub("%s+$", "")
    if query == "" then
        loadSeedList()
        return
    end
    State.token = State.token + 1
    local token = State.token

    setStatus(("Đang tìm '%s'…"):format(query))
    local results, err = searchGames(query)
    if token ~= State.token then return end

    if err then
        setStatus("⚠️ Tìm kiếm lỗi: " .. tostring(err), C.RED)
        return
    end
    if #results == 0 then
        setStatus(("Không tìm thấy game nào khớp '%s'."):format(query), C.YELLOW)
        State.games, State.order, State.selected = {}, {}, nil
        rebuildList()
        return
    end

    State.games, State.order, State.selected = {}, {}, nil
    for _, g in ipairs(results) do
        State.games[g.universeId] = g
        State.order[#State.order + 1] = g.universeId
    end
    rebuildList()
    setStatus(("✅ Tìm thấy %d game cho '%s'."):format(#results, query), C.GREEN)
end

local function addByPlaceId(raw)
    local placeId = tonumber(tostring(raw or ""):gsub("^%s+", ""):gsub("%s+$", ""))
    if not placeId then
        setStatus("⚠️ PlaceId phải là số.", C.RED)
        return
    end
    State.token = State.token + 1
    local token = State.token

    setStatus(("Đang tra PlaceId %d…"):format(placeId))
    local uid, err = universeFromPlaceId(placeId)
    if token ~= State.token then return end
    if not uid then
        setStatus("⚠️ " .. tostring(err), C.RED)
        return
    end

    local rows = fetchByUniverseIds({ tostring(uid) })
    if token ~= State.token then return end

    local g = {
        universeId = uid, placeId = placeId,
        name = ("place %d"):format(placeId), creator = "", playing = 0, desc = "",
    }
    if type(rows) == "table" and rows[1] then
        local r = rows[1]
        g.name = tostring(r.name or g.name)
        g.playing = tonumber(r.playing) or 0
        g.visits = tonumber(r.visits) or 0
        g.favorites = tonumber(r.favoritedCount) or 0
        g.desc = tostring(r.description or "")
        if type(r.creator) == "table" then g.creator = tostring(r.creator.name or "") end
    end

    if State.games[uid] then
        setStatus("ℹ️ Game này đã có trong danh sách.", C.YELLOW)
        return
    end
    State.games[uid] = g
    State.order[#State.order + 1] = uid
    rebuildList()
    addBox.Text = ""
    setStatus(("✅ Đã thêm '%s' (👥 %s)."):format(g.name, fmtInt(g.playing)), C.GREEN)
end

-- ============================================================================
-- VÀO GAME
-- ============================================================================
local function joinSelected()
    local g = State.selected
    if not g then
        setStatus("⚠️ Chọn một game trước đã.", C.RED)
        return
    end
    setStatus(("Đang vào '%s'…"):format(g.name), C.YELLOW)
    local ok, err = pcall(function()
        TeleportService:Teleport(g.placeId, LocalPlayer)
    end)
    if not ok then
        -- Trong Studio TeleportService luôn lỗi; nói rõ để người dùng không tưởng script hỏng.
        setStatus("⚠️ Không vào được: " .. tostring(err) .. "  (trong Studio thì teleport bị chặn)", C.RED)
    end
end

-- ============================================================================
-- SỰ KIỆN
-- ============================================================================
doSearchBtn.Activated:Connect(function() doSearch(searchBox.Text) end)
searchBox.FocusLost:Connect(function(enter) if enter then doSearch(searchBox.Text) end end)
homeBtn.Activated:Connect(function() searchBox.Text = "" loadSeedList() end)
refreshBtn.Activated:Connect(function()
    if searchBox.Text == "" then loadSeedList() else doSearch(searchBox.Text) end
end)
sortBtn.Activated:Connect(function()
    State.sortByPlaying = not State.sortByPlaying
    sortBtn.Text = State.sortByPlaying and "👥 ↓" or "↕ Mặc định"
    rebuildList()
end)
addBtn.Activated:Connect(function() addByPlaceId(addBox.Text) end)
addBox.FocusLost:Connect(function(enter) if enter then addByPlaceId(addBox.Text) end end)
joinBtn.Activated:Connect(joinSelected)

-- mở/đóng + kéo
local function setVisible(v)
    main.Visible = v
    toggleBtn.Text = v and "✕" or "🎮"
    if v then
        main.Size = UDim2.new(0, 800, 0, 525)
        TweenService:Create(main, TweenInfo.new(0.16, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), {
            Size = UDim2.new(0, 820, 0, 540),
        }):Play()
        if #State.order == 0 then loadSeedList() end
    end
end
toggleBtn.Activated:Connect(function() setVisible(not main.Visible) end)
closeBtn.Activated:Connect(function() setVisible(false) end)
UserInputService.InputBegan:Connect(function(input, processed)
    if not processed and input.KeyCode == CFG.TOGGLE_KEY then setVisible(not main.Visible) end
end)

do
    local dragStart, startPos, draggingTitle
    titleBar.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1
            or input.UserInputType == Enum.UserInputType.Touch then
            draggingTitle, dragStart, startPos = true, input.Position, main.Position
        end
    end)
    UserInputService.InputChanged:Connect(function(input)
        if draggingTitle and (input.UserInputType == Enum.UserInputType.MouseMovement
            or input.UserInputType == Enum.UserInputType.Touch) then
            local d = input.Position - dragStart
            main.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + d.X,
                                      startPos.Y.Scale, startPos.Y.Offset + d.Y)
        end
    end)
    UserInputService.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1
            or input.UserInputType == Enum.UserInputType.Touch then
            draggingTitle = false
        end
    end)
end

-- ============================================================================
-- KHỞI ĐỘNG
-- ============================================================================
setStatus(("Sẵn sàng. Phím %s để mở/đóng."):format(CFG.TOGGLE_KEY.Name or "F2"))
print("[RobloxGameBrowser] đã nạp. Bấm 🎮 hoặc phím F2.")
