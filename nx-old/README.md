# Orchestrator UI

## Pre-requisites:

This project requires `yarn` to be installed globally. It will also install `nx` to manage the mono repo tooling.
Supported Node versions: "^14.18.0 || >=16.0.0"

## Development server

Run `nx serve example-orchestrator-ui` for a dev server. Navigate to http://localhost:4200/. The app will automatically
reload if you change any of the source files.

## Storybook server

Run `nx storybook orchestrator-ui-components` for a storybook server. Navigate to http://localhost:4400/. The app will
automatically reload if you change any of the story files.

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Remote caching

Run `npx nx connect-to-nx-cloud` to enable [remote caching](https://nx.app) and make CI faster.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## Publishing @orchestrator-ui/orchestrator-ui-components to NPM

The contents of /src/lib are published as a library on npm: [@orchestrator-ui/orchestrator-ui-components][1]

In order to publish a new version to NPM:

1. Manually update the version number in /libs/orchestration-ui-components/package.json
1. Create a new build, this will create a dist folder at [root]/dist
   `yarn build:orchestrator-ui-components`
1. Deploy the version
   `yarn publish dist/libs/orchestrator-ui-components`
   TODO: Add login steps

## Link locally to the orchestrator-ui-components npm library using Yalc

When working on the orchestrator-ui-components library from another repository, a local link can be used to see updates
to the local changes directly in the consuming app by running `./link-start.sh`.

Additionally in the consuming application run

`npx yalc link @orchestrator-ui/orchestrator-ui-components`

After stopping yalc you can optionally remove the yalc store at this location "npx yalc dir"

[1]:[https://www.npmjs.com/package/@orchestrator-ui/orchestrator-ui-components]

## Designs

1. [Invision](https://projects.invisionapp.com/share/MW134V4MHPB7?hideLogo=true#/screens)
2. [Sketch](https://www.sketch.com/s/68008066-6d55-4e28-8ba9-cebb8489fc95)
