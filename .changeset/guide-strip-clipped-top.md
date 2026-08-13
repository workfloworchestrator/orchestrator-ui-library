---
'@orchestrator-ui/orchestrator-ui-components': patch
---

Fix the workflow guide panel button sliding under the sticky timeline when the page is scrolled to the end on shorter viewports: its fixed minimum height could exceed the available viewport space, so the sticky bottom clamp pushed its top out of view. The minimum height is now capped by the same space the maximum height already uses
