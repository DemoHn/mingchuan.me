/* Replace with your SQL commands */
START TRANSACTION;

CREATE TABLE IF NOT EXISTS album_directory (
  id INT AUTO_INCREMENT,
  parent_node INT NOT NULL,
  name VARCHAR(128) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CREATE UNIQUE INDEX dir_name_unique_in_dir ON album_directory(parent_node, name);

-- album album_file
CREATE TABLE IF NOT EXISTS album_file (
  id INT AUTO_INCREMENT,
  directory_id INT NOT NULL,
  hash_key VARCHAR(32) NOT NULL,
  mime_type INT NOT NULL,
  size INT(8) NOT NULL,
  name VARCHAR(128) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- create indexes - ensure a directory has one unique file
-- CREATE UNIQUE INDEX file_name_unique_in_dir ON album_file(directory_id, name);

-- album_mime_type
CREATE TABLE IF NOT EXISTS album_mime_type (
  id INT AUTO_INCREMENT,
  mime_type VARCHAR(255) NOT NULL,
  handler_type INT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;