FROM cypress/base:16.14.2-slim

USER node
COPY --chown=node:node ./e2e/projects/package.*\.json /treco/e2e/projects/
RUN npm i

CMD []