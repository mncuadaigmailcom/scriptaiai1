# Cài tính năng trang phục Roblox

`script.js` là Luau **LocalScript** tạo giao diện tab 👥. Nếu muốn thay đổi trang phục đáng tin cậy trong **game do bạn quản lý**, đặt nội dung `OutfitServer.server.lua` vào **ServerScriptService** dưới dạng Script (không phải LocalScript), rồi chạy `script.js` trên client như trước. Server tự tạo `ReplicatedStorage.BC_OutfitRequest`.

Trong tab 👥, nhập **username Roblox** (không phải display name), nhấn **👕 Mặc trang phục**. Có thể dùng tài khoản không ở server hoặc offline. **↩ Khôi phục** trả về mô tả đã lưu cho nhân vật hiện tại. Hồi sinh tạo nhân vật mới và không tự mặc lại.

**Giới hạn quan trọng:** ServerScript áp trang phục trên server, vì vậy **mọi người đều thấy**, không đáp ứng yêu cầu “chỉ mình tôi thấy”. Không thể cài ServerScript vào game của người khác chỉ bằng executor/LocalScript. Nếu không có server companion, client thử `ApplyDescription` cục bộ; game có thể ghi đè hoặc ngăn thay đổi, nên không thể hứa hoạt động ở mọi game. Không có cách server-authoritative vừa đổi chính nhân vật của bạn vừa bảo đảm không ai khác nhìn thấy nó; để chỉ mình thấy cần một nhân vật giả/preview riêng phía client, không phải thay avatar thật trên server.
