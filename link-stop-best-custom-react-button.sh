#!/bin/bash
cd dist/libs/best-custom-react-button || exit
yarn unlink
cd ../../../node_modules/react || exit
yarn unlink
cd ../react-dom || exit
yarn unlink
cd ../@emotion/react || exit
yarn unlink
