#Build stage
FROM node:20.10.0-alpine3.19

WORKDIR app/
COPY . .
RUN npm install \
&& npm run build \
&& rm -rf node_modules \
&& npm install --production

CMD ["node","dist/index.js"]