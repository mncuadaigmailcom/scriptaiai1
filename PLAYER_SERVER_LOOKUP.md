# Tìm server người chơi trong Script Hub

Mở tab 📚 Script Hub → mục 🔎 TÌM SERVER NGƯỜI CHƠI (hoặc lọc **Server**), nhập **username** Roblox và bấm Tìm. Kết quả có thể gồm tên place/game, PlaceId và JobId của server; không tự động dịch chuyển.

Để hoạt động đáng tin cậy trong **game do bạn sở hữu**, đặt `PlayerServerLookup.server.lua` vào `ServerScriptService` dưới dạng **Script**. ServerScript tạo `ReplicatedStorage.BC_PlayerServerLookup` và thực hiện `TeleportService:GetPlayerPlaceInstanceAsync` phía server. Có giới hạn tốc độ 3 giây/lần/người. Nếu không cài server companion, client thử gọi API trực tiếp; nhiều môi trường sẽ từ chối thao tác này và UI sẽ báo lỗi cụ thể.

Roblox có thể không trả về server do người dùng offline, quyền riêng tư, server riêng hoặc hạn chế API. Không thể đảm bảo tìm thấy mọi người chơi, cũng không thể cài ServerScript vào game người khác bằng executor. Đây không phải cơ chế vượt quyền riêng tư Roblox.
