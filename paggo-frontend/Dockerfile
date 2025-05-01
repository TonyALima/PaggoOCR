FROM node:slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

RUN npx next build

EXPOSE 3000

CMD ["npx", "next", "start"]
