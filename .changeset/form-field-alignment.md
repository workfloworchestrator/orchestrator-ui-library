---
'@orchestrator-ui/orchestrator-ui-components': minor
---

Align pydantic form inputs on the same layout row.
- Inputs are pushed to the bottom of their row, and error messages are shown in a reserved space below the input so they no longer move it.
- Errors are truncated to one line, with the full text on hover.
- The integer field is now full width when the field has a `layout`.
