# Kiểm thử tốc độ chạy, sảnh → trận và Bay — v4.38

`script.js` là **Luau**, không phải JavaScript. Hub vẫn là một file độc lập để không thay đổi cách nạp hiện có.

## Tốc độ chạy — Mặc định / Cao nhất đã thấy

Mở **📚 Script Hub → 🏃 TỐC ĐỘ CHẠY**:

- **↺ Mặc định**: dùng WalkSpeed game đang đặt, không ép một hằng số 16. Khi game đổi sprint/tốc độ, chế độ mặc định theo giá trị mới mà không liên tục ghi lại thuộc tính.
- **⇡ Cao nhất**: chọn WalkSpeed cao nhất **đã quan sát ở pha chơi hiện tại**. Ví dụ game chạy bình thường `16`, sprint từng lên `32`, rồi về `16`: có thể chọn `16–32` (thanh vẫn cho phép giảm về 0).
- **Thanh kéo / ô số**: đồng bộ hai chiều, nhận số thập phân; bấm **✔ Áp dụng / Enter**. Khi chưa bật chỉ lưu lựa chọn, không thay đổi nhân vật.
- **🏃 Bật / ⏹ Dừng**: áp dụng hoặc hoàn trả tốc độ còn do controller giữ. Các giá trị game ghi mới không bị ghi đè lúc tắt.
- **WASD / joystick gốc của game**: chỉ chỉnh `Humanoid.WalkSpeed`; không có lực bay, CFrame/vận tốc cưỡng bức, NoClip, chỉnh lực nhảy/trọng lực hoặc nút ảo mới.

**Không còn chụp trần 500 lên game vốn có WalkSpeed cao hơn.** Ví dụ native `1200`, cao nhất đã quan sát `1600`: Mặc định vẫn là `1200`, trần chọn là `1600`, không tự giảm về `500`. Sai số float32 của thuộc tính trong engine được tính đến để không nhận nhầm làm game từ chối.

### Giới hạn thông tin — không phải bảo đảm chống ban

Client **không biết tốc độ tối đa thật hoặc ngưỡng anti-cheat của server**. “Cao nhất” ở đây chỉ là **cao nhất đã thấy**, không phải một mức được bảo đảm cho phép ở mọi thời điểm. Thay đổi WalkSpeed vẫn có thể vi phạm luật game.

- Chưa thấy mức cao hơn `16` thì chỉ chọn được tối đa `16`; không tự bịa mức `500` hoặc `2000`. Có thể để **Mặc định** rồi dùng sprint/chạy nhanh **gốc của game** để quan sát thêm.
- Chỉ quan sát WalkSpeed khi các chế độ can thiệp khác của hub không hoạt động; không lấy vận tốc bay/rơi/teleport hoặc `SpeedMeter.max` để suy ra trần. Không nhận nhầm giá trị do chính controller ghi (kể cả property event deferred).
- Đang dùng **số tự chọn / Cao nhất**, game sửa WalkSpeed sang một mức dương khác: **tự dừng, nhường game**, không ép lại mỗi frame. Chế độ **Mặc định** chỉ theo cập nhật gốc của game.
- Game khoá WalkSpeed `0`, nhân vật chết/thiếu part/đang neo hoặc game chưa tải: chuyển sang **Chờ**, không đoán giới hạn, không mở khoá hộ game. Trần được đọc lại khi pha chơi mới sẵn sàng.
- Nếu game dùng cơ chế di chuyển riêng không dựa vào Humanoid.WalkSpeed hoặc server không nhận thay đổi, chức năng có thể không có tác dụng. Không dùng kết quả test dưới đây làm bằng chứng chống ban.

### Sửa chuyển sảnh → trận trong cùng client

Có thể bấm **Bật ngay khi đang chờ**. Nút hiện **⏳ Chờ vào trận**, giữ ý định bật thay vì từ chối rồi bắt bấm lại:

1. Đợi game tải, nhân vật vào Workspace, Humanoid sống, RootPart tồn tại và không còn Anchored, WalkSpeed hợp lệ/dương.
2. Quan sát giá trị/root ổn định ít nhất `0.3 giây` sau chuyển pha, rồi mới áp dụng; không lấy `16` tạm lúc spawn làm giới hạn trận.
3. Bắt lại Character, Humanoid, root đến muộn hoặc đổi trực tiếp; không dùng event chết/reset của nhân vật cũ để tắt nhân vật mới. Rigs đổi tên root được hỗ trợ qua `Humanoid.RootPart`.
4. **Dừng**, bấm lại công tắc hoặc chuyển sang chế độ di chuyển khác sẽ huỷ ý định đang chờ. Một lần Enter muộn khi game đang khoá không biến lựa chọn cũ thành tốc độ `0`.
5. GUI bị gỡ Parent tạm thời rồi gắn lại không làm controller chết ngay. Nếu mất Parent liên tục **10 giây**, controller hoàn trả và dọn kết nối; GUI thực sự bị Destroy được dọn ngay.

