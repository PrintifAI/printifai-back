FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY prisma/schema.prisma package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client, build the app
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app


# Copy package files and install production dependencies only
COPY prisma/schema.prisma package*.json ./
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV TZ=Europe/Moscow

# Expose API port
EXPOSE 80

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD curl -f http://localhost:80/health || exit 1

# Start the application
CMD ["npm", "run", "start:prod"] 