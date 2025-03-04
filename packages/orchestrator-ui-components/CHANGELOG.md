# @orchestrator-ui/orchestrator-ui-components

## 3.4.0

### Minor Changes

-   2389b16: 808 - Support for metadata description modify - requires orchestrator core 2.10.0

## 3.3.3

### Patch Changes

-   62d16da: 1709 Replace default icons with SURF icons

## 3.3.2

### Patch Changes

-   59230ea: inline edit for description of metadata pages

## 3.3.1

### Patch Changes

-   56bdc1d: 1705 Added prop for custom icon summary card

## 3.3.0

### Minor Changes

-   0476c1d: Adds an asteriks to every single word search
-   937c8d6: Adds customer description edit forms
-   1bb8c3c: Added support for displaying software versions in hamburger menu

## 3.2.0

### Minor Changes

-   2175530: 1704 - Adjustments to assist in overriding the standard menu items: Using more descriptive id values. Adds reusable divider menu item

## 3.1.1

### Patch Changes

-   e838f80: 330 Making timeline in process detail pages sticky to the top of the screen. Introduces a useContentRef hook to refer to the scrollable content div in the pagetemplate

## 3.1.0

### Minor Changes

-   98c1716: Fix notes not updating when changing pages, fix cancel button resetting note to older value
-   c19dacd: 1662 Make the navbar fixed when scrolling and notify user for failing websocket there.

## 3.0.3

### Patch Changes

-   bba111c: Add missing subscription id to start process form

## 3.0.2

### Patch Changes

-   a4492fd: Fix 400 error in create lir prefix form
-   4baeff5: 1509 Remove toast for failed websocket connection that covers the next and back buttons in the forms.

## 3.0.1

### Patch Changes

-   4bd9869: 1146 Allow workflow to start with additional prefilled variables - LIR prefixes page

## 3.0.0

### Major Changes

-   f6315dd: 1479:

    -   csvDownload (Breaking change): Changed the parameters of initiateCsvFileDownload for directly exporting data to CSV.
    -   GroupedTable: The table has a small header with a button "Collapse / Expand", this can now be overridden.
    -   Introduced a utility type to help ensuring that all the props of an object will be of type "string". Typically useful for the csvDownload functionality

    Changes to be made by the consumer of the library:
    The function `initiateCsvFileDownload` now requires 3 parameters instead of 2. The new parameter is `keyOrder` and is an array of strings representing the desired order of the columns in the CSV file. See example below for the placement.

    Before:

    ```javascript
    initiateCsvFileDownload(data, fileName);
    ```

    After:

    ```javascript
    initiateCsvFileDownload(data, keyOrder, fileName);
    ```

### Patch Changes

-   19d1d88: Enables prefilling of prefixes
-   bbf8983: 1623 Changes the colors of the WfoInsyncIcon to make the no-in-sync state more prominent
-   eb45e6b: 289 Metadata page: making related product blocks, resource types and product tags badges clickable. It will update the search query to show that specific item.

## 2.15.0

### Minor Changes

-   c7eaf69: 1620 Add subscriptionPath option for WfoRelatedSubscriptions, WfoSubscriptionDetailTree

### Patch Changes

-   79d9133: 1569 Some non-functional tweaks on the table components: Adds classNames and adds a Fragment component in a mapper function
-   2cab3b2: Add summary field to Object field type in AutoFieldLoader

## 2.14.1

### Patch Changes

-   7f972a1: Fixes calling getFirstUuidPart with null value
-   86b504f: Feat: refactor IPPREFIX table #2143

## 2.14.0

### Minor Changes

-   0172be2: Adds resizable table columns

## 2.13.0

### Minor Changes

-   195a951: 692 Adds WfoErrorMonitoringProvider for tracing purposes. It exposes 2 methods via the useWfoErrorMonitoring hook. These reporting functions are used within the component library. To start using it, the WfoErrorMonitoringProvider needs to be added to the \_app.tsx and the errorMonitoringHandler needs to be implemented.

### Patch Changes

-   95de1e8: 1552 Remove last line of workflow timeline card

## 2.12.0

### Minor Changes

-   6e4d726: 1560 Table Header: for narrow columns, moving the sort icons as much as possible to the right
-   cd0d38f: 1556 Adds inline note editing for the subscription list page

### Patch Changes

