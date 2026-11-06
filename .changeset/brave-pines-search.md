---
"@orchestrator-ui/orchestrator-ui-components": minor
---

Refactor the metadata products page to use the GraphQL `products` search instead of the old query, in the structured search table.

- The page gets the search bar, filter builder, retriever selection and "show more" pagination, with the search in the URL. Only visible columns are requested, and a score column shows during a query or filter.
- New `getProductListSearch` endpoint (`useGetProductListSearchQuery`). The old `getProducts` endpoint is kept.
