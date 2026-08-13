---
'@orchestrator-ui/orchestrator-ui-components': patch
---

Fix the note column on the workflows and tasks lists keeping the previous page's note when paginating to a row without a note. EuiInlineEditText only follows its value prop while the value is truthy, so empty notes are now passed as the invisible character, the same way the subscription note edits already do
