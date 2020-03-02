FROM node:12-alpine

RUN npm i npm@latest -g

RUN mkdir -p /opt/node_app && chown -R node:node /opt/node_app

WORKDIR /opt/node_app

COPY package*.json ./
USER node
RUN npm install --ignore-scripts
ENV PATH /opt/node_app/node_modules/.bin:$PATH

COPY --chown=node:node . .

RUN npm run postinstall

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT 9229 9230

CMD [ "npm", "run", "start" ]