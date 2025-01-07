---
'@orchestrator-ui/orchestrator-ui-components': major
---

1479:
- csvDownload (Breaking change): Changed the parameters of initiateCsvFileDownload for directly exporting data to CSV.
- GroupedTable: The table has a small header with a button "Collapse / Expand", this can now be overridden.
- Introduced a utility type to help ensuring that all the props of an object will be of type "string". Typically useful for the csvDownload functionality

Changes to be made by the consumer of the library:
The function `initiateCsvFileDownload` now requires 3 parameters instead of 2. The new parameter is `keyOrder` and is an array of strings representing the desired order of the columns in the CSV file. See example below for the placement.

Before:
```javascript
initiateCsvFileDownload(data, fileName);
```

After:
```javascript
initiateCsvFileDownload(data, keyOrder, fileName);
```
