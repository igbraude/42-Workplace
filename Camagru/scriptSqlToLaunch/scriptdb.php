<?php


 include('../config/database-setup.php');

try {
    
    $conn->exec('CREATE DATABASE IF NOT EXISTS `Camagru`;
    USE `Camagru`');

    $conn->exec("CREATE TABLE IF NOT EXISTS `user` (
        `user_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        `username` VARCHAR(80) NOT NULL,
        `email` VARCHAR(80) NOT NULL,
        `password` VARCHAR(80) NOT NULL,
        `active` ENUM('N', 'Y'),
        `notif` ENUM('N', 'Y') DEFAULT 'Y'
    )");

    $conn->exec("CREATE TABLE IF NOT EXISTS `image`(
        `image_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        `username` VARCHAR(80) NOT NULL,
        `date_img` DATETIME NOT NULL,
        `like` INT NOT NULL,
        `dislike` INT NOT NULL,
        `path` LONGBLOB NOT NULL,
        `private` ENUM('N', 'Y')
    )");

    $conn->exec('CREATE TABLE IF NOT EXISTS `commentary` (
        `commentary_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        `username` VARCHAR(80) NOT NULL,
        `date_comm` DATETIME NOT NULL,
        `image_id` INT NOT NULL,
        `message` TEXT NOT NULL
    )');


    $conn->exec("CREATE TABLE IF NOT EXISTS `likeDislike`(
        `image_id` INT NOT NULL,
        `username` VARCHAR(80),
        `like` ENUM('N', 'Y'),
        `dislike` ENUM('N', 'Y')
    )");

    $conn->exec("CREATE TABLE IF NOT EXISTS `historique` (
        `path` LONGBLOB NOT NULL,
        `username` VARCHAR(80) NOT NULL
    )");


    $conn->exec('CREATE TRIGGER `like` AFTER INSERT
    ON `likeDislike` FOR EACH ROW
    UPDATE `image`
    SET `image`.`like` = `image`.`like` + 1
    WHERE `image_id`= NEW.`image_id`');

    $conn->exec('CREATE TRIGGER `unlike` AFTER DELETE
    ON `likeDislike` FOR EACH ROW
    UPDATE `image`
    SET `image`.`like` = `image`.`like` - 1
    WHERE `image_id`= OLD.`image_id`');
} catch(Exception $e) {
}
header('location: ../showImagesPublic.php?page=1');