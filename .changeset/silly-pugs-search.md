---
"@orchestrator-ui/orchestrator-ui-components": minor
---

The metadata products list and the subscriptions list now use the structured search table with a GraphQL search.

- The metadata products page searches through the new `getProductListSearch` endpoint (`useGetProductListSearchQuery`) instead of the old query. The old `getProducts` endpoint is kept.
- Both lists get the search bar, filter builder, retriever selection and "show more" pagination, with the search in the URL. Only visible columns are requested, and a score column shows during a query or filter.
- Search list columns are keyed by the GraphQL path of their value. Subscriptions `productName`, `tag`, `customerFullname` and `customerShortcode` are now `product.name`, `product.tag`, `customer.fullname` and `customer.shortcode`. Hidden columns reappear once, and the csv exports are named by the translated column labels.
- `getSubscriptionListSearch` takes GraphQL fields in the payload `columns` (`'product.name'`, not `'subscription.product.name'`).
- `WfoStructuredSearchTable` and `WfoFilterBuilder` require an `entityKind`, which sets the search paths that the filter builder and column filters resolve. A data column can declare a `searchPath` for sorting, filtering and export.
- New hooks `useStructuredSearchState` and `useSearchExport` share the search state and csv export of the lists.
- The subscriptions list no longer duplicates rows when a loaded page is refetched after an invalidation, such as a note edit.
- The row details modal of the subscription list loads the full row when it opens, so columns that are hidden in the table are filled. `WfoStructuredSearchTable` takes an optional `renderRowDetails` for custom modal content and a `detailModalTitle`, and the new `WfoRowDetails` renders the row as a key value table with a loading state.
