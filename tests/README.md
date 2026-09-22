# Kiểm thử tốc độ động, vượt mức tự chọn, sảnh → trận và Bay — v4.39

`script.js` là **Luau**, không phải JavaScript. Hub vẫn là một file độc lập để không thay đổi cách nạp hiện có.

## Sửa số tốc độ trống khi chơi Evade / game cập nhật tốc độ liên tục

Báo cáo Evade của người dùng dẫn đến việc kiểm tra và **tái lập lỗi trong mã v4.38**: mỗi lần WalkSpeed đổi, bộ đếm “ổn định 0,3 giây” lại bắt đầu từ đầu. Một game ghi WalkSpeed mỗi frame có thể khiến trạng thái chờ không bao giờ kết thúc. Khi chờ, code cũ còn xoá cả số mặc định/đỉnh đang hiển thị.

v4.39:

- Chờ **nhân vật/root sẵn sàng liên tục**, không yêu cầu số WalkSpeed đứng yên. Gia tốc hoặc sprint thay đổi mỗi frame không còn làm kẹt vô hạn.
- **Đọc được số thì hiển thị ngay**, kể cả lúc chưa cho phép áp dụng tốc độ. Số trong thời gian dựng rig là tạm; không đem đỉnh tạm đó làm trần khi pha chơi chính thức sẵn sàng.
- Đưa **Mặc định (WS) / Cao nhất đã thấy** lên ngay dưới tiêu đề, trước các nút và thanh kéo. Không cần cuộn qua slider mới thấy số.
- Hỗ trợ một Humanoid nằm lồng trong `player.Character`, cùng root của nó. Không quét toàn Workspace để chọn đại NPC/người chơi khác. Nhiều Humanoid không rõ chủ thể thì báo lý do thay vì đoán.
- Bay/NoClip không còn làm bảng đọc số trống sau respawn. Khi boost cũ đang bật, chỉ dùng nền đã lưu và ghi rõ nguồn; không lấy tốc độ đã nhân thành max game.
- Có dòng **WS hiện tại / Đo ngang / loại Humanoid / nguồn số** để chẩn đoán. Vận tốc ngang là `AssemblyLinearVelocity` trên mặt XZ, **không phải mặc định hoặc tối đa game** và không dùng để mở trần.
- Nếu không có Humanoid hoặc game dùng bộ điều khiển riêng, hiển thị “chưa đọc được / chưa có mẫu” và lý do, không bịa các số 16/32/2000. Đặc biệt, một nhân vật đang chuyển động nhưng WalkSpeed bằng 0 không chứng minh rằng ghi WalkSpeed sẽ điều khiển được nó.

**Chưa có kiểm thử trên server Evade thật.** Test mô phỏng các dạng lỗi trên, không phải bản sao đã xác minh của bộ điều khiển Evade. Không hard-code “tốc độ tối đa Evade”. Nếu vẫn lỗi, cần ảnh hai số đầu khung, dòng trạng thái/chẩn đoán và phiên bản hub để phân biệt thiếu nhân vật, game khoá hay bộ di chuyển riêng.

## Tốc độ chạy — Mặc định / Cao nhất đã thấy

Mở **📚 Script Hub → 🏃 TỐC ĐỘ CHẠY**:

- **↺ Mặc định**: dùng WalkSpeed game đang đặt, không ép một hằng số 16. Khi game đổi sprint/tốc độ, chế độ mặc định theo giá trị mới mà không liên tục ghi lại thuộc tính.
- **⇡ Cao nhất**: chọn WalkSpeed cao nhất **đã quan sát ở pha chơi hiện tại**. Ví dụ game chạy bình thường `16`, sprint từng lên `32`, rồi về `16`: có thể chọn `16–32` (thanh vẫn cho phép giảm về 0).
- **Thanh kéo / ô số**: đồng bộ hai chiều, nhận số thập phân; bấm **✔ Áp dụng / Enter**. Khi chưa bật chỉ lưu lựa chọn, không thay đổi nhân vật.
- **🏃 Bật / ⏹ Dừng**: áp dụng hoặc hoàn trả tốc độ còn do controller giữ. Các giá trị game ghi mới không bị ghi đè lúc tắt.
- **WASD / joystick gốc của game**: chỉ chỉnh `Humanoid.WalkSpeed`; không có lực bay, CFrame/vận tốc cưỡng bức, NoClip, chỉnh lực nhảy/trọng lực hoặc nút ảo mới.

