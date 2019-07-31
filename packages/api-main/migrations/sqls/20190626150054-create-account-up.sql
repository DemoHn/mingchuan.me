/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS accounts (
  id INT AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  password_hash BLOB NOT NULL,
  permission_mask INT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id)
);