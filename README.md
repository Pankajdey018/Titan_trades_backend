# Titan Trades Backend

Production-style trading backend built with Node.js, Express, and MongoDB.

## Highlights

- JWT auth (`register`, `login`, `me`)
- Transaction-safe order execution engine
- Automatic holdings + positions reconciliation
- Trade ledger generation per order
- Portfolio summary endpoint with totals (invested/current value/P&L)
- Clear REST API versioning (`/api/v1/*`)
- Centralized error handling middleware and health check
- Indexed Mongoose models for query performance

## API

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (Bearer token)

### Orders
- `POST /api/v1/orders` (Bearer token)
- `GET /api/v1/orders` (Bearer token)

Sample body:
```json
{
  "symbol": "AAPL",
  "qty": 5,
  "orderType": "BUY",
  "orderMode": "MARKET",
  "marketPrice": 196.25
}
```

### Portfolio
- `GET /api/v1/portfolio/summary` (Bearer token)

### Health
- `GET /health`

## Environment Variables

Create `.env`:

```bash
PORT=3000
DB_URL=mongodb://localhost:27017/titan_trades
JWT_SECRET=super-secret
JWT_EXPIRES_IN=1d
```

## Run

```bash
npm install
npm run dev
```

