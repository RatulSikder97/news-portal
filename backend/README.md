# News Portal Backend

A NestJS backend for the News Portal application with MongoDB.

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Getting Started

### 1. Start MongoDB with Docker

```bash
docker-compose up -d
```

This will start a MongoDB instance on port 27017.

### 2. Install Dependencies

```bash
npm install
```

### 3. Seed the Database


```bash
npm run seed
```


## Scripts

- `npm run start:prod` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run seed` - Seed the database with initial data
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
