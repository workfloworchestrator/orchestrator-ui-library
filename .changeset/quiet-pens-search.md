---
"@orchestrator-ui/orchestrator-ui-components": minor
---

Refactor the metadata workflows and tasks pages to use the GraphQL `workflows` search instead of the old query, in the structured search table.

- The pages get the search bar, filter builder, retriever selection and "show more" pagination, with the search in the URL. Only visible columns are requested, and a score column shows during a query or filter.
- New `getWorkflowListSearch` endpoint (`useGetWorkflowListSearchQuery`), shared by both pages through the new `WfoWorkflowDefinitionsList`. The product tags and scheduled columns are not searchable, so they cannot be sorted or filtered.
- The `getWorkflows` endpoint, `workflowListObjectMapper` and `taskListObjectMapper` are removed. The old `getTasks` endpoint is kept.
- The row details modal loads the full workflow or task when it opens, so columns that are hidden in the table, such as the product tags, are filled.
