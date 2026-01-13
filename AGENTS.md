# AGENTS.md - Coding Agent Guide

This guide provides essential information for AI coding agents working in this Nuxt 4 blog codebase.

## Tech Stack

- **Frontend**: Nuxt 4.0.3, Vue 3, Nuxt Content 3.6.3, Pinia, VueUse, shadcn-nuxt, Tailwind CSS 4.x (Vite plugin)
- **Backend**: Nitro (Nuxt server), MySQL + Drizzle ORM, Redis (token/rate limiting)
- **Key Libraries**: PrimeVue components, reka-ui, zod validation, bcrypt, jsonwebtoken, dayjs
- **Package Manager**: pnpm 10.11.0
- **Node Version**: 20+ (see `.nvmrc` and `.node-version`)

## Build/Lint/Test Commands

### Development
```bash
pnpm dev              # Start dev server on port 4775
pnpm dev -p <PORT>    # Start on custom port
```

### Build & Production
```bash
pnpm build            # Build for production
pnpm preview          # Preview production build
```

### Linting
```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix ESLint issues
```

### Database Operations
```bash
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema directly (no migration)
pnpm db:studio        # Open Drizzle Studio
pnpm db:drop          # Drop schema
```

### Release Management
```bash
pnpm release:patch    # Bump patch version (1.0.0 -> 1.0.1)
pnpm release:minor    # Bump minor version (1.0.0 -> 1.1.0)
pnpm release:major    # Bump major version (1.0.0 -> 2.0.0)
pnpm publish:post     # Quick commit + push for content updates
```

### Running Single Tests
This project does not currently have a test suite configured. When adding tests in the future, document test commands here.

## Code Style Guidelines

### ESLint Configuration
- Uses `@antfu/eslint-config` with Vue accessibility checks
- Auto-formatting enabled for CSS, HTML (markdown disabled)
- Ignores: `app/components/ui/**`, `**/*.md`, `lib/**`
- Special rules:
  - `ts/no-explicit-any`: OFF (any is allowed)
  - `no-console`: OFF (console.log allowed)
  - `antfu/top-level-function`: OFF
  - Vue a11y rules mostly disabled for flexibility

### Import Conventions
- Auto-imports enabled for Vue, Nuxt, and composables
- Use explicit imports for external libraries
- Server utilities auto-import from `server/utils`
- Import order: node built-ins → external packages → internal aliases → relative imports

### Formatting
- **Formatter**: ESLint (NOT Prettier)
- **Indentation**: 2 spaces
- **Line Length**: No strict limit, but keep it readable
- **Quotes**: Single quotes preferred
- **Semicolons**: Not required (follow ESLint rules)

### TypeScript Guidelines
- `strict: false` in tsconfig (relaxed mode)
- `noImplicitAny: false` (any types allowed)
- No explicit return types required
- Use zod schemas for runtime validation

### Naming Conventions
- **Components**: PascalCase (e.g., `AppTopNav.vue`, `UserAvatar.vue`)
- **Component Prefixes**:
  - `App*` - Common layout/navigation components
  - `Prose*` - MDC/markdown rendering components
  - `Memo*` - Memo-related components
  - `Animate*` - Animation components
  - `VB*` - vue-bits components (imported with `pathPrefix: false`)
- **Composables**: camelCase with `use` prefix (e.g., `useMemos`, `useUserSession`)
- **API Routes**: RESTful structure under `server/api/v1/`
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_CODES`)
- **Database Tables**: snake_case with `blog_` prefix (e.g., `blog_user`, `blog_memo`)
- **Database Fields**: camelCase in schema, snake_case in DB

### File Organization
```
app/
  ├── pages/           # Route pages
  ├── layouts/         # Layout components
  ├── components/
  │   ├── common/      # Shared components (no prefix)
  │   ├── ui/          # shadcn components (no prefix)
  │   ├── animate/     # Animation components (Animate prefix)
  │   ├── memo/        # Memo components (Memo prefix)
  │   ├── vue-bits/    # Third-party vue-bits (VB prefix)
  │   ├── content/     # Global MDC overrides
  │   └── mdc/         # MDC prose components
  ├── assets/css/      # Global CSS (Tailwind entry)
  └── composables/     # Composables
server/
  ├── api/v1/          # API endpoints (versioned)
  ├── middleware/      # Server middleware (numbered order)
  ├── utils/           # Server utilities (auto-imported)
  ├── routes/          # Special routes (sitemap, RSS)
  ├── plugins/         # Server plugins
  └── tasks/           # Scheduled tasks
