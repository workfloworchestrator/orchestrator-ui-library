# Workflow Orchestrator UI Library

This package contains the pages and components that are meant to be used in an app that serves the frontend to a [workflow orchestrator backend][1]. Its source code lives in the [Orchestrator UI library][4] repository.

## Workflow Orchestrator

The [Workflow Orchestrator Programme][1] is an open source collaboration developing software, tools and best practices for automating and orchestrating networks. Our vision is to create an ecosystem of Software that enables users to Automate and Orchestrate their network.
This package contains the frontend components and pages used with an orchestrator backend, visit the [Workflow Orchestrator Programme][1] website or the github page for [orchestrator core][2] for more information on running a workflow orchestrator.

### Example frontend setup

This package is meant to be consumed by an app that connects it to a running workflow orchestrator. For an example setup have a look at the [example orchestrator ui][3].

## Development

This repository only contains the library; it does not run on its own. To develop it, clone it into an app that uses the
library (for example the [example orchestrator ui][3]) and add it to that app's workspace, so the app uses the local
code instead of the version from npm:

```bash
cd <your-app>
git clone git@github.com:workfloworchestrator/orchestrator-ui-library.git orchestrator-ui-components
```

Make sure the app ignores the cloned folder in its own `.gitignore`. Inside the library folder:

```bash
npm install
npm run dev      # rebuild dist/ on every change
npm run test
npm run lint
npm run tsc
npm run prettier
```

## Contributing

Each PR, which typically addresses an existing ticket from the issue list, should have a reference to the issue (eg use the issue number in the branch name). Furthermore the PR should include a changeset describing the changes of the PR, which will become part of the changelog in NPM.

## Release and publish

### Preparing the release

```bash
npm run changeset
```

- Include the changes made by this command in pull requests to the main branch
- Specifies the type of version bump (`major`, `minor` or `patch`)
- Adds a description or release notes for the release
- All entries will be saved in a `.md` file in the `.changeset` folder

Once the pull-request with a changeset file is merged to the main branch another PR is opened by the Changesets-bot to update the version number of the package. When this pull request gets merged to main an automatic publish to NPM will be performed.

### Release to NPM

Just merge the `Version Packages` PR into main, and the package will be published to npm automatically. The release is tagged as `v<version>`.

## Frontend-Backend versioning dependency

The file `version-compatibility.json` in the root of the orchestrator-ui-library is used to define the minimum backend version that is required for a specific frontend version.
In the UI a check is added to validate whether the UI matches a minimum release of the backend.

See the [Frontend / Backend Compatibility](https://workfloworchestrator.github.io/orchestrator-ui-library/guides/compatibility/) guide for the current compatibility table. When adding a new entry to `version-compatibility.json`, add a matching row there in the same pull request.

[1]: https://www.workfloworchestrator.org
[2]: https://github.com/workfloworchestrator/orchestrator-core
[3]: https://github.com/workfloworchestrator/example-orchestrator-ui
[4]: https://github.com/workfloworchestrator/orchestrator-ui-library
