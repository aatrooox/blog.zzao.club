#!/usr/bin/env python3
import asyncio
import json
import re
import sys
from pathlib import Path
from playwright.async_api import async_playwright

DEFAULT_COOKIE_FILE = "/tmp/x_cookies_pw.json"


async def scrape_x_posts(
    username: str, count: int = 5, cookie_file: str = DEFAULT_COOKIE_FILE
):
    if not Path(cookie_file).exists():
        print(f"❌ Cookie文件不存在: {cookie_file}")
        print("\n请先导出Cookie并转换格式")
        print("参考: .opencode/skills/x-scraper/SKILL.md")
        sys.exit(1)

    with open(cookie_file, "r") as f:
        cookies = json.load(f)

    print(f"✅ 加载了 {len(cookies)} 个Cookies")

    async with async_playwright() as p:
        print("🚀 启动Chromium浏览器...")

        browser = await p.chromium.launch(
            headless=False, args=["--no-sandbox", "--disable-setuid-sandbox"]
        )

        context = await browser.new_context(viewport={"width": 1920, "height": 1080})

        await context.add_cookies(cookies)
        print("🍪 Cookies已注入")

        page = await context.new_page()

        url = f"https://x.com/{username}/with_replies"
        print(f"🌐 访问 {url}...")

        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(5000)

            try:
                await page.wait_for_selector(
                    'article[data-testid="tweet"]', timeout=15000
                )
            except:
                print("⚠️  with_replies 超时，尝试主页...")
                await page.goto(
                    f"https://x.com/{username}",
                    wait_until="domcontentloaded",
                    timeout=30000,
                )
                await page.wait_for_timeout(5000)
                await page.wait_for_selector(
                    'article[data-testid="tweet"]', timeout=10000
                )

            print("📜 加载帖子...")

            for i in range(12):
                await page.mouse.wheel(0, 1000)
                await page.wait_for_timeout(2000)
                print(f"📜 滚动加载... ({i + 1}/12)")

            articles = await page.query_selector_all('article[data-testid="tweet"]')
            print(f"✅ 找到 {len(articles)} 条帖子")

            if not articles:
                print("⚠️  没有找到帖子，可能Cookie已过期")
                await browser.close()
                return []

            posts = []

            for idx, article in enumerate(articles[:count]):
                try:
                    time_elem = await article.query_selector("time")
                    post_time = (
                        await time_elem.get_attribute("datetime")
                        if time_elem
                        else "Unknown"
                    )

                    post_link = "Unknown"
                    post_id = "Unknown"

                    if time_elem:
                        link_elem = await time_elem.evaluate_handle(
                            'node => node.closest("a")'
                        )
                        if link_elem and link_elem.as_element():
                            href = await link_elem.as_element().get_attribute("href")
                            if href:
                                post_link = (
                                    f"https://x.com{href}"
                                    if href.startswith("/")
                                    else href
                                )
                                match = re.search(r"/status/(\d+)", href)
                                if match:
                                    post_id = match.group(1)

                    text_elem = await article.query_selector(
                        '[data-testid="tweetText"]'
                    )
                    text_content = await text_elem.inner_text() if text_elem else ""

                    views_elem = await article.query_selector(
                        '[href$="/analytics"] span'
                    )
                    views = (
                        (await views_elem.inner_text()).strip() if views_elem else "N/A"
                    )

                    like_elem = await article.query_selector(
                        '[data-testid="like"] span'
                    )
                    likes = (await like_elem.inner_text()).strip() if like_elem else "0"

                    retweet_elem = await article.query_selector(
                        '[data-testid="retweet"] span'
                    )
                    retweets = (
                        (await retweet_elem.inner_text()).strip()
                        if retweet_elem
                        else "0"
                    )

                    reply_elem = await article.query_selector(
                        '[data-testid="reply"] span'
                    )
                    replies = (
                        (await reply_elem.inner_text()).strip() if reply_elem else "0"
                    )

                    post = {
                        "index": idx + 1,
                        "username": username,
                        "postId": post_id,
                        "publishTime": post_time,
                        "postLink": post_link,
                        "textContent": text_content,
                        "views": views or "N/A",
                        "likes": likes or "0",
                        "retweets": retweets or "0",
                        "replies": replies or "0",
                    }

                    posts.append(post)
                    print(f"✓ 提取帖子 {idx + 1} (ID: {post_id})")

                except Exception as e:
                    print(f"✗ 提取帖子 {idx + 1} 失败: {e}")

            await browser.close()
            return posts

        except Exception as e:
            print(f"❌ 错误: {e}")
            await browser.close()
            raise


def format_output(posts):
    print("\n" + "=" * 80)
    print("📊 结果")
    print("=" * 80 + "\n")

    for post in posts:
        print(f"【帖子 {post['index']}】")
        print(f"🔗 链接: {post['postLink']}")
        print(f"📅 时间: {post['publishTime']}")
        print(
            f"📝 内容: {post['textContent'][:100]}{'...' if len(post['textContent']) > 100 else ''}"
        )
        print(f"📊 数据:")
        print(f"   👀 浏览: {post.get('views', 'N/A')}")
        print(f"   ❤️  点赞: {post.get('likes', '0')}")
        print(f"   🔁 转发: {post.get('retweets', '0')}")
        print(f"   💬 回复: {post.get('replies', '0')}")
        print("-" * 80)


async def main():
    if len(sys.argv) < 2:
        print("用法: python3 scraper.py <用户名> [数量] [--cookie-file <路径>]")
        print("\n示例:")
        print("  python3 scraper.py dotey 15")
        print("  python3 scraper.py elonmusk 20 --cookie-file /path/to/cookies.json")
        print("\n前提: 需要先导出并转换Cookie")
        print("参考: .opencode/skills/x-scraper/SKILL.md")
        sys.exit(1)

    # Parse arguments
    username = sys.argv[1].lstrip("@")
    count = 10
    cookie_file = DEFAULT_COOKIE_FILE

    # Parse count and optional flags
    i = 2
    while i < len(sys.argv):
        if sys.argv[i] == "--cookie-file" and i + 1 < len(sys.argv):
            cookie_file = sys.argv[i + 1]
            i += 2
        else:
            # Assume it's the count
            count = int(sys.argv[i])
            i += 1

    print(f"🎯 目标: @{username}")
    print(f"📌 数量: {count} 条帖子")
    print(f"🍪 Cookie文件: {cookie_file}\n")

    try:
        posts = await scrape_x_posts(username, count, cookie_file)

        if not posts:
            print("\n⚠️  未获取到帖子")
            sys.exit(1)

        format_output(posts)

        print("\n" + "=" * 80)
        print("📄 JSON 输出")
        print("=" * 80)
        print(json.dumps(posts, ensure_ascii=False, indent=2))

        output_file = f"/tmp/x_{username}_posts.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(posts, f, ensure_ascii=False, indent=2)

        print(f"\n✅ 抓取了 {len(posts)} 条帖子")
        print(f"💾 保存到: {output_file}")

    except KeyboardInterrupt:
        print("\n\n⚠️  已中断")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ 错误: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
