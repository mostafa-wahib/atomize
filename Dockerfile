FROM node:18 

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY .env ./

COPY ./src ./

COPY ./tsconfig.json ./

RUN yarn build

EXPOSE 1337

CMD ["node", "build/app.js"]
#CMD ["yarn", "dev"]
