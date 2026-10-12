---
'@orchestrator-ui/orchestrator-ui-components': patch
---

Stop signing the user out on HTTP 403 from the REST API. A 403 is an authorization denial for a logged-in user; only 401 ends the session. The `detail` of the 403 is now shown in a toast when starting a workflow or resuming a step is not allowed. REST 403s on other requests surface as error states instead of a logout.
