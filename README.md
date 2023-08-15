Todo: copy old README.md

# Getting started

```
yarn
turbo dev
```

# Release and publish

### Preparing the release

```bash
yarn run packages:changeset
```

-   Include the changes made by this command in pull requests to the main branch
-   Selecting packages that will get a version bump
-   Specifies per selected package the type of version bump (`major`, `minor` or `patch`)
-   Adds a description or release notes for the release
-   All entries will be saved in a `.md` file in the `.changeset` folder

Once the pull request with a changeset file is merged to the main branch another PR is opened by the Changesets-bot to update the version numbers of the packages. When this pull request gets merged to main an automatic publish to NPM will be performed.
