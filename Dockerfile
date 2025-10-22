# Etapa 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências (produção + dev)
RUN npm ci

# Copia tudo
COPY . .

# Gera o cliente Prisma
RUN npx prisma generate

# Compila TypeScript
RUN npm run build


# Etapa 2: Runtime
FROM node:22-alpine

WORKDIR /app

# Copia apenas o necessário
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY .env .env

# Expõe a porta (caso tenha API ou webhook)
EXPOSE 3000

# Inicia o bot
CMD ["node", "dist/index.js"]
