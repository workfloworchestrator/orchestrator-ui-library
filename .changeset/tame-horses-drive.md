---
"@orchestrator-ui/orchestrator-ui-components": patch
---

Fix ProcessDetailQuery by removing form subfields
- !WARNING: this version requires backend version 2.1.0.
  - It changes the graphql processes.page.form to a JSON type, so there are no subfields to request and will respond with an error.
