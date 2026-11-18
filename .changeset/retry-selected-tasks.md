---
'@orchestrator-ui/orchestrator-ui-components': minor
---

Add a "Retry selected" button to the bulk edit of the active tasks list.

- `WfoStructuredSearchTable`'s `bulkEditConfiguration` takes an optional `renderActions` that renders actions on the selected rows next to the select all button.
- `WfoProcessesList` takes an optional `bulkEditConfiguration`.
- The number of selected rows is shown below the bulk edit buttons.
- New `useBulkProcessActionMutation` for the bulk endpoint (`resume`, `abort`, `delete` and `note` actions).
