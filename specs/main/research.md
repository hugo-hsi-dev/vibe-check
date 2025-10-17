# Technical Research: Vibe Check PWA

**Date**: 2025-10-17  
**Phase**: 0 - Research & Technical Decisions

This document consolidates research findings for all technical unknowns identified in the implementation plan.

---

## 1. SvelteKit Remote Functions Setup

### Overview
Remote functions are SvelteKit's experimental feature (since 2.27) for type-safe client-server communication. They replace traditional load functions and form actions with a unified approach.

### Configuration Required

**Enable in svelte.config.js:**
```javascript
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    experimental: {
      remoteFunctions: true
    }
  },
  compilerOptions: {
    experimental: {
      async: true  // Enable await in components
    }
  }
};

export default config;
```

### File Organization Pattern

Remote functions must be in `.remote.js` or `.remote.ts` files within `src/` directory:

```
src/routes/
├── blog/
│   ├── +page.svelte
│   └── data.remote.ts       # Co-located with routes
├── profile/
│   ├── +page.svelte
│   └── settings.remote.ts
└── lib/
    └── shared.remote.ts      # Shared across multiple routes
```

### Type Inference Pattern

Types automatically flow from server to client:

```typescript
// data.remote.ts
import { query } from '$app/server';
import * as v from 'valibot';

export const getPosts = query(async () => {
  return [{ id: 1, title: "Hello" }]; // Return type inferred
});

// +page.svelte
import { getPosts } from './data.remote';
// TypeScript knows return type is { id: number, title: string }[]
const posts = await getPosts();
```

### Decision: Use Valibot for Validation

**Rationale:**
- More performant than Zod (smaller bundle size)
- Better TypeScript inference
- Modular API (tree-shakeable)
- Standard Schema compliant

**Example:**
```typescript
import * as v from 'valibot';
import { query } from '$app/server';

export const getUser = query(
  v.string(), // Validates input
  async (userId) => {
    // userId is type-safe string
    return await db.users.findOne({ id: userId });
  }
);
```

### Best Practices Identified

1. **Co-locate remote files with routes** - Improves type inference and organization
2. **Use `query.batch` for n+1 problems** - Batch simultaneous queries automatically
3. **Always validate inputs** - Use Valibot schemas for all remote functions with arguments
4. **Use `getRequestEvent()` for cookies/auth** - Access request context anywhere
5. **Refresh queries explicitly** - Call `query().refresh()` or use `updates()` for single-flight mutations

---

## 2. Vitest Browser Mode Configuration

### Overview
Vitest Browser Mode runs tests in real browsers using Playwright, replacing jsdom/happy-dom. The vitest-browser-svelte package provides Svelte 5-specific testing utilities.

### Multi-Project Setup (Client-Server Alignment Strategy)

**Philosophy:** Keep client tests in real browsers while server tests run fast in Node.js with minimal mocking.

**vite.config.ts configuration:**
```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  
  test: {
    projects: [
      {
        // Client-side tests (Svelte components)
        extends: true,
        test: {
          name: 'client',
          environment: 'browser',
          testTimeout: 2000, // Prevent hanging on element lookups
          browser: {
            enabled: true,
            provider: 'playwright',
            instances: [
              { browser: 'chromium' },
              // { browser: 'firefox' },
              // { browser: 'webkit' },
            ],
          },
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: [
            'src/lib/server/**',
            'src/**/*.ssr.{test,spec}.{js,ts}',
          ],
          setupFiles: ['./src/vitest-setup-client.ts'],
        },
      },
      {
        // SSR tests (Server-side rendering)
        extends: true,
        test: {
          name: 'ssr',
          environment: 'node',
          include: ['src/**/*.ssr.{test,spec}.{js,ts}'],
        },
      },
      {
        // Server-side tests (Node.js utilities)
        extends: true,
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: [
            'src/**/*.svelte.{test,spec}.{js,ts}',
            'src/**/*.ssr.{test,spec}.{js,ts}',
          ],
        },
      },
    ],
    coverage: {
      include: ['src'], // Improved performance
    },
  },
});
```

