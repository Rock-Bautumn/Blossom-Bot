-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS blossom_dev_db;
CREATE USER IF NOT EXISTS 'blossom_dev'@'localhost' IDENTIFIED WITH mysql_native_password BY 'blossom_dev_pwd';
GRANT ALL PRIVILEGES ON `blossom_dev_db`.* TO 'blossom_dev'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'blossom_dev'@'localhost';
FLUSH PRIVILEGES;
USE blossom_dev_db;

-- TINYINT is same as BOOL, 0 is false, 1 is true
CREATE table ChannelViews (
   channelview_id INT NOT NULL AUTO_INCREMENT,
   username VARCHAR(25) NOT NULL,
   channelname VARCHAR(25) NOT NULL,
   viewing_time INT NOT NULL DEFAULT 0,
   banked_time INT NOT NULL DEFAULT 0,
   is_watching TINYINT NOT NULL DEFAULT 0,
   PRIMARY KEY ( channelview_id )
);
