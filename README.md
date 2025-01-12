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

## Rodando o Projeto

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar o banco de dados
Renomeie o arquivo .env.example para .env e configure as variáveis de ambiente conforme necessário.

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
