#!/usr/bin/env python3
"""Compile the full standalone hub and run it against a deterministic Roblox mock.

Requires the official Luau CLI (luau and luau-compile) on PATH, or LUAU_BIN and
LUAU_COMPILE_BIN. No network scripts are downloaded or executed by these tests.
"""
from pathlib import Path
import os
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
TESTS = ROOT / "tests"


def tool(name: str, variable: str) -> str:
    binary = os.environ.get(variable) or shutil.which(name)
    if not binary:
        raise SystemExit(f"Missing {name}. Install Luau or set {variable} to its executable path.")
    return binary


def quote(text: str) -> str:
    equals = "===="
    while f"]{equals}]" in text:
        equals += "="
    return f"[{equals}[{text}]{equals}]"


def main() -> None:
    luau = tool("luau", "LUAU_BIN")
    compiler = tool("luau-compile", "LUAU_COMPILE_BIN")
    source = (ROOT / "script.js").read_text(encoding="utf-8")
    subprocess.run([compiler, "--null", str(ROOT / "script.js")], check=True)
    # The test-only return exposes real locals without adding a test API to the hub.
    source += "\nreturn {S=S, D=D, Store=Store, main=main, gui=gui, tabs=tabs, tabContent=tabContent}\n"
    mock = (TESTS / "roblox_mock.luau").read_text(encoding="utf-8")
    suites = sys.argv[1:] or ["flight", "ground_speed", "lobby_speed", "dynamic_speed"]
    for suite in suites:
        if suite not in {"flight", "ground_speed", "lobby_speed", "dynamic_speed"}:
            raise SystemExit("Suites: flight, ground_speed, lobby_speed, dynamic_speed (omit to run all)")
        tests = (TESTS / f"{suite}.luau").read_text(encoding="utf-8")
        bundle = "local createMock = (function()\n" + mock + "\nend)()\n"
        bundle += "local hubSource = " + quote(source) + "\n" + tests
        print(f"Running {suite} regression suite...", flush=True)
        with tempfile.TemporaryDirectory(prefix="banana-cat-tests-") as directory:
            script = Path(directory) / f"{suite}-tests.luau"
            script.write_text(bundle, encoding="utf-8")
            subprocess.run([luau, str(script)], check=True, timeout=90)


if __name__ == "__main__":
    main()
