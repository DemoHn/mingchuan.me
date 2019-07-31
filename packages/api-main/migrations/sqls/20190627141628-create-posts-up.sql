/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  `status` VARCHAR(32) NOT NULL,
  permission VARCHAR(32) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id)
);