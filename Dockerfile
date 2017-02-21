FROM node:6.3.0-wheezy

RUN mkdir -p /usr/src/trudesk-plugin-server
WORKDIR /usr/src/trudesk-plugin-server

RUN npm install -g yarn babel-cli

COPY package.json /usr/src/trudesk-plugin-server
COPY webpack.config.js /usr/src/trudesk-plugin-server
COPY yarn.lock /usr/src/trudesk-plugin-server

RUN yarn install 

COPY . /usr/src/trudesk-plugin-server

RUN npm run build

EXPOSE 8117

CMD [ "/bin/bash", "/usr/src/trudesk-plugin-server/startup.sh" ]