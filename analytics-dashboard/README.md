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
**Live Server URL**
https://analytics-dashboard-soet.vercel.app/register

<img width="620" height="647" alt="image" src="https://github.com/user-attachments/assets/42bbe8e3-6c19-403e-9ae0-29b548728c03" />
<img width="1208" height="873" alt="image" src="https://github.com/user-attachments/assets/f88a69c2-6f31-4b28-bb47-3d97dfe4942a" />



