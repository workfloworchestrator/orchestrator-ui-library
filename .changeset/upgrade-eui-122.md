---
'@orchestrator-ui/orchestrator-ui-components': major
---

Upgrades most packages to their newest major version. It includes
-  `@elastic/eui` from 113 to 122. The peer dependency now requires `@elastic/eui@^122.1.0` (and transitively `@elastic/eui-theme-borealis@8.1.0`. This changes a lot design tokens and iconnames.
- 'nextjs` from 15 to 16
- Pydantic forms from 3.* to 4.*. This changes the shape of form payload slightly. It will now always contains keys even if their value is empty.

React is still pinned to 18.* until ElasticUI support React 19  

