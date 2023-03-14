FROM node:16-alpine
RUN mkdir -p /docker/app
WORKDIR /docker/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]