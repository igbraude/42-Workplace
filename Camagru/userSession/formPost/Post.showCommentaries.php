<?php

/*
    Formulaire Post ref: ../showCommentaries.php

     $_POST['postCommentary'] --->
                    - to create new object input ../showCommentaries.php when pressing Post button.

     $_POST['action'] --->
                    - to update a commentary input ../../Class/Class.commentary.php in DisplayCommentary function when pressing edit Button.
                    - to delete a commentary input ../../Class/Class.commentary.php in DisplayCommentary function when pressing delete Button.
    

     This form needs a rework I don't think I should put this information in session maybe use the method GET instead.
     $_POST['img_id'] && $_POST['imgPath']--->
                    - to get the img_id and img_base64 input  ../../Class/Class.images in DisplayImages function when pressing an image.

     $_GET['logout'] --> user logout
*/

session_start();
include("../Class/Class.commentary.php");
include('../config/database-setup.php');

if(isset($_POST['postCommentary'])) {
    $com = new Commentary($_POST['commentaryField'], $_SESSION['username'], $_POST['img_id']);
    $com->addInDatabase();
    $com->sendMail();
}

if (isset($_POST['action']) && $_POST['action'] == "delete") {
    include("../config/database-setup.php");
    $query = sprintf("DELETE FROM `commentary` WHERE `commentary_id`=%d", $_POST['id']);
    $stmt = $conn->prepare($query);
    $stmt->execute();
}

if (isset($_POST['action']) && $_POST['action'] == "edit") {
    include("../config/database-setup.php");
    $content = $_POST['content'];
    $id = $_POST['id'];
    $query = "UPDATE `commentary` SET `message`= ? WHERE commentary_id= ?";
    $stmt = $conn->prepare($query);
    $stmt->execute(array($content, $id));
} 

if (isset($_GET['logout'])) {
    header("location: logout.php");
}
?>