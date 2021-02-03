FROM node:12-alpine
ENV NODE_ENV=production

WORKDIR /app/backend

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

CMD ["npm", "start"]