# 🚀 Backend Auth (NestJS + Fastify)

Esse backend foi criado com o intuito de ser rápido, seguro e fácil de dar manutenção. Usei **NestJS** porque gosto da organização e arquitetura dele, mas troquei o framework HTTP padrão para **Fastify** para garantir que as requisições sejam processadas com o máximo de performance.

A ideia principal é ter uma base de autenticação sólida, para não precisar reinventar a roda a cada novo projeto.

## ✨ O que tem na API

* **Autenticação forte:** JWT gerado com chaves assimétricas (EdDSA) usando a biblioteca `jose`. Evitando o uso de strings simples como secrets.
* **Refresh Tokens:** O login retorna um Access Token de curta duração e um Refresh Token mais longo. Ambos são enviados diretamente via cookies seguros (`HttpOnly`), aumentando a segurança no frontend.
* **Senhas bem guardadas:** Hash de senhas realizado com **Argon2**, garantindo um excelente padrão de segurança de criptografia.
* **Validação blindada:** O payload das requisições é estritamente validado. Utilizei o **Zod** acoplado a um Custom Pipe do NestJS para barrar dados inválidos antes mesmo de chegarem aos Controllers.
* **Banco de Dados robusto:** **Prisma ORM** integrado ao PostgreSQL. Oferecendo tipagem de ponta a ponta e facilidade na criação de migrations.
* **Variáveis de Ambiente tipadas:** Prevenindo erros em produção causados por variáveis ausentes. O Zod valida o `.env` no momento em que a aplicação é iniciada.

## 🛠️ Stack

* Node.js (v18+)
* [NestJS](https://nestjs.com/)
* [Fastify](https://fastify.dev/)
* [Prisma](https://www.prisma.io/) + PostgreSQL
* [Zod](https://zod.dev/)
* [Argon2](https://github.com/ranisalt/node-argon2)
* [Jose](https://github.com/panva/jose) (para os JWTs)

## ⚙️ Como executar o projeto localmente

### 1. Clonar e Instalar
Utilizei o `pnpm` no desenvolvimento, mas sinta-se livre para usar o gerenciador da sua preferência (npm/yarn).

```bash
git clone <url-desse-repo>
cd <nome-da-pasta>
pnpm install
```

### 2. Configurando o `.env`
Crie um arquivo `.env` na raiz do projeto. Será necessário gerar um par de chaves Ed25519 e convertê-las para Base64 para a assinatura segura dos JWTs.

Exemplo de configuração:

```env
NODE_ENV="development"
PORT=3000
ORIGIN="http://localhost:5173" # URL do seu frontend
API_URL="http://localhost:3000"

# Conexão com o banco Postgres
DATABASE_URL="postgresql://user:pass@localhost:5432/seubanco?schema=public"

# Configurações de Autenticação
COOKIE_SECRET="insira_um_segredo_seguro_com_mais_de_32_caracteres"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"

# Chaves Ed25519 em formato Base64
JWT_PRIVATE_KEY_BASE64="sua_chave_privada_base_64"
JWT_PUBLIC_KEY_BASE64="sua_chave_publica_base_64"
```

### 3. Configurar o Banco e Prisma
Com o PostgreSQL em execução, rode os comandos abaixo para criar as tabelas e tipagens:

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

### 4. Iniciando a aplicação
```bash
# Modo de desenvolvimento
pnpm run start:dev

# Build para produção
pnpm run build
pnpm run start:prod
```

## 📂 Organização do Projeto

A estrutura foi dividida por domínios, concentrando a regra de negócios dentro do diretório `src/`:

* `config/`: Leitura e validação do `.env` e preparação das chaves de criptografia.
* `modules/auth/`: Lógica central de registro, login e emissão de tokens.
* `modules/users/`: Gerenciamento e persistência de dados dos usuários.
* `zod-validation.pipe.ts`: Pipe global responsável por interceptar e validar as requisições baseadas nos schemas.

---
Feito com ódio por bugs e muita pesquisa.