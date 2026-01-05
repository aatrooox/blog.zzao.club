---
title: Memos Apis
date: 2024-08-15
lastmod: 2025-08-19
showTitle: Memos Apis
---
注意：Memos版本为： `V0.22.4`
###   GET: /api/v1/memos?filter=

**Spelling the string directly may not succeed. I suggest requesting in the following way.**

```typescript
const filterValue = "creator=='users/1'&&tag_search==['Blog']&&visibilities==['PUBLIC', 'PROTECTED']&&limit==30";
const encodedFilterValue = encodeURIComponent(filterValue);
const url = `https://example.com/api/v1/memos?filter=${encodedFilterValue}`;
```

**it's all about query params ↓**
```go
var MemoFilterCELAttributes = []cel.EnvOption{
	cel.Variable("content_search", cel.ListType(cel.StringType)),
	cel.Variable("visibilities", cel.ListType(cel.StringType)),
	cel.Variable("tag_search", cel.ListType(cel.StringType)),
	cel.Variable("order_by_pinned", cel.BoolType),
	cel.Variable("display_time_before", cel.IntType),
	cel.Variable("display_time_after", cel.IntType),
	cel.Variable("creator", cel.StringType),
	cel.Variable("uid", cel.StringType),
	cel.Variable("row_status", cel.StringType),
	cel.Variable("random", cel.BoolType),
	cel.Variable("limit", cel.IntType),
	cel.Variable("include_comments", cel.BoolType),
	cel.Variable("has_link", cel.BoolType),
	cel.Variable("has_task_list", cel.BoolType),
	cel.Variable("has_code", cel.BoolType),
	cel.Variable("has_incomplete_tasks", cel.BoolType),
}
```

