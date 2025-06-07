-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: petcare
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `albums`
--

DROP TABLE IF EXISTS `albums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `albums` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `albums`
--

LOCK TABLES `albums` WRITE;
/*!40000 ALTER TABLE `albums` DISABLE KEYS */;
INSERT INTO `albums` VALUES (1,3,'album_1748777156648.png','Chú chó vàng tinh nghịch đuổi bắt bong bóng xà phòng','2025-06-01 18:25:57','2025-06-01 18:25:57'),(2,3,'album_1748777597985.png','Mèo con tò mò khám phá thế giới trong chiếc hộp carton','2025-06-01 18:33:18','2025-06-01 18:33:18'),(3,3,'album_1748777626295.png','Khoảnh khắc bình yên: Chó cưng dụi đầu âu yếm vào tay chủ','2025-06-01 18:33:46','2025-06-01 18:33:46'),(4,3,'album_1748777647744.png','Nàng mèo Ba Tư kiêu sa tắm nắng bên bậu cửa sổ','2025-06-01 18:34:08','2025-06-01 18:34:08'),(5,3,'album_1748777680378.png','Năng động ngày hè: Hai chú chó con nô đùa trên bãi biển','2025-06-01 18:34:40','2025-06-01 18:34:40'),(6,3,'album_1748777712961.png','Chú thỏ trắng đáng yêu gặm cỏ non trong vườn','2025-06-01 18:35:13','2025-06-01 18:35:13'),(7,3,'album_1748777730094.png','Ánh mắt Husky: Chú chó Husky nhìn thẳng vào ống kính giữa trời tuyết','2025-06-01 18:35:30','2025-06-01 18:35:30'),(8,3,'album_1748777750307.png','Mèo Anh lông ngắn nhanh nhẹn vờn bắt tia laser','2025-06-01 18:35:50','2025-06-01 18:35:50'),(9,3,'album_1748777780378.png','Biểu cảm khó đỡ của chó Pug mặt xệ','2025-06-01 18:36:20','2025-06-01 18:36:20'),(10,3,'album_1748777800311.png','Giấc mơ ngọt ngào: Đàn mèo con say ngủ cuộn tròn bên nhau','2025-06-01 18:36:40','2025-06-01 18:36:40'),(11,3,'album_1748777822903.png','Vũ điệu hoàng hôn của Vẹt Macaw','2025-06-01 18:37:03','2025-06-01 18:37:03'),(12,3,'album_1748777840646.png','Mèo đen quý phái trên nhung đỏ dưới ánh nến','2025-06-01 18:37:21','2025-06-01 18:37:21'),(13,3,'album_1748777871149.png','Cá Betta đa sắc và vũ điệu','2025-06-01 18:37:51','2025-06-01 18:37:51'),(14,3,'album_1748777892374.png','Shiba Inu vui nhộn giữa thảm lá phong đỏ mùa thu','2025-06-01 18:38:12','2025-06-01 18:38:12'),(15,3,'album_1748777911109.png','Kỳ quan biến hóa: Tắc kè hoa trên nhành dâm bụt đỏ','2025-06-01 18:38:31','2025-06-01 18:38:31'),(16,3,'album_1748777927782.png','Mèo Sphynx cá tính với phụ kiện neon trên nền graffiti','2025-06-01 18:38:48','2025-06-01 18:38:48'),(17,3,'album_1748777953687.png','Vũ điệu thảo nguyên: Chó chăn cừu Úc giữa đồng hoa dại bảy sắc cầu vồng','2025-06-01 18:39:14','2025-06-01 18:43:25'),(18,3,'album_1748777975688.png','Thế giới cổ tích của Hamster: Bé chuột xinh trong ngôi nhà màu pastel','2025-06-01 18:39:36','2025-06-01 18:39:36');
/*!40000 ALTER TABLE `albums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment_services`
--

DROP TABLE IF EXISTS `appointment_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment_services` (
  `appointment_id` int NOT NULL,
  `service_id` int NOT NULL,
  PRIMARY KEY (`appointment_id`,`service_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `appointment_services_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `appointment_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment_services`
--

LOCK TABLES `appointment_services` WRITE;
/*!40000 ALTER TABLE `appointment_services` DISABLE KEYS */;
INSERT INTO `appointment_services` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(1,2),(2,2),(3,2),(4,2),(5,2),(6,2);
/*!40000 ALTER TABLE `appointment_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pet_id` int NOT NULL,
  `appointment_date` datetime NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pet_id` (`pet_id`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,6,'2024-03-20 10:00:00','Khám tổng quát cho chó','COMPLETED','2025-06-06 04:31:31','2025-06-06 04:32:20'),(2,6,'2024-03-20 10:00:00','Khám tổng quát cho chó','COMPLETED','2025-06-06 04:45:54','2025-06-06 04:46:28'),(3,6,'2024-03-20 10:00:00','Khám tổng quát cho chó','CANCELED','2025-06-06 09:41:06','2025-06-06 14:38:44'),(4,6,'2024-03-20 10:00:00','Khám tổng quát cho chó','CANCELED','2025-06-06 11:05:23','2025-06-06 11:05:45'),(5,8,'2024-03-20 10:00:00','Khám tổng quát cho chó','CANCELED','2025-06-06 14:45:46','2025-06-06 14:46:39'),(6,8,'2025-06-20 10:00:00','Khám tổng quát cho chó','PENDING','2025-06-06 16:25:17','2025-06-06 16:25:17');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (1,'Việc đưa thú cưng đi spa không chỉ giúp chúng sạch sẽ và thơm tho hơn mà còn giúp phát hiện sớm các vấn đề về da, ký sinh trùng hoặc bệnh lý tiềm ẩn. Ngoài ra, quá trình spa còn là cách để thú cưng thư giãn, giảm căng thẳng, đặc biệt với những thú cưng có tính cách nhạy cảm hoặc hay lo lắng. Việc chăm sóc đều đặn cũng giúp lông da khỏe mạnh và hạn chế rụng lông trong nhà.','2025-06-01 21:29:44.958300','Lợi ích khi cho thú cưng đi spa định kỳ','2025-06-01 21:29:44.958300'),(2,'Tần suất tắm cho chó phụ thuộc vào giống, độ dài lông và mức độ hoạt động. Tuy nhiên, một quy tắc chung là nên tắm cho chó từ 2 đến 4 tuần một lần. Nếu tắm quá thường xuyên, da chó có thể bị khô và dễ kích ứng. Ngoài ra, việc sử dụng sữa tắm chuyên dụng dành cho chó là điều bắt buộc để bảo vệ lớp dầu tự nhiên trên da chúng.','2025-06-01 21:29:53.764368','Bao lâu nên đưa chó đi tắm một lần?','2025-06-01 21:29:53.764368'),(3,'Cắt móng chân là việc cần thiết để tránh cho mèo gây ra vết xước khi chơi đùa hoặc vô tình làm đau người. Ngoài ra, móng dài cũng có thể khiến mèo gặp khó khăn khi di chuyển hoặc bị gãy móng gây đau đớn. Việc cắt móng đúng cách và đúng tần suất (khoảng 2-3 tuần/lần) giúp mèo luôn thoải mái và khỏe mạnh.','2025-06-01 21:30:00.754524','Cắt móng chân cho mèo có cần thiết không?','2025-06-01 21:30:00.754524'),(4,'Thời điểm lý tưởng để triệt sản cho chó thường là sau 6 tháng tuổi, trước khi chó có biểu hiện động dục đầu tiên. Triệt sản không chỉ giúp tránh mang thai ngoài ý muốn mà còn có tác dụng phòng tránh các bệnh lý như viêm tử cung, ung thư vú ở chó cái hoặc ung thư tuyến tiền liệt ở chó đực. Hãy tham khảo bác sĩ thú y để chọn thời điểm phù hợp nhất.','2025-06-01 21:30:06.087662','Khi nào nên cho chó triệt sản?','2025-06-01 21:30:06.087662'),(5,'Mèo lông dài như mèo Ba Tư cần được chải lông hằng ngày để tránh tình trạng rối lông và hình thành búi lông trong dạ dày khi liếm lông. Ngoài ra, nên sử dụng lược chuyên dụng và sản phẩm làm mềm lông nếu cần. Việc tắm định kỳ (2–3 tháng/lần) với sữa tắm dịu nhẹ và kiểm tra ve rận cũng rất quan trọng để duy trì bộ lông khỏe mạnh, óng mượt cho mèo.','2025-06-01 21:30:11.420435','Cách chăm sóc lông cho mèo lông dài','2025-06-01 21:30:11.420435'),(6,'Một spa tốt cho thú cưng cần có không gian sạch sẽ, dụng cụ vệ sinh được khử trùng thường xuyên và nhân viên có kiến thức chăm sóc động vật. Chủ nuôi nên ưu tiên các spa cho phép giám sát quá trình chăm sóc, sử dụng sản phẩm an toàn và có quy trình tiếp nhận – trả thú cưng rõ ràng. Đừng quên đọc đánh giá từ khách hàng cũ để có cái nhìn thực tế nhất.','2025-06-01 21:30:17.615302','Lưu ý khi chọn spa cho thú cưng','2025-06-01 21:30:17.615302'),(7,'Tắm khô là giải pháp tiện lợi cho những chú chó sợ nước hoặc trong những ngày thời tiết lạnh. Tuy nhiên, tắm khô không nên thay thế hoàn toàn việc tắm bằng nước. Chỉ nên sử dụng khi cần thiết và chọn sản phẩm tắm khô uy tín, không chứa hóa chất độc hại. Việc chải lông kỹ sau khi tắm khô cũng rất quan trọng để loại bỏ bụi bẩn còn sót lại.','2025-06-01 21:30:22.455067','Tắm khô cho chó có hiệu quả không?','2025-06-01 21:30:22.455067'),(8,'Việc xổ giun định kỳ 3–6 tháng/lần là cực kỳ quan trọng để bảo vệ sức khỏe cho cả thú cưng lẫn người trong gia đình. Giun sán có thể gây tiêu chảy, sụt cân, chậm phát triển và trong trường hợp nặng có thể dẫn đến tử vong. Hãy sử dụng thuốc được khuyến nghị bởi bác sĩ thú y và theo dõi phản ứng sau khi uống thuốc để xử lý kịp thời nếu có tác dụng phụ.','2025-06-01 21:30:29.066597','Xổ giun định kỳ cho chó mèo','2025-06-01 21:30:29.066597'),(9,'Nhiều spa thú cưng hiện nay cung cấp dịch vụ massage chuyên nghiệp giúp thú cưng thư giãn, lưu thông máu tốt hơn và cải thiện sức khỏe tổng thể. Massage đặc biệt có lợi với các thú cưng lớn tuổi, ít vận động hoặc có biểu hiện căng thẳng. Tuy nhiên, cần chọn spa có nhân viên được đào tạo để đảm bảo an toàn trong quá trình thực hiện.','2025-06-01 21:30:34.304920','Spa thú cưng có dịch vụ massage không?','2025-06-01 21:30:34.304920'),(10,'Nếu bạn thấy thú cưng thường xuyên gãi, rụng lông bất thường, lông bết dính, có mùi khó chịu hoặc xuất hiện mảng đỏ trên da, đó có thể là dấu hiệu cảnh báo vấn đề về da. Việc đưa thú cưng đi spa kịp thời giúp làm sạch da, loại bỏ vi khuẩn, ve rận và ngăn chặn tình trạng trở nên nghiêm trọng hơn.','2025-06-01 21:30:40.862330','Dấu hiệu thú cưng cần được chăm sóc da lông','2025-06-01 21:30:40.862330'),(11,'Nhuộm lông cho thú cưng đang trở thành xu hướng ở một số nơi, tuy nhiên bạn cần cực kỳ cẩn trọng. Không phải loại thuốc nhuộm nào cũng an toàn với da và sức khỏe thú cưng. Hãy ưu tiên những sản phẩm chuyên dụng, không chứa amoniac hoặc chất tẩy mạnh. Tốt nhất nên hỏi ý kiến bác sĩ thú y trước khi thực hiện để đảm bảo an toàn tuyệt đối.','2025-06-01 21:30:45.441147','Có nên nhuộm lông cho thú cưng?','2025-06-01 21:30:45.441147'),(12,'Nhuộm lông cho thú cưng đang trở thành xu hướng ở một số nơi, tuy nhiên bạn cần cực kỳ cẩn trọng. Không phải loại thuốc nhuộm nào cũng an toàn với da và sức khỏe thú cưng. Hãy ưu tiên những sản phẩm chuyên dụng, không chứa amoniac hoặc chất tẩy mạnh. Tốt nhất nên hỏi ý kiến bác sĩ thú y trước khi thực hiện để đảm bảo an toàn tuyệt đối.','2025-06-06 04:14:18.740234','Có nên nhuộm lông cho thú cưng?','2025-06-06 04:14:18.740234');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `added_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (3,8,1,0,'2025-06-06 15:23:13');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chats`
