-- Đặt Script trong ServerScriptService của game bạn sở hữu.
-- Roblox có thể từ chối tra cứu vì quyền riêng tư / trạng thái offline.
local Players = game:GetService("Players")
local TeleportService = game:GetService("TeleportService")
local MarketplaceService = game:GetService("MarketplaceService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local remote = ReplicatedStorage:FindFirstChild("BC_PlayerServerLookup")
if not remote then
    remote = Instance.new("RemoteFunction")
    remote.Name = "BC_PlayerServerLookup"
    remote.Parent = ReplicatedStorage
end
assert(remote:IsA("RemoteFunction"), "BC_PlayerServerLookup phải là RemoteFunction")
local last = {}
Players.PlayerRemoving:Connect(function(p) last[p] = nil end)

remote.OnServerInvoke = function(caller, username)
    if type(username) ~= "string" or #username < 1 or #username > 20 or not username:match("^[%w_]+$") then
        return false, "Username không hợp lệ"
    end
    local now = os.clock()
    if last[caller] and now - last[caller] < 3 then return false, "Chờ 3 giây trước khi tìm tiếp" end
    last[caller] = now
    local okId, userId = pcall(function() return Players:GetUserIdFromNameAsync(username) end)
    if not okId then return false, "Không tìm thấy username" end
    local ok, sameServer, message, placeId, jobId = pcall(function()
        return TeleportService:GetPlayerPlaceInstanceAsync(userId)
    end)
    if not ok then return false, "Không tra được: " .. tostring(sameServer) end
    if type(placeId) ~= "number" or placeId <= 0 then
        return false, "Offline hoặc Roblox không chia sẻ server: " .. tostring(message or "")
    end
    local name = "Place " .. tostring(placeId)
    local okName, info = pcall(function() return MarketplaceService:GetProductInfo(placeId, Enum.InfoType.Asset) end)
    if okName and type(info) == "table" and type(info.Name) == "string" then name = info.Name end
    return true, name, placeId, type(jobId) == "string" and jobId or "", sameServer == true
end
