FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm exec prisma generate
RUN pnpm run build

FROM node:20-alpine AS production
WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm prune --prod

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/src/main"]

