## 📄 Descrição do Projeto

O **api-lumi** é uma API em NestJS responsável por:
- Extrair dados relevantes de faturas de energia (PDFs).
- Persistir as informações em um banco PostgreSQL.
- Disponibilizar esses dados via API REST para o front-end.

## 📚 Tecnologias Utilizadas

- **Node.js** + **NestJS** (TypeScript)
- **TypeORM**
- **PostgreSQL**
- **pdf-parse**
- **Jest** (Testes)
- **Railway** (deploy)

## ⚙️ Instalação e Execução Local

```bash
# Clone o projeto
git clone https://github.com/DedeOli21/api-lumi.git
cd api-lumi

# Instale as dependências
npm install

# Crie um arquivo .env com as variáveis necessárias (veja .env.example)

# Rode a aplicação em modo dev
npm run start:dev
```

## 📊 Principais Endpoints

- `GET /faturas`: Lista todas as faturas
- `GET /faturas?cliente=123&mes=2024-04`: Filtra por cliente e mês
- `GET /faturas/:id`: Detalha uma fatura
- `GET /faturas/:id/download`: Faz download do PDF

## 🛠️ Deploy no Railway

- Crie projeto no [Railway](https://railway.app)
- Adicione plugin PostgreSQL
- Configure as variáveis de ambiente (`DATABASE_HOST`, etc.)
- Conecte o repositório e aguarde build/deploy automático
- Verifique a URL gerada (ex: `https://api-lumi.up.railway.app`)

## ✅ Rodando os Testes

```bash
# Testes unitários
test
npm run test

# Cobertura de testes
npm run test:cov
```

---
