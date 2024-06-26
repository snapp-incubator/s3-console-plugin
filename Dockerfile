FROM node:20-buster-slim as build
USER root
RUN command -v yarn || npm i -g yarn
ADD . /usr/src/app
WORKDIR /usr/src/app
RUN yarn install && yarn build

FROM docker.io/library/nginx:latest

# Copy custom nginx.conf without 'user' directive and listening on port 8080
COPY nginx.conf /etc/nginx/nginx.conf

# Adjust permissions
RUN chgrp -R 0 /var/cache/nginx /usr/share/nginx/html \
    && chmod -R g=u /var/cache/nginx /usr/share/nginx/html

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]