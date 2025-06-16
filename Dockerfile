# -------- Base Stage --------
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies early for caching
COPY package.json package-lock.json ./
RUN npm install

# -------- Build Stage --------
FROM base AS builder

WORKDIR /app

# Copy ALL necessary files including next.config.mjs and environment
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

# Set environment
ENV NODE_ENV=production

# Build the Next.js app
RUN npm run build

# -------- Production Stage --------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy standalone build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static


EXPOSE 3000

# Run the app
CMD ["node", "server.js"]
