---
"@orchestrator-ui/orchestrator-ui-components": patch
---

2834 Fix stale subscription list data when more pages are loaded

- Request only the current page so refetches reload what is shown
- Page structured searches by offset and store the page in the URL
- Page text queries with cursors, the right chevron loads the next page
- Show the total next to the pagination
- Add the LIST cache tag to the subscription list search
