<?php

    function user_like() {
        include("../config/database-setup.php");
        $likeObject = [];
        $query = sprintf("SELECT * FROM `likeDislike` WHERE `image_id` = %d AND `username` = '%s'", $_POST['img_id'], $_SESSION['username']);
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_BOTH);
        if ($result == FALSE) {
            return(FALSE);
        }
        else {
            return(TRUE);
        }
    }

    function getLike() {
        global $conn;
        $likeObject = [];
        $query = sprintf("SELECT `like`, `dislike` FROM `image` WHERE `image_id`=%d", $_POST['img_id']);
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $like = $stmt->fetch(PDO::FETCH_BOTH);
        return($like);
    }

    function like_data() {
        include("../config/database-setup.php");
        $likeObject = [];
        $query = sprintf("INSERT INTO `likeDislike`(`image_id`, `username`, `like`, `dislike`)
        VALUE (%d, '%s', 'Y', 'N')", $_POST['img_id'], $_SESSION['username']);
        $stmt = $conn->prepare($query);
        $stmt->execute();
    }

    function dislike_data() {
        include("../config/database-setup.php");
        $likeObject = [];
        $query = sprintf("DELETE FROM `likeDislike` WHERE `image_id`= %d AND `username` = '%s'", $_POST['img_id'], $_SESSION['username']);
        $stmt = $conn->prepare($query);
        $stmt->execute();
    }

?>