-   cdb9c83: 1530 Navigate to task list page when clicking on the tasks count icon
-   87540ac: 1577 Fixes uncheckable checkbox (only the label was clickable)
-   c592740: 1536 Hides inUseByIds in the list of product block instance values
-   88a9db4: 1561 Fixes double copy icon in subscription detail page at the in-use-by-subscriptions section
-   d39017a: Fix WfoInlineNoteEdit showing cached value from the previous page on the next one
-   a442a0b: new column width and customer fullname hidden

## 2.11.1

### Patch Changes

-   56e2537: Fixes rights issue in github action
-   b7fe3ee: Adds github action permission to publish with provenance

## 2.11.0

### Minor Changes

-   85fca33: Adds npm provenance flag

### Patch Changes

-   59389ea: Removes limit on related workflows on subscription detail page

## 2.10.1

### Patch Changes

-   4a1ef5b: Adds pre-wrap style to value display fieldds

## 2.10.0

### Minor Changes

-   e198ef6: 1528 Add tooltip to WfoInlineText edit, fix bug showing empty tooltip
-   4adc510: Adds table view to workflow steps

## 2.9.1

### Patch Changes

-   fc4a7c5: Fixes too many productblock values being hidden

## 2.9.0

### Minor Changes

-   fc8002a: 1503 Makes disabled action menu items expandable to list all subscriptions preventing this action to be available

### Patch Changes

-   beca81e: Fixes possible error in suspend step
-   9d1881f: 1504 Resolves task names and workflow names into the description text from the metadata endpoint, making the titles more human-readable
-   e8c65bf: update to translation file
-   4bf976f: Fixes showing empty product block values where they should not be

## 2.8.4

### Patch Changes

-   be6bf70: added extra Dutch translation term and fix workflowsteps translation
-   3bfe651: Updates npm packages to latest versions
-   490da42: 1490 Remove last border of a product block key value item

## 2.8.3

### Patch Changes

-   85f1514: Added new icons - WfoActualWork, WfoMalfunction, WfoPlannedWork

## 2.8.2

### Patch Changes

-   056ba69: 1402 Adds context menu to be used in the table. It exposes a callback that is triggered when the menu opens (for optionally triggering a REST call to populate the menu)

## 2.8.1

### Patch Changes

-   d119e38: 1404 Allows WfoFilterTabs to accept append property that is passed on to EuiTab component
-   3d1ebbe: 1419 Update product block detail color to match list item color.
-   f6a31a6: Fix: Empty value dropdown override
-   038989c: 1451 Disables the subscription delta button when the process is running

## 2.8.0

### Minor Changes

-   846a884: Updates npm dependency minor versions

## 2.7.1

### Patch Changes

-   2da7671: Fix: Add onchange on the useEffect state in order to set the default

## 2.7.0

### Minor Changes

-   b293024: Adds flags to disable RTK cache in development

### Patch Changes

-   f00a7d1: 1494 Introduces refs to fix the useEffect rerender loop
-   aa24057: 735 - WfoSearch: Triggers onUpdateQueryString when field is erased. Adds queryIsValid prop to mark the validity of the query.
-   6bcfd14: 1398 - Adds a generic way of serializing objects when exporting CSV files

## 2.6.0

### Minor Changes

-   404ffe2: Shows empty values in productBlocks in detail mode

### Patch Changes

-   293c85c: 1440 Adjusted FieldValue type to include ReactNode for NMS

## 2.5.0

### Minor Changes

-   78e5223: Fixed buy that does not display Array in blocks
-   06ec6bc: Connects websocket regardless of what page you start on
-   f0f5aed: 1440 Changes for the NMS service ports tab

### Patch Changes

-   ac98ce6: Update tsv information modal

## 2.4.0

### Minor Changes

-   ad83b95: Improves performace of subscription dropdown options

### Patch Changes

-   ff6f520: 1377 Added copy button to UUID fields in tables

## 2.3.0

### Minor Changes

-   0efcf20: 315 - Making the sort icon always visible in cases of small table columns.
-   1b23a42: 459 Implements single click sorting in the table. Marks WfoSortButtons as deprecated.

## 2.2.0

### Minor Changes

-   e228d98: Sorts grouped table groups
-   d24efe6: 1381 Render mouseover tooltip for the new tables

### Patch Changes

-   60021b1: Fixes checkboxes without labels

## 2.1.1

### Patch Changes

-   648badb: 1423 Handles not_authenticated errors from graphql endpoints. Adds accessTokenExpiresAt and refreshTokenExpiresAt to WfoSession
-   f5138d3: 1406 Added sorting for new tasks and workflow dropdowns
-   223888a: 1363 - Making the title use all space available. Moves the subtitle around to show above the children (action buttons) on small screens

