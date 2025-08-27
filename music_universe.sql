-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: music_universe
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `user_id` int NOT NULL,
  `song_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`song_id`),
  KEY `song_id` (`song_id`),
  KEY `idx_fav_created` (`created_at`),
  CONSTRAINT `fk_fav_song` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fav_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (8,15,'2025-08-26 18:02:22'),(8,16,'2025-08-26 18:02:22'),(8,14,'2025-08-26 18:02:23');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (12,'Ballad','2025-08-25 17:25:30','2025-08-25 17:25:30'),(13,'Rap','2025-08-26 17:57:58','2025-08-26 17:57:58'),(14,'Remix','2025-08-26 17:58:15','2025-08-26 17:58:15'),(15,'V-pop','2025-08-26 17:58:42','2025-08-26 17:58:42');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `songs`
--

DROP TABLE IF EXISTS `songs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `songs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `artist_name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `genre_id` int DEFAULT NULL,
  `duration_sec` int DEFAULT NULL,
  `audio_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lyrics` text COLLATE utf8mb4_unicode_ci,
  `uploader_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_songs_title` (`title`),
  KEY `idx_songs_artist_name` (`artist_name`),
  KEY `idx_songs_genre` (`genre_id`),
  KEY `idx_songs_created` (`created_at`),
  KEY `idx_songs_uploader` (`uploader_id`),
  CONSTRAINT `fk_songs_genre` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_songs_uploader` FOREIGN KEY (`uploader_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `songs`
--

