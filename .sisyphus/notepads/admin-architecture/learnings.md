Settings.vue admin-area analysis - appended findings
Date: 2026-02-10

Summary:
- Tabs and template sections mapped to line ranges (see details).
- Client-side token checks exist in definePageMeta middleware; it reads localStorage keys 'blog/tokenInfo' and 'blog/token'. If none found, page redirects to '/'.
- PAT (Personal Access Token) flows (fetch, list, generate, delete, copy) are implemented in this file; key functions and lines recorded below.
- No isSuperAdmin / superAdmin conditional rendering found inside app/pages/settings.vue. Role gating for superAdmin is not present here.

Details (line references are absolute to the file app/pages/settings.vue):
- Tab definitions: lines 58-66 (const tabs, currentTab)
- Client-side token check (page middleware): lines 16-46
  - Reads localStorage.getItem('blog/tokenInfo') at line 21
  - Falls back to localStorage.getItem('blog/token') at line 38
  - Redirects to '/' if no token found at line 42-44
- userStore token set during GitHub callback: lines 255-268 (userStore.setToken at line 264)
- PAT related state and helpers:
  - PAT state declarations: lines 67-72
  - fetchScopes(): lines 85-90
  - fetchPATs(): lines 117-122
  - deletePAT(id): lines 124-133 (delete API + confirmation)
  - onSubmitPAT(values): lines 183-194 (generate token)
  - copyToken(): lines 196-201
- Template sections (tabs -> template v-if ranges):
  - Profile (Basic info): lines 305-329 (v-if="currentTab === 'profile'")
  - Account (User settings): lines 332-353 (v-if="currentTab === 'account'")
  - Security (Change password): lines 356-380 (v-if="currentTab === 'security'")
  - Developer (PAT): lines 383-540 (v-if="currentTab === 'developer'")
- PAT template details:
  - PAT explanation card: lines 389-397
  - Token generation form (when no generatedToken): lines 399-454 (AutoForm with patSchema + scopes selection)
  - Generated token display (when generatedToken present): lines 556?-? (display block lines 56x) -- see file for exact placement (block begins at line 556? correction: generated token block starts at 456?).

Notes / Actionable:
- Use the referenced lines to make UI/UX fixes or to add role-based gating if desired.
- For any further change (add superAdmin gating, move token checks to middleware file), provide a single-file task.