## 2.1.0

### Minor Changes

-   fb2cca8: 1376 Adds inline note edit component
-   93e1926: 1363 Consistent header spacings on all pages
-   72007aa: 1395 Fixes sorting in the related subscriptions table

### Patch Changes

-   851eb96: 1393 Fix workflow dropdown not refreshed after subscription is set in sync

## 2.0.0

### Major Changes

-   7991a97: 1384 - (Breaking change) - Replaces WfoBasicTable and WfoTableWithFilter with WfoTable and WfoAdvancedTable. Both have slightly different interfaces compared with the previous components

### Minor Changes

-   ca01308: Refactor WfoSubscriptionGeneral, use WfoSubscriptionDetailSection in forms
-   0041a7c: 699, 1370 - Fix and update product block view

### Patch Changes

-   94ed80b: "649 Fixed a bug where details were shown based on index instead of unique id of a PB
-   5ce3e1f: 1363 Fixes labels in table settings modal
-   0fe9ad5: 1363 Adds WfoMultilineCell and WfoTruncateCell
-   88c4181: 1378 Add sorting for subscription details workflows tab

## 1.38.2

### Patch Changes

-   414391f: Adjust start task combobox size, so it doesn't hide list items
-   7c6f8b2: Add enum for ids of subscription detail sections

## 1.38.1

### Patch Changes

-   702cbdf: Display orchestrator-ui-library version in header

## 1.38.0

### Minor Changes

-   6f8b708: Added WfoGraphqlErrorsMeta handler, added isLoading to WfoSubscriptionActions, using fragments in some graphql queries, changes required for #1320
-   1318c92: Added open support menu item to context menu
-   e46972c: Adds onFocus websocket reconnection if connection is lost

## 1.37.1

### Patch Changes

-   a95a3c7: Changed order of side menu to reflect the importance of the pages in a more logical order

## 1.37.0

### Minor Changes

-   4f91f82: Adds submenu higlighting
-   6601919: Adjust submenu hightlighting
-   a25dc81: Improve error presentation for WfoTableWithFilter
-   d9c18b9: Fixes removing the last item in a list in some cicrumstances

### Patch Changes

-   2501569: Fixed bug that always showed error on subscription list page, improved function for mapping errors
-   38f7135: 906 Uses isLoading instead of isFetching to render the no-results component. This keeps the table visible when browsing between pages of the paginated table
-   2c6d26d: added WfoIsAllowedToRender around the cache flush component
-   04b1ff7: Added invalidation to subscriptionId query, and loading state for setInSync button
-   60c8947: 1312 Reretrieves ports when the user goes through the same form multiple times. Retrieving on mount keeps the port list up to date.

## 1.36.1

### Patch Changes

-   f7571b1: 822 Removes debounce mechanism in the websocket logic

## 1.36.0

### Minor Changes

-   5663e2c: Fixes list item delete button

### Patch Changes

-   ef5910a: Removes unavailable untagged port subscriptions from dropdown list
-   eed3424: Fix console errors that show when both data and errors are present in wfoGraphqlRequestBaseQuery. Fix name of the function.
-   c880f61: 1295 - Partial rollback of changes introduced in PR 1242. These changes broke the functionality to remove a list item
-   d23fa2b: 1294 Rollback style-change in list fields
-   b1fc20a: Fix no no product/subscription_id prefill when clicking on a workflow breadcrumb by adding query param to link

## 1.35.0

### Minor Changes

-   3a8ba59: Adds hamburger menu
-   86cbc9c: Adds celery worker status card to settings page

### Patch Changes

-   be2a21d: Fixes typo in constant
-   8afc446: 1252 Fixes the copy icon in the key-value table
-   9be10f0: Removes show all option from pages that cant use it

## 1.34.0

### Minor Changes

-   6a098f6: WFO GraphQL base query that handles both errors and data returned

## 1.33.0

### Minor Changes

-   bd05bd4: Makes productBlocks on service configuration tab scrollable

### Patch Changes

-   a728dfe: 1168 Exposes toObjectWithSortedKeys util

## 1.32.0

### Minor Changes

-   06f97cc: Updates graphql seperator character
-   cf75ff3: Keep uppercase letters if original text in breadcrumb is only uppercase

### Patch Changes

-   845dce4: Fix form label not visible in SummaryField and TimestampField
-   95862a2: Orders productsblocks in service configuration page better

## 1.31.0

### Minor Changes

-   8e2c77c: Updates graphql error code to match backend

