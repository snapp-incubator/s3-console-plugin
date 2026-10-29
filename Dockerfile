FROM node:24-slim AS build
USER root
WORKDIR /usr/src/app
# The e2e tests run elsewhere; skip Cypress's ~200 MB binary download.
ENV CYPRESS_INSTALL_BINARY=0
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM docker.io/library/nginx:latest

# Copy custom nginx.conf without 'user' directive and listening on port 8080
COPY nginx.conf /etc/nginx/nginx.conf

# Adjust permissions
RUN chgrp -R 0 /var/cache/nginx /usr/share/nginx/html \
    && chmod -R g=u /var/cache/nginx /usr/share/nginx/html

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]