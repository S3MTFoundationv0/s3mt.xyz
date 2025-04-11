# ---- Base Stage ----
FROM node:23-alpine AS base
WORKDIR /app
# Copy package files first for layer caching
COPY package.json yarn.lock ./
# Install dependencies
RUN yarn install --frozen-lockfile

# ---- Development Stage ----
FROM base AS development
# Install HAProxy (needed even for dev if we keep the same structure)
RUN apk add --no-cache haproxy
# Copy HAProxy config (might be simpler without HAproxy for pure dev, but sticking to request)
COPY haproxy.cfg /etc/haproxy/haproxy.cfg
# Copy entrypoint (will start HAProxy and then run CMD)
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
# Copy rest of the application code (will be overwritten by volume mount, but good practice)
COPY . .
# Expose HAProxy port
EXPOSE 80
# Set entrypoint
ENTRYPOINT ["/entrypoint.sh"]
# Default command for dev (runs Nuxt dev server via entrypoint)
CMD ["yarn", "dev"] # nuxi dev --host is called by yarn dev

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /app
# Copy all source code
COPY . .
# Build the Nuxt application
RUN yarn build

# ---- Production Stage ----
FROM node:23-alpine AS production
WORKDIR /app
# Install HAProxy
RUN apk add --no-cache haproxy
# Copy HAProxy configuration
COPY haproxy.cfg /etc/haproxy/haproxy.cfg
# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
# Copy built artifacts from builder stage
COPY --from=builder /app/.output ./.output
# Copy production node_modules from base stage (smaller than dev deps)
# Note: Nuxt output includes node_modules, so this might be redundant depending on Nuxt version/config
# Consider optimizing later if needed. For now, copy package files for runtime deps if any.
COPY package.json yarn.lock ./
# Install only production dependencies (if server needs them directly)
# RUN yarn install --production --frozen-lockfile
# Expose HAProxy port
EXPOSE 80
# Set entrypoint
ENTRYPOINT ["/entrypoint.sh"]
# Default command for production (runs the built Nuxt server via entrypoint)
CMD ["node", ".output/server/index.mjs"] 