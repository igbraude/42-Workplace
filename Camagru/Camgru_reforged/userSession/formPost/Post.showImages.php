<?php
/*

    Formulaire Post : ref : ../showImages.php

    $_POST['action'] ---> action delete on an image. input from ../showImages.php

    $_GET['logout'] --> user logout 
*/

session_start();
include("../config/database-setup.php");
include("../Class/Class.image.php");

if (isset($_POST['action']) && $_POST['action'] == "delete") {
    $query = sprintf("DELETE FROM `image` WHERE `image_id`=%d", $_POST['img_id']);
    $stmt = $conn->prepare($query);
    $stmt->execute();
}


if (isset($_GET['logout'])) {
    header("location: logout.php");
}
?>