Không thể biết chính xác cách chuyển trận của mọi game chỉ từ Roblox API chung. Dòng trạng thái cho biết đang chờ game, Humanoid, root, mở khoá hay ổn định tốc độ để chẩn đoán, thay vì chỉ báo “không bật được”.

### Chuyển sang server/place khác thật sự

Teleport thực sự tạo client/Lua VM mới; controller ở sảnh không tự tồn tại ở server mới.

- Tùy chọn **↪ Qua server: tự nạp hub** mặc định **TẮT**. Muốn dùng, bật trước khi rời sảnh.
- Nhận diện các API executor phổ biến: `queue_on_teleport`, `queueonteleport`, `syn.queue_on_teleport`, `fluxus.queue_on_teleport`. Loại trừ hàm bù chỉ lưu trong RAM của hub, kể cả sau reload.
- Không có API hoặc queue báo lỗi: hiện rõ **cần chạy lại link script sau khi vào server chơi**; không báo thành công giả.
- Loader chỉ tải lại **chính file hub của repository này**, đợi game/LocalPlayer/PlayerGui tối đa 60 giây, kiểm tra place/experience đích và chống nạp trùng. Cả tải/biên dịch/chạy lỗi đều có thông báo, không giữ cờ đang nạp vĩnh viễn.
- **Ở server mới, tốc độ bắt đầu TẮT**: không mang tốc độ, trần hay trạng thái bay/NoClip cũ sang. Hub đọc mặc định mới; người dùng bấm Bật khi muốn. Việc queue thực sự được thực thi phụ thuộc executor, không được mock xác nhận.
- Nếu teleport thất bại, trạng thái chờ ở client cũ có thể phục hồi sau khi ổn định. Một payload đã gửi vào executor **không thể thu hồi từ hub**; tắt tùy chọn chỉ ngăn lần gửi tiếp theo. Payload cũ không bật tốc độ và sẽ bỏ qua sai place/experience.

### Giữ các tính năng cũ

Giữ **7 trang, đủ 32 thẻ của v4.37 (gồm 31 thẻ gốc + tốc độ chạy)**. Không xoá Bay, Bay An Toàn, NoClip, nhảy vô hạn, thảm, boost, kính, ESP, phát sáng, quan sát người chơi hay cấu hình của chúng.

Chạy mặt đất loại trừ các chế độ di chuyển xung đột: bật chế độ khác thì chạy mặt đất nhường quyền. Yêu cầu chuyển chưa hợp lệ không tự tắt Bay/thảm đang dùng. Kính đã đặt được giữ; các tiện ích không điều khiển di chuyển vẫn dùng độc lập. Trần quan sát của khung mới không thay đổi giới hạn cấu hình của các tính năng cũ.

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

Có thể chọn riêng một suite:

```sh
python3 tests/run.py flight
python3 tests/run.py ground_speed
python3 tests/run.py lobby_speed
```

Runner:

1. Biên dịch **toàn bộ** `script.js`, kiểm tra cả cú pháp và giới hạn thanh ghi/local.
2. Nạp **toàn bộ mã hub thật** vào mock Roblox xác định, không chép lại thuật toán điều khiển sang test.
3. Kiểm thử giao diện và controller qua các hàm/callback thật, mỗi test dùng một hub mới.
4. Không tải hay thực thi script bên ngoài. HTTP thật bị chặn. Riêng test loader cung cấp **fixture mã hub hiện tại ở trong bộ test**, chạy payload queue ở một mock client khác để kiểm tra nạp lại toàn bộ hub; không kết nối server Roblox hay tải GitHub.

Các file:

- `run.py`: biên dịch và tạo bundle tạm, không thay đổi file nguồn.
- `roblox_mock.luau`: vector/CFrame, cây Instance, sự kiện tức thời/deferred, scheduler, input và render bindings; đếm ghi Humanoid và hỗ trợ mô phỏng từ chối ghi WalkSpeed.
- `flight.luau`: **74 test hồi quy Bay và các tính năng cũ**.
- `ground_speed.luau`: **93 test tốc độ chạy**, giữ các hồi quy và cập nhật kỳ vọng cho trần quan sát / trạng thái chờ mới.
- `lobby_speed.luau`: **65 test mặc định/cao nhất, chuyển pha, float32 và queue/loader**.

**Kết quả v4.38: 232/232 test đạt**, cùng biên dịch full hub và kiểm tra diff giữ CRLF.

## Phạm vi kiểm tra

### Tốc độ chạy

