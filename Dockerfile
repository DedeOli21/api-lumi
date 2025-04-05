# Etapa de build
FROM node:23-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Copia todo o código-fonte
COPY . .

# Compila o projeto
RUN yarn build

# Etapa final
FROM node:23-alpine

WORKDIR /app

# Copia apenas os arquivos necessários da etapa de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json yarn.lock ./

ENV NODE_ENV=development

EXPOSE 3000

CMD ["node", "dist/main.js"]