# ---------- Stage 1: builder (install all deps + compile TS) ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (with dev deps for the TypeScript build)
COPY package*.json ./
RUN npm ci

# Build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- Stage 2: production (only prod deps + compiled output) ----------
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Compiled JS from the builder
COPY --from=builder /app/dist ./dist

# Run as a non-root user
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 5000
CMD ["node", "dist/index.js"]
