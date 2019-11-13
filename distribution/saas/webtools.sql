-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server Version:               10.2.12-MariaDB - mariadb.org binary distribution
-- Server Betriebssystem:        Win64
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Exportiere Struktur von Tabelle webtools.configuration
CREATE TABLE IF NOT EXISTS `configuration` (
  `db_namespace` varchar(255) NOT NULL,
  `db_key` varchar(255) NOT NULL,
  `db_content` mediumtext DEFAULT NULL,
  PRIMARY KEY (`db_namespace`,`db_key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Daten Export vom Benutzer nicht ausgewählt
-- Exportiere Struktur von Tabelle webtools.datalayer
CREATE TABLE IF NOT EXISTS `datalayer` (
  `db_uid` varchar(255) NOT NULL,
  `db_key` varchar(255) NOT NULL,
  `db_value` mediumtext DEFAULT NULL,
  `db_lastmodified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `db_version` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`db_uid`,`db_key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Daten Export vom Benutzer nicht ausgewählt
-- Exportiere Struktur von Tabelle webtools.entities
CREATE TABLE IF NOT EXISTS `entities` (
  `db_id` varchar(255) DEFAULT NULL,
  `db_name` varchar(255) DEFAULT NULL,
  `db_type` varchar(255) DEFAULT NULL,
  `db_content` mediumtext DEFAULT NULL,
  `db_version` varchar(256) DEFAULT NULL,
  UNIQUE KEY `db_id` (`db_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Daten Export vom Benutzer nicht ausgewählt
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
