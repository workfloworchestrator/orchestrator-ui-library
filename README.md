Todo: copy old README

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

## Designs

1. [Invision](https://projects.invisionapp.com/share/MW134V4MHPB7?hideLogo=true#/screens)
2. [Sketch](https://www.sketch.com/s/68008066-6d55-4e28-8ba9-cebb8489fc95)
