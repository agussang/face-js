FROM node:12.18.2

RUN npm install -g pm2

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN mkdir /uploads

RUN chmod +x /uploads/

RUN npm install

COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "start" ]