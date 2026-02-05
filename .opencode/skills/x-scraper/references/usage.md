# Usage Guide

Detailed usage examples and advanced options for x-scraper.

## Basic Usage

### Standard Scraping

```bash
cd .opencode/skills/x-scraper/scripts
python3 scraper.py <username> [count]
```

**Arguments**:
- `username` - X.com username (with or without @)
- `count` - Number of posts to fetch (optional, default: 10)

**Examples**:
```bash
# Fetch 10 posts (default)
python3 scraper.py example_user

# Fetch 20 posts
python3 scraper.py user1 20

# Username with @ prefix (automatically stripped)
python3 scraper.py @user2 15
```

---

## Advanced Options

### Custom Cookie File

Use different cookie file instead of default `/tmp/x_cookies_pw.json`:

```bash
python3 scraper.py <username> <count> --cookie-file <path>
```

**Examples**:
```bash
# Use cookie from home directory
python3 scraper.py example_user 10 --cookie-file ~/x_cookies_pw.json

# Use cookie from custom location
python3 scraper.py user1 20 --cookie-file /secure/cookies/x_pw.json
```

**When to use**:
- Managing multiple X.com accounts
- Storing cookies in secure location
- Separating personal/work accounts

---

## Output Handling

### Output Location

**Default output file**: `/tmp/x_{username}_posts.json`

**Examples**:
- `python3 scraper.py example_user 10` → `/tmp/x_example_user_posts.json`
- `python3 scraper.py user1 20` → `/tmp/x_user1_posts.json`

### Reading Output

**View JSON formatted**:
```bash
cat /tmp/x_example_user_posts.json | python3 -m json.tool
```

**Count posts**:
```bash
cat /tmp/x_example_user_posts.json | python3 -c "import json, sys; print(len(json.load(sys.stdin)))"
```

**Extract all post links**:
```bash
cat /tmp/x_example_user_posts.json | python3 -c "import json, sys; [print(p['postLink']) for p in json.load(sys.stdin)]"
```

---

## Scraping Multiple Users

### Sequential Scraping

```bash
for user in user1 user2 user3; do
    python3 scraper.py $user 10
done
```

**Output files**:
- `/tmp/x_user1_posts.json`
- `/tmp/x_user2_posts.json`
- `/tmp/x_user3_posts.json`

### Batch Script

```bash
#!/bin/bash
USERS=("user1" "user2" "user3")
COUNT=15

for user in "${USERS[@]}"; do
    echo "Scraping @$user..."
    python3 scraper.py $user $COUNT
    sleep 5  # Avoid rate limiting
done
```

---

## Data Processing Examples

### Filter Posts by Date

```python
import json
from datetime import datetime, timedelta

with open('/tmp/x_example_user_posts.json') as f:
    posts = json.load(f)

# Last 7 days
week_ago = datetime.now() - timedelta(days=7)
recent_posts = [
    p for p in posts
    if datetime.fromisoformat(p['publishTime'].replace('Z', '+00:00')) > week_ago
]

print(f"Posts in last 7 days: {len(recent_posts)}")
```

### Sort by Engagement

```python
import json

with open('/tmp/x_example_user_posts.json') as f:
    posts = json.load(f)

def parse_metric(s):
    """Convert '1.2K' to 1200, '2.3M' to 2300000"""
    s = s.replace(',', '')
    if 'K' in s:
        return float(s.replace('K', '')) * 1000
    if 'M' in s:
        return float(s.replace('M', '')) * 1000000
    return float(s) if s != 'N/A' else 0

# Sort by likes
sorted_posts = sorted(posts, key=lambda p: parse_metric(p['likes']), reverse=True)

print("Top 5 most liked posts:")
for post in sorted_posts[:5]:
    print(f"{post['likes']} likes: {post['textContent'][:50]}...")
    print(f"Link: {post['postLink']}\n")
```

### Export to CSV

