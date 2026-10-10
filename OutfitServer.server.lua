-- Đặt Script này trong ServerScriptService của game Roblox do bạn quản lý.
-- Chế độ này thay ngoại hình trên SERVER: mọi người chơi đều có thể nhìn thấy.
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local remote = ReplicatedStorage:FindFirstChild("BC_OutfitRequest")
if not remote then
    remote = Instance.new("RemoteFunction")
    remote.Name = "BC_OutfitRequest"
    remote.Parent = ReplicatedStorage
end

local saved = {} -- [Player] = {character = Model, description = HumanoidDescription}
local lastCall = {} -- chống spam request

Players.PlayerRemoving:Connect(function(p)
    saved[p] = nil
    lastCall[p] = nil
end)

remote.OnServerInvoke = function(p, action, userId)
    if action ~= "apply" and action ~= "restore" then return false, "Yêu cầu không hợp lệ" end
    local now = os.clock()
    if lastCall[p] and now - lastCall[p] < 1 then return false, "Vui lòng đợi 1 giây" end
    lastCall[p] = now
    local character = p.Character
    local humanoid = character and character:FindFirstChildOfClass("Humanoid")
    if not humanoid or humanoid.Health <= 0 then return false, "Nhân vật chưa sẵn sàng" end
    if action == "restore" then
        local entry = saved[p]
        if not entry or entry.character ~= character then return false, "Không có trang phục gốc để khôi phục" end
        local ok, err = pcall(function() humanoid:ApplyDescription(entry.description) end)
        if ok then saved[p] = nil; return true, "Đã khôi phục trang phục gốc" end
        return false, tostring(err)
    end
    if type(userId) ~= "number" or userId ~= math.floor(userId) or userId < 1 or userId > 9999999999999 then
        return false, "UserId không hợp lệ"
    end
    local okFetch, description = pcall(function() return Players:GetHumanoidDescriptionFromUserId(userId) end)
    if not okFetch or not description then return false, "Không tải được trang phục: " .. tostring(description) end
    -- Recheck sau khi hàm mạng yield: không áp lên nhân vật mới sau hồi sinh.
    if p.Character ~= character or humanoid.Parent ~= character then return false, "Nhân vật đã thay đổi; thử lại" end
    if not saved[p] or saved[p].character ~= character then
        local okOriginal, original = pcall(function() return humanoid:GetAppliedDescription() end)
        if not okOriginal or not original then return false, "Không lưu được trang phục gốc" end
        saved[p] = {character = character, description = original}
    end
    local okApply, err = pcall(function() humanoid:ApplyDescription(description) end)
    if not okApply then return false, tostring(err) end
    return true, "Đã áp trang phục trên server (mọi người đều thấy)"
end