- Giữ 7 trang và kiểm tra theo tên từng thẻ trong 31 thẻ gốc; thêm đúng 1 thẻ tốc độ chạy (tổng 32).
- Không viết ngoài WalkSpeed khi bật riêng chế độ mới; không tạo mover, HUD, watchdog hay ghi lại thuộc tính mỗi frame.
- Thanh kéo chuột/cảm ứng: hai đầu, giữa, vượt biên, làm tròn, trần thập phân, nhả ngoài, đa chạm, khôi phục cuộn, ẩn khung/tab/menu/ScreenGui và mất focus.
- Ô số: Enter/nút Áp dụng, số thập phân, 0, số âm, quá trần, rỗng, NaN, infinity; không xoá số đang gõ khi refresh/lọc.
- Mặc định theo game khác đỉnh quan sát; có thể tăng đến đỉnh WalkSpeed đã thấy, không lấy đỉnh bay/teleport; không áp trần 500 sai lên tốc độ native lớn; game khoá 0 hoặc chưa có tốc độ hợp lệ.
- Event của chính controller (immediate/deferred), game tăng/giảm/khoá tốc độ, mất event, từ chối ghi hoặc ghi trả ngay lập tức; tự dừng thay vì ép lại.
- Thẻ và khung hiển thị cùng trạng thái, StopAll/reset-to-game, trả đúng baseline, không giẫm ghi mới của game; SpeedMeter cũ không học nhầm tốc độ đang chỉnh.
- Chuyển hai chiều với Bay, Bay An Toàn, NoClip, nhảy vô hạn, boost, thảm/chạy trên thảm, bay tới kính/người; không tắt chế độ đang chạy vì yêu cầu chuyển không hợp lệ.
- Chết, khoảng trống hồi sinh, Humanoid đến muộn, thay trực tiếp nhân vật; event chết/reset cũ không được huỷ ý định chạy ở nhân vật mới.
- Đóng/huỷ/gỡ Parent GUI, reload liên tiếp, huỷ panel, callback hồi sinh cũ còn chờ; không để controller cũ gắn lại observer.

Test đã bắt và giúp sửa: kẹt cuộn khi ẩn panel/ScreenGui; thông báo chưa có tốc độ không đổi sau khi game sẵn sàng; nhãn thẻ cũ sau khi tự dừng; không trả tốc độ khi GUI bị gỡ Parent; callback hồi sinh cũ nối lại observer sau khi đóng; event nhân vật cũ huỷ nhầm trạng thái nhân vật mới; và dừng Bay trước khi biết yêu cầu chuyển sang chạy có hợp lệ hay không. Mép phải thanh kéo cũng được sửa để chọn đúng trần có phần thập phân.

### Sảnh / trận / server mới

- Nhấn Bật từ WalkSpeed 0, game chưa tải, không có Character, root/Humanoid đến muộn, root neo hoặc character ngoài Workspace.
- Chuyển pha trên cùng Humanoid, Character/root thay liên tiếp, giá trị mặc định tạm, GUI reparent, dừng giữa lúc chờ; không ghi lại tốc độ trong trạng thái ổn định.
- Mặc định theo sprint gốc; chọn Max/ô số/slider cao hơn mặc định; reset, chống tự nâng trần do own-write, trả đúng giá trị native lớn và xử lý float32.
- Tự nạp phải opt-in; loại trừ shim RAM; queue một lần mỗi lần thử; xử lý báo lỗi, mất API, teleport thất bại và không rò kết nối khi đóng/reload.
- Payload nạp full hub vào **mock client khác**: giới hạn mới, tốc độ TẮT, tải chậm, thiếu LocalPlayer/PlayerGui, timeout, sai đích, payload trùng, lỗi HTTP/compile/runtime và retry.

Các test đã tái lập thêm lỗi trần 500 làm mất tốc độ mặc định thực ở game nhanh; kiểm tra sai số float32 khi tăng phạm vi; và bảo vệ việc lựa chọn đang chờ không bị ghi thành 0 bởi một thao tác nhập muộn.

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
4. Chọn **Mặc định**, dùng sprint gốc để quan sát mức cao hơn, rồi thử Max/nhập số giữa mặc định và đỉnh. Ở mode số/Max, game sửa tốc độ dương phải tự dừng; game khoá 0 phải chờ, không mở khoá hộ.
5. Bấm Bật trong sảnh, vào trận; thử countdown, chết/hồi sinh, Humanoid/root đến muộn. Phải tự đọc lại mặc định khi sẵn sàng; Dừng trong lúc chờ phải huỷ việc tự tiếp tục.
6. Nếu game teleport sang server khác, bật tùy chọn ↪ trước khi rời sảnh. Kiểm tra executor thực sự nạp lại hub; ở server mới tốc độ phải TẮT với trần mới. Nếu không hỗ trợ queue thì nạp lại link bằng tay.
7. Thử chuyển 🏃 ↔ các chế độ bay/thảm/NoClip/boost; tính năng cũ vẫn bật lại được, nhưng không điều khiển nhân vật đồng thời với chạy mặt đất.
8. Hồi quy Bay: nhìn xuống khoảng 60° rồi giữ W/đẩy joystick phải bay xuống theo hướng nhìn; nhìn lên làm tương tự. Thả input phải đứng lơ lửng, không né hoặc tự bay vòng.
9. Trong Bay, kiểm tra A/D, Space/Shift/Ctrl, công tắc NoClip độc lập, HUD đa chạm, ẩn/hiện HUD, hồi sinh và chuyển Bay ↔ Bay An Toàn/kính/người.
