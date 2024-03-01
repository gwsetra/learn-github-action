FROM node:14-alpine AS build
WORKDIR /src
COPY package*.json .
RUN npm i
COPY . .
RUN npm run package

FROM node:14-alpine

WORKDIR /app
COPY --from=build /src/dist .
EXPOSE 80
CMD node index.js