FROM node:12-alpine
RUN npm install -g is-unpublished@0.2.0
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
