FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:alpine AS deploy-node
WORKDIR /app
COPY --from=build /app/build .
COPY --from=build /app/package.json .
COPY --from=build /app/node_modules ./node_modules
EXPOSE 5173

# Default Port
ENV PORT=5173
# Default ENV variables for communication with clouditor engine
ENV PUBLIC_OAUTH_AUTHORITY=http://localhost:8080
ENV PUBLIC_OAUTH_CLIENT_ID=dashboard
ENV PUBLIC_OAUTH_REDIRECT_URI=http://localhost:5173/callback
ENV PUBLIC_OAUTH_SCOPE="profile email"
ENV PUBLIC_CLOUDITOR_URL=http://localhost:8080
CMD ["node", "index.js"]