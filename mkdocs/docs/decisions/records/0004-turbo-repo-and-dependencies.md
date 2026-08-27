# ADR 0004 - Turbo Repo and dependencies

- **Status:** Accepted
- **Date:** 2023-07-25

## Decisions

The developer experience with NX was nice, but we ran into problems when we wanted to test our example app standalone. A couple of library versions had problems that were encountered too long after the release. So we decided to switch to Turbo Repo.

We did some tests and found out that it was easy to let the packages/library build itself into a `dist/` folder and use this to serve the app. This ensures the standalone example app version will work, as we use it in the same way while developing.

During this investigation we also reached consensus on a vision regarding dependency management. We found out that we didn't need to ship EUI, React, or Next.js with our package. So we moved these dependencies to `peerDependencies`: this ensures an ultra-small library, with no chances of double React versions, and gives users flexibility when choosing their dependency versions.

## Action items

- Switch to Turbo Repo
- Create three packages: `@orchestrator-ui/orchestrator-ui-components`, `@orchestrator-ui/eslint-config-custom`, and `@orchestrator-ui/tsconfig`
- Keep the core dependencies as light as possible and let package users choose their React, Next.js, and EUI versions

## Attendees

- René Dohmen
- Ricardo van der Heijden
- Ruben van Leeuwen
