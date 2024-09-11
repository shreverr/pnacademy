# syntax=docker/dockerfile:1

FROM node:20-alpine as base

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i

COPY . .

FROM base as production

ENV NODE_PATH=./build

RUN npm install pm2@latest -g

RUN npm run build