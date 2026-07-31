---
'@orchestrator-ui/orchestrator-ui-components': patch
---

Fix scheduled task create/delete requests to use the canonical /api/schedules/ endpoint with a trailing slash, avoiding unnecessary HTTP redirects
