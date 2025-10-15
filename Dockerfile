# syntax=docker/dockerfile:1.7

# ---- Build stage ----
FROM node:20-alpine AS builder

ENV NODE_ENV=production
WORKDIR /app

# Helpful for some native modules used by Next.js
RUN apk add --no-cache libc6-compat

# Enable corepack to use the repo's Yarn version
RUN corepack enable

# Copy only files needed to install deps first (better cache)
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/

RUN yarn install --immutable

# Copy the rest of the source and build
COPY . .
RUN yarn build

# ---- Runtime stage ----
FROM node:20-alpine AS runner

ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable

# Copy production artifacts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["yarn", "start", "-p", "3000"]
