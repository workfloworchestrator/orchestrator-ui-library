---
"@orchestrator-ui/orchestrator-ui-components": patch
---

Fix "does not contain" errors on nested properties. ParseCEL originally only recognizes 2 level deep properties. 
This change adds support nested negated like expressions that are more than two levels deep such as `!subscription.product.description.contains("SURF")`
