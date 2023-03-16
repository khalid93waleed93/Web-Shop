FROM node:14-alpine
ARG AUTH_TOKEN
RUN mkdir -p /docker/app
WORKDIR /docker/app
COPY . /docker/app
RUN apk add git
RUN npm config set @viscircle-org:registry https://gitlab.com/api/v4/projects/30810500/packages/npm/
RUN npm config set -- '//gitlab.com/api/v4/packages/npm/:_authToken' "${AUTH_TOKEN}"
RUN npm config set -- '//gitlab.com/api/v4/projects/30810500/packages/npm/:_authToken' "${AUTH_TOKEN}"
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