--

DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `message` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `receiver_id` int NOT NULL,
  `sender_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6dbye15iemw6gjqt0q4q06nf1` (`receiver_id`),
  KEY `FKla7peq6fislsxok7a4wxv5p36` (`sender_id`),
  CONSTRAINT `FK6dbye15iemw6gjqt0q4q06nf1` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKla7peq6fislsxok7a4wxv5p36` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats`
--

LOCK TABLES `chats` WRITE;
/*!40000 ALTER TABLE `chats` DISABLE KEYS */;
/*!40000 ALTER TABLE `chats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'sdffđg','123','dfgdfg','invalid-email','dfg','gfdg','PENDING','2025-06-05 21:19:51','2025-06-06 22:25:40');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` int NOT NULL,
  `subtotal` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,10,350000,3500000),(2,2,1,110,350000,38500000);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_price` int NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,8,3500000,'COMPLETED','2025-06-06 07:25:39','2025-06-06 10:50:00','Số 1, Đường ABC','0123456789'),(2,8,38500000,'PENDING','2025-06-06 15:22:34','2025-06-06 15:22:34','Số 1, Đường ABC','0123456789');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pets`
--

DROP TABLE IF EXISTS `pets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `species` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `breed` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `sex` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `image_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `pets_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pets`
--

LOCK TABLES `pets` WRITE;
/*!40000 ALTER TABLE `pets` DISABLE KEYS */;
INSERT INTO `pets` VALUES (1,3,'Milo','Dog','Poodle','2022-01-01','Male','2025-06-01 18:53:32','pet_1.png',_binary '\0','2025-06-06 13:00:35'),(2,4,'Fluffy','Cat','Persian','2020-01-01','Female','2025-06-01 18:57:50','pet_2.png',_binary '\0','2025-06-06 13:00:35'),(3,5,'Max','Dog','Golden Retriever','2019-05-10','Male','2025-06-01 19:03:16','pet_3.png',_binary '\0','2025-06-06 13:00:35'),(4,6,'Mimi','Cat','Scottish Fold','2021-08-15','Female','2025-06-01 19:06:40','pet_4.png',_binary '\0','2025-06-06 13:00:35'),(5,7,'Ben','Dog','Beagle','2022-03-20','Male','2025-06-01 19:10:34','pet_5.png',_binary '\0','2025-06-06 13:00:35'),(6,8,'Luna','Cat','Bengal','2020-11-02','Female','2025-06-01 19:14:28','pet_6.png',_binary '\0','2025-06-06 13:00:35'),(7,8,'LunaSIU','Cat','Bengal','2020-11-02','Female','2025-06-06 08:04:47','pet_7.png',_binary '','2025-06-06 13:00:35'),(8,8,'LunaSIUyrt','Cat','Bengal','2020-11-02','Female','2025-06-06 14:45:24','pet_8.png',_binary '','2025-06-06 13:00:35'),(9,8,'LunaSIUyrt','Cat','Bengal','2020-11-02','Female','2025-06-06 20:26:08','pet_9.png',_binary '\0','2025-06-06 13:26:08');
/*!40000 ALTER TABLE `pets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` int NOT NULL,
  `stock` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Thức ăn hạt cho chó lớn','Thức ăn hạt dinh dưỡng cho chó trưởng thành',350000,0,'2025-06-01 14:52:52','2025-06-06 16:09:37','product_1.png','thức ăn',_binary '\0'),(2,'Thức ăn hạt cho mèo con','Thức ăn hạt giàu dinh dưỡng cho mèo con',280000,80,'2025-06-01 14:55:20','2025-06-06 16:09:37','product_2.png','thức ăn',_binary '\0'),(3,'Thức ăn ướt cho chó nhỏ','Thức ăn ướt thơm ngon, dễ tiêu cho chó nhỏ',50000,150,'2025-06-01 14:59:58','2025-06-06 16:09:37','product_3.png','thức ăn',_binary '\0'),(4,'Thức ăn hạt dinh dưỡng cho mèo lớn','Thức ăn hạt giúp mèo duy trì vóc dáng khỏe mạnh',320000,90,'2025-06-01 15:02:25','2025-06-06 16:09:37','product_4.png','thức ăn',_binary '\0'),(5,'Thức ăn cho chó con vị gà','Thức ăn cho chó con, vị gà thơm ngon',300000,100,'2025-06-01 15:03:15','2025-06-06 16:09:37','product_5.png','thức ăn',_binary '\0'),(6,'Thức ăn hỗn hợp cho thú cưng','Thức ăn hỗn hợp cung cấp đầy đủ dưỡng chất',400000,70,'2025-06-01 15:06:26','2025-06-06 16:09:37','product_6.png','thức ăn',_binary '\0'),(7,'Thức ăn hạt dinh dưỡng cho thú cưng lớn','Hạt dinh dưỡng giúp thú cưng khỏe mạnh và năng động',360000,60,'2025-06-01 15:07:08','2025-06-06 16:09:37','product_7.png','thức ăn',_binary '\0'),(8,'Thức ăn hạt vị cá cho chó','Thức ăn hạt vị cá thơm ngon cho chó',330000,110,'2025-06-01 15:10:28','2025-06-06 16:09:37','product_8.png','thức ăn',_binary '\0'),(9,'Thức ăn cho mèo bị dị ứng','Thức ăn đặc biệt dành cho mèo bị dị ứng',380000,50,'2025-06-01 15:13:43','2025-06-06 16:09:37','product_9.png','thức ăn',_binary '\0'),(10,'Thức ăn cho thú cưng ốm yếu','Thức ăn bổ dưỡng giúp thú cưng nhanh hồi phục',410000,40,'2025-06-01 15:16:51','2025-06-06 16:09:37','product_10.png','thức ăn',_binary '\0'),(11,'Vòng cổ cho chó','Vòng cổ chống cắn, bền và đẹp',120000,150,'2025-06-01 15:21:04','2025-06-06 16:09:37','product_11.png','phụ kiện thú cưng',_binary '\0'),(12,'Dây dắt chó','Dây dắt chắc chắn, có tay cầm êm',180000,130,'2025-06-01 15:22:14','2025-06-06 16:09:37','product_12.png','phụ kiện thú cưng',_binary '\0'),(13,'Bát ăn inox cho mèo','Bát inox chống rỉ, dễ vệ sinh',90000,200,'2025-06-01 15:25:33','2025-06-06 16:09:37','product_13.png','phụ kiện thú cưng',_binary '\0'),(14,'Đồ chơi bóng cho chó','Bóng cao su bền, an toàn cho thú cưng',70000,180,'2025-06-01 15:25:48','2025-06-06 16:09:37','product_14.png','phụ kiện thú cưng',_binary '\0'),(15,'Áo cho chó nhỏ','Áo len giữ ấm cho chó nhỏ',220000,90,'2025-06-01 15:30:20','2025-06-06 16:09:37','product_15.png','phụ kiện thú cưng',_binary '\0'),(16,'Balo vận chuyển thú cưng','Balo tiện lợi, thoáng khí, an toàn',450000,60,'2025-06-01 15:33:20','2025-06-06 16:09:37','product_16.png','phụ kiện thú cưng',_binary '\0'),(17,'Giường ngủ cho mèo','Giường mềm mại, giữ ấm cho mèo',350000,80,'2025-06-01 15:34:47','2025-06-06 16:09:37','product_17.png','phụ kiện thú cưng',_binary '\0'),(18,'Lược chải lông','Lược mềm mại giúp chải lông sạch sẽ',60000,220,'2025-06-01 15:36:30','2025-06-06 16:09:37','product_18.png','phụ kiện thú cưng',_binary '\0'),(19,'Chuông cổ cho mèo','Chuông nhỏ gắn trên vòng cổ mèo',40000,160,'2025-06-01 15:38:23','2025-06-06 16:09:37','product_19.png','phụ kiện thú cưng',_binary '\0'),(20,'Mũ che nắng cho chó','Mũ thời trang chống nắng cho chó',130000,110,'2025-06-01 15:42:48','2025-06-06 16:09:37','product_20.png','phụ kiện thú cưng',_binary '\0'),(21,'Sữa tắm thảo dược cho chó','Sữa tắm nhẹ dịu, giúp da khỏe mạnh',180000,140,'2025-06-01 15:44:06','2025-06-06 16:09:37','product_21.png','sữa tắm',_binary '\0'),(22,'Sữa tắm trị ve cho mèo','Sữa tắm diệt ve và bọ chét cho mèo',220000,120,'2025-06-01 15:47:09','2025-06-06 16:09:37','product_22.png','sữa tắm',_binary '\0'),(23,'Sữa tắm khử mùi cho chó','Giúp loại bỏ mùi hôi hiệu quả',190000,100,'2025-06-01 15:48:54','2025-06-06 16:09:37','product_23.png','sữa tắm',_binary '\0'),(24,'Sữa tắm dưỡng ẩm cho thú cưng','Giữ ẩm và làm mềm lông cho thú cưng',200000,110,'2025-06-01 15:49:36','2025-06-06 16:09:37','product_24.png','sữa tắm',_binary '\0'),(25,'Sữa tắm bạc hà cho mèo','Giúp thú cưng thơm mát, sạch sẽ',210000,90,'2025-06-01 15:52:45','2025-06-06 16:09:37','product_25.png','sữa tắm',_binary '\0'),(26,'Sữa tắm chống rụng lông','Giảm rụng lông, tăng độ bóng mượt',230000,80,'2025-06-01 15:53:28','2025-06-06 16:09:37','product_26.png','sữa tắm',_binary '\0'),(27,'Sữa tắm thảo mộc cho thú cưng','Làm sạch nhẹ nhàng, không gây kích ứng',170000,130,'2025-06-01 15:54:52','2025-06-06 16:09:37','product_27.png','sữa tắm',_binary '\0'),(28,'Sữa tắm diệt khuẩn','Bảo vệ da thú cưng khỏi vi khuẩn gây hại',250000,70,'2025-06-01 15:56:40','2025-06-06 16:09:37','product_28.png','sữa tắm',_binary '\0'),(29,'Sữa tắm cho thú cưng nhạy cảm','Công thức nhẹ nhàng, phù hợp da nhạy cảm',260000,60,'2025-06-01 15:57:47','2025-06-06 16:09:37','product_29.png','sữa tắm',_binary '\0'),(30,'Sữa tắm hương hoa anh đào','Mùi thơm dễ chịu, giữ lông mềm mại',240000,85,'2025-06-01 15:59:43','2025-06-06 16:09:37','product_30.png','sữa tắm',_binary '\0'),(31,'Chuồng lồng sắt cho chó nhỏ','Chuồng sắt chắc chắn, dễ vệ sinh',1200000,30,'2025-06-01 16:02:04','2025-06-06 16:09:37','product_31.png','chuồng lồng nuôi nhốt',_binary '\0'),(32,'Lồng vận chuyển thú cưng','Lồng nhỏ gọn, tiện lợi khi đi du lịch',850000,50,'2025-06-01 16:04:41','2025-06-06 16:09:37','product_32.png','chuồng lồng nuôi nhốt',_binary '\0'),(33,'Chuồng lồng inox cho thú cưng','Chuồng inox bền, dễ vệ sinh',1500000,25,'2025-06-01 16:06:31','2025-06-06 16:09:37','product_33.png','chuồng lồng nuôi nhốt',_binary '\0'),(34,'Chuồng nhựa cho mèo','Chuồng nhựa nhẹ, thoáng khí cho mèo',900000,40,'2025-06-01 16:28:08','2025-06-06 16:09:37','product_34.png','chuồng lồng nuôi nhốt',_binary '\0'),(35,'Chuồng sắt lắp ráp cho chó','Chuồng dễ lắp ráp, chắc chắn',1300000,35,'2025-06-01 16:45:03','2025-06-06 16:09:37','product_35.png','chuồng lồng nuôi nhốt',_binary '\0'),(36,'Chuồng lồng có bánh xe','Dễ di chuyển, phù hợp thú cưng lớn',1800000,20,'2025-06-01 16:45:38','2025-06-06 16:09:37','product_36.png','chuồng lồng nuôi nhốt',_binary '\0'),(37,'Chuồng lồng gỗ cho thú cưng','Chuồng gỗ tự nhiên, an toàn cho thú cưng',1700000,15,'2025-06-01 17:03:05','2025-06-06 16:09:37','product_37.png','chuồng lồng nuôi nhốt',_binary '\0'),(38,'Chuồng lồng di động','Chuồng nhẹ, dễ di chuyển cho thú cưng',1400000,27,'2025-06-01 17:09:13','2025-06-06 16:09:37','product_38.png','chuồng lồng nuôi nhốt',_binary '\0'),(39,'Chuồng nhựa cao cấp cho mèo','Chuồng nhựa cao cấp, thoáng mát',1100000,22,'2025-06-01 17:09:27','2025-06-06 16:09:37','product_39.png','chuồng lồng nuôi nhốt',_binary '\0'),(40,'Chuồng sắt chống gỉ','Chuồng sắt sơn tĩnh điện chống gỉ',1250000,30,'2025-06-01 17:19:10','2025-06-06 16:09:37','product_40.png','chuồng lồng nuôi nhốt',_binary '\0'),(41,'Thuốc trị ve chó','Thuốc diệt ve hiệu quả cho chó',200000,100,'2025-06-01 17:20:27','2025-06-06 16:09:37','product_41.png','thuốc',_binary '\0'),(42,'Thuốc chống ký sinh trùng','Thuốc ngăn ngừa ký sinh trùng cho thú cưng',280000,90,'2025-06-01 17:23:22','2025-06-06 16:09:37','product_42.png','thuốc',_binary '\0'),(43,'Thuốc kháng sinh cho mèo','Thuốc kháng sinh điều trị nhiễm khuẩn cho mèo',350000,70,'2025-06-01 17:25:40','2025-06-06 16:09:37','product_43.png','thuốc',_binary '\0'),(44,'Thuốc tiêu hóa cho thú cưng','Giúp thú cưng tiêu hóa tốt hơn',150000,120,'2025-06-01 17:28:59','2025-06-06 16:09:37','product_44.png','thuốc',_binary '\0'),(45,'Thuốc bổ gan cho chó','Hỗ trợ chức năng gan cho chó',320000,60,'2025-06-01 17:29:39','2025-06-06 16:09:37','product_45.png','thuốc',_binary '\0'),(46,'Thuốc giảm đau cho mèo','Thuốc giảm đau và viêm cho mèo',300000,55,'2025-06-01 17:32:04','2025-06-06 16:09:37','product_46.png','thuốc',_binary '\0'),(47,'Thuốc bổ xương khớp','Hỗ trợ sức khỏe xương khớp cho thú cưng',400000,40,'2025-06-01 17:33:53','2025-06-06 16:09:37','product_47.png','thuốc',_binary '\0'),(48,'Thuốc tiêm phòng dại','Thuốc tiêm phòng bệnh dại cho chó mèo',500000,35,'2025-06-01 17:34:39','2025-06-06 16:09:37','product_48.png','thuốc',_binary '\0'),(49,'Thuốc bổ mắt','Bảo vệ và cải thiện thị lực cho thú cưng',270000,50,'2025-06-01 17:36:26','2025-06-06 16:09:37','product_49.png','thuốc',_binary '\0'),(50,'Thuốc bổ sức đề kháng','Tăng cường sức đề kháng cho thú cưng',350000,45,'2025-06-01 17:38:25','2025-06-06 16:09:37','product_50.png','thuốc',_binary '\0');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (3,'admin'),(2,'doctor'),(1,'owner');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_reviews`
--

DROP TABLE IF EXISTS `service_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `service_id` int NOT NULL,
  `appointment_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_review_user` (`user_id`),
  KEY `fk_review_service` (`service_id`),
  KEY `fk_review_appointment` (`appointment_id`),
  CONSTRAINT `fk_review_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`),
  CONSTRAINT `fk_review_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_reviews`
--

LOCK TABLES `service_reviews` WRITE;
/*!40000 ALTER TABLE `service_reviews` DISABLE KEYS */;
INSERT INTO `service_reviews` VALUES (1,8,1,1,5,'Dịch vụ rất tốt!','2025-06-05 21:34:49','2025-06-05 21:34:49'),(2,8,1,2,5,'Dịch vụ rất tốt!','2025-06-05 21:46:56','2025-06-05 21:46:56');
/*!40000 ALTER TABLE `service_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` bit(1) DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Khám Test','Dịch vụ khám sức khỏe tổng quát cho thú cưng.',150000,'2025-06-01 14:35:37',_binary '\0','2025-06-06 19:06:35'),(2,'Xét nghiệm','Dịch vụ xét nghiệm chẩn đoán bệnh cho thú cưng.',250000,'2025-06-01 14:35:46',_binary '\0','2025-06-06 19:06:35'),(3,'Xổ giun','Dịch vụ xổ giun, giúp thú cưng loại bỏ ký sinh trùng đường ruột.',50000,'2025-06-01 14:35:57',_binary '\0','2025-06-06 19:06:35'),(4,'Tiêm vaccin','Dịch vụ tiêm phòng vaccin để bảo vệ thú cưng khỏi các bệnh truyền nhiễm.',200000,'2025-06-01 14:36:06',_binary '\0','2025-06-06 19:06:35'),(5,'Triệt sản','Dịch vụ triệt sản giúp kiểm soát sinh sản cho thú cưng.',400000,'2025-06-01 14:36:13',_binary '\0','2025-06-06 19:06:35'),(6,'Mổ đẻ','Dịch vụ mổ đẻ hỗ trợ thú cưng sinh con an toàn.',1500000,'2025-06-01 14:36:23',_binary '\0','2025-06-06 19:06:35'),(7,'Tắm rửa','Dịch vụ tắm rửa, làm sạch và chăm sóc lông cho thú cưng.',100000,'2025-06-01 14:36:32',_binary '\0','2025-06-06 19:06:35'),(8,'Phẫu thuật','Dịch vụ phẫu thuật điều trị các bệnh lý cho thú cưng.',500000,'2025-06-01 14:36:38',_binary '\0','2025-06-06 19:06:35');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role_id` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2a$10$aOXaLdzDRcnayMsF5Tc3GeYrlc8FGuGb7/tSkCmNNmAZGw/KWYRdi','Admin','admin@admin.com','0123456789','01 Ngô Mây, Quy Nhơn',3,1,'2025-06-01 14:28:06','2025-06-01 14:28:06'),(2,'doctor','$2a$10$Ocgogi495dbZHiwLyQ4NS.FyGIbnmbcUI74519hIgm7dSpCutODzO','Doctor','doctor@doctor.com','0123456788','01 Lê Lai, Quy Nhơn',2,1,'2025-06-01 14:28:50','2025-06-01 14:28:50'),(3,'user','$2a$10$v16WJrw5/qupwQttZNVT.eyQoKTDDmT1VC30pli7278W7M6D2kjLm','User','user@user.com','0123456787','01 Biên Cương, Quy Nhơn',1,1,'2025-06-01 14:29:27','2025-06-01 14:29:27'),(4,'phu','$2a$10$S75eoCVHAXyQADvzzp/fwe6Q9Yz0kjK97HQ.laV1BjSwLmhA6vQTa','Phu','phu@phu.com','0123456786','03 Diên Hồng, Quy Nhơn',1,1,'2025-06-01 18:55:33','2025-06-01 21:24:40'),(5,'nguyen','$2a$10$2/wRrelRUcnqurzDAK47e.a1c0KIG/Vn9C5Bu.5yw36lcyhP9VZIe','Nguyen','nguyen@nguyen.com','0123456785','49 Lữ Gia, Quy Nhơn',1,1,'2025-06-01 18:58:57','2025-06-01 18:58:57'),(6,'lam','$2a$10$yKJHzJfITIoqXAQV9Kgs0u1LEmsfdFjzZCJiu70p2I9/2C0um5p/y','Lam','lam@lam.com','0123456784','111 Nguyễn Thái Học, Quy Nhơn',1,1,'2025-06-01 19:04:29','2025-06-01 19:04:29'),(7,'quang','$2a$10$klKnvdoSIWtEUNrPgJWEFOMqaqqjiq208yzO93T5TdSqWjeIp.Dx.','Quang','quang@quang.com','0123456783','236 Hoàng Văn Thụ, Quy Nhơn',1,1,'2025-06-01 19:07:18','2025-06-01 19:07:18'),(8,'phong','$2a$10$pjHN8WUqPO0Qji3viVLZ/.aoMh8EYkYCZ1ktUQgTmhDDziWPnxMc2','Phong','phong@phong.com','0123456782','236 Hoàng Văn Thụ, Quy Nhơn',1,1,'2025-06-01 19:10:56','2025-06-01 19:10:56');
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

-- Dump completed on 2025-06-07  6:52:42
