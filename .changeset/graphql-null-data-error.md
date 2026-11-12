---
'@orchestrator-ui/orchestrator-ui-components': patch
---

2790 Treat a GraphQL response with errors and no data (e.g. access denied) as a query error instead of successful `null` data, so the page no longer crashes for a signed-in user without permissions
