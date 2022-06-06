ARG VERSION
ARG NODE_ENV=production

# --- Build image
FROM node:16.14-buster as builder

WORKDIR /app

# Install packages
COPY package.json yarn.lock ./
RUN yarn

ENV NODE_ENV=${NODE_ENV}

COPY . .
RUN yarn build

# --- Final image
FROM nginx:1.21-alpine

# Set working directory to nginx resources directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static resources
RUN rm -rf ./*

# Copies static resources from builder stage
COPY --from=builder /app/build .

# Containers run nginx with global directives and daemon off
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# COPY ../.env .env
COPY ./env.sh .

RUN chmod +x env.sh

EXPOSE 80

CMD ["/bin/sh", "-c", "/usr/share/nginx/html/env.sh > env.js && nginx -g \"daemon off;\""]
