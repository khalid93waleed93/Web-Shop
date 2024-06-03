# Node.js-Image
FROM node:14

# Arbeitsverzeichnis
WORKDIR /usr/src/app

# Kopieren und installieren
COPY package*.json ./

RUN npm install

# Kopieren den Rest der Anwendung
COPY . .

ARG NODE_ENV
ARG STRIPE_SECRET_KEY
ARG MONGODB_PROD_URL
ARG MONGODB_DEV_URL
ARG BASE_PROD_URL
ARG BASE_DEV_URL
ARG MAILJET_SECRET_KEY
ARG MAILJET_API_KEY

RUN echo "NODE_ENV=${NODE_ENV}" >> .env \
    && echo "STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}" >> .env \
    && echo "MONGODB_PROD_URL=${MONGODB_PROD_URL}" >> .env \
    && echo "MONGODB_DEV_URL=${MONGODB_DEV_URL}" >> .env \
    && echo "BASE_PROD_URL=${BASE_PROD_URL}" >> .env \
    && echo "BASE_DEV_URL=${BASE_DEV_URL}" >> .env \
    && echo "MAILJET_SECRET_KEY=${MAILJET_SECRET_KEY}" >> .env \
    && echo "MAILJET_API_KEY=${MAILJET_API_KEY}" >> .env

#bundeln
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Starten
CMD ["node", "dist/server.js"]
