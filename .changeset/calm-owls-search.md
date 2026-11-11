---
"@orchestrator-ui/orchestrator-ui-components": minor
---

The workflows and tasks list pages now use the GraphQL `processes` search instead of the old search, in the same structured search table as the subscriptions list.

- Both pages get the search bar, filter builder, retriever selection and "show more" pagination, with the search in the URL. Only visible columns are requested, and a score column shows during a query or filter.
- Tabs filter on `statuses`: `defaultWorkflowsListTabs` and `defaultTasksListTabs` are `WfoProcessListTab`s (`ProcessActiveStatuses` or `ProcessDoneStatuses`) instead of using `alwaysOnFilters`.
- `WfoProcessesList` takes `isTask` and `statuses` instead of `alwaysOnFilters`, `dataDisplayParams` and `setDataDisplayParam`. `ProcessListExportItem` and `processListObjectMappers` are removed.
- Search list columns are keyed by the GraphQL path of their value. Subscriptions `productName`, `tag`, `customerFullname`, `customerShortcode` and processes `productName`, `tag`, `customer`, `customerAbbreviation` are now `product.name`, `product.tag`, `customer.fullname`, `customer.shortcode`. Hidden columns reappear once, and the csv exports are named by the translated column labels.
- `getSubscriptionListSearch` and the new `getProcessListSearch` take GraphQL fields in the payload `columns` (`'product.name'`, not `'subscription.product.name'`).
- `WfoStructuredSearchTable` and `WfoFilterBuilder` require an `entityKind`, which sets the search paths the filter builder and column filters resolve. A data column can declare a `searchPath` for sorting, filtering and export.
- New hooks `useStructuredSearchState` and `useSearchExport` share the search state and csv export of the lists.
- The subscriptions list no longer duplicates rows when a loaded page is refetched after an invalidation, such as a note edit.
- The row details modal of the process and subscription lists loads the full row when it opens, so columns that are hidden in the table are filled. `WfoStructuredSearchTable` takes an optional `renderRowDetails` for custom modal content, which gives more freedom over what the row details show than the table data allows, and the new `WfoRowDetails` renders the row as a key value table with a loading state.
