# Implementation Plan: Vibe Check

**Branch**: `main` | **Date**: 2025-10-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/main/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Building a progressive web application (PWA) using cutting-edge SvelteKit technology with offline-first capabilities. The application leverages SvelteKit's experimental remote functions for type-safe client-server communication, vitest's browser mode for comprehensive component testing, and vite-pwa for native-like mobile experiences without app store deployment.

## Technical Context

**Language/Version**: TypeScript 5.9+, Node.js (latest LTS)  
**Primary Framework**: SvelteKit 2.43+ with experimental remote functions  
**Frontend**: Svelte 5.39+ (runes mode)  
**Backend**: SvelteKit server routes + remote functions  
**Database**: PostgreSQL via Drizzle ORM 0.44+  
**PWA**: vite-pwa with Workbox (default configuration)  
**Testing**: 
  - Unit tests: Vitest 3.2+
  - Component tests: vitest-browser-svelte 1.1+ (Vitest browser mode)
  - E2E tests: Playwright 1.55+
**Build Tool**: Vite 7.1+  
**Styling**: Tailwind CSS 4.1+  
**Target Platform**: Web browsers (desktop + mobile), installable as PWA  
**Deployment**: Dokploy with adapter-node on traditional Node.js server  
**Project Type**: Web application (SvelteKit full-stack)  
**Performance Goals**: 
  - PWA offline-first functionality
  - Stale-while-revalidate caching
  - Background updates
  - Fast navigation with optimistic UI updates
**Constraints**: 
  - No SvelteKit load functions or form actions (use remote functions exclusively)
  - Component-level data fetching (remote functions imported directly in components)
  - Mocked database for tests (Drizzle client abstracted for testing)
**Scale/Scope**: Progressive web application with offline support

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: Constitution template not yet filled - assuming standard best practices apply

Key considerations:
- ✓ Type-safe client-server communication via remote functions
- ✓ Comprehensive testing strategy (unit, component, E2E)
- ✓ Progressive enhancement via PWA
- ✓ Modern Svelte 5 runes-based components

## Project Structure

### Documentation (this feature)

```
specs/main/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
src/
├── lib/
│   ├── components/        # Svelte 5 components (runes-based)
│   ├── server/            # Server-only modules (DB, auth, etc.)
│   │   ├── db/           # Drizzle client and schema
│   │   └── auth/         # Authentication logic
│   └── utils/            # Shared utilities
├── routes/
│   ├── +layout.svelte    # Root layout
│   ├── +page.svelte      # Home page
│   └── [feature]/
│       ├── +page.svelte
│       └── data.remote.ts # Remote functions for this feature
└── app.html              # HTML template

tests/
├── unit/                 # Vitest unit tests
├── component/            # vitest-browser-svelte component tests
└── e2e/                  # Playwright E2E tests
```

**Structure Decision**: Web application using SvelteKit's default single-project structure. Remote functions are co-located with routes (`.remote.ts` files) for better organization and type inference. Server-only code lives in `$lib/server/` to prevent client-side bundling.

## Key Technical Decisions

### Remote Functions Architecture

SvelteKit's experimental remote functions replace traditional load functions and form actions:

- **query**: Read dynamic data from server (with caching and refresh capabilities)
- **query.batch**: Batch multiple queries to solve n+1 problems
- **form**: Handle form submissions with progressive enhancement
- **command**: Imperative server operations (like mutations)
- **prerender**: Static data at build time

All remote functions:
- Provide type-safe communication (types flow from server to client)
- Support Standard Schema validation (Valibot, Zod)
- Serialize with devalue (handles Date, Map, custom types)
- Can use `getRequestEvent()` for cookies, headers, etc.

### Component-Level Data Fetching

Instead of passing data as props, components import and call remote functions directly:

```svelte
<script>
  import { getPost } from '../data.remote.ts';
  
  let { params } = $props();
  const post = $derived(await getPost(params.slug));
</script>
```

This requires mocking remote functions in component tests.

### PWA Configuration

Using vite-pwa with default Workbox settings:
- Auto-update in background (no user prompt)
- Stale-while-revalidate strategy
- Service worker handles offline functionality
- No custom configuration until optimization phase

### Testing Strategy

1. **Unit Tests** (Vitest): Test pure functions, utilities, business logic
2. **Component Tests** (vitest-browser-svelte): Test components in real browser with mocked remote functions
3. **E2E Tests** (Playwright): Test full user flows with real database interactions

Database mocking: Abstract Drizzle client behind interface for test injection.

### Deployment

Dokploy with adapter-node:
- Traditional Node.js server (not edge)
- PostgreSQL connection via Drizzle
- Environment variables for database credentials
- Service worker served as static asset

## Complexity Tracking

*No constitution violations to justify at this time*

## Phase 0: Research Requirements

Before proceeding to Phase 1, research the following:

1. **SvelteKit Remote Functions Setup**
   - Enable experimental.remoteFunctions in svelte.config.js
   - Enable compilerOptions.experimental.async for await in components
   - Best practices for organizing .remote.ts files
   - Type generation and inference patterns

2. **Vitest Browser Mode Configuration**
   - Setup vitest-browser-svelte for component testing
   - Configure browser providers (playwright, webdriverio)
   - Mocking patterns for remote functions in tests
   - Sveltest.dev testing patterns and best practices

3. **Vite-PWA Integration**
   - Setup vite-pwa plugin in vite.config
   - Workbox configuration options
   - Service worker registration and update flow
   - Manifest.json generation

4. **Drizzle ORM Best Practices**
   - Schema definition patterns
   - Connection pooling with PostgreSQL
   - Migration strategy
   - Test mocking patterns for DB client

5. **Adapter-Node Configuration**
   - Build output structure
   - Environment variable handling
   - PostgreSQL connection in production
   - Dokploy deployment requirements

## Next Steps

After completing this plan:
1. Generate `research.md` (Phase 0)
2. Create `data-model.md` for database schema (Phase 1)
3. Define API contracts in `contracts/` (Phase 1)
4. Create `quickstart.md` with setup instructions (Phase 1)
5. Run `/speckit.tasks` to generate implementation task breakdown
