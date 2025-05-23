FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and prisma schema first
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
# Copy generated Prisma client
COPY --from=builder /app/generated ./generated

# Set environment variables
ENV NODE_ENV=production
ENV TZ=Europe/Moscow

# Expose API port
EXPOSE 80

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD curl -f http://localhost:80/health || exit 1

# Start the application
CMD ["npm", "run", "start:prod"]