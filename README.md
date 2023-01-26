# Orchestrator UI

## Yarn

This project requires to use Yarn

## Development server

Run `nx serve example-orchestrator-ui` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Remote caching

Run `npx nx connect-to-nx-cloud` to enable [remote caching](https://nx.app) and make CI faster.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## Link locally to the orchestrator-ui-components npm library

When working on the orchestrator-ui-components library combined with an implementation of the orchestrator-ui app, a local link can be used by running `./link-start.sh`. This will expose the library for local development. To connect to the local version of the npm package, run the folowing commands in the custom orchestrator-ui app:
```shell
rm -rf node_modules/.cache
yarn link @orchestrator-ui/orchestrator-ui-components
yarn link react
yarn link react-dom
```

To stop using the link, first run the folowing commands in the custom version of the orchestrator-ui app:
```shell
yarn unlink @orchestrator-ui/orchestrator-ui-components
yarn unlink react
yarn unlink react-dom
rm -rf node_modules/.cache
yarn install --force
```

Finally run `./link-stop.sh` to stop exposing the orchestrator-ui-components library package
