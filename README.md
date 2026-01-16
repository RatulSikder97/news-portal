# News Portal

**Developed by: Ratul Sikder**  
**Roll: 2506102**

## Features
- **Authentication**: JWT-based login/register with HttpOnly cookies.
- **Traffic Control and Validation**: Rate Limiting (Throttling) and Data Validation (DTOs).
- **Performance**: Server-side Caching (In-memory/File).
- **Database**: MongoDB with Mongoose ODM & Schema Validation.
- **Error Handling**: Global Exception Filters & Standardized API Responses.
- **News Management**: CRUD operations with pagination & search.
- **Comments**: Real-time ready comment system with user association.
- **Frontend**: React Functional Components with TypeScript & Hooks.
- **State Management**: Context API for Authentication state.
- **Infrastructure**: Containerized support (Docker).

## Configuration (.env)

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/news-portal
PORT=3000
JWT_SECRET=your_secret_key
```

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:3000
```

## How to Run

### Backend
```bash
cd backend
docker compose up -d  # Start MongoDB
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Endpoints
- **App**: http://localhost:5173/
- **API**: http://localhost:3000/