**Không còn chụp trần 500 lên game vốn có WalkSpeed cao hơn.** Ví dụ native `1200`, cao nhất đã quan sát `1600`: Mặc định vẫn là `1200`, trần chọn là `1600`, không tự giảm về `500`. Sai số float32 của thuộc tính trong engine được tính đến để không nhận nhầm làm game từ chối.

### Mới: 🔓 Vượt mức đã quan sát (tùy chọn, mặc định TẮT)

1. Bật **🔓 Vượt mức** trong khung tốc độ. Chỉ bật công tắc này **không tự tăng tốc độ**.
2. Nếu cần, sửa **Trần mở rộng** rồi nhấn **Enter / ✔ nhỏ** cạnh ô đó. Mặc định `2000`; chấp nhận số hữu hạn `1–1.000.000`. Đây là cấu hình kỹ thuật của hub, **không phải tốc độ game cho phép**.
3. Nhập tốc độ muốn dùng ở ô **Tốc độ**, bấm **✔ Áp dụng / Enter**, rồi bật chế độ chạy nếu đang tắt. Cũng có thể dùng slider.
4. Trần slider khi mở = **max(mức quan sát, trần mở rộng)**. Ví dụ chỉ quan sát được 32, trần mở rộng 200: có thể gửi yêu cầu WalkSpeed 100 hoặc 150; đỉnh quan sát vẫn là 32, không bị sửa thành 150.
5. Nút **Cao nhất** vẫn chọn **cao nhất đã quan sát**, không chọn trần tự đặt. **Mặc định** trả về nền game.
6. Tắt 🔓 thì kẹp ngay về phạm vi quan sát và bỏ số cao đang lưu. Nếu đang chờ spawn/game khoá 0, trở về lựa chọn Mặc định thay vì lưu số cao ẩn hoặc biến lựa chọn thành 0. Giảm trần cũng bỏ lựa chọn vượt quá trần mới.

**Đây chỉ là mở giới hạn chọn số trong hub, không phải bypass giới hạn máy chủ.** Game ghi đè hoặc từ chối thì controller dừng, không reapply mỗi frame. Không tự unanchor, mở khoá WalkSpeed 0, bay hoặc xuyên tường. Chuyển server/reload hub không tự cấp lại quyền vượt mức; cần bật lại bằng tay.

### Giới hạn thông tin — không phải bảo đảm chống ban

Client **không biết tốc độ tối đa thật hoặc ngưỡng anti-cheat của server**. “Cao nhất” ở đây chỉ là **cao nhất đã thấy**, không phải một mức được bảo đảm cho phép ở mọi thời điểm. Thay đổi WalkSpeed vẫn có thể vi phạm luật game.

- Khi **🔒 Vượt mức TẮT**, chưa thấy mức cao hơn `16` thì chỉ chọn được tối đa `16`; không tự bịa mức `500` hoặc `2000` là max game. Có thể để **Mặc định** rồi dùng sprint/chạy nhanh **gốc của game** để quan sát thêm.
- Chỉ quan sát WalkSpeed khi các chế độ can thiệp khác của hub không hoạt động; không lấy vận tốc bay/rơi/teleport hoặc `SpeedMeter.max` để suy ra trần. Không nhận nhầm giá trị do chính controller ghi (kể cả property event deferred).
- Đang dùng **số tự chọn / Cao nhất**, game sửa WalkSpeed sang một mức dương khác: **tự dừng, nhường game**, không ép lại mỗi frame. Chế độ **Mặc định** chỉ theo cập nhật gốc của game.
- Game khoá WalkSpeed `0`, nhân vật chết/thiếu part/đang neo hoặc game chưa tải: chuyển sang **Chờ**, không đoán giới hạn, không mở khoá hộ game. Trần được đọc lại khi pha chơi mới sẵn sàng.
- Nếu game dùng cơ chế di chuyển riêng không dựa vào Humanoid.WalkSpeed hoặc server không nhận thay đổi, chức năng có thể không có tác dụng. Không dùng kết quả test dưới đây làm bằng chứng chống ban.

