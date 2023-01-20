#!/bin/bash
yarn run build:best-custom-react-button
cd dist/libs/best-custom-react-button || exit
yarn link
cd ../../../node_modules/react || exit
yarn link
cd ../react-dom || exit
yarn link
cd ../../
yarn run build-watch:best-custom-react-button
