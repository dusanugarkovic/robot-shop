FROM node:10.4.0

EXPOSE 8081

WORKDIR /opt/server

COPY package.json /opt/server/

RUN npm install

COPY src/* /opt/server/

CMD ["node", "server.js"]