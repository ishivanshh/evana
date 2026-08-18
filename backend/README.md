# Evana Candle Backend

Express and MongoDB API for the Evana premium candle e-commerce project.

## Day 1 Scope

- Express app and server bootstrap
- MongoDB connection through Mongoose
- Centralized success/error response format
- Centralized error middleware
- Basic 404 handler
- CORS
- JSON and URL-encoded body parsing
- Health route:
  - `GET /api/health`

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Configure these values in `.env` before running against real services:

- `MONGO_URI`
- `CLIENT_URL`

Authentication, products, cart, orders, payments, uploads, and admin features are intentionally not implemented in Day 1.
