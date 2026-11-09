# Development setup

This repository contains a single npm package, `@orchestrator-ui/orchestrator-ui-components`. It does not run on its
own: it is developed inside an app that uses the library, such as the
[example orchestrator ui](https://github.com/workfloworchestrator/example-orchestrator-ui).

## Working on the library from an app

Clone this repository into the app and add it to the app's workspace, so the app uses the local code instead of the
version published on npm. Make sure the app ignores the cloned folder in its own `.gitignore`.

```bash
cd <your-app>
git clone git@github.com:workfloworchestrator/orchestrator-ui-library.git orchestrator-ui-components
```

Inside the library folder:

```bash
npm install
npm run dev      # rebuild dist/ on every change
npm run test
npm run lint
npm run tsc
npm run prettier
```

## Releasing

Releases are managed with [changesets](https://github.com/changesets/changesets). Add a changeset to each PR with
`npm run changeset`. After merging to main, the Changesets bot opens a `Version Packages` PR; merging that PR publishes
the package to npm and tags the release as `v<version>`.
