---
"@orchestrator-ui/orchestrator-ui-components": minor
---

Refactor the metadata product blocks page to use the GraphQL `productBlocks` search instead of the old query, in the structured search table.

- The page gets the search bar, filter builder, retriever selection and "show more" pagination, with the search in the URL. Only visible columns are requested, and a score column shows during a query or filter.
- New `getProductBlockListSearch` endpoint (`useGetProductBlockListSearchQuery`). The old `getProductBlocks` endpoint is kept.
- The row details modal loads the full product block when it opens, so columns that are hidden in the table are filled.