**Setup file (vitest-setup-client.ts):**
```typescript
/// <reference types="@vitest/browser/matchers" />
/// <reference types="@vitest/browser/providers/playwright" />
```

### Testing Pattern: Always Use Locators

**Golden Rule:** Never use container queries - always use page locators for auto-retry and semantic queries.

```typescript
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import { expect, it } from 'vitest';

it('should render button', async () => {
  render(MyButton, { children: createRawSnippet(() => ({
    render: () => `<span>Click me</span>`
  }))});

  // ✅ DO: Use page locators (auto-retry)
  const button = page.getByRole('button', { name: 'Click me' });
  await expect.element(button).toBeInTheDocument();
  
  // ❌ DON'T: Use container queries
  // const { container } = render(MyButton);
  // const button = container.querySelector('button'); // NO!
});
```

### Locator Hierarchy (Priority Order)

1. **Semantic roles** (best for accessibility):
   ```typescript
   page.getByRole('button', { name: 'Submit' });
   page.getByRole('textbox', { name: 'Email' });
   ```

2. **Labels** (good for forms):
   ```typescript
   page.getByLabel('Email address');
   ```

3. **Text content** (good for unique text):
   ```typescript
   page.getByText('Welcome back');
   ```

4. **Test IDs** (fallback for complex cases):
   ```typescript
   page.getByTestId('submit-button');
   ```

### Handling Multiple Elements (Strict Mode)

Vitest Browser operates in strict mode - multiple matches cause errors:

```typescript
// ❌ FAILS: "strict mode violation" if multiple elements
page.getByRole('link', { name: 'Home' });

// ✅ CORRECT: Use .first(), .nth(), .last()
page.getByRole('link', { name: 'Home' }).first();
page.getByRole('link', { name: 'Home' }).nth(1); // Second element (0-indexed)
page.getByRole('link', { name: 'Home' }).last();
```

### Mocking Remote Functions for Component Tests

**Pattern:** Mock remote functions in component tests since components import them directly.

**Setup mock file (src/lib/__mocks__/data.remote.ts):**
```typescript
import { vi } from 'vitest';

export const getPosts = vi.fn(async () => [
  { id: 1, title: 'Test Post', slug: 'test-post' }
]);

export const createPost = {
  fields: {
    title: {
      as: vi.fn(() => ({ name: 'title', value: '' })),
      issues: vi.fn(() => []),
      value: vi.fn(() => ''),
    },
    content: {
      as: vi.fn(() => ({ name: 'content', value: '' })),
      issues: vi.fn(() => []),
      value: vi.fn(() => ''),
    },
  },
  pending: false,
  result: null,
};
```

**Use in test:**
```typescript
vi.mock('./data.remote');

it('should display posts', async () => {
  const { getPosts } = await import('./data.remote');
  
  render(BlogPage);
  
  await expect.element(page.getByText('Test Post')).toBeInTheDocument();
  expect(getPosts).toHaveBeenCalled();
});
```

### Testing Svelte 5 Runes

Use `untrack()` and `flushSync()` for reactive state:

```typescript
import { untrack, flushSync } from 'svelte';
import { expect, it } from 'vitest';

it('should handle reactive state', () => {
  let count = $state(0);
  let doubled = $derived(count * 2);

  expect(untrack(() => doubled)).toBe(0);

  count = 5;
  flushSync(); // Ensure derived state updates
  expect(untrack(() => doubled)).toBe(10);
});
```

### Foundation First Template

```typescript
describe('ComponentName', () => {
  describe('Initial Rendering', () => {
    it('should render with default props', async () => {
      // First test
    });
  });

  describe('User Interactions', () => {
    it('should handle click events', async () => {
      // Interaction tests
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data gracefully', async () => {
      // Edge case tests
    });
  });
});
```