### Sửa chuyển sảnh → trận trong cùng client

Có thể bấm **Bật ngay khi đang chờ**. Nút hiện **⏳ Chờ vào trận**, giữ ý định bật thay vì từ chối rồi bắt bấm lại:

1. Đợi game tải, nhân vật vào Workspace, Humanoid sống, RootPart tồn tại và không còn Anchored, WalkSpeed hợp lệ/dương.
2. Đợi **actor/root sẵn sàng liên tục** ít nhất `0.3 giây` sau chuyển pha, rồi mới áp dụng giá trị game mới nhất. WalkSpeed được phép thay đổi trong lúc đợi; không mang đỉnh tạm lúc dựng rig làm giới hạn trận.
3. Bắt lại Character, Humanoid, root đến muộn hoặc đổi trực tiếp; không dùng event chết/reset của nhân vật cũ để tắt nhân vật mới. Rigs đổi tên root được hỗ trợ qua `Humanoid.RootPart`.
4. **Dừng**, bấm lại công tắc hoặc chuyển sang chế độ di chuyển khác sẽ huỷ ý định đang chờ. Một lần Enter muộn khi game đang khoá không biến lựa chọn cũ thành tốc độ `0`.
5. GUI bị gỡ Parent tạm thời rồi gắn lại không làm controller chết ngay. Nếu mất Parent liên tục **10 giây**, controller hoàn trả và dọn kết nối; GUI thực sự bị Destroy được dọn ngay.

Không thể biết chính xác cách chuyển trận của mọi game chỉ từ Roblox API chung. Dòng trạng thái cho biết đang chờ game, Humanoid, root, mở khoá hay ổn định tốc độ để chẩn đoán, thay vì chỉ báo “không bật được”.

### Chuyển sang server/place khác thật sự

Teleport thực sự tạo client/Lua VM mới; controller ở sảnh không tự tồn tại ở server mới.

- Tùy chọn **↪ Qua server: tự nạp hub** mặc định **TẮT**. Muốn dùng, bật trước khi rời sảnh.
- Nhận diện các API executor phổ biến: `queue_on_teleport`, `queueonteleport`, `syn.queue_on_teleport`, `fluxus.queue_on_teleport`. Loại trừ hàm bù chỉ lưu trong RAM của hub, kể cả sau reload.
- Không có API hoặc queue báo lỗi: hiện rõ **cần chạy lại link script sau khi vào server chơi**; không báo thành công giả.
- Loader dùng URL có phiên bản để tránh cache URL bản cũ, chỉ tải lại **chính file hub của repository này**, đợi game/LocalPlayer/PlayerGui tối đa 60 giây, kiểm tra place/experience đích và chống nạp trùng. Cả tải/biên dịch/chạy lỗi đều có thông báo, không giữ cờ đang nạp vĩnh viễn.
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
python3 tests/run.py dynamic_speed
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
- `lobby_speed.luau`: **65 test mặc định/cao nhất, chuyển pha, float32 và queue/loader**; cập nhật kỳ vọng bộ đếm để không chờ WalkSpeed đứng yên.
- `dynamic_speed.luau`: **52 test đọc số động, nested rig, chẩn đoán và vượt mức opt-in**.

**Kết quả v4.39: 284/284 test đạt**, cùng biên dịch full hub và kiểm tra diff giữ CRLF.

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

