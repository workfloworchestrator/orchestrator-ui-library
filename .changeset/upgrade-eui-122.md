---
'@orchestrator-ui/orchestrator-ui-components': major
---

Upgrades most packages to their newest major version. It includes
- `@elastic/eui` from 113 to 122. The peer dependency now requires `@elastic/eui@^122.1.0` (and transitively `@elastic/eui-theme-borealis@8.1.0`). This changes a lot of design tokens and icon names.
- `Next.js` from 15 to 16
- Pydantic forms from 3.* to 4.*. This changes the shape of the form payload: it now submits all properties in a form definition to the backend, including ones with no default or `null` as a default. These attributes were previously silently dropped. To restore the previous behavior, set the new optional `pydanticFormsLegacyNullHandling` property on `OrchestratorConfig` to `true`. It defaults to `false` and is passed to pydantic-forms as its `legacyNullHandling` toggle.

React is still pinned to 18.* until ElasticUI supports React 19
