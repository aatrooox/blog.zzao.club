# Troubleshooting Guide

Common issues and solutions for x-scraper.

## Environment Issues

### Python Version Issues

#### "python3: command not found"

**Cause**: Python not installed or not in PATH

**Solution**:
```bash
# Check if python is aliased
which python python3

# If neither found, install (see setup.md)
# Ubuntu/Debian
sudo apt install python3.11

# macOS
brew install python@3.11
```

#### "Python 3.11+ required, found 3.9"

**Cause**: Outdated Python version

**Solution**:
```bash
# Install Python 3.11+ (see setup.md)
# Then use explicit version
python3.11 -m pip install playwright
python3.11 scraper.py example_user 10
```

---

### Dependency Issues

#### "ModuleNotFoundError: No module named 'playwright'"

**Cause**: Playwright not installed

**Solution**:
```bash
python3 -m pip install playwright
python3 -m playwright install chromium
```

#### "playwright._impl._errors.Error: Executable doesn't exist"

**Cause**: Chromium browser not installed by Playwright

**Solution**:
```bash
python3 -m playwright install chromium
```

**If still fails**:
```bash
# Force reinstall
python3 -m playwright install --force chromium
```

#### "ImportError: cannot import name 'async_playwright'"

**Cause**: Playwright version mismatch or corrupted installation

**Solution**:
```bash
python3 -m pip uninstall playwright
python3 -m pip install playwright
python3 -m playwright install chromium
```

---

## Cookie Issues

### "Cookie文件不存在" (Cookie file not found)

**Cause**: Cookie file missing or wrong path

**Check default location**:
```bash
ls -lh /tmp/x_cookies_pw.json
```

**Solution**:
1. If file truly missing: Export cookies (see setup.md)
2. If file exists elsewhere: Use `--cookie-file` flag
   ```bash
   python3 scraper.py example_user 10 --cookie-file /path/to/cookies.json
   ```

---

### "Cookie已过期" (Cookies expired)

**Cause**: X.com cookies typically expire after 7 days

**Solution**:
1. Open X.com in Chrome and verify you're logged in
2. Re-export cookies using Cookie-Editor
3. Re-run converter:
   ```bash
   python3 convert_cookies.py /tmp/x_cookies.json /tmp/x_cookies_pw.json
   ```
4. Try scraping again

---

### Missing Key Cookies (auth_token, ct0, twid)

**Symptom**: Converter shows warning:
```
⚠️ 警告: 未找到关键 Cookie (auth_token, ct0, twid)
```

**Cause**: Not logged in when exporting cookies

**Solution**:
1. Clear browser cookies for X.com
2. Login to X.com again
3. Verify you can see your timeline
4. Re-export cookies
5. Re-run converter

---

### "sameSite" Format Errors

**Symptom**: Error about sameSite field when scraper runs

**Cause**: Didn't run cookie converter, using raw Cookie-Editor export

**Solution**:
Always run converter before scraping:
```bash
python3 convert_cookies.py <raw-export> /tmp/x_cookies_pw.json
```

Never manually edit cookie files.

---

## Scraping Issues

### "找到 0 条帖子" (0 posts found)

**Possible causes**:

#### 1. Expired or invalid cookies
**Check**: Does scraper show login page in browser window?
**Solution**: Re-export cookies (see Cookie Issues above)

#### 2. Incorrect username
**Check**: Does the user exist on X.com?
**Solution**: Verify username on https://x.com/{username}

#### 3. Private/protected account
**Check**: Does account require login to view?
**Solution**: x-scraper cannot access protected accounts, even with cookies

#### 4. Rate limiting
**Check**: Have you scraped many times recently?
**Solution**: Wait 30-60 minutes before trying again

---

### Timeout Errors

#### "TimeoutError: waiting for selector timed out"

**Possible causes**:

#### 1. Slow network
**Solution**: Increase timeout in script
```bash
# Edit scraper.py line 41
timeout=30000  # Change to 60000 (60 seconds)
```

#### 2. X.com slow or rate-limiting
**Solution**: Wait and retry later

#### 3. Proxy issues
**Check**: Are you behind a corporate firewall or proxy?
**Solution**: Configure proxy or disable
```bash
# Check proxy settings
echo $HTTP_PROXY $HTTPS_PROXY $ALL_PROXY

# Temporarily disable
unset HTTP_PROXY HTTPS_PROXY ALL_PROXY
python3 scraper.py example_user 10
```

---

### Browser Fails to Launch

#### "Browser closed unexpectedly"

**Cause**: Missing system dependencies for Chromium

**Solution Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2
```

**Solution macOS**:
```bash
# Usually no additional deps needed
# If fails, reinstall Chromium
python3 -m playwright install --force chromium
```

---

## Scraper Behavior Issues

### Scraper hangs at "加载帖子..."

**Cause**: Infinite scrolling not finding enough posts

**What's happening**: Script scrolls page trying to load more posts

**Solution**:
- If user has fewer posts than requested count, this is normal
- Wait for timeout, scraper will return what it found
- Request smaller count: `python3 scraper.py username 5`

---

### Posts missing or out of order

**Cause**: X.com uses algorithmic timeline, not strictly chronological

**This is normal behavior**: X.com's timeline sorting

**Solutions**:
- Request more posts to ensure coverage
- Sort results by `publishTime` in your code:
  ```python
  posts = sorted(posts, key=lambda p: p['publishTime'], reverse=True)
  ```

---

### Engagement metrics show "N/A"

**Cause**: X.com HTML structure changed or metrics not visible

**Solution**:
- Scraper still captures text content and links
- Metrics are secondary data, not critical
- If metrics needed, X.com may have changed HTML structure (requires script update)

---

## Getting Help

If issue persists after trying solutions:

1. **Check script version**: Ensure using latest scraper.py
2. **Verify prerequisites**: Re-run all checks in setup.md
3. **Test with known-working username**: Try a public account you know exists
4. **Check X.com status**: Visit https://x.com directly in browser
5. **Review error messages**: Look for specific error codes or messages

**Diagnostic command**:
```bash
# Run with small count to minimize time
python3 scraper.py example_user 3

# Check output files
ls -lh /tmp/x_example_user_posts.json
cat /tmp/x_example_user_posts.json | python3 -m json.tool
```
