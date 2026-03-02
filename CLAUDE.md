# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Orchestrator UI Library — a monorepo containing reusable React/Next.js components for the Workflow Orchestrator frontend. The core component library (`@orchestrator-ui/orchestrator-ui-components`) is published to npm and consumed by application hosts.

## Monorepo Structure

-   **packages/orchestrator-ui-components** — Main component library (published to npm). Built with tsup, outputs ESM to `dist/`.
-   **packages/eslint-config-custom** — Shared ESLint config (flat config, ESLint v9)
-   **packages/jest-config** — Shared Jest base configuration
-   **packages/tsconfig** — Shared TypeScript configs (base + nextjs)
-   **apps/wfo-ui** — Example Orchestrator UI app (git submodule)
-   **apps/wfo-ui-surf** — SURF variant with Sentry/OPA integration
-   **apps/storybook** — Storybook documentation (Vite-based, Storybook v8)

## Common Commands

```bash
# Development
pnpm run dev              # Start wfo-ui in dev mode
pnpm run dev:surf         # Start wfo-ui-surf
pnpm run dev:storybook    # Start Storybook dev server
pnpm run dev:all          # Start all apps in parallel

# Quality checks (all run via Turborepo)
pnpm run tsc              # Type check all packages
pnpm run lint             # ESLint all packages
pnpm run prettier         # Check formatting
pnpm run prettier-fix     # Auto-fix formatting
pnpm run test             # Run all tests
pnpm run build            # Build all packages

# Run tests in a specific package
cd packages/orchestrator-ui-components && pnpm exec jest
cd packages/orchestrator-ui-components && pnpm exec jest path/to/file.spec.ts  # single test
cd packages/orchestrator-ui-components && pnpm exec jest --testPathPattern="pattern"

# Release
pnpm run packages:changeset   # Create a changeset (interactive)
# Merge changeset to main → Changesets bot opens "Version Packages" PR → merge that PR to publish
```

## Pre-commit Hooks (Husky)

Runs `tsc`, `lint`, and `prettier` on every commit. Do not skip with `--no-verify`.

## Code Style

-   **Prettier**: 4-space indentation, single quotes, trailing commas (`all`), bracket spacing
-   **Import sorting**: Enforced by `@trivago/prettier-plugin-sort-imports` — order: react → react-native → third-party packages → `@`-scoped → relative paths, with separation between groups
-   **ESLint**: TypeScript-aware rules, React hooks rules, console restricted to warn/error only

## Architecture

### Tech Stack

-   **React 18.3 / Next.js 15.5** — UI framework
-   **Elastic UI (EUI) v111** — Primary component library
-   **Emotion** — CSS-in-JS styling (`@emotion/react`, `@emotion/css`)
-   **Redux Toolkit + RTK Query** — State management and data fetching
-   **GraphQL** via `graphql-request` — API communication
-   **next-intl** — i18n (locales: `en-GB`, `nl-NL`)
-   **next-auth** — Authentication (Keycloak/OAuth2)
-   **tsup** — Library bundling (ESM, ES2022 target)

### Component Library Source Layout (`packages/orchestrator-ui-components/src/`)

-   `components/` — UI components, prefixed with `Wfo` (e.g., `WfoTable`, `WfoPageTemplate`)
-   `pages/` — Full page components (subscriptions, processes, metadata, settings, tasks, workflows)
-   `hooks/` — Custom React hooks (`useOrchestratorTheme`, `useDataDisplayParams`, etc.)
-   `rtk/` — Redux Toolkit store setup, API slices, and RTK Query endpoints
-   `contexts/` — React context providers (config, confirmation dialog, policy, tree)
-   `theme/` — Emotion-based theme with EUI Borealis modifications
-   `api/` — API client setup and base query configurations
-   `icons/` — SVG icon components
-   `types/` — Shared TypeScript type definitions
-   `utils/` — Utility functions
-   `configuration/` — App configuration and version management
-   `messages/` — Translation JSON files

### Key Patterns

-   **RTK Query endpoints**: Defined in `rtk/endpoints/*.ts`, use `injectEndpoints()` on a shared `orchestratorApi` instance. Two base query types: REST (`fetch`) and GraphQL.
-   **Store factory**: `getOrchestratorStore()` creates the Redux store with slices for config, component overrides, toast messages, pydantic forms, and custom APIs.
-   **Theme hook**: `useOrchestratorTheme()` provides EUI theme values plus custom orchestrator theme extensions.
-   **Styling pattern**: Emotion `css` utility functions in separate `styles.ts` files, consumed via `useWithOrchestratorTheme()`.
-   **Component overrides**: `orchestratorComponentOverride` Redux slice enables host apps to replace default components.
-   **Dynamic forms**: `pydantic-forms` library generates forms from Python Pydantic schemas with configurable field matchers.

### Frontend-Backend Versioning

`version-compatibility.json` at the repo root defines minimum backend versions required for each frontend release.

## Changesets & Releases

PRs should include a changeset (`pnpm run packages:changeset`). Specify the package, bump type (major/minor/patch), and description. After merge, the Changesets bot opens a "Version Packages" PR — merging that triggers automatic npm publish.
