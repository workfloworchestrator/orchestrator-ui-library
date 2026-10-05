---
"@orchestrator-ui/orchestrator-ui-components": major
---

Uses the latest version of pydantic-forms-ui. This version submits all properties in a form definition, including ones with no default or null as a default to the backend. 
These attributes were previously silently dropped. See the legacyNullHandling toggle in pydantic forms to restore previous behavior. 
