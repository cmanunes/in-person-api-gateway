FROM node:19.6.0-bullseye-slim

WORKDIR /opt/app

COPY ./dist .

CMD [ "node", "./dist/bundle.js" ]