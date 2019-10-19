CREATE DATABASE IF NOT EXISTS `Camagru`;
USE `Camagru`;

CREATE TABLE IF NOT EXISTS `user` (
    `user_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(80) NOT NULL,
    `email` VARCHAR(80) NOT NULL,
    `password` VARCHAR(80) NOT NULL,
    `active` ENUM('N', 'Y')
);

CREATE TABLE IF NOT EXISTS `image`(
    `image_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(80) NOT NULL,
    `date_img` DATETIME NOT NULL,
    `like` INT NOT NULL,
    `dislike` INT NOT NULL,
    `path` LONGBLOB NOT NULL,
    `private` ENUM('N', 'Y')
);

CREATE TABLE IF NOT EXISTS `commentary` (
    `commentary_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(80) NOT NULL,
    `date_comm` DATETIME NOT NULL,
    `image_id` INT NOT NULL,
    `message` TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS `likeDislike`(
	`image_id` INT NOT NULL,
    `username` VARCHAR(80),
    `like` ENUM('N', 'Y'),
    `dislike` ENUM('N', 'Y')
);

----> trigger for likes
CREATE TRIGGER `like` AFTER INSERT
   ON `likeDislike` FOR EACH ROW
   UPDATE `image`
   SET `image`.`like` = `image`.`like` + 1
   WHERE `image_id`= NEW.`image_id`;

---> trigger on dislike
CREATE TRIGGER `unlike` AFTER DELETE
   ON `likeDislike` FOR EACH ROW
   UPDATE `image`
   SET `image`.`like` = `image`.`like` - 1
   WHERE `image_id`= OLD.`image_id`;


--------------------------------------------------------------------------------------------


DELETE FROM `likeDislike` WHERE `image_id`= 33;
---> Delete triiger
DROP TRIGGER `like`;

---> check
UPDATE `likeDislike` SET `like`="N" WHERE `image_id`="3";
---> insert
INSERT INTO `likeDislike`(`image_id`, `username`, `like`, `dislike`)
VALUE (3, "check", "Y", "N");


---> Good select to see if the photo is liked
SELECT * FROM `likeDislike` AS l
INNER JOIN `image` AS i
ON i.`image_id`= l.`image_id` AND l.`image_id` = 3 AND l.`username`="root";
--->select
SELECT `image`.`image_id`, `image`.`username` FROM `image` INNER JOIN `likeDislike`
WHERE `image`.`image_id` = `likeDislike`.`image_id`
AND `image`.`username` = `likeDislike`.`username`;

SELECT `image`.`image_id`, `image`.`username`, `likeDislike`.`like`, `likeDislike`.`dislike`
FROM `image` INNER JOIN `likeDislike`
ON `image`.`image_id`=`likeDislike`.`image_id` AND `image`.`username`=`likeDislike`.`username`;

SELECT `likeDislike`.`image_id`, `image`.`username`, `likeDislike`.`like`, `likeDislike`.`dislike`
FROM `image` INNER JOIN `likeDislike`
ON `image`.`username`=`likeDislike`.`username`;