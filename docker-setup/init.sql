use mysql;
CREATE DATABASE IF NOT EXISTS mce_main; 
GRANT ALL ON mce_main.* TO 'general-user'@'%';
FLUSH PRIVILEGES;