# Link-Slim - URL Shortener

Link-Slim é um sistema de encurtamento de URLs com autenticação de usuários. O sistema permite que qualquer usuário encurte URLs, mas usuários autenticados podem listar, editar e excluir seus URLs encurtados.

## Funcionalidades

- **Encurtamento de URLs**: Permite que qualquer usuário envie um URL longo e receba uma versão encurtada com no máximo 6 caracteres.
- **Autenticação de Usuários**: Usuários podem se registrar e autenticar-se no sistema.
- **Gerenciamento de URLs**: Usuários autenticados podem listar, editar e excluir seus URLs encurtados.
- **Contabilização de Cliques**: Cada vez que um URL encurtado é acessado, a quantidade de cliques é incrementada.
- **Exclusão Lógica**: URLs podem ser deletados logicamente, ou seja, o registro não será removido fisicamente, mas marcado como excluído.

## Tecnologias Utilizadas

- **NestJS** - Framework para Node.js.
- **Prisma** - ORM para interação com o banco de dados.
- **PostgreSQL** - Banco de dados relacional.
- **Docker** - Para containerização do banco de dados.

## Requisitos

Para rodar o Link-Slim, você precisa ter os seguintes requisitos:

### 1. **Node.js** (versão usada no desenvolvimento v22.13.0)
Certifique-se de ter o Node.js instalado no seu sistema. Caso não tenha, você pode baixá-lo [aqui](https://nodejs.org/).

### 2. **Docker e Docker Compose**
Você precisará do Docker e do Docker Compose para rodar o banco de dados PostgreSQL em contêineres. Baixe o Docker [aqui](https://www.docker.com/products/docker-desktop) e o Docker Compose será instalado automaticamente com o Docker Desktop.

### 3. **PostgreSQL**
O projeto utiliza o PostgreSQL como banco de dados relacional. Se preferir rodar o banco localmente sem Docker, você pode instalar o PostgreSQL diretamente no seu sistema. Mais informações [aqui](https://www.postgresql.org/download/).

### 4. **Prisma CLI**
O Prisma é utilizado como ORM para interação com o banco de dados. O Prisma CLI será instalado automaticamente quando você rodar `npm install`.

## Rodando o Projeto

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar o banco de dados
Renomeie o arquivo .env.example para .env e configure as variáveis de ambiente conforme necessário.

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/linkslim?schema=public"
BASE_URL="http://localhost:3000"

```

### 3. Iniciar o Docker

```bash
docker-compose up -d
```

### 4. Rodar as migrações do Prisma
Após o banco de dados estar rodando, você precisa rodar as migrações do Prisma para criar as tabelas no banco:

```bash
npx prisma migrate dev --name init
```

### 5. Rodar o servidor
Agora que o banco de dados está configurado e as tabelas criadas, você pode rodar o servidor:

```bash
npm run start
```

## 📩 Testando a API no Postman

Para facilitar os testes da API, incluí uma collection do Postman com todas as rotas disponíveis.

### 🔹 Passos para importar a Collection
### 1. Baixe o arquivo da Collection disponível no repositório:
```bash
docs/postman/link-slim.postman_collection.json
```

### 2. Abra o Postman e clique em "Import".

### 3. Selecione o arquivo JSON e importe.

### 4. Configure a variável BASE_URL no ambiente do Postman (se necessário).

Agora você pode testar todas as rotas diretamente no Postman! 🚀
