FROM node:12-alpine
RUN npm install -g is-unpublished
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
