#!/usr/bin/env python3
"""Chạy bộ test cho script.js bằng mock Roblox (không cần Roblox/executor).

Cách dùng (từ thư mục gốc repo):
    pip install lupa            # Lua 5.3 nhúng trong Python
    python tests/run_tests.py                      # chạy test trên script.js
    python tests/run_tests.py path/to/other.js     # chạy test trên file khác
    python tests/run_tests.py --snapshot in.js out.json   # xuất trạng thái UI để so sánh

Lưu ý: script.js là Luau. Runner chuyển `x += e` thành `x = x + (e)` để Lua 5.3 đọc được;
mọi kiểm tra giới hạn (ví dụ tối đa 200 local/hàm) vẫn được Lua 5.3 kiểm tra như thật.
"""
import json
import os
import re
import sys

from lupa.lua53 import LuaRuntime

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

COMPOUND = re.compile(
    r'(?<![~<>=])\b([A-Za-z_]\w*(?:\.[A-Za-z_]\w*|\[[^\]\n]*\])*)\s*([+\-*/])=(?!=)\s*'
    r'([A-Za-z0-9_.]+(?:\s*[+\-*/]\s*[A-Za-z0-9_.]+)*)'
)


def luau_to_lua(src: str) -> str:
    src = src.replace('\r\n', '\n')
    return COMPOUND.sub(lambda m: f"{m.group(1)} = {m.group(1)} {m.group(2)} ({m.group(3)})", src)


def run(script_path: str, snapshot_out=None) -> int:
    with open(script_path, encoding='utf-8') as f:
        src = luau_to_lua(f.read())
    lua = LuaRuntime(unpack_returned_tuples=True)
    g = lua.globals()
    g.SCRIPT_SRC = src
    g.MOCK_PATH = os.path.join(HERE, 'roblox_mock.lua')
    g.SNAPSHOT_OUT = snapshot_out
    with open(os.path.join(HERE, 'run_tests.lua'), encoding='utf-8') as f:
        lua.execute(f.read())
    result = g.RESULT
    if result is None:
        print('Không có kết quả từ bộ test')
        return 2
    failed = int(result['failed'])
    return 0 if failed == 0 else 1


def compare_snapshots(before_path: str, after_path: str) -> int:
    """So sánh 2 snapshot: không được MẤT bất kỳ UI/tính năng nào (chỉ được thêm)."""
    with open(before_path, encoding='utf-8') as f:
        before = json.load(f)
    with open(after_path, encoding='utf-8') as f:
        after = json.load(f)
    b_ui, a_ui = set(before['uiNames']), set(after['uiNames'])
    lost = sorted(b_ui - a_ui)
    added = sorted(a_ui - b_ui)
    b_g, a_g = set(before['globals']), set(after['globals'])
    print(f"UI trước: {len(b_ui)} · UI sau: {len(a_ui)}")
    print(f"Đã MẤT: {len(lost)}")
    for n in lost:
        print('   -', n)
    print(f"Thêm mới: {len(added)}")
    for n in added:
        print('   +', n)
    b_t, a_t = set(before.get('texts', [])), set(after.get('texts', []))
    lost_t = sorted(b_t - a_t)
    print(f"Nhãn/nút chữ trước: {len(b_t)} · sau: {len(a_t)} · MẤT: {len(lost_t)}")
    for t in lost_t:
        print('   -', t)
    print(f"Nhãn/nút thêm mới: {len(a_t - b_t)}")
    for t in sorted(a_t - b_t):
        print('   +', t)
    print(f"Global BananaCatHub_* mất: {sorted(b_g - a_g) or 'không'} · thêm: {sorted(a_g - b_g) or 'không'}")
    print(f"Print trước/sau: {len(before['printed'])} / {len(after['printed'])}")
    print(f"Lỗi runtime trước/sau: {len(before['errors'])} / {len(after['errors'])}")
    return 1 if lost or lost_t or (b_g - a_g) else 0


if __name__ == '__main__':
    args = sys.argv[1:]
    if args and args[0] == '--snapshot':
        script, out = args[1], args[2]
        code = run(script, out)
        sys.exit(code)
    if args and args[0] == '--compare':
        sys.exit(compare_snapshots(args[1], args[2]))
    script = args[0] if args else os.path.join(ROOT, 'script.js')
    sys.exit(run(script))
