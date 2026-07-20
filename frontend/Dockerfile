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

# Next.js inlines NEXT_PUBLIC_* vars into the JS bundle at build time, not at
# container runtime — they must be available as build ARGs/ENV before
# `pnpm run build` runs, not just passed via docker-compose `environment:`.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Build Next.js application
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]
