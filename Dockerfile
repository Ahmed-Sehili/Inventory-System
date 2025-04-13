# Stage 1: Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod

# Copy built application from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.pnpm node_modules/.pnpm

# Copy necessary configuration files if any
COPY .env.example .env.example
COPY serviceAccountKey.example.json serviceAccountKey.example.json

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]