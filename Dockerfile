FROM node:12-alpine3.11

WORKDIR /usr/src/server
COPY package.json .
ADD . /usr/src/server

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]