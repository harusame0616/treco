# ---------- DEVELOP ----------
FROM node:18-alpine3.15 AS DEVELOP
WORKDIR /treco/web/projects
RUN apk update && apk add git

CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
# ---------- BUILD ----------
FROM node:18-alpine3.15 AS BUILD

WORKDIR /treco/web/projects
COPY ./projects /treco/web/projects

RUN npm i && npm run build && npm prune --production

CMD ["npm", "start", "--", "-H", "0.0.0.0"]

# ---------- PRODUCTION ----------
FROM node:18-alpine3.15 AS PRODUCTION

WORKDIR /treco/web/projects

COPY ./projects/package.json /treco/web/projects
COPY ./projects/next.config.js /treco/web/projects
COPY --from=BUILD /treco/web/projects/public /treco/web/projects/public
COPY --from=BUILD  /treco/web/projects/.next /treco/web/projects/.next
COPY --from=BUILD  /treco/web/projects/node_modules /treco/web/projects/node_modules


CMD ["npm", "start", "--", "-H", "0.0.0.0"]