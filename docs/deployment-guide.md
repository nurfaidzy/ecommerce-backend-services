# Deployment Guide - Ecommerce Backend Services

## 🚀 **Phase 2 Complete: API Gateway Implementation**

### Architecture Overview
```
Frontend (Next.js) 
    ↓
API Gateway (Port 4000)
    ├── /api/categories/* → Category Service (Port 4001)
    └── /api/items/* → Item Service (Port 4002)
```

---

## 📋 **Quick Deployment Steps**

### 1. Database Setup ✅ (Already completed by Boss)
- PostgreSQL database created
- Environment variables configured
- Tables auto-created via TypeORM synchronization

### 2. API Gateway Configuration ✅ (Just completed)
- HTTP proxy routing implemented
- Error handling for service unavailability
- Proper DTO validation at gateway level

### 3. Start All Services

#### Option A: Development Mode (All-in-One)
```bash
# Start API Gateway (includes database connection)
npm run start:dev
# Runs on http://localhost:4000
```

#### Option B: True Microservices Mode
```bash
# Terminal 1 - Start Category Service
nest start category-service --watch
# Runs on http://localhost:4001

# Terminal 2 - Start Item Service  
nest start item-service --watch
# Runs on http://localhost:4002

# Terminal 3 - Start API Gateway
npm run start:dev
# Runs on http://localhost:4000
```

---

## 🔧 **API Gateway Endpoints**

### Categories (Proxied to Category Service)
```http
POST   /api/categories              # Create category
GET    /api/categories              # List all categories
GET    /api/categories/:id          # Get category by ID
GET    /api/categories/slug/:slug   # Get category by slug
PATCH  /api/categories/:id          # Update category
DELETE /api/categories/:id          # Delete category
```

### Items (Proxied to Item Service)
```http
POST   /api/items                     # Create item
GET    /api/items                     # List all items
GET    /api/items/:id                 # Get item by ID
GET    /api/items/slug/:slug          # Get item by slug
GET    /api/items/category/:categoryId # Get items by category
PATCH  /api/items/:id                 # Update item
DELETE /api/items/:id                 # Delete item
```

---

## 🧪 **Testing the API**

### Create a Category
```bash
curl -X POST http://localhost:4000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics"
  }'
```

### Create an Item
```bash
curl -X POST http://localhost:4000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones",
    "price": 99.99,
    "categoryId": "CATEGORY_ID_FROM_ABOVE"
  }'
```

### List All Categories
```bash
curl http://localhost:4000/api/categories
```

### List All Items
```bash
curl http://localhost:4000/api/items
```

---

## ⚙️ **Configuration Options**

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=YourUsernameHere
DB_PASSWORD=YourPasswordHere
DB_NAME=ecommerce_db

# Services
CATEGORY_SERVICE_URL=http://localhost:4001
ITEM_SERVICE_URL=http://localhost:4002
```

### Service Ports
- **API Gateway**: 4000 (main entry point for frontend)
- **Category Service**: 4001 (internal microservice)
- **Item Service**: 4002 (internal microservice)

---

## 🏗️ **Architecture Features**

### ✅ **API Gateway Benefits**
- **Single Entry Point**: Frontend only needs to know port 4000
- **Service Discovery**: Gateway handles routing to microservices
- **Error Handling**: Graceful degradation when services are down
- **Load Balancing Ready**: Can easily add multiple service instances

### ✅ **Microservices Independence**
- **Separate Databases**: Each service can have its own database (currently shared)
- **Independent Deployment**: Services can be updated separately
- **Technology Flexibility**: Different services can use different technologies
- **Scalability**: Scale services independently based on load

### ✅ **Development Benefits**
- **Hot Reload**: All services support watch mode for development
- **TypeScript**: Full type safety across all services
- **Shared Libraries**: Common entities and DTOs prevent duplication
- **Consistent API**: RESTful conventions across all endpoints

---

## 🔄 **Development Workflow**

### Adding New Features
1. **Update Entities**: Modify `/libs/common/entities/`
2. **Update DTOs**: Modify `/libs/dto/`
3. **Update Service**: Implement business logic in relevant service
4. **Update Controller**: Add endpoints to service controller
5. **Update Gateway**: No changes needed - proxy automatically handles new endpoints
6. **Test**: Use curl or Postman to test complete flow

### Database Changes
1. **Modify Entities**: Update TypeORM entities
2. **Run Migration**: TypeORM auto-sync in development
3. **Production**: Create proper migrations for production deployment

---

## 🎯 **Next Phase: Frontend Integration**

### Ready for Frontend Connection
- ✅ **API Gateway**: Single endpoint for frontend at `http://localhost:4000`
- ✅ **CORS Ready**: Can be configured for frontend domain
- ✅ **RESTful APIs**: Standard HTTP methods and status codes
- ✅ **Validation**: Input validation prevents bad data
- ✅ **Error Handling**: Meaningful error messages for frontend

### Frontend Integration Points
```typescript
// Frontend API calls should target:
const API_BASE_URL = 'http://localhost:4000/api';

// Categories
fetch(`${API_BASE_URL}/categories`)
fetch(`${API_BASE_URL}/categories/slug/electronics`)

// Items  
fetch(`${API_BASE_URL}/items`)
fetch(`${API_BASE_URL}/items/category/${categoryId}`)
```

---

**Status**: 🚀 **Ready for Frontend Integration!**

*ATLAS Phase 2 Complete - API Gateway successfully bridges frontend to microservices backend.*
