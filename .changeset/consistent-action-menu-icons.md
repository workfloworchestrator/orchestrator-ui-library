---
"@orchestrator-ui/orchestrator-ui-components": minor
---

Make action menu and row icons consistent across tables

- New `WfoViewDetailsButton`: one "show all columns in detail view" button (hover state and tooltip) used by `WfoAdvancedTable` and `WfoStructuredSearchTable`.
- Workflows list: the `...` menu is first and only shows for rows that can be retried. The column is left out when no row on the page can be retried. The `</>` delta icon is the last column.
- Scheduled tasks list: the delete button is the first column, with a grey 20px icon. `WfoButtonWithConfirm` accepts any `IconType` for `iconType`.
- `WfoFirstPartUUID`: the text is vertically centred with its copy icon.
