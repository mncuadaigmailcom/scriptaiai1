-- Dán TOÀN BỘ đoạn này vào Delta. Mở console Delta/F9 nếu có lỗi.
local url = "https://raw.githubusercontent.com/mncuadaigmailcom/scriptaiai1/arena/01a0de06-scriptaiai1/script.js"
local function fail(stage, err)
    local msg = "[taodepzai] " .. stage .. ": " .. tostring(err)
    warn(msg)
    pcall(function() game:GetService("StarterGui"):SetCore("SendNotification", {
        Title = "taodepzai - lỗi " .. stage,
        Text = tostring(err):sub(1, 180), Duration = 12
    }) end)
end
local okFetch, source = pcall(function() return game:HttpGet(url) end)
if not okFetch then fail("tải link", source); return end
if type(source) ~= "string" or #source < 100000 then
    fail("tải link", "Nội dung trả về không phải script đầy đủ (" .. tostring(#tostring(source)) .. " ký tự)")
    return
end
if type(loadstring) ~= "function" then fail("biên dịch", "Delta không có loadstring"); return end
local okCompile, fn, compileError = pcall(loadstring, source)
if not okCompile then fail("biên dịch", fn); return end
if not fn then fail("biên dịch", compileError); return end
local okRun, runError = xpcall(fn, function(err)
    if debug and type(debug.traceback) == "function" then return debug.traceback(tostring(err), 2) end
    return tostring(err)
end)
if not okRun then fail("chạy", runError); return end
print("[taodepzai] Script đã chạy xong; nếu không có GUI, hãy chụp console gửi lại.")
