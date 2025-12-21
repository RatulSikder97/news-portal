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

This will populate the database with initial users and news articles.

### 4. Start the Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Users

| Method | Endpoint   | Description       |
| ------ | ---------- | ----------------- |
| GET    | /users     | Get all users     |
| GET    | /users/:id | Get user by ID    |
| POST   | /users     | Create a new user |
| PUT    | /users/:id | Update a user     |
| DELETE | /users/:id | Delete a user     |

### News

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | /news                         | Get all news (paginated) |
| GET    | /news/:id                     | Get news by ID           |
| POST   | /news                         | Create news              |
| PATCH  | /news/:id                     | Update news              |
| DELETE | /news/:id                     | Delete news              |
| POST   | /news/:id/comments            | Add comment to news      |
| DELETE | /news/:id/comments/:commentId | Remove comment           |

### Query Parameters for GET /news

- `_page`: Page number (default: 1)
- `_limit`: Items per page (default: 10)
- `q`: Search query (searches in title and body)
- `_sort`: Sort field (default: id)
- `_order`: Sort order - asc or desc (default: desc)

The response includes an `X-Total-Count` header with the total number of items.

## Project Structure

```
backend/
├── src/
│   ├── database/
│   │   └── seed.ts          # Database seeding script
│   ├── news/
│   │   ├── dto/
│   │   │   └── news.dto.ts  # Data Transfer Objects
│   │   ├── schemas/
│   │   │   ├── comment.schema.ts
│   │   │   └── news.schema.ts
│   │   ├── news.controller.ts
│   │   ├── news.module.ts
│   │   └── news.service.ts
│   ├── users/
│   │   ├── dto/
│   │   │   └── user.dto.ts
│   │   ├── schemas/
│   │   │   └── user.schema.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── app.module.ts
│   └── main.ts
├── .env
├── docker-compose.yml
├── nest-cli.json
├── package.json
└── tsconfig.json
```

## Environment Variables

| Variable    | Description               | Default                               |
| ----------- | ------------------------- | ------------------------------------- |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/news-portal |
| PORT        | Server port               | 3000                                  |

## Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run seed` - Seed the database with initial data
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
