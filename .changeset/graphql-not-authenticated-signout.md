---
'@orchestrator-ui/orchestrator-ui-components': patch
---

2791 Sign out when a GraphQL response reports `not_authenticated` with HTTP 200, as orchestrator-core does. Previously only non-2xx responses were checked, so GraphQL never triggered the sign-out on an expired session
