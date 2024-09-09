FROM node:20-alpine As development

ARG PORT=3000

ENV CI=true

EXPOSE $PORT

WORKDIR /opt/app

COPY . .

RUN corepack enable yarn && yarn install && yarn run build

CMD ["yarn", "node", "dist/main.js" ]