## 1.30.3

### Patch Changes

-   679ae6c: Fix for vlan field not showing initial value on 2nd page on modify workflow

## 1.30.2

### Patch Changes

-   fe3e991: Fixes websocket connection without authorization

## 1.30.1

### Patch Changes

-   6f308f9: Fix not logging out when token expires

## 1.30.0

### Minor Changes

-   231230c: Updates most packages to latest version

## 1.29.1

### Patch Changes

-   deff75b: Workflow-list and Task-list pages: Keeps old data in table while refreshing data

## 1.29.0

### Minor Changes

-   80f18ae: Fixes npm audit messages
-   637f8ea: Adds websocket status badge to page title instead of header

## 1.28.0

### Minor Changes

-   3444973: added a new table for the nms chassis general tab

## 1.27.1

### Patch Changes

-   54b537c: Added productType to Workflow option used by LIR prefixes

## 1.27.0

### Minor Changes

-   0a3877d: Moves side menu toggle from header to breadcrumb
-   bc65670: Orders product blocks in subcription detail tree
-   8f45591: Improves confirmation dialog on page leave
-   cbfc034: Updates websocket messages to work with new format

## 1.26.0

### Minor Changes

-   3508ff8: Sort product block instance values by field name

### Patch Changes

-   257ef6e: Added number type to parseDate function

## 1.25.0

### Minor Changes

-   10e542e: Adds websockets responsiveness to process list and processDetails
-   f225422: Resolves external subscription id and name in product block details
-   47a545b: Adds subscription info to modify workflow start page
-   cd59329: Hides empty productBlock values in subscription detail

### Patch Changes

-   43bcc3c: Fixes table settings reset
-   02d39db: Fix pressing back not returning to the form page for submitted forms

## 1.24.0

### Minor Changes

-   83fb33d: Adds a reconnect option for the websocket
-   ef169fc: 1108 Adds getEnvironmentVariables helper function that retrieves multiple environment variables and logs warnings in case variables do not exist
-   e4e9b73: Adds better messages for some edge cases

### Patch Changes

-   fda8911: Hides more product block items for productblocks outside the current subscription
-   54e6f9f: Fixed caching issue when switching from Create Node to create Corelink form caused 400 error

## 1.23.0

### Minor Changes

-   33240b6: Fixes websockets with authentication
-   b94c618: Added customer with subscription query used by nms

### Patch Changes

-   9f18b7c: 1066 VlanField: Only allows to clear the value when the field is enabled

## 1.22.0

### Minor Changes

-   f6dc4fb: Replaces subscriptionsWithFilter REST call with a graphQL query
-   d48df6b: Exports WFoUserInputForm

### Patch Changes

-   bcfe7de: 916 Exposes menuItemIsAllowed helper function
-   50e8f68: Fixes signOut modal showing in some cases
-   6a7264f: 1086 StartPage: Summary card with product counts ignores terminated instances
-   aca21a5: 1085 Filters out current subscription from the related subscriptions list

## 1.21.0

### Minor Changes

-   ae0d9a8: Removes some obsolete configuration
-   560cf74: Adds a different style if a productblock is outside the subscription boundary
-   5ee68fa: Signs user out when api calls fail because of expired token
-   d4ac80a: Removed axios and react-query dependencies

### Patch Changes

-   13d7c6d: Fixes missing aria-labels on icons
-   b9680b8: 626 Applies dark theme to form fields

## 1.20.0

### Minor Changes

-   decb678: Removes obsolete configuration options

## 1.19.1

### Patch Changes

-   e1811bc: revert username to old code solution

## 1.19.0

### Minor Changes

-   7dc5cf0: Moving axios form fields and fetches to RTK

### Patch Changes

-   213fb25: Uses preferred_username to filter for my-workflows
-   71fa3bd: 1055 Making OAuth Scopes configurable via Environment Variables

## 1.18.0

### Minor Changes

-   b8cf381: 626 Tweaks dark theme on detail pages and the settings page

### Patch Changes

-   3888ea9: Adjustment to placeholder translations

## 1.17.0

### Minor Changes

-   8a32409: 626 - Introduces basic styles to be reused. Updates useWithOrchestratorTheme hook to accept the whole theme object. Applies dark theme for Page Templates, Start page and pages with a filterable table.

## 1.16.0

### Minor Changes

-   ed6d5c7: Fixes tooltip message on vlan field

### Patch Changes

-   5301916: Added trash icon

## 1.15.0

### Minor Changes

-   a8c625e: Added workflow information link and env vars for it

