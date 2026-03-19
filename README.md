## Backend (Node.js + TypeScript + MongoDB)

### Functional Requirements (MVP)
- **Auth**
  - Login with `email` + `password`
  - JWT returned on successful login
  - Backend enforces role-based access (OPS / FINANCE)
  - Seeded users:
    - `ops@demo.com` / `ops123` (OPS)
    - `finance@demo.com` / `fin123` (FINANCE)
- **Vendors**
  - Create vendor (OPS only)
  - List vendors (OPS + FINANCE)
  - Fields: `name` (required), `upi_id`, `bank_account`, `ifsc`, `is_active` (default `true`)
- **Payouts**
  - OPS can create payout (Draft), submit payout (Draft → Submitted), view all payouts
  - FINANCE can approve (Submitted → Approved), reject (Submitted → Rejected with reason), view all payouts
  - No status jumping allowed
  - Fields: `vendor_id`, `amount (>0)`, `mode (UPI|IMPS|NEFT)`, `note`, `status`, `decision_reason`, timestamps
- **Audit trail**
  - Each payout action creates an audit record: `CREATED/SUBMITTED/APPROVED/REJECTED`
  - Stores who performed it + timestamp

### Error/Response Format
- **Success**
  - `{ "success": true, "message": "...", "data": ... }`
- **Error**
  - `{ "success": false, "error": { "code": "...", "message": "...", "details": ... } }`

### Setup
1. Copy `.env.example` → `.env` and set `MONGODB_URI` + `JWT_SECRET`
2. Install deps

```bash
npm install
```

3. Seed users

```bash
npm run seed
```

4. Start server

```bash
npm run dev
```

Server: `http://localhost:4000`

### API Endpoints
All endpoints are prefixed with `/api`.

- `POST /api/auth/login`
- `GET /api/vendors` (OPS, FINANCE)
- `POST /api/vendors` (OPS)
- `GET /api/payouts` (OPS, FINANCE)
- `POST /api/payouts` (OPS)
- `GET /api/payouts/:id` (OPS, FINANCE)
- `POST /api/payouts/:id/submit` (OPS)
- `POST /api/payouts/:id/approve` (FINANCE)
- `POST /api/payouts/:id/reject` (FINANCE)

"# payout-backend" 
"# payout-backend" 
