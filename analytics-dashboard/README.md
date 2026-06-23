# Analytics Dashboard

A multi-tenant analytics SaaS — track events from any website and visualize
them in real time. Built with Node.js, Express, MySQL, and React.

This zip contains everything pre-built. Follow the steps below in order.

---

## What's inside

```
analytics-dashboard/
├── server/      ← Node.js + Express + MySQL backend
├── client/      ← React frontend
├── test.html    ← test page for the tracker snippet
└── README.md    ← this file
```

---

## Step 1 — Backend setup

Open a terminal (Git Bash recommended on Windows) inside the `server` folder:

```bash
cd server
npm install
```

Create your real `.env` file from the template:

```bash
cp .env.example .env
```

Open `.env` in a text editor and fill in your actual MySQL password:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourrealpassword
DB_NAME=analytics_db
JWT_SECRET=makethisalongrandomstringnobodycanguess
JWT_EXPIRES_IN=7d
```

---

## Step 2 — Create the database

**Easiest option — MySQL Workbench:**
1. Open MySQL Workbench → connect to your local instance
2. File → Open SQL Script → select `server/config/schema.sql`
3. Click the ⚡ lightning bolt button to run it
4. Verify with:
   ```sql
   USE analytics_db;
   SHOW TABLES;
   ```
   You should see: `api_keys`, `events`, `organizations`, `users`

**Or from a terminal where the `mysql` command works:**
```bash
mysql -u root -p < config/schema.sql
```

---

## Step 3 — Start the backend

```bash
npm run dev
```

You should see:
```
Server running on http://localhost:5000
```

Confirm it works by opening in your browser:
```
http://localhost:5000/health
```

---

## Step 4 — Frontend setup

Open a **new** terminal tab, go to the `client` folder:

```bash
cd client
npm install
npm start
```

This opens `http://localhost:3000` automatically.

---

## Step 5 — Test the full flow

1. You'll be redirected to `/login`. Click "Create one".
2. Fill in: workspace name, your name, email, password → Create account.
3. You should land on the Dashboard with charts already showing data
   (50 demo events are seeded automatically on registration).
4. Click "Send test event" — watch the total go up and the charts update.
5. Go to "Settings" → click "Generate new API key" → copy it.

---

## Step 6 — Test the tracker snippet

1. Open `test.html` (in the root of this project) in a text editor.
2. Replace `PASTE_YOUR_API_KEY_HERE` with the key you copied in Step 5.
3. Save the file, then open it by double-clicking (opens in your browser).
4. Go back to your Dashboard tab and refresh — the total event count should
   have increased. That's the `page_view` event that just fired from
   `test.html`.
5. Click the "Click to fire a test event" button on the test page, then
   refresh the dashboard again to see the `button_click` event appear.

If all of this works — your project is fully functional locally.

---

## Step 7 — Deploy (optional, to get a live URL)

1. **Database** — create a free MySQL instance on [Railway](https://railway.app),
   run `schema.sql` on it.
2. **Backend** — deploy the `server` folder to [Render](https://render.com).
   Build command: `npm install`. Start command: `node index.js`.
   Add the same environment variables as your `.env`, pointing at the
   Railway database.
3. Update `server/public/tracker.js` — change `API_URL` to your Render URL.
4. **Frontend** — update `client/src/api/axiosInstance.js` — change
   `baseURL` to your Render URL. Deploy the `client` folder to
   [Vercel](https://vercel.com).
5. Update CORS in `server/index.js` to allow your Vercel URL.

---

## Troubleshooting

**`mysql: command not found`**
MySQL isn't in your system PATH — use MySQL Workbench instead (Step 2).

**`Access denied for user 'root'@'localhost'`**
Wrong password in `.env`. Try blank password, or `root`, `password`, `1234`
in MySQL Workbench to find the right one.

**`mkdir` errors on Windows PowerShell**
Use Git Bash instead — it accepts the same commands used throughout this
project (`mkdir`, `ls`, `cd`, etc.) without translation.

**Port 5000 already in use**
```bash
netstat -ano | findstr :5000
taskkill /PID <the_number_shown> /F
```

---

## Architecture notes (useful for interviews)

- **Multi-tenancy**: every SQL query is scoped by `org_id`, which always
  comes from the JWT or API key — never from the request body. This is what
  prevents one organization from ever seeing another's data.
- **Connection pool**: `config/db.js` keeps 10 MySQL connections open and
  reused, instead of opening a new one per request.
- **Composite index** on `events(org_id, created_at)` keeps dashboard
  queries fast as the table grows.
- **Two auth systems**: JWT for logged-in dashboard users, API keys (hashed
  with SHA-256) for the tracker snippet running on external websites.
- **Passwords** are hashed with bcrypt — never stored in plain text.
