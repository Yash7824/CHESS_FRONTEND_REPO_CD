#!/usr/bin/env bash
cd ./client
echo "Install Node Dependencies..."
npm i --legacy-peer-deps --save-dev
echo "Install Angular CLI..."
npm install -g  @angular/cli
echo "Create Build File..."
ng build 
echo "Deploy Build with Netlify CLI..."
npm install netlify-cli -g
netlify deploy \
            --dir dist \
            --site "$NETLIFY_SITE_ID"  \
            --auth "$NETLIFY_API_TOKEN"
echo "Remove Build File After Deploy..."
rm -r dist
