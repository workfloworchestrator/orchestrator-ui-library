# @orchestrator-ui/orchestrator-ui-components

## 0.11.1

### Patch Changes

- e83d9aa: new summary card out-of-sync subscriptions
- 7ff8936: Applies policies in several components

## 0.11.0

### Minor Changes

- 6332355: Adds dark theme behind feature toggle
- e808db4: Add a websocket that can be called to clear cache

### Patch Changes

- c3da8a6: add customer abbrev to customer drop down string in form field
- 05c9acc: add status and insync badge to subscription detail page

## 0.10.0

### Minor Changes

- 18da717: 460 Introduces a usePolicy hook to help with conditionally rendering of components. The useWfoSession hook can be used to identify the user

## 0.9.1

### Patch Changes

- 1578b99: NPM Audit fix for IP package

## 0.9.0

### Minor Changes

- 8675375: Fixes a SelectField bug
- c8c6e10: Update npm dependency versions

### Patch Changes

- 4bee6a1: Fixes crashes caused by uniforms connectField function
- 56d5e6e: Trigger the changesets action

## 0.8.1

### Patch Changes

- 5224527: 721: Fix customer select not being disabled
- 16f32ad: 651: Fix incorrect port select options
- 84a75b7: Change service port select label when root subscription instance has title

## 0.8.0

### Minor Changes

- 8eded72: Required for issue 573 Add restart open relate

### Patch Changes

- 534ecf4: 685: Fix form reloading and resetting inputs

## 0.7.0

### Minor Changes

- 5d20aec: Adds accesToken to RTK Query clients

## 0.6.0

### Minor Changes

- d44c55c: Fix ProcessDetailQuery by removing form subfields
  - !WARNING: this version requires backend version 2.1.0.
    - It changes the graphql processes.page.form to a JSON type, so there are no subfields to request and will respond with an error.

## 0.5.2

### Patch Changes

- e88410d: Update form fields to remove 'organisation' naming
- 2310074: 723: Fix SummaryField .includes is not a function

## 0.5.1

### Patch Changes

- dac8fb2: update date presentation and move getDate to utils
- e3b847a: Adds error boundary at the top level of the app
- 926d47b: Table enhancements: Introduces a loading-placeholder and a no-data-placeholder. Prevents showing previous page results while loading new data.

## 0.5.0

### Minor Changes

- 267a753: Adding RTK and RTK Query for some endpoints and store data

## 0.4.0

### Minor Changes

- cdc668f: 544 - Export functionality for the tables

### Patch Changes

- e8af27c: Process table - each column width in absolute or %
- e9af205: change order tabs sub-detail-page
- 996fc9f: added border radius to wfo tree and empty PB card placeholder
- 41e0cc9: added copyright to sidebar

## 0.3.1

### Patch Changes

- d824a58: fix uuid in breadcrumb
- cb3142a: - expand the root product block card by default
  - change tree icon of root product block
  - open other subscription detail page opens in new tab
  - use title of root product block in tree like the other product blocks
- e6aaef7: 598 Fixes invisible email in step list

## 0.3.0

### Minor Changes

- ef5eace: Updates all major dependencies including Typescript to version 5 and NextJS to version 14

## 0.2.7

### Patch Changes

- ce48846: Updates linting rules to ban all console statements except console.error()

## 0.2.6

### Patch Changes

- 6597ac1: Test release after adding absolute imports (issue 414)

## 0.2.5

### Patch Changes

- 6d680f6: Test release before adding absolute imports (issue 414)

## 0.2.4

### Patch Changes

- 38d1229: Fixed handling navigation for pages with sidebar submenu items

## 0.2.3

### Patch Changes

- 577825a: Adds title to process list page

## 0.2.2

### Patch Changes

- f49382c: Updates metadata pages and adds initial version of process-list page

## 0.2.1

### Patch Changes

- 3533525: Updated TS-Config to improve developer experience

## 0.2.0

### Minor Changes

- 6c4cb21: Added translation setup and next-inl configuration. Translation strings are now available when using the useTranslations hook. For more on how to add translations refer to apps/wfo-ui/translations/README.md

## 0.1.2

### Patch Changes

- 0cef169: Splitted WFO in separate packages

## 0.1.1

### Patch Changes

- Converted tsconfig and eslint to standalone NPM package

## 0.1.0

### Minor Changes

- c597fc5: Switched to tsup build in turborepo
