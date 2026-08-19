---
'@orchestrator-ui/orchestrator-ui-components': patch
---

Show skeleton rows in WfoStructuredSearchTable (search POC page) for longer running searches. A search that is still loading after a short delay replaces the current results with skeleton rows matching the configured number of rows from the table settings; fast searches keep the current results with only the loading line.
