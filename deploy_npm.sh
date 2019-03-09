#!/usr/bin/env bash

# Add version to package.json
sed -i s/"\"version\":.*/\"version\": \"${CI_COMMIT_REF_NAME}\","/ package.json

# Install dependencies
yarn build:ci

# Put NPM access token to .npmrc for publishing
echo '//dev.thecrm.co/:_authToken=${NPM_TOKEN}' > .npmrc

# Publish new version of the app to NPM
npm publish --registry http://dev.thecrm.co
