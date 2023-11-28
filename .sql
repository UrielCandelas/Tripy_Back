/* INSERT INTO cat_transport (transport, createdAt, updatedAt) VALUES
  ('Automóvil', NOW(), NOW()),
  ('Autobús', NOW(), NOW()),
  ('Avión', NOW(), NOW()),
  ('Barco', NOW(), NOW()),
  ('Ninguno', NOW(), NOW()); */

/*drop database tripy_db;*/
create database if not exists tripy_db;
use tripy_db;
  
select * from travels;
select * from cat_transport;
select * from users;
select * from det_extras;
select * from cat_locations;
select * from chat_messages;
select * from det_activities;
select * from det_expenses;
select * from locations_comments;
select * from travel_requests;
select * from user_comments;
CREATE TABLE `users` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `email` char(40) NOT NULL,
  `name` char(20) NOT NULL,
  `lastName` char(20) NOT NULL,
  `secondLastName` char(20) NOT NULL,
  `userName` char(15) UNIQUE NOT NULL,
  `password` char(65) NOT NULL,
  `rate` decimal,
  `isAdmin` boolean NOT NULL DEFAULT false,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL
);

CREATE TABLE `cat_locations` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `location_name` char(20) NOT NULL,
  `location` char(50) NOT NULL,
  `description` char(125) NOT NULL,
  `rate` decimal,
  `cost` decimal NOT NULL,
  `schedule` char(20),
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL
);

CREATE TABLE `user_comments` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `comentary_text` char(50) NOT NULL,
  `rate` decimal NOT NULL,
  `id_userComented` int NOT NULL,
  `id_userComent` int NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL
);

CREATE TABLE `travels` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_user1` int NOT NULL,
  `id_user2` int,
  `id_location` int NOT NULL,
  `travel_date` date NOT NULL,
  `id_transportation` int NOT NULL,
  `id_expenses` int,
  `id_extras` int,
  `companions` int NOT NULL,
  `isActive` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL
);

CREATE TABLE `det_activities` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_travel` int NOT NULL,
  `activity` char(30) NOT NULL,
  `expenses` decimal NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL
);

CREATE TABLE `travel_requests` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_user1` int NOT NULL,
  `id_user2` int NOT NULL,
  `id_travel` int NOT NULL,
  `isActive` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL
);

CREATE TABLE `chat_messages` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_user1` int NOT NULL,
  `id_user2` int NOT NULL,
  `message` char(255) NOT NULL,
  `room` char(50) NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL
);

CREATE TABLE `det_extras` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `extra_commentary` char(125) NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL
);

CREATE TABLE `cat_transport` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `transport` char(10) NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL
);

CREATE TABLE `det_expenses` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_user1` int NOT NULL,
  `id_user2` int,
  `id_travel` int,
  `expense` char(20) NOT NULL,
  `quantity` decimal NOT NULL,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL
);

ALTER TABLE `user_comments` ADD FOREIGN KEY (`id_userComented`) REFERENCES `users` (`id`);

ALTER TABLE `user_comments` ADD FOREIGN KEY (`id_userComent`) REFERENCES `users` (`id`);

ALTER TABLE `travels` ADD FOREIGN KEY (`id_user1`) REFERENCES `users` (`id`);

ALTER TABLE `travels` ADD FOREIGN KEY (`id_user2`) REFERENCES `users` (`id`);

ALTER TABLE `travels` ADD FOREIGN KEY (`id_location`) REFERENCES `cat_locations` (`id`);

ALTER TABLE `travels` ADD FOREIGN KEY (`id_transportation`) REFERENCES `cat_transport` (`id`);

ALTER TABLE `travels` ADD FOREIGN KEY (`id_expenses`) REFERENCES `det_expenses` (`id`);

ALTER TABLE `travels` ADD FOREIGN KEY (`id_extras`) REFERENCES `det_extras` (`id`);

ALTER TABLE `det_activities` ADD FOREIGN KEY (`id_travel`) REFERENCES `travels` (`id`);

ALTER TABLE `travel_requests` ADD FOREIGN KEY (`id_user1`) REFERENCES `users` (`id`);

ALTER TABLE `travel_requests` ADD FOREIGN KEY (`id_user2`) REFERENCES `users` (`id`);

ALTER TABLE `travel_requests` ADD FOREIGN KEY (`id_travel`) REFERENCES `travels` (`id`);

ALTER TABLE `chat_messages` ADD FOREIGN KEY (`id_user1`) REFERENCES `users` (`id`);

ALTER TABLE `chat_messages` ADD FOREIGN KEY (`id_user2`) REFERENCES `users` (`id`);

ALTER TABLE `det_expenses` ADD FOREIGN KEY (`id_user1`) REFERENCES `users` (`id`);

ALTER TABLE `det_expenses` ADD FOREIGN KEY (`id_user2`) REFERENCES `users` (`id`);

ALTER TABLE `det_expenses` ADD FOREIGN KEY (`id_travel`) REFERENCES `travels` (`id`);