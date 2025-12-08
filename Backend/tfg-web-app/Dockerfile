FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./

FROM base AS dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

FROM base AS build
RUN npm install -g pnpm
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm exec prisma generate
RUN pnpm run build

FROM node:20-alpine AS production
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY --from=build /app/prisma ./prisma
RUN pnpm install --prod --frozen-lockfile
RUN pnpm exec prisma generate

COPY --from=build /app/dist ./dist

EXPOSE 4000
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/src/main"]
