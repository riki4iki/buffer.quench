
FROM node:12-alpine

RUN mkdir -p /home/source/buffer.quench/app/node_modules && chown -R node:node /home/source/buffer.quench

WORKDIR /home/source/buffer.quench

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

RUN npm run postinstall

EXPOSE 3000

CMD [ "npm", "run", "." ]