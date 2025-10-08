# ADR 0004 - Turbo Repo and dependencies

Date: 2023-07-25

## Status

*Accepted*

## Decisions

The developer experience with NX was nice, but we ran into problems when we wanted to test our example app standalone.
A couple of lib versions had problems that were encountered too long after the release. So we decided to switch to
Turbo Repo.

We did some tests and found out that it was easy to let the packages/lib build itself into a `dist/` folder and use this
to serve the app. This ensures the standalone example app version will work; as we use it in teh same way whilst developing. 

During this investigation we also reached consensus on a vision regarding dependency management. We found out that we didn't 
need to ship EUI/React or Next JS with our package. So we moved these dependencies to the `peerDependencies`: this ensures an 
ultra small lib, and no chances on double React versions. It gives users of the package some flexibility when choosing their 
versions of the dependencies.

## Action items

- Switch to Turbo Repo
- Create 3
  packages: `@orchestrator-ui/orchestrator-ui-components`, `@orchestrator-ui/eslint-config-custom`, `@orchestrator-ui/tsconfig`
- Keep the core dependencies as light as possible and let package users choose: React, Next JS and EUI versions

## Attendees

- René Dohmen
- Ricardo van der Heijden
- Ruben van Leeuwen
