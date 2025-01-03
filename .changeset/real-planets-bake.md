---
'@orchestrator-ui/orchestrator-ui-components': patch
---

1479 GroupedTable: The table has a small header with a button "Collapse / Expand", this can now be overridden. csvDownload: the function "csvDownloadHandler" is async and allows to fetch data for the consumer before a CSV download is started by the browser. The newly added "csvDownloadHandlerSync" is introduced if the requested data is already present. Introduced a utility type to help ensuring that all the props of an object will be of type "string". Typically useful for the csvDownload functionality
