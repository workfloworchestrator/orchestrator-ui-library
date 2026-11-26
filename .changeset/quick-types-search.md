---
"@orchestrator-ui/orchestrator-ui-components": minor
---

Refactor the metadata resource types page to use the GraphQL `resourceTypes` search instead of the old query, in the structured search table.

- The page gets the search bar, filter builder, retriever selection and pagination, with the search in the URL.
- New `getResourceTypeListSearch` endpoint (`useGetResourceTypeListSearchQuery`). The old `getResourceTypes` endpoint is kept.
