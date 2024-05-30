# Node.js-Image
FROM node:14

# Arbeitsverzeichnis
WORKDIR /usr/src/app

# Kopieren und installieren
COPY package*.json ./
RUN npm install

# Kopieren den Rest der Anwendung
COPY . .

# Exponieren den Port
EXPOSE 3000

# Starten
CMD ["npm", "start"]