FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json ./

# Install all dependencies (including dev for development)
RUN pnpm install

# Copy source code
COPY . .

# Build Next.js application
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]