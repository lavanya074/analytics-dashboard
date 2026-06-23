CREATE DATABASE IF NOT EXISTS analytics_db;
USE analytics_db;

-- One row per company / individual using the dashboard
CREATE TABLE IF NOT EXISTS organizations (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- One row per user, tied to an org. role controls access level
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  org_id        INT NOT NULL,
  name          VARCHAR(100),
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','analyst','viewer') DEFAULT 'viewer',
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

-- Every tracked action. properties is JSON for flexible event data
-- Composite index on (org_id, created_at) makes dashboard queries fast
CREATE TABLE IF NOT EXISTS events (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  org_id      INT NOT NULL,
  event_type  VARCHAR(100) NOT NULL,
  properties  JSON,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_org_time (org_id, created_at),
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

-- API keys used by the tracker.js snippet. We store the hash, not the raw key
CREATE TABLE IF NOT EXISTS api_keys (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  org_id     INT NOT NULL,
  key_hash   VARCHAR(255) NOT NULL,
  label      VARCHAR(100) DEFAULT 'Production',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS events (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  org_id      INT NOT NULL,
  event_type  VARCHAR(100) NOT NULL,
  properties  JSON,
  is_demo     BOOLEAN DEFAULT false,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_org_time (org_id, created_at),
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);