LOCK TABLES `songs` WRITE;
/*!40000 ALTER TABLE `songs` DISABLE KEYS */;
INSERT INTO `songs` VALUES (14,'Hồng Nhan','J97',13,NULL,'/uploads/audio/1756231224797-y2mate--jack-há»ng-nhan-official-mv-g5r.mp3','/uploads/images/1756231224796-táº£i-xuá»ng.jfif',NULL,8,'2025-08-26 18:00:24','2025-08-26 18:00:24'),(15,'Bạc Phận','J97 - KICM',15,NULL,'/uploads/audio/1756231236651-báº-c-pháº¬n-icm-x-jack-official-mv---icm-entertainment.mp3','/uploads/images/1756231236650-425334e6f252b8c34d74d16177a5eb9d.jpg',NULL,8,'2025-08-26 18:00:36','2025-08-26 18:06:42'),(16,'Sóng Gió','J97 - KICM',15,NULL,'/uploads/audio/1756231335630-y2mate--sãng-giã-icm-x-jack-official-music-video.mp3','/uploads/images/1756231335629-táº£i-xuá»ng-(1).jfif',NULL,8,'2025-08-26 18:02:15','2025-08-26 18:02:15'),(17,'Dưới Tán Cây Khô Hoa Nở','J97',12,NULL,'/uploads/audio/1756232438698-jack---j97-dæ¯á»i-tãn-cãy-khã-hoa-ná»-(-prod.-hino-)-official-visualizer-track-no.1---j97.mp3','/uploads/images/1756232438697-71fcf0df868fa79aaaf5bf66ad63fc8a.jpg',NULL,8,'2025-08-26 18:20:38','2025-08-26 18:20:38'),(18,'Trạm Dừng Chân','J97',15,NULL,'/uploads/audio/1756232616253-y2mate--jack-j97-tráº-m-dá»ªng-chãn-track-no-3.mp3','/uploads/images/1756232616252-hq720.jpg',NULL,8,'2025-08-26 18:23:36','2025-08-26 18:23:36'),(19,'Hoa Hải Đường','J97',15,NULL,'/uploads/audio/1756232722152-y2mate--jack-hoa-háº£i-äæ°á»ng-official-music-video.mp3','/uploads/images/1756232722151-a8626a5671f5a01250a074c4c8140cae.jpg',NULL,8,'2025-08-26 18:25:22','2025-08-26 18:25:22'),(20,'Sai Người Sai Thời Điểm','Thanh Hưng',12,NULL,'/uploads/audio/1756232936257-y2mate--sai-ngæ°á»i-sai-thá»i-äiá»m-thanh-hæ°ng-lyric.mp3','/uploads/images/1756232936256-134cd70f34f1310e3488d535678320b9.jpg',NULL,9,'2025-08-26 18:28:56','2025-08-26 18:28:56'),(21,'Thay Tôi Yêu Cô Ấy','Thanh Hưng',12,NULL,'/uploads/audio/1756233055350-y2mate--thay-tã´i-yãªu-cã´-áº¤y-änstä-thanh-hæ°ng.mp3','/uploads/images/1756233055349-50d49d8c9046d12fe2bace3cf336053a.jpg',NULL,9,'2025-08-26 18:30:55','2025-08-26 18:30:55'),(22,'Cần Không Có Có Không Cần','Thanh Hưng',12,NULL,'/uploads/audio/1756234135048-cáº§n-khã´ng-cã³,-cã³-khã´ng-cáº§n---thanh-hæ°ng-(lyrics-video)---thanh-hæ°ng-official.mp3','/uploads/images/1756234135048-b86b3c28e123e4e4e94d65ceed2312ac.jpg',NULL,9,'2025-08-26 18:48:55','2025-08-26 18:48:55'),(23,'Em Cưới Rồi À','Thanh Hưng',12,NULL,'/uploads/audio/1756234198981-em-cæ¯á»i-rá»i-ã---thanh-hæ¯ng-âem-cuoi-roi-a,-khong-doi-anh-nua-aâ-official-mv-valentine-2025---thanh-hæ°ng-official.mp3','/uploads/images/1756234198981-1334ab4e5711f26ac90f6b9494e282d4.jpg',NULL,9,'2025-08-26 18:49:59','2025-08-26 18:49:59'),(24,'Vạn Sự Tùy Duyên','Thanh Hưng',12,NULL,'/uploads/audio/1756234303408-váº¡n-sá»±-tã¹y-duyãªn---thanh-hæ°ng-official-animation-music-video---thanh-hæ°ng-official.mp3','/uploads/images/1756234303408-2f186acfa0194a1d60125e9f2db4ab8a.jpg',NULL,9,'2025-08-26 18:51:43','2025-08-26 18:51:43'),(25,'Kỷ Niệm Giam Cầm Chúng Ta','Thanh Hưng',12,NULL,'/uploads/audio/1756234408479-ká»¶-niá»m-giam-cáº¦m-chãng-ta---thanh-hæ¯ng-official-music-video---anh-nhá»-em-ráº¥t-nhiá»u,-nhá»-ráº¥t-nhiá»u.---thanh-hæ°ng-official.mp3','/uploads/images/1756234408479-a5b359acb5f924441a0365b191b52f2b.jpg',NULL,9,'2025-08-26 18:53:28','2025-08-26 18:53:28'),(26,'Chắc Vì Mình Chưa Tốt','Thanh Hưng',12,NULL,'/uploads/audio/1756234483666-cháº¯c-vã¬-mã¬nh-chæ°a-tá»t---thanh-hæ°ng-(lyrics-video)---thanh-hæ°ng-official.mp3','/uploads/images/1756234483666-549cd08d0415780100693b1b6cbce0b2.jpg',NULL,9,'2025-08-26 18:54:43','2025-08-26 18:54:43');
/*!40000 ALTER TABLE `songs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_requests`
--

DROP TABLE IF EXISTS `support_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `full_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_name` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `topic` enum('ky_thuat','tai_khoan','thanh_toan','khac') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'khac',
  `subject` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('mo','dang_xu_ly','da_giai_quyet') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'mo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` datetime DEFAULT NULL,
  `resolved_by` int DEFAULT NULL,
  `admin_note` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `fk_sr_user` (`user_id`),
  KEY `fk_sr_admin` (`resolved_by`),
  KEY `idx_sr_status` (`status`),
  KEY `idx_sr_created` (`created_at`),
  KEY `idx_sr_email` (`email`),
  CONSTRAINT `fk_sr_admin` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_requests`
--

LOCK TABLES `support_requests` WRITE;
/*!40000 ALTER TABLE `support_requests` DISABLE KEYS */;
INSERT INTO `support_requests` VALUES (1,NULL,'Nguyễn Văn A','nguyenvana','a@example.com','ky_thuat','Không đăng nhập được','Tôi gặp vấn đề khi sử dụng tính năng đăng nhập.','mo','2025-08-09 19:05:28',NULL,NULL,NULL),(2,NULL,'Trần Thị B','tranthib','b@example.com','khac','Góp ý giao diện','Màu nền hơi tối, mong có tuỳ chọn sáng.','mo','2025-08-09 19:05:28',NULL,NULL,NULL),(3,NULL,'Nguyễn Văn A','nguyenvana','a@example.com','ky_thuat','Không đăng nhập được','Mình gặp lỗi... giúp với','mo','2025-08-12 17:53:11',NULL,NULL,NULL),(4,NULL,'Le Loc',NULL,'letanloc@gmail.com','khac','Báo lỗi bài hát','Bài hát Em Cười Rồi À bị lỗi phát lại','mo','2025-08-12 18:09:26',NULL,NULL,NULL);
/*!40000 ALTER TABLE `support_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_name` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `is_locked` tinyint(1) NOT NULL DEFAULT '0',
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locked_at` datetime DEFAULT NULL,
  `locked_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_name` (`account_name`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_created` (`created_at`),
  KEY `idx_users_role_locked` (`role`,`is_locked`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (8,'Quản Trị Viên','loc.mmiv','admin@gmail.com','$2b$10$VfUDrqH0CajOA.D7X0XDeeZZuktSxk21viJ6IXFX2406n.xswnMSy','admin',0,NULL,NULL,NULL,'2025-08-22 18:25:18','2025-08-26 17:56:32'),(9,'Lê Tấn Lộc','midnight','user@gmail.com','$2b$10$Wfdup9NNLa.T9YTPk3t7Ue/H.vSzeT/D9lzMJaNNTb9QHPRSaneVe','user',0,NULL,NULL,NULL,'2025-08-22 18:28:52','2025-08-26 17:56:32');
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

-- Dump completed on 2025-08-27 22:40:15
