# Kiểm thử tốc độ chạy + Bay theo camera — v4.37

`script.js` là **Luau**, không phải JavaScript. Hub vẫn là một file độc lập để không thay đổi cách nạp hiện có.

## Mới: 🏃 Tốc độ chạy mặt đất

Mở **📚 Script Hub → 🏃 TỐC ĐỘ CHẠY**, ở đầu danh sách:

1. **Kéo thanh từ trái sang phải**, hoặc nhập số rồi bấm **✔ Áp dụng / Enter**. Thanh kéo và ô số dùng chung giá trị; hỗ trợ số thập phân, ví dụ `12.5`.
2. Bấm **🏃 Tốc độ: BẬT** để áp dụng. Chỉnh số khi đang tắt chỉ chuẩn bị giá trị, không thay đổi nhân vật.
3. Dùng **WASD / joystick gốc của game**. Chế độ này chỉ chỉnh `Humanoid.WalkSpeed`: không có BodyVelocity/BodyGyro, không ghi CFrame/vận tốc, không sửa trọng lực/lực nhảy, không tạo nút ảo hay tự bật xuyên tường. Hướng chạy và va chạm do bộ điều khiển/engine của game xử lý; nhìn lên/xuống không được chuyển thành lực bay.
4. **↺ Theo game** bỏ lựa chọn thủ công và chọn giới hạn quan sát hiện tại. **⏹ Dừng** hoàn trả WalkSpeed nếu thuộc tính vẫn đang giữ giá trị do chế độ này áp dụng.

### Giới hạn tốc độ — không phải bảo đảm chống ban

**Client không biết tốc độ tối đa thật hoặc ngưỡng anti-cheat của server.** Thay đổi WalkSpeed vẫn có thể vi phạm luật game; không có chức năng hay kết quả test nào ở đây bảo đảm tránh ban.

- Trần của thanh kéo/ô số = **min(WalkSpeed quan sát hiện tại khi hub không can thiệp, 500)**. `500` chỉ là trần kỹ thuật của điều khiển, **không phải ngưỡng an toàn**.
- Ví dụ: game quan sát là `16` thì chọn được `0–16`; nhập `100` sẽ bị kẹp về `16`. Tính năng mới **không tự tăng vượt mức quan sát của game**.
- Giá trị **cao nhất quan sát** chỉ là thông tin, không dùng làm trần khi game đã giảm tốc độ. Không dùng đỉnh vận tốc bay, teleport, rơi, hay `SpeedMeter.max` để đoán giới hạn.
- Chưa có nhân vật/WalkSpeed hợp lệ: không đoán `16` làm mặc định. Game đặt `0`: không tự mở khoá di chuyển.
- Game ghi WalkSpeed khác khi đang điều chỉnh: **tự dừng và nhường game**, cập nhật trần, không liên tục ghi lại để chống server correction. Muốn bật lại cần thao tác của người dùng.
- Quan sát qua event WalkSpeed và Heartbeat khoảng 5 lần/giây; không ghi tốc độ mỗi frame hoặc dựng watchdog di chuyển mới. Lọc cả event tức thời và deferred để không nhận nhầm giá trị của chính mình thành tốc độ game.
- Khi hồi sinh, đọc giới hạn của **nhân vật mới**, không dùng đỉnh/cap của nhân vật trước. Khi tắt, đổi chế độ, đóng hoặc nạp lại hub: chỉ khôi phục thuộc tính còn do controller giữ, không ghi đè thay đổi mới của game.

Để không tranh lực/thuộc tính, bật chạy mặt đất sẽ dừng các chế độ bay, NoClip, nhảy vô hạn, tăng tốc cũ và thảm đang bật. Bật lại một trong các chế độ đó thì chạy mặt đất nhường quyền. **Không xoá chức năng, cấu hình hay kính đã đặt.** Phát sáng/ESP/quan sát người chơi vẫn là các chức năng độc lập. Giới hạn của chế độ mới **không áp dụng thay** cho các chế độ di chuyển cũ.

## Bay theo camera (v4.36, được giữ nguyên)

Trong **📚 Script Hub → 🚀 BAY THEO CAMERA**:

- **🚀 Bay**: bật/tắt bay điều khiển tay, dùng BodyVelocity/BodyGyro như Bay An Toàn.
- **W/S** hoặc joystick: tiến/lùi theo toàn bộ hướng camera, có cả góc lên/xuống.
- **A/D**: trái/phải theo camera.
- **Space / ⬆**: lên theo trục đứng; **Shift/Ctrl / ⬇**: xuống.
- Không có input: vận tốc mục tiêu bằng 0 (đứng lơ lửng); không tự tiến tới hay bay vòng.
- **🧱 Xuyên tường**: công tắc độc lập, dùng chung trạng thái với thẻ NoClip cũ. Bật/tắt Bay không tự bật/tắt công tắc này.
- **📱 Nút ảo**: HUD có joystick, nút hướng, lên/xuống, kéo vị trí, ẩn và dừng; vẫn dùng được khi đóng menu chính. HUD này thuộc **Bay**, không thuộc chế độ chạy mặt đất mới.
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

Có thể chọn riêng một suite: `python3 tests/run.py flight` hoặc `python3 tests/run.py ground_speed`.

Runner:

1. Biên dịch **toàn bộ** `script.js`, kiểm tra cả cú pháp và giới hạn thanh ghi/local.
2. Nạp **toàn bộ mã hub thật** vào mock Roblox xác định, không chép lại thuật toán điều khiển sang test.
3. Kiểm thử giao diện và controller qua các hàm/callback thật, mỗi test dùng một hub mới.
4. Không tải hay thực thi các script bên ngoài. Mọi yêu cầu HTTP trong test đều bị chặn và làm test thất bại.

