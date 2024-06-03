# Node.js-Image
FROM node:14

# Arbeitsverzeichnis
WORKDIR /usr/src/app

# Kopieren und installieren
COPY package*.json ./

RUN npm install

# Kopieren den Rest der Anwendung
COPY . .

COPY ./path/to/server/.env ./dist/.env

#bundeln
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Starten
CMD ["node", "dist/server.js"]
