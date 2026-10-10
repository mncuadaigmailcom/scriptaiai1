# Trang phục Roblox

`script.js` là Luau client, trong tab 👥 có hai nút khác nhau:

- **👕 Mặc LOCAL**: tìm username Roblox (kể cả tài khoản offline), lấy HumanoidDescription, thử `ApplyDescriptionReset`/`ApplyDescription`, rồi tạo mẫu avatar cục bộ bằng `Players:CreateHumanoidModelFromDescription` và sao chép Shirt/Pants/ShirtGraphic/Accessory vào nhân vật của bạn. **↩ Khôi phục LOCAL** khôi phục mô tả và quần áo/phụ kiện đã lưu của nhân vật hiện tại. Thay đổi client thường chỉ bạn thấy; game có thể ghi đè và API có thể không được hỗ trợ trên một số môi trường. Phụ kiện tùy chỉnh/morph khác của game có thể không được tái tạo chính xác. Hồi sinh sẽ trở lại nhân vật game.
- **🌐 Mặc SERVER**: chỉ dùng trong game **bạn sở hữu**. Đặt nội dung `OutfitServer.server.lua` vào `ServerScriptService` dưới dạng Script. Server tạo `ReplicatedStorage.BC_OutfitRequest`, xác thực UserId, chỉ sửa nhân vật người gửi và lưu mô tả để **↩ Khôi phục SERVER**. **Mọi người đều thấy** thay đổi này.

Dùng **username** tài khoản, không phải display name. Không thể cài Script phía server của game người khác bằng executor. Chế độ local không bảo đảm đổi được ở mọi game; mode server không đáp ứng yêu cầu “chỉ mình thấy”.
