FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

RUN npm install pm2

RUN node deploy-commands.js

CMD ["node", "index.js"]
# CMD ["npx", "pm2", "index.js"]
