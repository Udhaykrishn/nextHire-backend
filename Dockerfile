FROM node:22-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install
COPY . .
RUN pnpm build

FROM node:22-alpine AS prod
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/dist ./dist

RUN addgroup -S nestjs && adduser -S nestjs -G nestjs
USER nestjs

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3001/health || exit 1

CMD ["node", "dist/main.js"]
