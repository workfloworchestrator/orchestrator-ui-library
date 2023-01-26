#!/bin/bash
yarn run build:orchestrator-ui-components
cd dist/libs/orchestrator-ui-components || exit
yarn link
cd ../../../node_modules/react || exit
yarn link
cd ../react-dom || exit
yarn link
cd ../../
yarn run build-watch:orchestrator-ui-components
