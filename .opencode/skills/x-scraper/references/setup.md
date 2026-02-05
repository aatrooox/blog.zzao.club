# Setup Guide

Complete environment setup for x-scraper skill.

## Prerequisites Check

Before using x-scraper, verify all requirements:

### 1. Python 3.11+

**Check version**:
```bash
python3 --version
```

**Expected**: Python 3.11.0 or higher

**If missing or outdated**:

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip
```

#### macOS
```bash
brew install python@3.11
```

**Verify installation**:
```bash
python3.11 --version
```

---

### 2. Playwright Dependencies

**Check installation**:
```bash
python3 -c "import playwright; print('✓ playwright installed')" 2>/dev/null || echo "✗ playwright missing"
```

**If missing**:
```bash
python3 -m pip install playwright
python3 -m playwright install chromium
```

**Verify installation**:
```bash
python3 -c "from playwright.async_api import async_playwright; print('✓ All dependencies ready')"
```

**Common issues**:
- `ModuleNotFoundError`: Re-run `pip install playwright`
- `Executable doesn't exist`: Re-run `python3 -m playwright install chromium`

---

### 3. X.com Authentication Cookies

x-scraper requires authenticated cookies to access X.com posts.

**Check if cookie file exists**:
```bash
ls -lh /tmp/x_cookies_pw.json
```

**If file exists**: You're ready to scrape. Skip to usage.

**If file missing**: Follow cookie export process below.

---

## Cookie Export Process

### Step 1: Install Cookie-Editor Extension

1. Open Chrome browser
2. Visit: https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm
3. Click "Add to Chrome"
4. Confirm installation

### Step 2: Login to X.com

1. Navigate to https://x.com
2. Ensure you are logged in
3. Verify you can see your timeline

### Step 3: Export Cookies

1. Click Cookie-Editor extension icon 🍪 in browser toolbar
2. Click "Export" button (top right)
3. Select "JSON" format
4. Copy the JSON content
5. Save to a file on your system

**Recommended paths**:
- `/tmp/x_cookies.json` (temporary)
- `~/x_cookies.json` (home directory)
- Any path you prefer

### Step 4: Convert Cookie Format

Cookie-Editor exports in Chrome format, but Playwright requires a different format.

**Run converter**:
```bash
cd .opencode/skills/x-scraper/scripts
python3 convert_cookies.py <your-cookie-file> /tmp/x_cookies_pw.json
```

**Examples**:
```bash
# If saved to /tmp/x_cookies.json
python3 convert_cookies.py /tmp/x_cookies.json /tmp/x_cookies_pw.json

# If saved to home directory
python3 convert_cookies.py ~/x_cookies.json /tmp/x_cookies_pw.json

# Custom output path
python3 convert_cookies.py ~/Downloads/cookies.json /tmp/custom_cookies.json
```

**Expected output**:
```
📥 加载了 13 个 Cookie
✅ 已转换 13 个 Cookie
💾 保存到: /tmp/x_cookies_pw.json

🔑 关键 Cookie:
  - auth_token: f23f957dffc4dfdd3e7b...
  - twid: u%3D1727963779131142...
  - ct0: 65362af3f43c824133fe...
```

**If key cookies missing**:
- Ensure you were logged in to X.com before exporting
- Try logging out and back in
- Re-export cookies

---

## Verification

After setup, verify everything works:

```bash
cd .opencode/skills/x-scraper/scripts

# Test with small count (won't take long)
python3 scraper.py example_user 3
```

**Expected output**:
```
🎯 目标: @example_user
📌 数量: 3 条帖子
🍪 Cookie文件: /tmp/x_cookies_pw.json

✅ 加载了 13 个Cookies
🚀 启动Chromium浏览器...
🍪 Cookies已注入
🌐 访问 https://x.com/example_user/with_replies...
📜 加载帖子...
...
✅ 抓取了 3 条帖子
💾 保存到: /tmp/x_example_user_posts.json
```

**If successful**: Setup complete!

**If failed**: See [troubleshooting.md](troubleshooting.md)

---

## Cookie Maintenance

### Cookie Lifespan

X.com cookies typically expire after **7 days**.

### When to Re-export

Re-export cookies when you see:
- "Cookie已过期" error
- "找到 0 条帖子" (unexpectedly)
- Scraper opens browser but shows login page

### Re-export Process

1. Clear old cookie file: `rm /tmp/x_cookies_pw.json`
2. Ensure logged in to X.com in Chrome
3. Re-export cookies (Step 3 above)
4. Re-run converter (Step 4 above)

---

## Using Custom Cookie Paths

If you prefer to store cookies elsewhere:

**Export to custom location**:
```bash
python3 convert_cookies.py ~/my-cookies/x.json ~/my-cookies/x_pw.json
```

**Use custom path when scraping**:
```bash
python3 scraper.py example_user 10 --cookie-file ~/my-cookies/x_pw.json
```

---

## Security Notes

- Cookie files contain sensitive authentication data
- Do not share cookie files
- Store in secure locations (avoid public directories)
- Delete old cookie files when no longer needed
- Re-export cookies if you suspect compromise
