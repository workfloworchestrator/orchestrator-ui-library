---
'@orchestrator-ui/orchestrator-ui-components': patch
---

Fix published npm package missing the `dist` folder. The package now declares an explicit `files` list so `dist` is always included regardless of `.gitignore` rules.
