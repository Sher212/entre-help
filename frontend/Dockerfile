# ---- SmartAgri AI Frontend - Google Cloud Run Dockerfile ----
# Stage 1: Build the Vite app
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .



RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 8080

# Nginx will substitute $PORT at runtime (Cloud Run sets PORT=8080)
ENV PORT=8080
CMD ["sh", "-c", "envsubst '$$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
