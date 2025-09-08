# Ecommerce Backend Services

> **Enterprise-Grade Microservices Backend for Modern E-commerce**

A robust, modular backend system built with **NestJS** and **TypeScript**, following clean architecture and microservices best practices. This project provides a scalable foundation for e-commerce platforms, featuring a shared PostgreSQL database, reusable libraries, and professional code quality standards.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v22+
- PostgreSQL 16+
- npm (or yarn)

### Installation & Setup
```bash
# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Build the project
npm run build

# Start all services (API Gateway + Microservices)
npm run all

# Or, to start only the API Gateway (no DB required)
npm run dev
```

> **Note:** Microservices require a valid PostgreSQL connection in `.env`. The API Gateway can run standalone for development.

---

## 🏗️ Architecture Overview

### Project Structure
```
/apps
  ecommerce-backend-services/   # API Gateway
  category-service/             # Category CRUD microservice
  item-service/                 # Item/Product CRUD microservice
/libs
  common/                      # Shared entities, utils, response wrappers
  dto/                         # Shared DTOs for validation
```

### Database Schema
- **Categories**: `id`, `name`, `slug`, `created_at`, `updated_at`
- **Items**: `id`, `name`, `slug`, `description`, `price`, `category_id`, `created_at`, `updated_at`
- **Relationships**: One-to-Many (Category → Items)

---

## 🛠️ Commands & Service Endpoints

### Common Commands
| Command            | Description                        |
|--------------------|------------------------------------|
| `npm run all`      | Start API Gateway + all microservices |
| `npm run services` | Start only category & item services |
| `npm run dev`      | Start API Gateway only             |
| `npm run build`    | Build the project                  |
| `npm run test`     | Run unit tests                     |
| `npm run test:e2e` | Run end-to-end tests               |

### Service URLs (Default)
- **API Gateway**: http://localhost:3000
- **Category Service**: http://localhost:3001
- **Item Service**: http://localhost:3002

### Category Service Endpoints
```http
GET    /categories              # List all categories
POST   /categories              # Create new category
GET    /categories/:id          # Get category by ID
GET    /categories/slug/:slug   # Get category by slug
PATCH  /categories/:id          # Update category
DELETE /categories/:id          # Delete category
```

### Item Service Endpoints
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

## ✨ Features
- **SEO-Friendly URLs**: Automatic slug generation for categories and items
- **Robust Validation**: DTOs with class-validator for safe, clean data
- **Consistent Error Handling**: Professional HTTP status codes and error messages
- **TypeORM Integration**: Modern ORM with entity relationships
- **Reusable Libraries**: Shared entities, DTOs, and utilities for DRY code
- **Code Quality**: Enforced with ESLint and Prettier
- **Testing**: Unit and e2e tests with Jest

---

## 📚 Documentation
- [Development Activity Log](./docs/development-activity-log.md)
- [Implementation Summary](./docs/implementation-summary.md)
- [Phase 1 Project Plan](./docs/phase1-initial%20project.md)

---

## 🧑‍💻 Development & Testing

```bash
# Development (watch mode)
npm run start:dev

# Debug mode
npm run start:debug

# Build for production
npm run build
npm run start:prod

# Code formatting & linting
npm run format
npm run lint
npm run lint:fix

# Testing
npm run test         # Unit tests
npm run test:watch   # Watch mode
npm run test:cov     # Coverage
npm run test:e2e     # End-to-end tests
```

---

## 🏛️ Tech Stack
- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** PostgreSQL + TypeORM
- **Validation:** class-validator, class-transformer
- **Testing:** Jest
- **Code Quality:** ESLint, Prettier

---

## 🚦 Next Steps
1. **Database Setup:** Create and connect PostgreSQL instance
2. **API Gateway:** Expand service routing and authentication
3. **Frontend Integration:** Connect with a Next.js or other frontend
4. **Testing:** Expand unit and integration test coverage

---

## 🚀 Deployment

For production deployment, see the [NestJS deployment guide](https://docs.nestjs.com/deployment).

You can also deploy to AWS using [NestJS Mau](https://mau.nestjs.com):
```bash
npm install -g @nestjs/mau
mau deploy
```

---

## 🔗 Resources
- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Discord](https://discord.gg/G7Qnnhy)
- [NestJS Courses](https://courses.nestjs.com/)
- [NestJS Devtools](https://devtools.nestjs.com)
- [Jobs Board](https://jobs.nestjs.com)

---

## 🤝 Contributing & Support

This project is MIT-licensed and welcomes contributions! For support, see the [NestJS support page](https://docs.nestjs.com/support).

---

**Developed by ATLAS** — Demonstrating enterprise-grade backend architecture and clean code principles.

*Like Atlas bearing the heavens, this system carries the structured knowledge of modern microservices development.*
