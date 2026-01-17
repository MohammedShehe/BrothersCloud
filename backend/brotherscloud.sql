-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: metro.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_date` date NOT NULL,
  `event_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `event_description` text COLLATE utf8mb4_general_ci,
  `repetition` enum('yearly','once') COLLATE utf8mb4_general_ci DEFAULT 'once',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notified_on_day` datetime DEFAULT NULL,
  `notified_before_day` datetime DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_event_name` (`event_name`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (13,4,'2005-06-12','MO\'s Birthday','Mohammed Aminu Shehe was born on this day','yearly','2025-08-18 14:11:02',NULL,NULL),(25,4,'2026-03-07','Mom\'s Birthday',NULL,'yearly','2025-08-23 10:34:41',NULL,NULL),(26,4,'2026-01-01','New Year',NULL,'yearly','2025-08-23 16:00:57',NULL,NULL),(27,4,'2025-10-30','LPU Makeup class',NULL,'once','2025-10-27 11:14:00',NULL,NULL),(28,4,'2025-11-02','Ma Asha wa Dar kaniagiza','Lawgate track suit','once','2025-10-28 02:17:12',NULL,NULL);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fbsc_records`
--

DROP TABLE IF EXISTS `fbsc_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fbsc_records` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `product` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `pair` int DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  `record_date` date NOT NULL,
  `notes` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`record_id`),
  KEY `user_id` (`user_id`),
  KEY `record_date` (`record_date`),
  CONSTRAINT `fbsc_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fbsc_records`
--

LOCK TABLES `fbsc_records` WRITE;
/*!40000 ALTER TABLE `fbsc_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `fbsc_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `file_type` enum('image','document','video') COLLATE utf8mb4_general_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `file_description` text COLLATE utf8mb4_general_ci,
  `file_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_size` bigint unsigned DEFAULT '0',
  `uploaded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cloudinary_url` text COLLATE utf8mb4_general_ci,
  `mime_type` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cloud_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`file_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_file_name` (`file_name`),
  CONSTRAINT `files_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (47,4,'image','Developer - MO','',NULL,5401248,'2025-08-23 21:06:58','https://res.cloudinary.com/dlokcqf1h/image/upload/v1755983217/brotherscloud/images/cfif0vjjuhwh6j5ptdxd.jpg',NULL,'brotherscloud/images/cfif0vjjuhwh6j5ptdxd'),(49,4,'video','MO na Sahil','',NULL,3222527,'2025-08-23 21:18:15','https://res.cloudinary.com/dlokcqf1h/video/upload/v1755983894/brotherscloud/videos/umawfimfmvcqgcwrxyc6.mov',NULL,'brotherscloud/videos/umawfimfmvcqgcwrxyc6'),(57,4,'image','Super mom','',NULL,61992,'2025-08-24 15:21:27','https://res.cloudinary.com/dlokcqf1h/image/upload/v1756048887/brotherscloud/images/c0b71f39e8b46b7daa092701ac7cb676_tkfchf.jpg','image/jpeg','brotherscloud/images/c0b71f39e8b46b7daa092701ac7cb676_tkfchf'),(58,4,'image','Kiduli','',NULL,1867468,'2025-08-24 15:22:20','https://res.cloudinary.com/dlokcqf1h/image/upload/v1756048940/brotherscloud/images/5454c79ce09dcbfaa198fae783029504_m5y5gu.jpg','image/jpeg','brotherscloud/images/5454c79ce09dcbfaa198fae783029504_m5y5gu'),(59,4,'image','Super Dad','',NULL,1975167,'2025-08-24 15:23:12','https://res.cloudinary.com/dlokcqf1h/image/upload/v1756048991/brotherscloud/images/fc35fe39d713f2a22e71314a593ab828_ysvtrq.jpg','image/jpeg','brotherscloud/images/fc35fe39d713f2a22e71314a593ab828_ysvtrq'),(60,4,'image','Isco','',NULL,4527307,'2025-08-24 15:24:11','https://res.cloudinary.com/dlokcqf1h/image/upload/v1756049050/brotherscloud/images/3a1f6ab619267d46e4c24b908bb04e01_domvse.jpg','image/jpeg','brotherscloud/images/3a1f6ab619267d46e4c24b908bb04e01_domvse'),(61,4,'image','Kinjili','',NULL,9465328,'2025-08-24 15:26:13','https://res.cloudinary.com/dlokcqf1h/image/upload/v1756049172/brotherscloud/images/a0a76a27c4edd81b727a8d9433b67d46_eawswv.jpg','image/jpeg','brotherscloud/images/a0a76a27c4edd81b727a8d9433b67d46_eawswv'),(63,4,'image','LPU Background','',NULL,246784,'2025-08-25 14:00:54','https://res.cloudinary.com/dlokcqf1h/image/upload/v1756130453/brotherscloud/images/5fd3569b30fb285c86e4c115548c7d72_eq1wyc.jpg','image/jpeg','brotherscloud/images/5fd3569b30fb285c86e4c115548c7d72_eq1wyc'),(67,4,'document','C programming Certificate','',NULL,364130,'2025-08-28 14:56:28','https://res.cloudinary.com/dlokcqf1h/raw/upload/v1756392988/brotherscloud/documents/da93ab0146989c118c95f41c39d176d0_a1qhdn','application/pdf','brotherscloud/documents/da93ab0146989c118c95f41c39d176d0_a1qhdn'),(68,4,'document','YUVA - Offer Letter','',NULL,132238,'2025-08-28 14:56:46','https://res.cloudinary.com/dlokcqf1h/raw/upload/v1756393005/brotherscloud/documents/a44fbb87bcaeb24f9060b5b89040308d_r529pu','application/pdf','brotherscloud/documents/a44fbb87bcaeb24f9060b5b89040308d_r529pu'),(69,4,'document','Cyber - Hackafest','',NULL,264568,'2025-08-28 14:57:18','https://res.cloudinary.com/dlokcqf1h/raw/upload/v1756393037/brotherscloud/documents/a1a9f45bdf727e60c3c8bbc991ff6e7f_gavere','application/pdf','brotherscloud/documents/a1a9f45bdf727e60c3c8bbc991ff6e7f_gavere'),(70,4,'image','MO11','',NULL,2252493,'2025-08-29 15:21:14','https://res.cloudinary.com/dlokcqf1h/image/upload/v1756480873/brotherscloud/images/224df53d075369cb36f462555f824b09_zv0gsn.jpg','image/jpeg','brotherscloud/images/224df53d075369cb36f462555f824b09_zv0gsn'),(71,2,'document','Fahima','Nalihitaji',NULL,41848,'2025-08-30 05:30:09','https://res.cloudinary.com/dlokcqf1h/raw/upload/v1756531809/brotherscloud/documents/3c2d8575cc767f9c021055a89b2c061a_ovzvff','application/vnd.openxmlformats-officedocument.wordprocessingml.document','brotherscloud/documents/3c2d8575cc767f9c021055a89b2c061a_ovzvff'),(72,4,'video','LPU','',NULL,3440358,'2025-09-01 05:36:46','https://res.cloudinary.com/dlokcqf1h/video/upload/v1756705005/brotherscloud/videos/347fdd318f5a551cb55ad87b00dec5dd_srb2i1.mp4','video/mp4','brotherscloud/videos/347fdd318f5a551cb55ad87b00dec5dd_srb2i1'),(73,4,'image','Four Brothers Sports Center','',NULL,853093,'2025-10-13 10:31:16','https://res.cloudinary.com/dlokcqf1h/image/upload/v1760351475/brotherscloud/images/4a96cb4889d49c9094c31fa969880d6c_hxgcf4.jpg','image/jpeg','brotherscloud/images/4a96cb4889d49c9094c31fa969880d6c_hxgcf4'),(74,4,'image','MO11','',NULL,1496253,'2025-10-14 08:21:57','https://res.cloudinary.com/dlokcqf1h/image/upload/v1760430116/brotherscloud/images/874360564c7bdd7dd785eb197eff7d0a_dfxm7t.jpg','image/jpeg','brotherscloud/images/874360564c7bdd7dd785eb197eff7d0a_dfxm7t'),(75,4,'image','MO and Vini','',NULL,3787339,'2025-10-27 11:06:03','https://res.cloudinary.com/dlokcqf1h/image/upload/v1761563162/brotherscloud/images/76cbc0258f5fca7d686892fd008d40e8_gxwoqb.jpg','image/jpeg','brotherscloud/images/76cbc0258f5fca7d686892fd008d40e8_gxwoqb'),(76,4,'image','MO’s Internship CepiaLabs - Noida','',NULL,669012,'2025-10-31 14:29:26','https://res.cloudinary.com/dlokcqf1h/image/upload/v1761920965/brotherscloud/images/34e705a4009d2faacb9c81464dd2a41c_csranl.png','image/png','brotherscloud/images/34e705a4009d2faacb9c81464dd2a41c_csranl'),(77,4,'document','My LPU Transcript (2 years)','',NULL,1127720,'2025-10-31 14:30:32','https://res.cloudinary.com/dlokcqf1h/raw/upload/v1761921032/brotherscloud/documents/061d09c32da03d80c2a1179fd39204b4_iv7ucl','application/pdf','brotherscloud/documents/061d09c32da03d80c2a1179fd39204b4_iv7ucl'),(78,4,'document','MO’s Offer Letter CepiaLabs','',NULL,257198,'2025-11-04 06:32:38','https://res.cloudinary.com/dlokcqf1h/raw/upload/v1762237958/brotherscloud/documents/51a73009f2938d91ffd8e2790766d106_ayabtp','application/pdf','brotherscloud/documents/51a73009f2938d91ffd8e2790766d106_ayabtp'),(79,4,'document','MO’s CV','',NULL,54938,'2025-11-17 11:49:27','https://res.cloudinary.com/dlokcqf1h/raw/upload/v1763380166/brotherscloud/documents/b0bfb9eeb394255a9203e1171f90a82d_ainnhf','application/pdf','brotherscloud/documents/b0bfb9eeb394255a9203e1171f90a82d_ainnhf'),(80,4,'document','eGAZ - Certificate','',NULL,359922,'2025-12-01 09:00:09','https://res.cloudinary.com/dlokcqf1h/raw/upload/v1764579608/brotherscloud/documents/9f92295f084e2504ff3f777611cc3b78_cwqlb6','application/pdf','brotherscloud/documents/9f92295f084e2504ff3f777611cc3b78_cwqlb6'),(81,4,'document','My Final CV','',NULL,54928,'2025-12-09 13:23:19','https://res.cloudinary.com/dlokcqf1h/raw/upload/v1765286599/brotherscloud/documents/504825ff322be298bfe72136fe7b5716_aif42m','application/pdf','brotherscloud/documents/504825ff322be298bfe72136fe7b5716_aif42m');
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `search_index`
--

DROP TABLE IF EXISTS `search_index`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `search_index` (
  `search_id` int NOT NULL AUTO_INCREMENT,
  `item_type` enum('file','event') COLLATE utf8mb4_general_ci NOT NULL,
  `item_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`search_id`),
  KEY `idx_search_title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `search_index`
--

LOCK TABLES `search_index` WRITE;
/*!40000 ALTER TABLE `search_index` DISABLE KEYS */;
INSERT INTO `search_index` VALUES (1,'file',1,'Family Picnic','Photo from Zanzibar trip','2025-08-15 16:14:53'),(2,'file',2,'Birth Certificate','Ali Juma Shehe Birth Certificate','2025-08-15 16:14:53'),(3,'file',3,'Wedding Video','Fatma wedding ceremony video','2025-08-15 16:14:53'),(4,'event',1,'Christmas Gathering','Family Christmas dinner at home','2025-08-15 16:14:53'),(5,'event',2,'Ali Birthday','Cake cutting at 8 PM','2025-08-15 16:14:53'),(6,'event',3,'School Graduation','Fatma graduation from university','2025-08-15 16:14:53');
/*!40000 ALTER TABLE `search_index` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `middle_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Aminu','Shehe','Juma','amsheju77@gmail.com','$2b$10$Rkx1.A5hFaNGvyOCeSsWPeDhx3N5f.A1U2dJbc5Zr81mj1H/v4KIq','1973-01-30','2025-08-15 16:13:19'),(2,'Fahima','Mohamed','Issa','famissa77@gmail.com','$2b$10$Rkx1.A5hFaNGvyOCeSsWPeDhx3N5f.A1U2dJbc5Zr81mj1H/v4KIq','1976-03-07','2025-08-15 16:13:19'),(3,'Abdul-rahman','Aminu','Shehe','Manisalachu27@gmail.com','$2b$10$Rkx1.A5hFaNGvyOCeSsWPeDhx3N5f.A1U2dJbc5Zr81mj1H/v4KIq','2002-03-05','2025-08-15 16:13:19'),(4,'Mohammed','Aminu','Shehe','mosnake111@gmail.com','$2b$10$Rkx1.A5hFaNGvyOCeSsWPeDhx3N5f.A1U2dJbc5Zr81mj1H/v4KIq','2005-06-12','2025-08-15 16:13:19'),(5,'Abdul-warith','Aminu','Shehe','abdulwarith10@gmail.com','$2b$10$Rkx1.A5hFaNGvyOCeSsWPeDhx3N5f.A1U2dJbc5Zr81mj1H/v4KIq','2010-07-15','2025-08-15 16:13:19'),(6,'Mundhir','Aminu','Shehe','mundhiraminu@gmail.com','$2b$10$Rkx1.A5hFaNGvyOCeSsWPeDhx3N5f.A1U2dJbc5Zr81mj1H/v4KIq','2011-12-30','2025-08-15 16:13:19');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-17 13:51:40
