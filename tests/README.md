# Kiểm thử Tốc Độ mới (v4.40) và Bay theo camera

Bộ test này chạy **toàn bộ mã hub thật** (`script.js` là Luau, không phải JavaScript) trong một mock Roblox xác định. Không có Roblox thật, không có server, không có anti-cheat nào được kiểm chứng ở đây.

## Tính năng Tốc Độ (thay bộ "tốc độ chạy" cũ)

Theo yêu cầu người dùng, bộ tốc độ chạy cũ (đọc mức quan sát, trần vượt mức, queue teleport) đã **bị xoá** và thay bằng tính năng **⚡ Tốc Độ**:

- Chỉ ghi `Humanoid.WalkSpeed`. **Không** bay, **không** xuyên tường, **không** HUD/nút ảo, không BodyVelocity/CFrame/vận tốc cưỡng bức.
- Hướng đi theo camera nhờ **điều khiển gốc của game** (WASD/joystick mặc định của Roblox đã đi theo camera trên mặt phẳng ngang) — cảm giác giống Bay theo camera nhưng vẫn **va chạm, trọng lực và nhảy bình thường**.
- Tốc độ nhập được **mọi số hữu hạn ≥ 0** (ô số); thanh kéo hiển thị 0–500.
- Nhảy lên cao vẫn **rớt xuống theo trọng lực game**: hub không ghi CFrame/vận tốc/trọng lực lúc trên không (có test riêng).
- Bật khi nhân vật chưa sẵn sàng (sảnh/chết/thiếu root) → trạng thái **Chờ vào trận**, tự áp lại khi sẵn sàng; không mở khoá hộ game.
- Game đổi WalkSpeed khi đang chỉnh → **tự dừng, không ép lại**. Tắt sẽ trả tốc độ còn do hub giữ.
- Xung đột loại trừ với Bay/NoClip/thảm/boost… như trước; các tính năng đó vẫn bật lại được.

## Cách chạy

Cần nhị phân Luau chính thức (đặt qua biến môi trường):

```sh
LUAU_BIN=.../luau LUAU_COMPILE_BIN=.../luau-compile python3 tests/run.py
```

Suite: `flight`, `speedmove` (không truyền tham số sẽ chạy cả hai).

Quy trình:

1. Biên dịch **toàn bộ** `script.js` (cú pháp + giới hạn thanh ghi/local).
2. Nạp toàn bộ mã hub thật vào mock; mỗi test dùng một hub mới.
3. Không tải script ngoài; mọi HTTP thật đều bị chặn và làm test thất bại.

## Các suite

- `flight.luau`: **74 test** hồi quy Bay theo camera, Bay An Toàn, NoClip độc lập, HUD, xung đột tính năng, 7 trang/32 thẻ.
- `speedmove.luau`: **46 test** cho Tốc Độ: bật/tắt/khôi phục, mọi giá trị hợp lệ và giá trị sai bị từ chối, slider chuột/cảm ứng, nhập số/Enter, game ghi đè thì dừng, chờ sảnh/chết/neo, handoff với Bay/boost, chỉ ghi WalkSpeed, không HUD/vật lý bay, drag không tự bật lại, reload/dọn kết nối.

**Kết quả v4.40: 120/120 test đạt**, kèm biên dịch full hub và kiểm tra diff giữ CRLF.

## Những gì test KHÔNG chứng minh

- Không kiểm chứng di chuyển vật lý thật, cảm giác điều khiển, FPS hay server Roblox.
- Không kiểm chứng anti-cheat: đổi WalkSpeed vẫn có thể vi phạm luật game; không có bảo đảm tránh ban.
- "Đi theo camera" dựa trên điều khiển gốc của game; game dùng bộ điều khiển riêng có thể không nghe WalkSpeed.
- Loader/teleport của bản cũ đã bị xoá cùng tính năng cũ; chuyển server thật cần chạy lại script.

## Checklist nhanh trong game thật (nếu được phép)

1. Bật ⚡ Tốc Độ, nhập số (thử cả số lớn), đi bằng WASD/joystick: hướng phải theo camera, vẫn nhảy và va chạm.
2. Game đổi WalkSpeed (sprint/bị làm chậm): tính năng phải tự dừng, không giật tốc độ lại.
3. Vào sảnh chờ rồi vào trận: trạng thái Chờ phải tự áp tốc độ đã chọn khi nhân vật sẵn sàng.
4. Thử kéo thanh khi đang TẮT: không được tự bật; đang kéo mà tắt tính năng thì thanh phải dừng.
5. Bay ↔ Tốc Độ ↔ Thảm/boost: chỉ một bộ điều khiển nhân vật tại một thời điểm; tính năng cũ vẫn bật lại được.
