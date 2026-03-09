# Multi-stage build for Angular UI
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (cached layer)
COPY cashbackengine-ui/package*.json ./
RUN npm ci --silent

# Build Angular app
COPY cashbackengine-ui/ .
RUN npm run build:prod

# Runtime: nginx
FROM nginx:1.27-alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our nginx config
COPY cashbackengine-ui/nginx.conf /etc/nginx/conf.d/cashbackengine.conf

# Copy built Angular files
COPY --from=build /app/dist/cashbackengine-ui/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
