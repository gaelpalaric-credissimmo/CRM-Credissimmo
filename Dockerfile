# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=build /app/server.js ./
COPY --from=build /app/routes ./routes
COPY --from=build /app/client/build ./client/build

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server.js"]