### Tốc độ thay đổi liên tục / vượt mức

- Năm ca đã tái lập thất bại trước sửa: gia tốc mỗi frame sau sảnh, đọc số lúc warm-up, đọc WS khi neo, đổi nhân vật lúc một chế độ khác đang bật, và Humanoid nằm lồng.
- Immediate/deferred events, số thay đổi khi đang tắt, readiness bị gián đoạn, giá trị tạm của rig, nguồn boost, nhân vật khác/không rõ chủ thể.
- Vận tốc ngang hữu hạn/không hữu hạn và chuyển động khi WS 0; không dùng số đo chuyển động làm game max.
- Mở trần phải opt-in; số/slider mouse/touch có thể yêu cầu cao hơn đỉnh quan sát, preset vẫn giữ ý nghĩa gốc, chỉnh trần/nhập sai số/focus.
- Self-write vượt mức không làm bẩn baseline/đỉnh; khoá lại/giảm trần không giữ số cao ẩn; chờ spawn hoặc WS 0 không biến lựa chọn thành 0.
- Game từ chối vẫn dừng; không physics writes/nút ảo; mode handoff, StopAll, đóng panel và reload giữ chức năng cũ, hoàn trả và dọn listener.
- Biên dịch full hub còn bắt được giới hạn 200 register sau khi thêm UI: đã tách constructor panel sang scope hàm riêng.

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

1. Vào trận, kiểm tra hai số ngay đầu khung 🏃. Thử đứng yên/sprint; số vẫn phải cập nhật dù tốc độ thay đổi liên tục. Nếu không có dữ liệu, chụp cả dòng trạng thái/chẩn đoán, không chỉ ảnh slider.
2. Thử 🔒/🔓, đặt trần mở rộng, nhập số và kéo thanh; tắt 🔓 phải kẹp về quan sát, không giữ lựa chọn cao để bật lại bất ngờ. Nếu game từ chối thì phải báo dừng, không hứa bypass.
3. Bật chạy, dùng điều khiển gốc; quay camera/nhìn lên xuống: vẫn đi trên mặt đất, giữ va chạm và trọng lực, nhảy theo game; không có nút bay/joystick ảo mới.
4. Nhả kéo ngoài khung, dùng nhiều ngón, ẩn menu/chuyển tab/chuyển cửa sổ: không kẹt kéo hoặc mất khả năng cuộn.
5. Chọn **Mặc định**, dùng sprint gốc để quan sát mức cao hơn, rồi thử Max/nhập số giữa mặc định và đỉnh. Ở mode số/Max, game sửa tốc độ dương phải tự dừng; game khoá 0 phải chờ, không mở khoá hộ.
6. Bấm Bật trong sảnh, vào trận; thử countdown, chết/hồi sinh, Humanoid/root đến muộn. Phải tự đọc lại mặc định khi sẵn sàng; Dừng trong lúc chờ phải huỷ việc tự tiếp tục.
7. Nếu game teleport sang server khác, bật tùy chọn ↪ trước khi rời sảnh. Kiểm tra executor thực sự nạp lại hub; ở server mới tốc độ phải TẮT với trần mới. Nếu không hỗ trợ queue thì nạp lại link bằng tay.
8. Thử chuyển 🏃 ↔ các chế độ bay/thảm/NoClip/boost; tính năng cũ vẫn bật lại được, nhưng không điều khiển nhân vật đồng thời với chạy mặt đất.
9. Hồi quy Bay: nhìn xuống khoảng 60° rồi giữ W/đẩy joystick phải bay xuống theo hướng nhìn; nhìn lên làm tương tự. Thả input phải đứng lơ lửng, không né hoặc tự bay vòng.
10. Trong Bay, kiểm tra A/D, Space/Shift/Ctrl, công tắc NoClip độc lập, HUD đa chạm, ẩn/hiện HUD, hồi sinh và chuyển Bay ↔ Bay An Toàn/kính/người.
