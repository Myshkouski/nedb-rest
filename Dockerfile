FROM node

WORKDIR /usr/app
COPY . /usr/app

RUN npm install

EXPOSE 27001

CMD [ "npm", "start" ]
