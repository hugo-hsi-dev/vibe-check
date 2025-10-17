# Vibe Check

A daily personality tracking PWA built with SvelteKit that helps users understand their personality trends over time through quick daily quizzes.

## Tech Stack

- **Framework**: SvelteKit 2.43+ with experimental remote functions
- **Frontend**: Svelte 5.39+ (runes mode)
- **Database**: PostgreSQL via Drizzle ORM 0.44+
- **PWA**: vite-pwa with Workbox
- **Testing**: 
  - Unit tests: Vitest 3.2+
  - Component tests: vitest-browser-svelte 1.1+ (Vitest browser mode)
  - E2E tests: Playwright 1.55+
- **Deployment**: Adapter-node for Dokploy

## Getting Started

### Prerequisites

- Node.js (latest LTS)
- PostgreSQL database
- pnpm (recommended)

### Installation

```sh
# install dependencies
pnpm install

# set up environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### Development

```sh
# start development server
pnpm dev

# or open in browser automatically
pnpm dev --open
```

### Testing

```sh
# run unit tests
pnpm test:unit

# run E2E tests
pnpm test:e2e

# run all tests
pnpm test
```

### Code Quality

```sh
# type check
pnpm check

# lint
pnpm lint

# format
pnpm format
```

## Building

To create a production version:

```sh
pnpm build
```

Preview the production build:

```sh
pnpm preview
```

## Project Structure

This project follows the [Vibe Check Constitution](.specify/memory/constitution.md) which defines our core principles:

- Type Safety First
- Test-First Development (80%+ coverage)
- User Experience Consistency (WCAG 2.1 AA)
- Performance Standards (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Code Quality Standards (ESLint, Prettier)
- Automated CI/CD Pipeline

## Contributing

All changes must go through pull requests. Branch protection is enabled on `main` requiring:

- 6 status checks to pass (unit tests, E2E tests, check, format, lint, build)
- Code review approval
- Verified commit signatures

See the [Feature Specification](specs/001-daily-personality-tracker/spec.md) for detailed user stories and requirements.

## License

MIT
