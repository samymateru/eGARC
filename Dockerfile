# -------- Base Stage --------
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies (for faster caching)
COPY package.json ./
COPY package-lock.json ./  

RUN npm install

# -------- Build Stage --------
FROM base AS builder

COPY . .

# Next.js requires NODE_ENV=production for static/SSG output
ENV NODE_ENV=production

# Build the Next.js app
RUN npm run build

# -------- Production Stage --------
FROM node:18-alpine AS runner

# For Next.js standalone mode
WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Copy only the build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.* ./

# If using standalone output, copy it like this:
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["npm", "start"]
