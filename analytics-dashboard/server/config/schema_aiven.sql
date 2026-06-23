-- Aiven's free MySQL plan only provides one database (defaultdb) and
-- doesn't allow creating additional ones, so this version skips the
-- CREATE DATABASE / USE statements from the original schema.sql and
-- creates tables directly in whichever database you connect to.

CREATE TABLE IF NOT EXISTS organizations (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS api_keys (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  org_id     INT NOT NULL,
  key_hash   VARCHAR(255) NOT NULL,
  label      VARCHAR(100) DEFAULT 'Production',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);