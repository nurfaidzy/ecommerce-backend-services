# Ecommerce Backend Services

## 🚀 **ATLAS Implementation - Phase 1 Complete**

A professional **NestJS microservices** ecommerce backend with shared PostgreSQL database, demonstrating clean architecture principles and modern TypeScript development.

**Status**: ✅ Core services implemented and ready for database connection

---

## 📋 **Quick Start**

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation & Setup
```bash
# Clone and install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Build the project
npm run build

# 🚀 Start all services (EASIEST)
npm run all

# OR start just the API Gateway (if DB not configured)
npm run dev
```

> **Note**: The API Gateway can run without database config, but microservices need PostgreSQL credentials in `.env`

---

## 🏗️ **Architecture Overview**

### Microservices Structure
```
/apps
  /ecommerce-backend-services  # API Gateway
  /category-service            # Category CRUD operations  
  /item-service               # Item/Product CRUD operations
/libs
  /common/entities           # Shared TypeORM entities
  /common/utils             # Slug generation utilities
  /dto                      # Validation DTOs
```

### Database Schema
- **Categories**: `id, name, slug, created_at, updated_at`
- **Items**: `id, name, slug, description, price, category_id, created_at, updated_at`
- **Relationships**: Category → Items (One-to-Many)

---

## � **Quick Start Commands**

| Command | Description | What it runs |
|---------|-------------|--------------|
| `npm run all` | **🔥 SIMPLEST** - Start everything | API Gateway + All Microservices |
| `npm run services` | Start only microservices | Category + Item services |
| `npm run dev` | Start just API Gateway | Main HTTP server only |

### Available Services After Running

- **API Gateway**: http://localhost:3000 *(Routes all requests to microservices)*
- **Category Service**: http://localhost:3001
- **Item Service**: http://localhost:3002

---

## �🔧 **API Endpoints**

### Categories Service
```http
GET    /categories              # List all categories
POST   /categories              # Create new category
GET    /categories/:id          # Get category by ID  
GET    /categories/slug/:slug   # Get category by slug
PATCH  /categories/:id          # Update category
DELETE /categories/:id          # Delete category
```

### Items Service
```http
GET    /items                     # List all items
POST   /items                     # Create new item
GET    /items/:id                 # Get item by ID
GET    /items/slug/:slug          # Get item by slug  
GET    /items/category/:categoryId # Get items by category
PATCH  /items/:id                 # Update item
DELETE /items/:id                 # Delete item
```

---

## ✨ **Key Features Implemented**

- ✅ **SEO-Friendly URLs**: Automatic slug generation for categories and items
- ✅ **Data Validation**: Comprehensive input validation with class-validator
- ✅ **Error Handling**: Proper HTTP status codes and error messages
- ✅ **TypeORM Integration**: Professional database ORM with relationships
- ✅ **Shared Libraries**: Reusable entities, DTOs, and utilities
- ✅ **Code Quality**: ESLint + Prettier enforced formatting

---

## 📖 **Documentation**

- 📝 [Development Activity Log](./docs/development-activity-log.md)
- 📋 [Implementation Summary](./docs/implementation-summary.md) 
- 🎯 [Phase 1 Project Plan](./docs/phase1-initial%20project.md)

---

## 🔧 **Development Commands**

```bash
# Development
npm run start:dev         # Start in watch mode
npm run start:debug       # Start with debug mode

# Building
npm run build            # Build the project
npm run start:prod       # Run production build

# Code Quality  
npm run format           # Format code with Prettier
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:cov         # Run tests with coverage
npm run test:e2e         # Run end-to-end tests
```

---

## 🏛️ **Tech Stack**

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL + TypeORM
- **Validation**: class-validator + class-transformer
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest

---

## 📈 **Next Steps**

1. **Database Setup**: Create PostgreSQL database and test connections
2. **API Gateway**: Implement service routing in main gateway
3. **Frontend Integration**: Connect with Next.js frontend
4. **Testing**: Add comprehensive unit and integration tests

---

**Developed by ATLAS** - Demonstrating enterprise-grade backend architecture and clean code principles.

*Like Atlas bearing the heavens, this system carries the structured knowledge of modern microservices development.*
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