## 1.14.2

### Patch Changes

-   06377ba: Adds prettier output for the "In-use by subscription(s)" on product blocks on subscription details
-   df57566: 799 Exports SummaryCard components and its related subcomponents and types

## 1.14.1

### Patch Changes

-   d835c16: add retry for processes in waiting state - added new icon to be used …

## 1.14.0

### Minor Changes

-   5b9d042: Moved form wizards to RTK

## 1.13.2

### Patch Changes

-   43be47b: 565 Added a new summary card listing the 5 latest workflows for the user that is logged in
-   8b6e73d: 879 Makes SummaryCards on the start page overridable

## 1.13.1

### Patch Changes

-   63ee9c0: 863 Adds title for traceback section on workflow detail page

## 1.13.0

### Minor Changes

-   12d72f9: Ads feature toggles to configuration

### Patch Changes

-   abd239c: filter workflows on target
-   72ee276: 863 Adds Traceback on process detail page

## 1.12.0

### Minor Changes

-   a95a6dc: Updates what the websocket interface is listening to

## 1.11.0

### Minor Changes

-   38b0c66: 333 - Adds override option for General tab on the SubscriptionDetail page and adds Customer descriptions field

### Patch Changes

-   9eca836: 983 Improvements in exporting data from the metadata pages
-   df1a9b6: Hide filter option on related subscriptions table

## 1.10.0

### Minor Changes

-   04ef921: Deprecate apiclient version of UserInputFormWizard

## 1.9.0

### Minor Changes

-   a9f3806: Improves sideBar navigation

## 1.8.0

### Minor Changes

-   752b3fd: 102 Adds context provider and hook to override values in subscription detail product blocks

## 1.7.0

### Minor Changes

-   d61106d: Release of the metadata task page

## 1.6.2

### Patch Changes

-   0bf6f82: New metadata taskpage with rtk

## 1.6.1

### Patch Changes

-   3cfd9f5: Fixes error in exported values
-   5807458: 332 Subscription detail page: hides metadata section when there is no data available

## 1.6.0

### Minor Changes

-   bf4698e: 332 Adds subscription metadata to the subscription list page and subscription detail page

### Patch Changes

-   e3874e0: Changed overlay icon colour of skipped step in workflow/task
    Badge style to product name column in metadata table products
    Some features owner subscription presentation & hide pb-sub-instance-id
    Changed default table row settings
-   29c6459: Added external link icon

## 1.5.0

### Minor Changes

-   9662041: 638 Moves SURF specific form fields to deprecated folder
-   c122786: Adds README files to be displayed on NPM. Adds Apache 2.0 license.

### Patch Changes

-   78a0b55: 812 Fixed object mapping from products rest call
-   1b3a9f0: Allows sending null as a value when removing existing values
-   9cf620e: 919 Fix port dropdown after changing the node in a Create Service Port workflow
-   c5c73da: Added isDisabled prop to WfoDropdownButton, small styles adjustment for keyColumn

## 1.4.0.

### Minor Changes

-   62b356f: Moves product blocks graphql query to RTK client
-   0e5c8f3: Moves subscriptionList query to RTK client
-   92ce67b: Moves subscriptionDetail to RTK client
-   3f68b52: Moves subscriptions dropdown options to RTK client
-   d7b1ce2: Moves products and productsSummary to RTK client
-   0b4da83: Moves resourceTypes metadata query to RTK client
-   6ee952f: Moves relatedSubscriptions RTK client
-   af1c86b: Moves processList summary queries to RTK client
-   70efdf5: Moves getting startOptions to RTK client
-   0d10af8: MOves get metadata workflows to RTK client

## 1.3.1

### Patch Changes

-   043b943: Moves processSteps query to RTK client
-   b511e4a: Fixes bug that occurs in some create workflows

## 1.3.0

### Minor Changes

-   1ab3e59: Adds set in sync action to subscription detail page

## 1.2.0

### Minor Changes

-   857b6de: Added option to override the baseQuery with custom baseQuery in RTK client

## 1.1.0

### Minor Changes

-   2d0c99c: 840 Updates policy resources

## 1.0.0

### Major Changes

-   507399b: R1 Release

## 0.13.1

### Patch Changes

-   9155f40: Added isDisabled prop to WfoSubmitModal

## 0.13.0

### Minor Changes

-   89835a4: 702 - Moves processDetail to rtkquery

### Patch Changes

-   e56c142: 760 remove duplicate product tags on metadata workflow page

## 0.12.0

### Minor Changes

