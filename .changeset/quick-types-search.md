---
"@orchestrator-ui/orchestrator-ui-components": minor
---

Refactor the metadata resource types page to use the GraphQL `resourceTypes` search instead of the old query, in the structured search table.

- The page gets the search bar, filter builder, retriever selection and "show more" pagination, with the search in the URL. Only visible columns are requested, and a score column shows during a query or filter.
- New `getResourceTypeListSearch` endpoint (`useGetResourceTypeListSearchQuery`). The old `getResourceTypes` endpoint is kept.
- Added `EntityKind.RESOURCE_TYPE`.
- The row details modal loads the full resource type when it opens, so columns that are hidden in the table, such as the product blocks, are filled.
