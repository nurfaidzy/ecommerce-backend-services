# Simple Commands Guide - Ecommerce Backend Services

## 🚀 **Super Simple Commands**

### **Start Everything (Microservices Mode)**
```bash
npm run all
# Starts all 3 services: Category + Item + API Gateway
# Runs on ports: 3001, 3002, 3000
```

### **Start Just the Services**  
```bash
npm run services
# Starts only Category + Item services
# Runs on ports: 3001, 3002
```

### **Start Single Service (Development)**
```bash
npm run dev
# Starts just the API Gateway (simplest option)
# Runs on port: 3000
```

---

## 📋 **All Available Commands**

### **🔥 Super Simple (New)**
- `npm run all` - Start all 3 services (microservices mode)
- `npm run services` - Start Category + Item services only  
- `npm run dev` - Start API Gateway only (simplest)

### **🎯 Specific Services**
- `npm run start:gateway` - API Gateway (port 3000)
- `npm run start:category` - Category Service (port 3001)
- `npm run start:item` - Item Service (port 3002)

### **🛠️ Development Tools**
- `npm run build` - Build all services
- `npm run format` - Format code with Prettier
- `npm run lint` - Fix linting issues
- `npm test` - Run all tests

---

## 🎯 **Which Command Should I Use?**

### **👉 For Frontend Development**
```bash
npm run dev
```
**Why**: Single service, connects to your database, all endpoints work through port 3000

### **👉 For Microservices Testing**  
```bash
npm run all
```
**Why**: True microservices architecture, services communicate via HTTP

### **👉 For Backend-Only Development**
```bash
npm run services
```
**Why**: Just the data services without the gateway

---

## 💡 **Pro Tips**

### **Multiple Terminals**
If you want more control, run in separate terminals:
```bash
# Terminal 1
npm run start:category

# Terminal 2  
npm run start:item

# Terminal 3
npm run start:gateway
```

### **Watch the Logs**
When using `npm run all`, you'll see colored logs from all services:
- **Green**: Category Service logs
- **Blue**: Item Service logs  
- **Magenta**: API Gateway logs

### **Stop All Services**
- Press `Ctrl+C` once to stop all services when using `npm run all`
- Each service supports hot reload - edit code and see changes instantly

---

## 🌐 **Service URLs**

### **API Gateway** (Frontend connects here)
- **URL**: http://localhost:3000
- **Categories**: http://localhost:3000/api/categories
- **Items**: http://localhost:3000/api/items

### **Direct Service Access** (For debugging)
- **Category Service**: http://localhost:3001/categories  
- **Item Service**: http://localhost:3002/items

---

## 🔧 **Troubleshooting**

### **Port Already in Use**
```bash
# Check what's using the port
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### **Database Connection Issues**
1. Make sure PostgreSQL is running
2. Check your `.env` file has correct database credentials
3. Verify database `ecommerce_db` exists

### **Service Won't Start**
```bash
# Clean build and restart
npm run build
npm run all
```

---

**ATLAS Recommendation**: Use `npm run all` for the full microservices experience, or `npm run dev` for simple development! 🚀
