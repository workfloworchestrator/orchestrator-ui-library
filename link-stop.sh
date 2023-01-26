#!/bin/bash
cd dist/libs/orchestrator-ui-components || exit
yarn unlink
cd ../../../node_modules/react || exit
yarn unlink
cd ../react-dom || exit
yarn unlink
