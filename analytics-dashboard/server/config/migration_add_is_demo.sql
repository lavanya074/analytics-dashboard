-- Run this once against your existing database to add demo-data tagging
-- without needing to drop/recreate the events table.
USE analytics_db;

ALTER TABLE events ADD COLUMN is_demo BOOLEAN DEFAULT false;

-- Backfill note: anything inserted via the old seedDemoEvents (before this
-- change) can't be told apart from real events automatically. If you want
-- a clean slate instead, you can wipe and re-seed per org:
--   DELETE FROM events WHERE org_id = <your_org_id>;
-- (seeding currently only runs once, on register() — see authController.js)