<!--
  Sync Impact Report:
  - Version: 1.1.0 → 1.1.1 (Added Dependabot automation)
  - Principles Modified: VI. Automated CI/CD Pipeline (added Dependabot requirement)
  - Sections Modified: Security Standards (added dependency update automation), CI/CD Standards (added Dependabot config)
  - Templates Status:
    ✅ plan-template.md - Constitution Check section aligned (no changes needed)
    ✅ spec-template.md - Requirements and testing sections aligned (no changes needed)
    ✅ tasks-template.md - Test-first workflow and quality gates aligned (no changes needed)
  - Files Created: .github/dependabot.yml
  - Deferred Items: None
  - Rationale: PATCH version bump - operational enhancement to existing CI/CD principle, no new principles
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

### VI. Automated CI/CD Pipeline

All code changes MUST pass through automated continuous integration and deployment pipelines. GitHub Actions MUST enforce all quality gates automatically, and AI-powered code review MUST supplement human review.

**Rationale**: Automation ensures consistent enforcement of quality standards, reduces human error, catches issues early, and enables solo developers to maintain production-grade quality without manual overhead.

**Non-negotiable rules**:
- GitHub Actions workflow MUST run on all pull requests
- CI pipeline MUST execute all tests (unit, component, E2E)
- CI pipeline MUST verify linting and formatting (ESLint + Prettier)
- CI pipeline MUST check TypeScript compilation
- CI pipeline MUST verify code coverage thresholds (≥ 80%)
- CI pipeline MUST build the application in production mode
- All CI checks MUST pass before merge is allowed (branch protection rules)
- Dependabot MUST be configured to automatically create PRs for dependency updates
- Dependabot PRs MUST be reviewed and merged within 7 days (security updates within 24 hours)
- Claude Code (or equivalent AI) MUST review all pull requests for:
  - Constitutional compliance (all 6 principles)
  - Code quality and maintainability
  - Security vulnerabilities
  - Performance implications
  - Test coverage adequacy
- AI review feedback MUST be addressed or explicitly acknowledged
- Failed CI checks MUST block merge (no manual overrides without documented justification)

**Solo Project Context**:
- AI-powered PR reviews serve as second pair of eyes for solo developer
- Automated CI/CD compensates for lack of team code reviews
- Quality gates enforce discipline without requiring team coordination
- All automation MUST be maintained and updated as project evolves

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
- All dependencies MUST be kept up to date (automated via Dependabot)
- Security vulnerability PRs from Dependabot MUST be reviewed within 24 hours
- Dependency updates MUST pass all CI checks before merging

### CI/CD Standards

- GitHub Actions workflows MUST be version controlled in `.github/workflows/`
- CI workflow MUST run on pull requests to main branch
- CI workflow MUST include parallel jobs for speed (tests, linting, build)
- Test results MUST be reported in PR comments or GitHub Checks
- Coverage reports MUST be generated and tracked over time
- Failed workflows MUST provide clear, actionable error messages
- Secrets and environment variables MUST use GitHub Secrets
- Deployment workflows MUST require manual approval for production
- All workflows MUST have timeout limits to prevent runaway builds
- Dependabot MUST be configured in `.github/dependabot.yml`
- Dependabot MUST check for npm dependency updates daily
- Dependabot MUST check for GitHub Actions updates weekly
- Dependabot PRs MUST trigger all CI checks automatically

## Quality Gates

All work MUST pass these gates before merging:

**Pre-commit** (local development):
- ✅ ESLint passes
- ✅ Prettier formatting applied
- ✅ TypeScript compiles without errors

**Pre-merge** (automated via GitHub Actions):
- ✅ All tests pass (unit + component + E2E)
- ✅ Code coverage ≥ 80% for new code
- ✅ ESLint passes with zero warnings
- ✅ Prettier formatting verified
- ✅ TypeScript compilation successful
- ✅ Production build succeeds
- ✅ Performance budgets not exceeded
- ✅ Accessibility audit passes
- ✅ AI code review completed (Claude or equivalent)
- ✅ All constitution principles verified
- ✅ Branch protection rules satisfied

**Pre-deploy** (manual verification):
- ✅ Database migrations tested in staging
- ✅ Environment variables documented and configured
- ✅ Monitoring and logging configured
- ✅ Rollback plan documented

## Governance

This constitution supersedes all other development practices and conventions. As a solo project, these principles provide structure and discipline equivalent to team-based quality processes.

**Amendment Process**:
- Proposed amendments MUST include rationale and impact analysis
- Amendments MUST be documented in the Sync Impact Report
- Amendments MUST update version number according to semantic versioning
- All dependent templates MUST be updated to maintain consistency
- Major amendments SHOULD be discussed with trusted advisors or community

**Versioning Policy**:
- MAJOR version: Backward-incompatible principle removals or redefinitions
- MINOR version: New principles added or materially expanded guidance
- PATCH version: Clarifications, wording improvements, typo fixes

**Compliance Review**:
- All PRs MUST verify constitutional compliance (automated via CI + AI review)
- Monthly audits SHOULD check for drift from principles
- Violations MUST be addressed immediately or exempted with written justification
- Repeated violations trigger constitution review and potential amendment

**Complexity Justification**:
- Any violation of simplicity principles MUST be documented
- Technical debt MUST have a remediation plan
- Architecture decisions MUST reference relevant principles

**Runtime Guidance**:
- Use `.specify/` templates for feature planning and implementation
- Follow user story prioritization in spec.md
- Implement tasks in dependency order from tasks.md
- Validate against quickstart.md before marking features complete

**Solo Project Workflow**:
- Create feature branch from main
- Develop with TDD (write failing tests first)
- Run local pre-commit checks before push
- Open PR and wait for automated CI/CD checks
- Review AI-powered PR feedback from Claude
- Address any issues identified by automation or AI
- Merge only after all checks pass
- Monitor deployment and production metrics

**Version**: 1.1.1 | **Ratified**: 2025-10-17 | **Last Amended**: 2025-10-17
