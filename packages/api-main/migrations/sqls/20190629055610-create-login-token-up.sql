/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS login_tokens (
  id INT AUTO_INCREMENT,
  account_id INT NOT NULL,
  public_key TEXT NOT NULL,
  device_identifier VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  UNIQUE KEY(device_identifier),
  PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;