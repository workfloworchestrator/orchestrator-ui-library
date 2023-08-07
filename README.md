Todo: copy old README.md

# Getting started

```
yarn
turbo dev
```

# Release and publish

### Preparing the release

```bash
yarn changeset
```

-   Selecting packages that will get a version bump and, in a later step, being published
-   Specifies per selected package the type of version bump (`major`, `minor` or `patch`)
-   Adds a description or release notes for the release
-   All entries will be saved in a `.md` file in the `.changeset` folder

### Processing changes

```bash
yarn changeset version
```

-   Applies version bump in the selected packages
-   Removes the `.md` file from the `.changset` folder

### Publishing changes

```bash
yarn changeset publish
```

-   Performs the actual publish to npm
-   This step also creates git tags, push them to git with `git push --follow-tags`

### The TLDR

```
yarn changeset
yarn changeset version
yarn changeset publish
```