Các file:

- `run.py`: biên dịch và tạo bundle tạm, không thay đổi file nguồn.
- `roblox_mock.luau`: vector/CFrame, cây Instance, sự kiện tức thời/deferred, scheduler, input và render bindings; đếm ghi Humanoid và hỗ trợ mô phỏng từ chối ghi WalkSpeed.
- `flight.luau`: **74 test hồi quy Bay và các tính năng cũ**.
- `ground_speed.luau`: **93 test tốc độ chạy**.

**Kết quả v4.37: 167/167 test đạt**, cùng biên dịch full hub và kiểm tra diff giữ CRLF.

## Phạm vi kiểm tra

### Tốc độ chạy

- Giữ 7 trang và kiểm tra theo tên từng thẻ trong 31 thẻ gốc; thêm đúng 1 thẻ tốc độ chạy (tổng 32).
- Không viết ngoài WalkSpeed khi bật riêng chế độ mới; không tạo mover, HUD, watchdog hay ghi lại thuộc tính mỗi frame.
- Thanh kéo chuột/cảm ứng: hai đầu, giữa, vượt biên, làm tròn, trần thập phân, nhả ngoài, đa chạm, khôi phục cuộn, ẩn khung/tab/menu/ScreenGui và mất focus.
- Ô số: Enter/nút Áp dụng, số thập phân, 0, số âm, quá trần, rỗng, NaN, infinity; không xoá số đang gõ khi refresh/lọc.
- Quan sát mới nhất khác đỉnh quan sát; không lấy đỉnh bay/teleport; trần kỹ thuật khác ngưỡng anti-cheat; game khoá 0 hoặc chưa có tốc độ hợp lệ.
- Event của chính controller (immediate/deferred), game tăng/giảm/khoá tốc độ, mất event, từ chối ghi hoặc ghi trả ngay lập tức; tự dừng thay vì ép lại.
- Thẻ và khung hiển thị cùng trạng thái, StopAll/reset-to-game, trả đúng baseline, không giẫm ghi mới của game; SpeedMeter cũ không học nhầm tốc độ đang chỉnh.
- Chuyển hai chiều với Bay, Bay An Toàn, NoClip, nhảy vô hạn, boost, thảm/chạy trên thảm, bay tới kính/người; không tắt chế độ đang chạy vì yêu cầu chuyển không hợp lệ.
- Chết, khoảng trống hồi sinh, Humanoid đến muộn, thay trực tiếp nhân vật; event chết/reset cũ không được huỷ ý định chạy ở nhân vật mới.
- Đóng/huỷ/gỡ Parent GUI, reload liên tiếp, huỷ panel, callback hồi sinh cũ còn chờ; không để controller cũ gắn lại observer.

Test đã bắt và giúp sửa: kẹt cuộn khi ẩn panel/ScreenGui; thông báo chưa có tốc độ không đổi sau khi game sẵn sàng; nhãn thẻ cũ sau khi tự dừng; không trả tốc độ khi GUI bị gỡ Parent; callback hồi sinh cũ nối lại observer sau khi đóng; event nhân vật cũ huỷ nhầm trạng thái nhân vật mới; và dừng Bay trước khi biết yêu cầu chuyển sang chạy có hợp lệ hay không. Mép phải thanh kéo cũng được sửa để chọn đúng trần có phần thập phân.

### Bay và hồi quy

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

## Giới hạn và kiểm tra trong Roblox thật

**Mock không phải engine vật lý Roblox.** Test xác nhận mã đã yêu cầu những thao tác nào, trạng thái, callback và vòng đời đối tượng; không xác nhận cảm giác chạy/bay, va chạm thực, cơ chế điều khiển riêng của từng game, độ trễ mạng, server correction thực hay tương thích mọi executor. Không dùng kết quả này làm benchmark FPS hoặc bằng chứng chống ban.

Checklist trong môi trường/game cho phép kiểm tra:

1. Mở khung 🏃, kéo thanh bằng chuột/điện thoại; gõ số thập phân, số vượt trần và bấm Áp dụng/Enter. Hai điều khiển phải đồng bộ; đừng nhầm trần quan sát với tốc độ tối đa thật.
2. Bật chạy, dùng điều khiển gốc; quay camera/nhìn lên xuống: vẫn đi trên mặt đất, giữ va chạm và trọng lực, nhảy theo game; không có nút bay/joystick ảo mới.
3. Nhả kéo ngoài khung, dùng nhiều ngón, ẩn menu/chuyển tab/chuyển cửa sổ: không kẹt kéo hoặc mất khả năng cuộn.
4. Cho game đổi WalkSpeed hợp lệ (sprint, debuff, cắt cảnh): chế độ mới tự tắt, không ép tốc độ lại. Thử game đặt 0 rồi mở khoá; giá trị hiển thị phải cập nhật.
5. Tắt, hồi sinh, đổi nhân vật và nạp lại hub khi chạy đang bật; không giữ tốc độ của nhân vật cũ hoặc để controller cũ can thiệp.
6. Thử chuyển 🏃 ↔ các chế độ bay/thảm/NoClip/boost; tính năng cũ vẫn bật lại được, nhưng không điều khiển nhân vật đồng thời với chạy mặt đất.
7. Hồi quy Bay: nhìn xuống khoảng 60° rồi giữ W/đẩy joystick phải bay xuống theo hướng nhìn; nhìn lên làm tương tự. Thả input phải đứng lơ lửng, không né hoặc tự bay vòng.
8. Trong Bay, kiểm tra A/D, Space/Shift/Ctrl, công tắc NoClip độc lập, HUD đa chạm, ẩn/hiện HUD, hồi sinh và chuyển Bay ↔ Bay An Toàn/kính/người.
