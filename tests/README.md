# Kiểm thử Bay theo camera — v4.36

`script.js` là **Luau**, không phải JavaScript. Hub vẫn là một file độc lập để không thay đổi cách nạp hiện có.

## Điều khiển mới

Trong **📚 Script Hub → 🚀 BAY THEO CAMERA**, ngay đầu danh sách:

- **🚀 Bay**: bật/tắt bay điều khiển tay, dùng BodyVelocity/BodyGyro như Bay An Toàn.
- **W/S** hoặc joystick: tiến/lùi theo toàn bộ hướng camera, có cả góc lên/xuống.
- **A/D**: trái/phải theo camera.
- **Space / ⬆**: lên theo trục đứng; **Shift/Ctrl / ⬇**: xuống.
- Không có input: vận tốc mục tiêu bằng 0 (đứng lơ lửng); không tự tiến tới hay bay vòng.
- **🧱 Xuyên tường**: công tắc độc lập, dùng chung trạng thái với thẻ NoClip cũ. Bật/tắt Bay không tự bật/tắt công tắc này.
- **📱 Nút ảo**: HUD có joystick, nút hướng, lên/xuống, kéo vị trí, ẩn và dừng. HUD vẫn dùng được khi đóng menu chính.
- Tốc độ từ **1–2000**, dùng chung với ô tốc độ Bay trong khung tuỳ chỉnh cũ.

Bay thường không chạy logic né vật/người, bán kính né, vòng tròn, khiên hoặc tự bay của `MV.Safe`. **Bay An Toàn vẫn là tính năng riêng, giữ các lựa chọn cũ.** Chuyển giữa Bay thường và Bay An Toàn/bay tới kính/bay tới người sẽ dừng bộ bay trước để tránh hai bộ lực tranh nhau; không xoá kính đã đặt hoặc loại bỏ các tính năng khỏi menu.

## Chạy bộ test

Cần Python 3 và hai chương trình CLI chính thức của Luau: `luau`, `luau-compile` (đã kiểm tra với **0.739**).

Nếu chúng có trong PATH:

```sh
python3 tests/run.py
```

Hoặc chỉ định đường dẫn:

```sh
LUAU_BIN=/path/to/luau \
LUAU_COMPILE_BIN=/path/to/luau-compile \
python3 tests/run.py
```

Runner:

1. Biên dịch **toàn bộ** `script.js`, kiểm tra cả cú pháp và giới hạn thanh ghi/local.
2. Nạp **toàn bộ mã hub thật** vào mock Roblox xác định, không chép lại thuật toán Bay sang test.
3. Kiểm thử giao diện và controller qua các hàm/callback thật.
4. Không tải hay thực thi các script bên ngoài. Mọi yêu cầu HTTP trong test đều bị chặn và làm test thất bại.

Các file:

- `run.py`: biên dịch và tạo bundle tạm, không thay đổi file nguồn.
- `roblox_mock.luau`: vector/CFrame, cây Instance, sự kiện, scheduler, input và render bindings.
- `flight.luau`: 74 test hồi quy.

## Phạm vi kiểm tra

- 7 trang và 31 thẻ chức năng gốc vẫn tồn tại; lọc/tìm không xoá khung Bay mới.
- Góc camera 0°, ±60°, ±90°, đổi yaw, quay camera lúc đang bay, hướng nhân vật khác hướng camera.
- Đứng lơ lửng khi thả điều khiển; tiến/lùi/ngang/lên/xuống; giới hạn tốc độ chéo; input analog.
- Phím/joystick riêng; cảm ứng đa điểm; nhả ngoài nút; kéo/ẩn/dựng lại HUD; mất focus; gõ trong TextBox.
- Hai phím hoặc hai nút hướng đối nhau triệt tiêu, không dùng nhầm MoveDirection cũ.
- NoClip độc lập, hoàn trả CanCollide gốc và không để trợ lực NoClip ghi CFrame khi đang bay.
- Bật lặp lại không tạo trùng mover; tắt trả Humanoid về trạng thái trước khi bay.
- Mất/thay camera, chết/hồi sinh, nhân vật chưa đủ part, thay nhân vật khi mô hình cũ còn tồn tại.
- Mất riêng BodyVelocity, BodyGyro hoặc sàn hiển thị; mất render binding; watchdog chạy ngay và được hủy đúng.
- Chuyển chế độ với Bay An Toàn/bay tới kính/bay tới người; thảm, nhảy, phát sáng, ESP và quan sát người chơi.
- Đồng bộ ô tốc độ mới/cũ, kiểm tra `Text` phải là chuỗi.
- Nạp lại hub khi đang bay không để lại mover/watchdog/kết nối input của phiên di chuyển cũ.

Test đã bắt và giúp sửa thêm rò kết nối input của HUD Bay An Toàn khi nạp lại hub, cùng lỗi hai nút hướng HUD đối nhau vẫn dùng hướng đi cũ.

## Giới hạn và kiểm tra trong Roblox thật

**Mock không phải engine vật lý Roblox.** Test kiểm tra vector vận tốc được yêu cầu, trạng thái, callback và vòng đời đối tượng; không xác nhận cảm giác bay, va chạm thực, độ trễ mạng, server correction hay tương thích mọi game/executor. Không dùng kết quả này làm benchmark FPS.

Checklist thực tế:

1. Bật Bay, không bấm gì: kiểm tra đứng lơ lửng, không né người hoặc tự xoay vòng.
2. Nhìn xuống khoảng 60° rồi giữ W/đẩy joystick: bay xuống theo hướng nhìn; nhìn lên làm tương tự.
3. Giữ W và quay camera qua trái/phải; thả input để dừng. Thử thêm A/D và Space/Shift/Ctrl.
4. Bật rồi tắt NoClip bằng nút mới khi đang bay; kiểm tra va chạm và xem nhãn thẻ NoClip cũ có đồng bộ không.
5. Trên điện thoại: một ngón giữ joystick, ngón khác quay camera; nhả ngón camera không được dừng joystick. Giữ lên/xuống bằng ngón thứ ba nếu thiết bị hỗ trợ.
6. Đóng menu, ẩn/hiện HUD, thả tay ngoài nút, chuyển cửa sổ rồi quay lại: không bị kẹt hướng.
7. Thử hồi sinh và chuyển chế độ Bay ↔ Bay An Toàn/kính/người; không có hai bộ bay cùng kéo nhân vật.
8. Tắt Bay và thử di chuyển/nhảy bình thường; thử nạp lại hub lúc Bay + NoClip đang bật.
