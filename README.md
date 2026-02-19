# TechShop Backend API

[![CI](https://github.com/buitai97/techshop-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/buitai97/techshop-backend/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/node-%3E%3D18%20%3C%3D22-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
[![Live Demo](https://img.shields.io/badge/demo-online-0ea5e9)](https://techshop-alpha.vercel.app/)

A production-oriented TypeScript backend for the TechShop e-commerce platform.

This service provides authentication, product catalog management, cart workflows, and order creation, with Prisma + MySQL for persistence and S3-backed image uploads.

## Highlights

- Express 5 + TypeScript REST API
- Prisma ORM with MySQL
- JWT-based route protection
- Product image uploads via `multer` + Amazon S3
- Input validation with Zod
- CORS configured for deployed frontend and local development
- Health check endpoint for uptime monitoring

## Tech Stack

- Runtime: Node.js (supported: `>=18 <=22`)
- Framework: Express
- Language: TypeScript
- Database: MySQL + Prisma
- Auth: JSON Web Token (JWT)
- Storage: Amazon S3

## Project Structure

```text
src/
  app.ts                # Express app bootstrap
  server.ts             # Lambda/serverless handler
  routes/api.ts         # API route definitions
  controllers/          # HTTP handlers
  services/             # Business logic + data layer calls
  middleware/           # JWT guard, multer upload middleware
  validation/           # Zod schemas
  config/               # Prisma/S3/shared config
prisma/
  schema.prisma         # Data models
  migrations/           # DB migrations
public/                 # Static assets served by Express
```

## Prerequisites

- Node.js 18-22
- MySQL database
- AWS S3 bucket (for product image upload)

## Environment Variables

Create a `.env` file in the project root.

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=365d
FRONTEND_URLS=your-frontend-url.com
DATABASE_URL=mysql://user:password@host:3306/database
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your_bucket_name
```

## Getting Started

```bash
npm install
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Start development server:

```bash
npm run dev
```

Build + run production bundle:

```bash
npm run build
npm start
```

## API Base URL

- Local: `http://localhost:3000`
- API prefix: `/api`

Health check:

- `GET /api/health`

## Authentication

All API routes are mounted behind a JWT middleware, except these whitelisted endpoints:

- `POST /api/register`
- `POST /api/login`
- `GET /api/products`
- `GET /api/products/:id`

For protected routes, send:

```http
Authorization: Bearer <accessToken>
```

## API Response Format

This API returns JSON for both success and error cases. Shapes vary slightly by endpoint, but these are the common patterns used in controllers.

Success examples:

```json
{
  "accessToken": "jwt-token-value"
}
```

```json
{
  "users": [],
  "count": 0
}
```

```json
{
  "user": { "id": 1, "username": "demo" },
  "message": "Register successfully!"
}
```

Error examples:

```json
{
  "message": "No token provided"
}
```

```json
{
  "errors": [
    "Username is required (username)",
    "Password must be at least 6 characters (password)"
  ]
}
```

```json
{
  "error": "Username already exists"
}
```

## Core Endpoints

### Auth

- `POST /api/register`
- `POST /api/login`
- `GET /api/account` (protected)

### Users

- `GET /api/users` (protected)
- `DELETE /api/users/:id` (protected)

### Products

- `POST /api/products` (protected, multipart upload)
- `GET /api/products`
- `GET /api/products/:id`
- `DELETE /api/products/:id` (protected)

### Cart

- `GET /api/cart` (protected)
- `GET /api/cartCount` (protected)
- `POST /api/cart` (protected)
- `PUT /api/cart` (protected)
- `POST /api/cart/empty` (protected)

### Orders

- `GET /api/orders` (protected)
- `GET /api/orders/user` (protected)
- `POST /api/orders` (protected)

## Example Requests

Login:

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"secret"}'
```

Fetch account:

```bash
curl http://localhost:3000/api/account \
  -H "Authorization: Bearer <accessToken>"
```

## Deployment Notes

- Serverless adapter is available in `src/server.ts` (`serverless-http`).
- Ensure `JWT_SECRET`, `DATABASE_URL`, and AWS credentials are configured in your deployment environment.
- Align allowed CORS origins in `src/app.ts` with your frontend domains.

## License

ISC
