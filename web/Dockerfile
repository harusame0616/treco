FROM node:18-alpine3.15
WORKDIR /treco/web/projects
RUN apk update && echo test && apk add git

FROM node:18-alpine3.15 AS BUILD

WORKDIR /treco/web/projects
COPY ./projects /treco/web/projects

RUN npm i && npm run build

CMD ["npm", "start"]