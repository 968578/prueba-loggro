FROM node:22.7.0 as build

WORKDIR /app

COPY package.json .

RUN npm i -E

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]