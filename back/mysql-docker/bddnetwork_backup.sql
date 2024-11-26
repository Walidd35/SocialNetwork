-- MySQL dump 10.13  Distrib 8.3.0, for macos12.6 (x86_64)
--
-- Host: localhost    Database: bddnetwork
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Comments`
--

DROP TABLE IF EXISTS `Comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` int DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comments`
--

LOCK TABLES `Comments` WRITE;
/*!40000 ALTER TABLE `Comments` DISABLE KEYS */;
INSERT INTO `Comments` VALUES (4,'4eme commentaire','2024-11-19 10:31:25','2024-11-19 10:31:25',21,6),(5,'5eme commentaire','2024-11-19 10:32:12','2024-11-19 10:32:12',21,6),(6,'5eme commentaire','2024-11-19 10:33:51','2024-11-19 10:33:51',21,6),(7,'7eme commentaire','2024-11-19 18:54:02','2024-11-19 18:54:02',21,6),(9,'un contenu','2024-11-20 14:35:20','2024-11-20 14:35:20',24,16),(10,'un contenu','2024-11-20 14:53:17','2024-11-20 14:53:17',24,16),(11,'contenu','2024-11-21 08:36:19','2024-11-21 08:36:19',11,6),(12,'contenu','2024-11-21 08:36:51','2024-11-21 08:36:51',21,6);
/*!40000 ALTER TABLE `Comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Posts`
--

DROP TABLE IF EXISTS `Posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime NOT NULL,
  `uptdated_at` datetime NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Posts`
--

LOCK TABLES `Posts` WRITE;
/*!40000 ALTER TABLE `Posts` DISABLE KEYS */;
INSERT INTO `Posts` VALUES (6,'/Users/walid/Documents/SQLApi/back/serveretapp/uploads/1731584244584.JPG','req3','Un post avec une premiere photo modifier','2024-11-14 11:37:24','2024-11-14 15:00:40',NULL),(7,'/Users/walid/Documents/SQLApi/back/serveretapp/uploads/1731863636770.JPG','req44','desc','2024-11-14 14:58:32','2024-11-17 17:13:56',NULL),(12,NULL,'testPostAdmin','testpostadmin','2024-11-17 17:29:53','2024-11-17 17:29:53',21),(13,'/Users/walid/Documents/SQLApi/back/serveretapp/uploads/1731865115288.JPG','yo test gif','yolololo','2024-11-17 17:38:35','2024-11-17 17:38:35',21),(16,NULL,'putpost user24','Petite description ','2024-11-20 14:31:36','2024-11-20 14:31:44',24),(17,NULL,'un contenu','desc','2024-11-20 21:50:28','2024-11-20 21:50:28',24),(19,NULL,'titre','desc','2024-11-21 08:26:37','2024-11-21 08:26:37',21),(20,NULL,'contenu','desc','2024-11-21 09:15:16','2024-11-21 09:15:43',11);
/*!40000 ALTER TABLE `Posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES (1,'user','2024-10-09 12:18:35','2024-10-09 12:18:35'),(2,'admin','2024-10-09 12:19:31','2024-10-09 12:19:31');
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(20) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (10,'user@gmail.com','$2a$08$z4dYzFYp1xgCYOzw3iJY5.v6D4/wZjpUj56sC0F0XQXcDFl.f6d1a','user'),(11,'user1@gmail.com','$2a$08$yFibFBjxpbl4Tlu/CGRttO0dMbBjZKRYnq/pLI0pivvxablS85A9C','user1'),(21,'userw@gmail.com','$2a$08$mHl2TuIWYmyYEJTlbg2.k.tY5uYu/npa5oOFNO.vIo7in4ImcPZzC','userw'),(24,'user35@gmail.com','$2a$08$BdOQndL9VweOQAWVy7.7teic4doufGs.j1tkDzaPRYL0RnQRslYCW','user35'),(25,'keo@gmail.com','$2a$08$jobf2/3OCkksdG9J/4snXuUHyaNFXfEBbsVEHl9slUHfy9/o0eMgS','keokgb'),(26,'user21@gmail.com','$2a$08$DvEIq1y61/UL0O3LWLQbeul5jl8ohZBQtvIQOJToHUTgkW7nLXgBK','uuuu'),(27,'userER@gmail.com','$2a$08$BO7p.Jzifjqmd61T3h4ZHuUyQBplmy.X58KhOxqJFRGuBXaue7wxu','fitia'),(28,'userwa@gmail.com','$2a$08$HC0tZYjGqGs0.xW6gvoi.uh5N8O7Eonjh5uztevFb8K0JW.qgNeRm','wawa'),(29,'userwa&@gmail.com','$2a$08$R3gAgGOEprHKQ2MbECj/nOqj8ysbzclJfQdYFn.1nXVlaMCrMw79.','wawa&'),(30,'userwsa&@gmail.com','$2a$08$K6IDOiaTUDINrkdn37ae.OIBKb9IWkBaAblVhpr/uEtqvcKq5FM4W','wawa&'),(31,'userwsas&@gmail.com','$2a$08$GS.m.ICNW0nbygEXKCXGEOVT98B2..1o7ji49b7iO8nHkRsViiF7q','wawa&'),(32,'userwsass&@gmail.com','$2a$08$BAHo2XkZIRWfNTGRAMuhYeuLu7UZBrwPx42JRT7kszUdhPPzfzhmq','wawa&'),(33,'userwsa1ss&@gmail.com','$2a$08$JUhSMOv3q1FpgW0G2.BcM.Iiw4v3tLRGdqWuJYDPpLXS3S0Ea1/Nq','wawa&'),(34,'userwsad1ss&@gmail.com','$2a$08$lir5DwiUx68ATwTpD.u1H.m2qnTbQRU7Ro9bQ7L7Sob2mXcKkjvPC','wawa&'),(35,'userwsads1ss&@gmail.com','$2a$08$TGq1efm21GaeU1vH3rmsTet9k76jVuBCAUonV/u1cXrBr.AVHWhSq','wawa&'),(36,'userwsadsd1ss&@gmail.com','$2a$08$h9VUc.eY2e5n.fvin3gK6uzqfYKv1o6trfsBOnDnokRlbN4Jqd/Mu','wawa&'),(37,'deminator@gmail.com','$2a$08$aCSZ77orjZUm3MRik66xv.s7DGomHhw.bG5OEbjWrEoo1oCZZBe32','wawa&ss'),(38,'deminator7@gmail.com','$2a$08$y/u.wMqRFqwkpC/9Zgf2feT7Sjof9RrxnwAKG8j4bv0sUtx5l63Iy','fittititit');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `role_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `Roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES ('2024-10-29 10:51:10','2024-10-29 10:51:10',1,10),('2024-10-29 10:57:39','2024-10-29 10:57:39',1,11),('2024-11-20 12:54:48','2024-11-20 12:54:48',1,24),('2024-11-21 08:10:21','2024-11-21 08:10:21',1,25),('2024-11-24 20:27:37','2024-11-24 20:27:37',1,27),('2024-11-25 14:20:28','2024-11-25 14:20:28',1,28),('2024-11-25 14:21:32','2024-11-25 14:21:32',1,29),('2024-11-25 14:23:01','2024-11-25 14:23:01',1,31),('2024-11-25 14:23:32','2024-11-25 14:23:32',1,32),('2024-11-25 14:23:53','2024-11-25 14:23:53',1,33),('2024-11-25 14:24:00','2024-11-25 14:24:00',1,34),('2024-11-25 14:25:49','2024-11-25 14:25:49',1,37),('2024-11-25 14:28:11','2024-11-25 14:28:11',1,38),('2024-11-15 10:31:56','2024-11-15 10:31:56',2,21);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-25 22:19:20