### Common Issues & Solutions

**Issue: "strict mode violation: getByRole() resolved to X elements"**
- **Solution:** Use `.first()`, `.nth()`, or `.last()`

**Issue: Test hanging on form submission**
- **Cause:** SvelteKit enhance causes navigation
- **Solution:** Test form state directly, avoid clicking submit buttons

**Issue: "Expected 2 arguments, but got 0"**
- **Cause:** Mock function signature doesn't match real function
- **Solution:** Match exact function signature in mock

**Issue: Role confusion (e.g., looking for 'input' role)**
- **Solution:** Use correct semantic role:
  - `<input type="text">` → `getByRole('textbox')`
  - `<input type="checkbox">` → `getByRole('checkbox')`
  - `<button>` → `getByRole('button')`

### Decision: Test File Naming Convention

- **Component tests:** `*.svelte.test.ts`
- **SSR tests:** `*.ssr.test.ts`
- **Server tests:** `*.test.ts` (default, in server directories)

---

## 3. Vite-PWA Integration

### Installation & Setup

**Install package:**
```bash
pnpm add -D @vite-pwa/sveltekit
```

**Configure vite.config.ts:**
```typescript
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      // Default options - stale-while-revalidate
      // Auto-update in background
    })
  ],
});
```

### Web Manifest in Layout

**src/routes/+layout.svelte:**
```svelte
<script>
  import { pwaInfo } from 'virtual:pwa-info';
  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

<slot />
```

### Service Worker Registration (Auto-Update)

**Add to layout's onMount:**
```svelte
<script>
  import { onMount } from 'svelte';
  import { pwaInfo } from 'virtual:pwa-info';
  
  onMount(async () => {
    if (pwaInfo) {
      const { registerSW } = await import('virtual:pwa-register');
      registerSW({ 
        immediate: true,
        onRegistered(r) {
          console.log('SW Registered:', r);
        },
        onOfflineReady() {
          console.log('App ready to work offline');
        },
      });
    }
  });
</script>
```

### Default Workbox Configuration

**Automatically configured glob patterns:**
- `client/**/*.{js,css,ico,png,svg,webp,webmanifest}`
- `prerendered/**/*.{html,json}`

**Build directory:** `.svelte-kit/output`

**Default strategy:** Stale-while-revalidate (serves cached content while fetching updates)

### Optional: Update Prompt Component

If you want to prompt users for updates (not using auto-update):

```svelte
<script lang="ts">
  import { useRegisterSW } from 'virtual:pwa-register/svelte';
  
  const { 
    needRefresh, 
    updateServiceWorker, 
    offlineReady 
  } = useRegisterSW();
</script>

{#if $needRefresh}
  <div class="update-prompt">
    <span>New content available!</span>
    <button onclick={() => updateServiceWorker(true)}>
      Reload
    </button>
  </div>
{/if}

{#if $offlineReady}
  <div>App ready to work offline</div>
{/if}
```

### Decision: Use Default Configuration

**Rationale:**
- Auto-update in background provides seamless UX
- Stale-while-revalidate balances offline capability with fresh content
- Default glob patterns cover all SvelteKit build outputs
- Can optimize later based on real-world performance data

**No custom configuration needed initially.**

---

## 4. Drizzle ORM Best Practices

### Schema Definition Pattern

**src/lib/server/db/schema.ts:**
```typescript
import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  published: boolean('published').default(false).notNull(),
  authorId: serial('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Database Client Setup

**src/lib/server/db/index.ts:**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Connection pooling configuration
const client = postgres(connectionString, {
  max: 10, // Maximum pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
```

### Using in Remote Functions

```typescript
// src/routes/blog/data.remote.ts
import { query } from '$app/server';
import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const getPosts = query(async () => {
  return await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt));
});
```

### Migration Strategy

**drizzle.config.ts:**
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/server/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

