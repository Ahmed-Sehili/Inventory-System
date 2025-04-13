FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Set environment variable to production BEFORE installing dependencies
ENV NODE_ENV=production

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Skip husky installation in production
ENV HUSKY=0

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Set environment variable to production BEFORE installing dependencies
ENV NODE_ENV=production

# Install production dependencies only
RUN npm install -g pnpm
RUN pnpm install --production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]