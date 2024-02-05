FROM node:18-alpine As development

ARG PORT=3000

ENV CI=true

EXPOSE $PORT

WORKDIR /opt/app

COPY . .

RUN yarn run build

CMD ["yarn", "node", "dist/main.js" ]
