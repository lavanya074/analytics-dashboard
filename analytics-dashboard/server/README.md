# Analytics Dashboard — Backend

Multi-tenant analytics API built with Node.js, Express, and MySQL.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create your `.env` file by copying the example:
   ```
   cp .env.example .env
   ```
   Then open `.env` and fill in your real MySQL password and a random JWT secret.

3. Create the database and tables.
   Open MySQL Workbench, run `config/schema.sql`, or from a terminal where the
   `mysql` command is available:
   ```
   mysql -u root -p < config/schema.sql
   ```

4. Start the server:
   ```
   npm run dev
   ```

5. Confirm it's running by opening:
   ```
   http://localhost:5000/health
   ```
   You should see `{"status":"ok"}`.

## API Endpoints

| Method | Route                     | Auth        | Description                  |
|--------|---------------------------|-------------|-------------------------------|
| POST   | /api/auth/register        | none        | Create org + admin user      |
| POST   | /api/auth/login           | none        | Log in, returns JWT          |
| POST   | /api/events               | API key     | Ingest a tracked event       |
| GET    | /api/analytics/overview   | JWT         | Dashboard stats              |
| POST   | /api/settings/api-key     | JWT (admin) | Generate a new API key       |

## Architecture notes

- **Connection pool** (not a single connection) in `config/db.js` handles
  concurrent requests without waiting.
- **Composite index** on `events(org_id, created_at)` keeps dashboard queries
  fast even with large amounts of data.
- **org_id always comes from the token** (JWT or API key) — never from the
  request body. This is what makes the multi-tenancy isolation safe; a client
  cannot fake which organization they belong to.
- **Passwords** are hashed with bcrypt. **API keys** are hashed with SHA-256.
  Neither is ever stored in plain text.
