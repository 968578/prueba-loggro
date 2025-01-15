FROM node:22.7.0

WORKDIR /app

COPY package.json .

RUN npm i -E

COPY . .

CMD ["npm", "run", "serve"]