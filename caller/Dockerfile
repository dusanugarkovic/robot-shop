FROM node:8

EXPOSE 8081

WORKDIR /opt/server

COPY package.json /opt/server/

RUN npm install

COPY src/server.js /opt/server/

CMD ["node", "server.js"]

