---
'@orchestrator-ui/orchestrator-ui-components': patch
---

Switch the repository to pnpm and declare the runtime dependencies `react-hook-form` and `refractor`, which were previously only resolved through hoisting. Also ship `version-compatibility.json` with the package.