-   5efb8b0: #821 Reverted FORMS_ENPOINT string, removed cimStartForm, added new string utils
    #833 Small change to useQueryWithFetch for the default sending level

## 0.11.1

### Patch Changes

-   e83d9aa: new summary card out-of-sync subscriptions
-   7ff8936: Applies policies in several components

## 0.11.0

### Minor Changes

-   6332355: Adds dark theme behind feature toggle
-   e808db4: Add a websocket that can be called to clear cache

### Patch Changes

-   c3da8a6: add customer abbrev to customer drop down string in form field
-   05c9acc: add status and insync badge to subscription detail page

## 0.10.0

### Minor Changes

-   18da717: 460 Introduces a usePolicy hook to help with conditionally rendering of components. The useWfoSession hook can be used to identify the user

## 0.9.1

### Patch Changes

-   1578b99: NPM Audit fix for IP package

## 0.9.0

### Minor Changes

-   8675375: Fixes a SelectField bug
-   c8c6e10: Update npm dependency versions

### Patch Changes

-   4bee6a1: Fixes crashes caused by uniforms connectField function
-   56d5e6e: Trigger the changesets action

## 0.8.1

### Patch Changes

-   5224527: 721: Fix customer select not being disabled
-   16f32ad: 651: Fix incorrect port select options
-   84a75b7: Change service port select label when root subscription instance has title

## 0.8.0

### Minor Changes

-   8eded72: Required for issue 573 Add restart open relate

### Patch Changes

-   534ecf4: 685: Fix form reloading and resetting inputs

## 0.7.0

### Minor Changes

-   5d20aec: Adds accesToken to RTK Query clients

## 0.6.0

### Minor Changes

-   d44c55c: Fix ProcessDetailQuery by removing form subfields
    -   !WARNING: this version requires backend version 2.1.0.
        -   It changes the graphql processes.page.form to a JSON type, so there are no subfields to request and will respond with an error.

## 0.5.2

### Patch Changes

-   e88410d: Update form fields to remove 'organisation' naming
-   2310074: 723: Fix SummaryField .includes is not a function

## 0.5.1

### Patch Changes

-   dac8fb2: update date presentation and move getDate to utils
-   e3b847a: Adds error boundary at the top level of the app
-   926d47b: Table enhancements: Introduces a loading-placeholder and a no-data-placeholder. Prevents showing previous page results while loading new data.

## 0.5.0

### Minor Changes

-   267a753: Adding RTK and RTK Query for some endpoints and store data

## 0.4.0

### Minor Changes

-   cdc668f: 544 - Export functionality for the tables

### Patch Changes

-   e8af27c: Process table - each column width in absolute or %
-   e9af205: change order tabs sub-detail-page
-   996fc9f: added border radius to wfo tree and empty PB card placeholder
-   41e0cc9: added copyright to sidebar

## 0.3.1

### Patch Changes

-   d824a58: fix uuid in breadcrumb
-   cb3142a: - expand the root product block card by default
    -   change tree icon of root product block
    -   open other subscription detail page opens in new tab
    -   use title of root product block in tree like the other product blocks
-   e6aaef7: 598 Fixes invisible email in step list

## 0.3.0

### Minor Changes

-   ef5eace: Updates all major dependencies including Typescript to version 5 and NextJS to version 14

## 0.2.7

### Patch Changes

-   ce48846: Updates linting rules to ban all console statements except console.error()

## 0.2.6

### Patch Changes

-   6597ac1: Test release after adding absolute imports (issue 414)

## 0.2.5

### Patch Changes

-   6d680f6: Test release before adding absolute imports (issue 414)

## 0.2.4

### Patch Changes

-   38d1229: Fixed handling navigation for pages with sidebar submenu items

## 0.2.3

### Patch Changes

-   577825a: Adds title to process list page

## 0.2.2

### Patch Changes

-   f49382c: Updates metadata pages and adds initial version of process-list page

## 0.2.1

### Patch Changes

-   3533525: Updated TS-Config to improve developer experience

## 0.2.0

### Minor Changes

-   6c4cb21: Added translation setup and next-inl configuration. Translation strings are now available when using the useTranslations hook. For more on how to add translations refer to apps/wfo-ui/translations/README.md

## 0.1.2

### Patch Changes

-   0cef169: Splitted WFO in separate packages

## 0.1.1

### Patch Changes

-   Converted tsconfig and eslint to standalone NPM package

## 0.1.0

### Minor Changes

-   c597fc5: Switched to tsup build in turborepo
