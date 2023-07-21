#!/bin/bash
npx nx build orchestrator-ui-components && npx yalc publish --push dist/libs/orchestrator-ui-components
npx nx watch --projects=orchestrator-ui-components -- 'npx nx build orchestrator-ui-components && npx yalc publish --push dist/libs/orchestrator-ui-components'
## After stopping yalc you can optionally remove the yalc store at this location "npx yalc dir"