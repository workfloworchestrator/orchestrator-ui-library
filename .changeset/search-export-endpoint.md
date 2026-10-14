---
'@orchestrator-ui/orchestrator-ui-components': minor
---

Export the subscriptions list through the new `POST /search/{entity}/export` endpoint, so exports are no longer limited to the 100 results of a normal search. The backend caps the export at `SEARCH_MAX_EXPORT_LIMIT` (default 1000), and a toast shows when not all results were exported. Requires an orchestrator-core version with the search export endpoint.
