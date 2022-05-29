FROM node:17 

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

COPY ./.env ./

COPY tsconfig.json .

RUN yarn install

RUN yarn global add typescript ts-node

COPY ./src ./

#RUN yarn build

EXPOSE 1337

#CMD ["node", "build/app.js"]
CMD ["yarn", "dev"]
