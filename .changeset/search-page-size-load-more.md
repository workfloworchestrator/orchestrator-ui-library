---
'@orchestrator-ui/orchestrator-ui-components': patch
---

Apply the configured number of rows on the beta subscriptions search page: the stored setting is applied on page load, changing it in the table settings modal restarts the search with the new size, and each "Load more" then fetches that many rows (up to the backend maximum of 100) instead of always 15
