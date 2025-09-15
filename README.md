# API GCD - Gestão Corporativa Digital

Uma API RESTful robusta e escalável para gerenciar empresas, desenvolvida com NestJS e TypeScript.

## 📋 Sobre o Projeto

Esta API permite realizar operações completas de CRUD (Create, Read, Update, Delete) para gerenciamento de empresas, incluindo validações avançadas, documentação automática e sistema de notificações por e-mail.

## 🚀 Tecnologias Utilizadas

- **[NestJS](https://nestjs.com/)** - Framework principal para desenvolvimento da API
- **[TypeORM](https://typeorm.io/)** - ORM para gerenciamento do banco de dados
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem de programação
- **[Swagger](https://swagger.io/)** - Documentação automática da API
- **[Jest](https://jestjs.io/)** - Framework de testes
- **[class-validator](https://github.com/typestack/class-validator)** - Validação de dados
- **[class-transformer](https://github.com/typestack/class-transformer)** - Transformação de objetos

## 🏗️ Arquitetura

O projeto segue os princípios de **Domain-Driven Design (DDD)** com uma arquitetura modular:

```
src/
├── empresas/
│   ├── controllers/    # Controladores HTTP
│   ├── services/       # Lógica de negócios
│   ├── entities/       # Entidades do banco
│   ├── dtos/          # Data Transfer Objects
│   └── tests/         # Testes unitários
├── notificacoes/
└── ...
```

### Camadas da Aplicação

- **Controller**: Gerencia requisições HTTP e respostas
- **Service**: Implementa a lógica de negócios
- **Repository**: Gerencia persistência de dados (TypeORM)

## 📡 Endpoints da API

### Empresas

| Método   | Rota              | Descrição                 | Status        |
| -------- | ----------------- | ------------------------- | ------------- |
| `POST`   | `/empresas`       | Cria uma nova empresa     | 201, 400, 409 |
| `GET`    | `/empresas`       | Lista empresas (paginado) | 200, 400      |
| `GET`    | `/empresas/:cnpj` | Busca empresa por CNPJ    | 200, 404      |
| `PUT`    | `/empresas/:cnpj` | Atualiza empresa          | 200, 400, 404 |
| `DELETE` | `/empresas/:cnpj` | Remove empresa            | 200, 404      |

## 📝 Modelo de Dados

### Empresa

```typescript
{
  nome: string; // Nome da empresa (obrigatório)
  cnpj: number; // CNPJ com 14 dígitos (obrigatório, único)
  nomeFantasia: string; // Nome fantasia (obrigatório)
  endereco: string; // Endereço completo (obrigatório)
}
```

## ✅ Validações

### CNPJ

- Deve conter exatamente 14 dígitos numéricos
- Campo obrigatório e único no sistema

### Campos de Texto

- `nome`, `nomeFantasia` e `endereco` são obrigatórios
- Validação de tipo string

## 🧪 Testes

O projeto conta com cobertura completa de testes:

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:cov
```

### Tipos de Teste

- **Testes Unitários**: Validam services e lógica de negócios
- **Testes de Integração**: Validam fluxo completo da API

## 📚 Documentação

A documentação interativa da API está disponível via Swagger:

```
http://localhost:3000/api/docs
```

### Recursos da Documentação

- Descrição detalhada de cada endpoint
- Exemplos de requisição e resposta
- Validações de campos
- Códigos de status HTTP

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Banco de dados configurado

### Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute as migrations
npm run migration:run

# Inicie o servidor
npm run start:dev
```

O servidor estará disponível em `http://localhost:3000`

## 📧 Sistema de Notificações

A API inclui um sistema automatizado de notificações por e-mail para:

- Criação de novas empresas
- Atualizações importantes
- Logs de erros

## 🔒 Segurança

### Implementações Atuais

- Validação rigorosa de entrada de dados
- Sanitização de dados com class-validator
- Tratamento adequado de erros

## 🛠️ Próximas Melhorias

- [ ] Autenticação JWT
- [ ] Autorização baseada em papéis
- [ ] Rate limiting
- [ ] Implementação de HTTPS
- [ ] **Monitoramento**: Logs e métricas (Prometheus/Grafana)


## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
