use mysql;
CREATE DATABASE IF NOT EXISTS mce_main;
ALTER DATABASE mce_main CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
GRANT ALL ON mce_main.* TO 'general-user'@'%';
FLUSH PRIVILEGES;