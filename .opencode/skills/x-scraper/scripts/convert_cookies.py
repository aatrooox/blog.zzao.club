#!/usr/bin/env python3
"""
Cookie 格式转换工具
将 Cookie-Editor 导出的格式转换为 Playwright 兼容格式
"""

import json
import sys
from pathlib import Path


def convert_cookie_format(input_file: str, output_file: str | None = None):
    """
    转换 Cookie 格式

    Cookie-Editor 格式 → Playwright 格式
    - sameSite: "no_restriction" → "None"
    - sameSite: "unspecified" → "Lax"
    - expirationDate → expires
    """
    if not Path(input_file).exists():
        print(f"❌ 文件不存在: {input_file}")
        sys.exit(1)

    with open(input_file, "r", encoding="utf-8") as f:
        cookies = json.load(f)

    print(f"📥 加载了 {len(cookies)} 个 Cookie")

    converted = []
    for cookie in cookies:
        # 转换 sameSite
        if "sameSite" in cookie:
            same_site = cookie["sameSite"]
            if same_site == "no_restriction":
                cookie["sameSite"] = "None"
            elif (
                same_site == "unspecified"
                or same_site is None
                or same_site == ""
                or same_site == "lax"
            ):
                cookie["sameSite"] = "Lax"
            elif same_site == "strict":
                cookie["sameSite"] = "Strict"
        else:
            cookie["sameSite"] = "Lax"

        # 转换 expirationDate → expires
        if "expirationDate" in cookie:
            cookie["expires"] = cookie.pop("expirationDate")

        # Playwright 需要的字段
        pw_cookie = {
            "name": cookie["name"],
            "value": cookie["value"],
            "domain": cookie["domain"],
            "path": cookie.get("path", "/"),
        }

        # 可选字段
        if "expires" in cookie:
            pw_cookie["expires"] = cookie["expires"]
        if "httpOnly" in cookie:
            pw_cookie["httpOnly"] = cookie["httpOnly"]
        if "secure" in cookie:
            pw_cookie["secure"] = cookie["secure"]
        if "sameSite" in cookie:
            pw_cookie["sameSite"] = cookie["sameSite"]

        converted.append(pw_cookie)

    # 输出文件
    if output_file is None:
        output_file = input_file.replace(".json", "_converted.json")

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(converted, f, indent=2, ensure_ascii=False)

    print(f"✅ 已转换 {len(converted)} 个 Cookie")
    print(f"💾 保存到: {output_file}")

    # 显示关键 Cookie
    key_cookies = [c for c in converted if c["name"] in ["auth_token", "ct0", "twid"]]
    if key_cookies:
        print("\n🔑 关键 Cookie:")
        for c in key_cookies:
            print(f"  - {c['name']}: {c['value'][:20]}...")
    else:
        print("\n⚠️  警告: 未找到关键 Cookie (auth_token, ct0, twid)")
        print("   可能需要重新登录 X.com 后导出")

    return output_file


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python3 convert_cookies.py <输入文件> [输出文件]")
        print("\n示例:")
        print("  python3 convert_cookies.py /tmp/x_cookies.json")
        print("  python3 convert_cookies.py /tmp/x_cookies.json /tmp/x_cookies_pw.json")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    convert_cookie_format(input_file, output_file)
