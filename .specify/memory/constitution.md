<!--
  Sync Impact Report:
  - Version: NEW → 1.0.0 (Initial constitution ratification)
  - Principles Added: All 5 core principles established
  - Sections Added: Core Principles, Development Standards, Quality Gates, Governance
  - Templates Status:
    ✅ plan-template.md - Constitution Check section aligned
    ✅ spec-template.md - Requirements and testing sections aligned
    ✅ tasks-template.md - Test-first workflow and quality gates aligned
  - Deferred Items: None
-->

# Vibe Check Constitution

## Core Principles

### I. Type Safety First

TypeScript MUST be used throughout the codebase with strict mode enabled. All functions, components, and modules MUST have explicit type definitions. The `any` type is PROHIBITED except when interfacing with untyped third-party libraries, and MUST be documented with a justification comment.

**Rationale**: Type safety catches errors at compile time, improves IDE support, enables confident refactoring, and serves as self-documenting code.

**Non-negotiable rules**:
- `strict: true` in tsconfig.json
- No implicit `any` types
- All exported functions MUST have return type annotations
- All component props MUST be typed (Svelte 5 type annotations)
- Database schemas MUST use Drizzle ORM types

### II. Test-First Development

Tests MUST be written BEFORE implementation for all new features and bug fixes. The Red-Green-Refactor cycle is mandatory: write failing tests, make them pass, then refactor.

**Rationale**: Test-first design leads to better architecture, prevents over-engineering, ensures testability, and creates living documentation of system behavior.

**Non-negotiable rules**:
- Unit tests MUST exist for all business logic (services, utilities, helpers)
- Component tests MUST exist for all interactive UI components
- E2E tests MUST exist for critical user journeys
- Tests MUST fail before implementation begins
- Code coverage MUST NOT drop below 80% for new code
- All tests MUST pass before merging to main

**Testing stack**:
- Vitest for unit tests (client + server environments)
- Vitest browser mode for component tests
- Playwright for E2E tests

### III. User Experience Consistency

All user-facing features MUST maintain consistent interaction patterns, visual design, and performance characteristics. Accessibility MUST be a first-class concern in all UI work.

**Rationale**: Consistency reduces cognitive load, improves learnability, and ensures the application feels cohesive rather than fragmented.

**Non-negotiable rules**:
- All interactive elements MUST have accessible labels and ARIA attributes
- All forms MUST include proper validation and error messages
- All loading states MUST provide user feedback (spinners, skeleton screens)
- All error states MUST provide actionable recovery steps
- Color contrast MUST meet WCAG 2.1 AA standards minimum
- All UI components MUST work with keyboard navigation
- Responsive design MUST support mobile, tablet, and desktop viewports

### IV. Performance Standards

The application MUST meet defined performance budgets. Performance degradation is treated as a bug and MUST be addressed before new features.

**Rationale**: Performance directly impacts user satisfaction, conversion rates, and accessibility for users on slower devices or networks.

**Non-negotiable rules**:
- Initial page load MUST complete in under 2 seconds on 3G
- Largest Contentful Paint (LCP) MUST be under 2.5 seconds
- First Input Delay (FID) MUST be under 100ms
- Cumulative Layout Shift (CLS) MUST be under 0.1
- Bundle size increases MUST be justified and documented
- Database queries MUST be optimized (indexes, pagination)
- Images MUST be optimized (WebP format, lazy loading, responsive)

### V. Code Quality Standards

All code MUST pass linting and formatting checks. Code reviews MUST verify adherence to all constitutional principles before approval.

**Rationale**: Consistent code style reduces friction, improves readability, and makes the codebase maintainable by the entire team.

**Non-negotiable rules**:
- ESLint MUST pass with zero warnings
- Prettier MUST be used for consistent formatting
- All commits MUST pass pre-commit hooks (lint + format check)
- All functions MUST have single responsibility
- Cyclomatic complexity MUST NOT exceed 10 per function
- File length MUST NOT exceed 300 lines (extract modules if larger)
- All magic numbers MUST be named constants
- All technical debt MUST be tracked with TODO comments including rationale

## Development Standards

### Code Organization

**SvelteKit Structure**:
- `src/routes/` - Page components and API endpoints
- `src/lib/` - Shared components, utilities, and business logic
- `src/lib/server/` - Server-only code (DB, auth, secrets)
- `src/lib/components/` - Reusable UI components
- `tests/` or co-located `*.spec.ts` files

**Naming Conventions**:
- Components: PascalCase (e.g., `UserProfile.svelte`)
- Files: kebab-case (e.g., `user-profile.ts`)
- Functions: camelCase (e.g., `getUserProfile`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
- Types/Interfaces: PascalCase (e.g., `UserProfile`)

### Database Standards

- All schema changes MUST use Drizzle migrations
- All queries MUST use parameterized queries (ORM handles this)
- All tables MUST have primary keys
- All foreign keys MUST have proper constraints
- All production data access MUST be logged
- Connection pooling MUST be configured appropriately

### Security Standards

- All user input MUST be validated and sanitized
- All secrets MUST be stored in environment variables
- All authentication MUST use industry-standard libraries
- All sensitive data MUST be encrypted at rest
- All API endpoints MUST have rate limiting
- All dependencies MUST be kept up to date (security patches)

## Quality Gates

All work MUST pass these gates before merging:

**Pre-commit**:
- ✅ ESLint passes
- ✅ Prettier formatting applied
- ✅ TypeScript compiles without errors

**Pre-merge**:
- ✅ All tests pass (unit + component + E2E)
- ✅ Code coverage ≥ 80% for new code
- ✅ Performance budgets not exceeded
- ✅ Accessibility audit passes
- ✅ Code review approved by at least one team member
- ✅ All constitution principles verified

**Pre-deploy**:
- ✅ Build succeeds in production mode
- ✅ Database migrations tested
- ✅ Environment variables documented
- ✅ Monitoring and logging configured

## Governance

This constitution supersedes all other development practices and conventions. All team members MUST familiarize themselves with these principles and apply them consistently.

**Amendment Process**:
- Proposed amendments MUST be discussed with the entire team
- Amendments MUST include rationale and impact analysis
- Amendments MUST be documented in the Sync Impact Report
- Amendments MUST update version number according to semantic versioning
- All dependent templates MUST be updated to maintain consistency

**Versioning Policy**:
- MAJOR version: Backward-incompatible principle removals or redefinitions
- MINOR version: New principles added or materially expanded guidance
- PATCH version: Clarifications, wording improvements, typo fixes

**Compliance Review**:
- All PRs MUST verify constitutional compliance
- Quarterly audits MUST check for drift from principles
- Violations MUST be addressed immediately or exempted with written justification
- Repeated violations trigger team discussion on principle adjustments

**Complexity Justification**:
- Any violation of simplicity principles MUST be documented
- Technical debt MUST have a remediation plan
- Architecture decisions MUST reference relevant principles

**Runtime Guidance**:
- Use `.specify/` templates for feature planning and implementation
- Follow user story prioritization in spec.md
- Implement tasks in dependency order from tasks.md
- Validate against quickstart.md before marking features complete

**Version**: 1.0.0 | **Ratified**: 2025-10-17 | **Last Amended**: 2025-10-17