**Commands:**
```bash
# Generate migration files
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

### Test Mocking Pattern

**Abstract DB behind interface for testing:**

```typescript
// src/lib/server/db/types.ts
export interface DatabaseClient {
  getPosts: () => Promise<Post[]>;
  getPost: (slug: string) => Promise<Post | undefined>;
  createPost: (data: NewPost) => Promise<Post>;
}
```

**Mock for tests:**
```typescript
// src/lib/server/db/__mocks__/index.ts
import { vi } from 'vitest';

export const db = {
  select: vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({
        orderBy: vi.fn(() => Promise.resolve([
          { id: 1, title: 'Test Post', slug: 'test-post' }
        ]))
      }))
    }))
  }))
};
```

### Decision: Connection Pooling Configuration

**Rationale:**
- PostgreSQL supports up to 100 concurrent connections by default
- Set max pool size to 10 for single-instance deployment
- Idle timeout of 20s balances connection reuse with resource cleanup
- Connect timeout of 10s fails fast on connection issues

---

## 5. Adapter-Node Configuration

### Installation

Already installed in package.json:
```json
{
  "devDependencies": {
    "@sveltejs/adapter-node": "^5.3.2"
  }
}
```

### Configuration

**svelte.config.js:**
```javascript
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      out: 'build',
      precompress: true,
      envPrefix: ''
    }),
    experimental: {
      remoteFunctions: true
    }
  },
  compilerOptions: {
    experimental: {
      async: true
    }
  }
};

export default config;
```

### Build Output Structure

```
build/
├── index.js           # Node.js server entry point
├── handler.js         # Request handler
├── client/            # Client-side assets
│   ├── _app/
│   └── ...
├── server/            # Server-side code
└── prerendered/       # Prerendered pages
```

### Environment Variables

**Required for production:**
```env
# .env (not committed)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
ORIGIN=https://yourdomain.com
PROTOCOL_HEADER=x-forwarded-proto
HOST_HEADER=x-forwarded-host
```

### Running in Production

**Start script:**
```bash
node build/index.js
```

**With environment variables:**
```bash
ORIGIN=https://yourdomain.com \
DATABASE_URL=postgresql://... \
node build/index.js
```

### Dokploy Deployment Requirements

**Dockerfile (if needed):**
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build application
RUN pnpm build

EXPOSE 3000

CMD ["node", "build/index.js"]
```

**Or use Dokploy's built-in Node.js support:**
- Set build command: `pnpm build`
- Set start command: `node build/index.js`
- Configure environment variables in Dokploy UI

### Decision: Production Configuration

**Rationale:**
- Use precompress option for gzip/brotli compression
- Default envPrefix (empty string) for standard env var usage
- Deploy via Dokploy's Node.js runtime (simpler than Docker)
- Use PostgreSQL connection string from environment
- Configure reverse proxy headers for ORIGIN detection

---

## Summary of Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Validation** | Valibot | Smaller bundle, better performance, modular |
| **Testing Strategy** | Multi-project Vitest (client/server/ssr) | Real browser tests + fast server tests |
| **Remote Functions** | Co-locate with routes | Better type inference and organization |
| **PWA Config** | Default vite-pwa settings | Stale-while-revalidate, auto-update |
| **DB Connection** | Postgres.js with pooling (max 10) | Balance performance and resource usage |
| **Deployment** | Dokploy + adapter-node | Simpler than Docker, native Node.js runtime |
| **Test Mocking** | Abstract Drizzle client | Enables unit testing without DB |

---

## Implementation Priorities

1. **Setup infrastructure** (SvelteKit config, vite-pwa, Drizzle)
2. **Create database schema** (users, posts, etc.)
3. **Implement remote functions** (query, form, command patterns)
4. **Build components** (with data fetching via remote functions)
5. **Write tests** (component tests with mocked remote functions)
6. **E2E tests** (Playwright for full user flows)
7. **Deploy** (Dokploy with environment configuration)

---

**Next Phase:** Phase 1 - Design (data-model.md, contracts/, quickstart.md)
