/* Replace with your SQL commands */
START TRANSACTION;

DROP INDEX dir_name_unique_in_dir ON album_directory;

DROP INDEX file_name_unique_in_dir ON album_file;

DROP TABLE IF EXISTS album_mime_type;
DROP TABLE IF EXISTS album_file;
DROP TABLE IF EXISTS album_directory;

COMMIT;