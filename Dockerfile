# ── Estágio 1: build ─────────────────────────────────────────────────────────
FROM node:24-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

# Copia o schema do Prisma antes de gerar o client para o target Linux
COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ── Estágio 2: produção ───────────────────────────────────────────────────────
FROM node:24-slim AS production

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

# Copia o client do Prisma gerado para Linux no estágio de build
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/server.js"]