lib/drizzle/          # Database schema & migrations
shared/utils/         # Shared constants (apiCodes)
content/              # Markdown content (or GitHub source)
```

### Vue Component Style
- Use `<script setup>` syntax
- Props: `defineProps<{ propName: Type }>()`
- Emits: `defineEmits<{ eventName: [payload: Type] }>()`
- Keep template logic minimal; extract to composables/computed
- Use TypeScript for type safety where beneficial

### Error Handling

#### API Responses
All API endpoints return standardized responses (always HTTP 200):
```ts
{
  code: number,        // From API_CODES (shared/utils/apiCodes.ts)
  message: string,
  data: any | null,
  timestamp: number
}
```

#### API Error Codes
- `0` - Success
- `1001-1999` - Authentication errors (NO_TOKEN, TOKEN_EXPIRED, TOKEN_INVALID, AUTH_FAILED)
- `2001-2999` - Permission errors (PERMISSION_DENIED, FORBIDDEN)
- `3001-3999` - Business logic errors (VALIDATION_ERROR, RESOURCE_NOT_FOUND, DUPLICATE_ERROR)
- `9001-9999` - System errors (INTERNAL_ERROR, NETWORK_ERROR)

#### Creating API Endpoints
1. Use `defineStandardResponseHandler` wrapper
2. Validate input with `useSafeValidatedBody/Query` + zod schema
3. Throw errors with `createError()` and include `data.code` from `API_CODES`
4. Return raw data (handler auto-wraps in standard format)

Example:
```ts
export const schema = z.object({ username: z.string() })

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, schema)
  
  if (!body.success) {
    throw createError({
      statusCode: 400,
      data: {
        code: API_CODES.VALIDATION_ERROR,
        message: '参数验证失败',
        data: body.error,
      },
    })
  }
  
  // ... business logic
  return { result: 'data' }  // Auto-wrapped by handler
})
```

## Authentication & Authorization

### Token System
- **JWT Access Token**: 15 min expiry, all permissions
- **Refresh Token**: 7 days, stored in Redis
- **PAT (Personal Access Token)**: Scoped permissions (wx/memo/comment/upload/user/all)

### Middleware Chain
1. `1.token.ts` - Extracts Bearer token to `event.context.token`
2. `2.auth0.ts` - Validates JWT/PAT, injects `context.userId` and `context.scope`
3. `3.rateLimit.ts` - Redis-based rate limiting by path/user/IP

### Route Protection
- `/api/v1/**` routes protected by default
- Whitelist: defined in `server/utils/whiteRoutes.ts` + `/api/v1/auth/refresh`
- GET requests without token = guest access (allowed)
- Non-GET requests require valid token
- PAT scope validation via `isPathAllowedByScope()`

### User Roles
- `superAdmin` - Full access (first registered user becomes superAdmin)
- `user` - Standard user
- Check role with `assertSuperAdmin()` in `server/utils/user.ts`

## Database Schema

### Key Tables (lib/drizzle/schema.ts)
- `blog_user` - Users (UUID primary key, bcrypt passwords)
- `blog_user_config` - User preferences
- `blog_access_token` - Personal access tokens (hashed)
- `blog_oauth` - OAuth provider links (GitHub)
- `blog_comment` / `blog_sub_comment` - Comments system
- `blog_like` - Likes (articles, comments, memos)
- `blog_memos` - Memos/posts with photos
- `blog_memo_tag` / `blog_memo_tag_relations` - Tags for memos

### Database Access
- Use `db` from `lib/drizzle` (auto-imported in server)
- Prefer Drizzle relations over manual joins
- Primary keys: UUID via `crypto.randomUUID()`
- Timestamps: `datetime` with `CURRENT_TIMESTAMP` defaults

## Content Management

### Nuxt Content Configuration
- Source: GitHub repository (`aatrooox/Blog`) via `CONTENT_REPO_TOKEN`
- Route prefix: `/post` (renders in `app/pages/post/[...slug].vue`)
- Filters: `**/*.md` (include), exclude `-*.md` and `book/**/*.md`
- Schema: `date`, `lastmod`, `tags[]`, `versions[]`
- Custom MDC components mapped in `nuxt.config.ts -> mdc.components.map`

### Syntax Highlighting
- Theme: `one-dark-pro` (light & dark)
- Supported languages: ts, js, vue, json, yml, yaml, sql, shell

## Deployment

### Production Setup
- **Port**: 4571 (PM2 via `pm2.config.json`)
- **Canary**: 4572 (PM2 via `pm2.canary.json`)
- **Environment**: `/root/envs/blog/.env` loaded via `pm2.preload.cjs`
- **Deploy**: GitHub Actions on `main` branch with `chore(release)` commits
- **Build**: `pnpm build` → `.output` directory
- **Prerender**: `/`, `/article`, `/post/**` (static), `/settings`, `/admin/**` (dynamic)

### Required Environment Variables
```env
DATABASE_URL=mysql://user:pass@host:3306/blog
NUXT_SESSION_PASSWORD=<32-char-random-string>
NUXT_JWT_SECRET=<random-string>
REDIS_HOST=127.0.0.1  # Optional, defaults to localhost
REDIS_PORT=6379        # Optional, defaults to 6379
CONTENT_REPO_TOKEN=    # If using GitHub content source
```

## Best Practices from Copilot Instructions

1. **API Middleware**: All `/api/v1/**` routes pass through token → auth → rate limit middleware
2. **Password Security**: Auto-upgrade from plaintext to bcrypt on first login (see `user/login.post.ts`)
3. **First User**: Automatically becomes `superAdmin`
4. **Token Rotation**: Refresh endpoint rotates both access and refresh tokens
5. **Error Responses**: Always return HTTP 200 with `code` field for client-side handling
6. **Scope Validation**: PAT tokens restricted by scope (check `isPathAllowedByScope`)
7. **Rate Limiting**: Upload endpoints have Redis-based limits
8. **Drizzle Relations**: Prefer using relations over manual joins for cleaner queries

## Common Tasks

### Adding a New API Endpoint
1. Create file in `server/api/v1/<feature>/<action>.<method>.ts`
2. Wrap handler with `defineStandardResponseHandler`
3. Define zod schema for validation
4. Use `useSafeValidatedBody/Query` for input validation
5. Return raw data (auto-wrapped)
6. Update whitelist in `whiteRoutes.ts` if public
7. Add to PAT scope if needed

### Adding a New Page
1. Create `.vue` file in `app/pages/`
2. Update route rules in `nuxt.config.ts` if prerendering needed
3. Add to `routeRules` (prerender: true/false)

### Modifying Database Schema
1. Edit `lib/drizzle/schema.ts`
2. Run `pnpm db:generate` to create migration
3. Run `pnpm db:migrate` or `pnpm db:push`
4. Commit migration files

---

**Note**: This is a personal blog project with relaxed conventions ("娱乐性质的个人空间，可不兴学啊！"). Prioritize functionality and readability over strict adherence to every rule.
