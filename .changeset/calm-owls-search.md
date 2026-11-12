---
"@orchestrator-ui/orchestrator-ui-components": minor
---

The subscriptions list now uses the GraphQL `subscriptions` search, with its search state and csv export moved into shared files.

- Search list columns are keyed by the GraphQL path of their value. Subscriptions `productName`, `tag`, `customerFullname` and `customerShortcode` are now `product.name`, `product.tag`, `customer.fullname` and `customer.shortcode`. Hidden columns reappear once, and the csv exports are named by the translated column labels.
- `getSubscriptionListSearch` takes GraphQL fields in the payload `columns` (`'product.name'`, not `'subscription.product.name'`).
- `WfoStructuredSearchTable` and `WfoFilterBuilder` require an `entityKind`, which sets the search paths the filter builder and column filters resolve. A data column can declare a `searchPath` for sorting, filtering and export.
- New hooks `useStructuredSearchState` and `useSearchExport` share the search state and csv export of the lists.
- The row details modal of the subscriptions list loads the full row when it opens, so columns that are hidden in the table are filled. `WfoStructuredSearchTable` takes an optional `renderRowDetails` for custom modal content, and the new `WfoRowDetails` renders the row as a key value table with a loading state.
