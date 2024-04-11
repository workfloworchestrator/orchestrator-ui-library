# @orchestrator-ui/orchestrator-ui-components

## 1.13.1

### Patch Changes

- 63ee9c0: 863 Adds title for traceback section on workflow detail page

## 1.13.0

### Minor Changes

- 12d72f9: Ads feature toggles to configuration

### Patch Changes

- abd239c: filter workflows on target
- 72ee276: 863 Adds Traceback on process detail page

## 1.12.0

### Minor Changes

- a95a6dc: Updates what the websocket interface is listening to

## 1.11.0

### Minor Changes

- 38b0c66: 333 - Adds override option for General tab on the SubscriptionDetail page and adds Customer descriptions field

### Patch Changes

- 9eca836: 983 Improvements in exporting data from the metadata pages
- df1a9b6: Hide filter option on related subscriptions table

## 1.10.0

### Minor Changes

- 04ef921: Deprecate apiclient version of UserInputFormWizard

## 1.9.0

### Minor Changes

- a9f3806: Improves sideBar navigation

## 1.8.0

### Minor Changes

- 752b3fd: 102 Adds context provider and hook to override values in subscription detail product blocks

## 1.7.0

### Minor Changes

- d61106d: Release of the metadata task page

## 1.6.2

### Patch Changes

- 0bf6f82: New metadata taskpage with rtk

## 1.6.1

### Patch Changes

- 3cfd9f5: Fixes error in exported values
- 5807458: 332 Subscription detail page: hides metadata section when there is no data available

## 1.6.0

### Minor Changes

- bf4698e: 332 Adds subscription metadata to the subscription list page and subscription detail page

### Patch Changes

- e3874e0: Changed overlay icon colour of skipped step in workflow/task
  Badge style to product name column in metadata table products
  Some features owner subscription presentation & hide pb-sub-instance-id
  Changed default table row settings
- 29c6459: Added external link icon

## 1.5.0

### Minor Changes

- 9662041: 638 Moves SURF specific form fields to deprecated folder
- c122786: Adds README files to be displayed on NPM. Adds Apache 2.0 license.

### Patch Changes

- 78a0b55: 812 Fixed object mapping from products rest call
- 1b3a9f0: Allows sending null as a value when removing existing values
- 9cf620e: 919 Fix port dropdown after changing the node in a Create Service Port workflow
- c5c73da: Added isDisabled prop to WfoDropdownButton, small styles adjustment for keyColumn

## 1.4.0.

### Minor Changes

- 62b356f: Moves product blocks graphql query to RTK client
- 0e5c8f3: Moves subscriptionList query to RTK client
- 92ce67b: Moves subscriptionDetail to RTK client
- 3f68b52: Moves subscriptions dropdown options to RTK client
- d7b1ce2: Moves products and productsSummary to RTK client
- 0b4da83: Moves resourceTypes metadata query to RTK client
- 6ee952f: Moves relatedSubscriptions RTK client
- af1c86b: Moves processList summary queries to RTK client
- 70efdf5: Moves getting startOptions to RTK client
- 0d10af8: MOves get metadata workflows to RTK client

## 1.3.1

### Patch Changes

- 043b943: Moves processSteps query to RTK client
- b511e4a: Fixes bug that occurs in some create workflows

## 1.3.0

### Minor Changes

- 1ab3e59: Adds set in sync action to subscription detail page

## 1.2.0

### Minor Changes

- 857b6de: Added option to override the baseQuery with custom baseQuery in RTK client

## 1.1.0

### Minor Changes

- 2d0c99c: 840 Updates policy resources

## 1.0.0

### Major Changes

- 507399b: R1 Release

## 0.13.1

### Patch Changes

- 9155f40: Added isDisabled prop to WfoSubmitModal

## 0.13.0

### Minor Changes

- 89835a4: 702 - Moves processDetail to rtkquery

### Patch Changes

- e56c142: 760 remove duplicate product tags on metadata workflow page

## 0.12.0

### Minor Changes

- 5efb8b0: #821 Reverted FORMS_ENPOINT string, removed cimStartForm, added new string utils
  #833 Small change to useQueryWithFetch for the default sending level

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