```bash
cat /tmp/x_example_user_posts.json | python3 -c "
import json, sys, csv
posts = json.load(sys.stdin)
writer = csv.DictWriter(sys.stdout, fieldnames=posts[0].keys())
writer.writeheader()
writer.writerows(posts)
" > /tmp/posts.csv
```

---

## Working with Content

### Extract Mentions

```python
import json
import re

with open('/tmp/x_example_user_posts.json') as f:
    posts = json.load(f)

mentions = set()
for post in posts:
    # Find all @mentions
    found = re.findall(r'@(\w+)', post['textContent'])
    mentions.update(found)

print(f"Mentioned users: {', '.join(sorted(mentions))}")
```

### Extract Hashtags

```python
import json
import re

with open('/tmp/x_example_user_posts.json') as f:
    posts = json.load(f)

hashtags = set()
for post in posts:
    # Find all #hashtags
    found = re.findall(r'#(\w+)', post['textContent'])
    hashtags.update(found)

print(f"Popular hashtags: {', '.join(sorted(hashtags))}")
```

### Find Posts with Links

```python
import json
import re

with open('/tmp/x_example_user_posts.json') as f:
    posts = json.load(f)

url_pattern = r'https?://[^\s]+'
posts_with_links = [
    p for p in posts
    if re.search(url_pattern, p['textContent'])
]

print(f"Posts containing links: {len(posts_with_links)}/{len(posts)}")
```

---

## Rate Limiting Best Practices

### Avoid Rate Limits

1. **Add delays between requests**:
   ```bash
   python3 scraper.py user1 10
   sleep 10
   python3 scraper.py user2 10
   ```

2. **Limit post count**:
   - Fetch 10-20 posts per request (not 100+)

3. **Don't scrape too frequently**:
   - Space out scraping sessions (every few hours, not every minute)

### Detecting Rate Limiting

**Signs you're rate limited**:
- "找到 0 条帖子" (unexpectedly)
- Browser shows login page or challenge
- Timeouts or errors

**Solution**:
- Wait 30-60 minutes
- Re-export cookies
- Reduce scraping frequency

---

## Converting Cookies

### Basic Conversion

```bash
python3 convert_cookies.py <input-file> [output-file]
```

**Examples**:
```bash
# Default output path
python3 convert_cookies.py /tmp/x_cookies.json

# Custom output path
python3 convert_cookies.py ~/Downloads/cookies.json /tmp/x_cookies_pw.json
```

### Verifying Conversion

**Check converter output**:
```
📥 加载了 13 个 Cookie
✅ 已转换 13 个 Cookie
💾 保存到: /tmp/x_cookies_pw.json

🔑 关键 Cookie:
  - auth_token: f23f957dffc4dfdd3e7b...
  - twid: u%3D1727963779131142...
  - ct0: 65362af3f43c824133fe...
```

**All three key cookies (auth_token, ct0, twid) must be present**.

If missing:
1. Verify you were logged in to X.com
2. Re-export cookies
3. Re-run converter

---

## Tips and Best Practices

### Recommended Post Counts

| Use Case | Recommended Count |
|----------|-------------------|
| Quick check | 5-10 posts |
| Daily monitoring | 10-20 posts |
| Analysis/research | 20-50 posts |
| Avoid | 100+ posts (slow, rate limiting risk) |

### Output File Management

**Clean up old files**:
```bash
# Delete all cached scraper output
rm /tmp/x_*_posts.json
```

**Archive important data**:
```bash
# Move to permanent location
mv /tmp/x_example_user_posts.json ~/archive/example_user_$(date +%Y%m%d).json
```

### Security

- Store cookies in secure locations (not public directories)
- Don't commit cookie files to version control
- Delete cookies when no longer needed
- Re-export cookies if you suspect compromise

### Performance

- Scraper uses headless browser (Chromium)
- Expect 30-60 seconds for 10-20 posts
- Larger counts take proportionally longer
- Network speed affects performance
