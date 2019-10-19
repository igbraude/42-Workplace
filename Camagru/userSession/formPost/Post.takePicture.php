<?php

/*
    Formulaire Post : ref: ../takePicture.php
    
     $_POST['selectedImage'] ---> to enable or disable the TakePicture button. User must choose first an image for the montage.

     $_POST['addImage'] --->  to create a new object input on ../takePicture.php when pressing takePicture button.

     $_POST['newPicture'] --->  $_POST['imgSelect'] --> user get access to this formulaire by clicking an image for the montage, input on ../takePicture.php
        -> to create a montage with the camera screenshot and an other image, in .jpeg image and encode it in base64 changing the $_POST['newPicture] into the new image(base64), input on ../takePicture.php after clicking the Take Picture button.

     $_GET['logout'] --> user logout


*/

session_start();
include("../Class/Class.image.php");
include("../config/database-setup.php");
include("../function/imageFunction.php");

if (isset($_POST['selectedImage'])) {
    $disabled = null;
}
else {
    $disabled = "disabled";
}

if(isset($_POST['addImage'])) {
    $img = new Images(0, $_SESSION['username'],$_POST['imagePath'], 0, 0, 'N');
    $img->addInDatabase();
}

if(isset($_POST['newPicture'])) {
    $dst = imagecreatefromjpeg($_POST['newPicture']);
    $src = imagecreatefrompng($_POST['imgSelect']);

    if ($_POST['imgSelect'] == "../imageMontage/image/cigarette.png") {
        $src = resize_image($_POST['imgSelect'], 150, 150);
        $min_x = 250;
        $min_y = 150;
    }
    else if ($_POST['imgSelect'] == "../imageMontage/image/cadre.png") {
        $src = resize_image($_POST['imgSelect'], 480, 430);
        $min_x = 12;
        $min_y = 75;
    }
    else if ($_POST['imgSelect'] == "../imageMontage/image/camera.png") {
        $src = resize_image($_POST['imgSelect'], 150, 150);
        $min_x = 350;
        $min_y = 350;
    }
    else if ($_POST['imgSelect'] == "../imageMontage/image/down.png") {
        $src = resize_image($_POST['imgSelect'], 150, 150);
        $min_x = 350;
        $min_y = 350;
    }
    else if ($_POST['imgSelect'] == "../imageMontage/image/up.png") {
        $src = resize_image($_POST['imgSelect'], 150, 150);
        $min_x = 350;
        $min_y = 350;
    }
    else if ($_POST['imgSelect'] == "../imageMontage/image/hat.png") {
        $src = resize_image($_POST['imgSelect'], 200, 200);
        $min_x = 150;
        $min_y = 350;
    }
    else if ($_POST['imgSelect'] == "../imageMontage/image/load.png") {
        $src = resize_image($_POST['imgSelect'], 150, 150);
        $min_x = 350;
        $min_y = 350;
    }
    else {
        $src = resize_image($_POST['imgSelect'], 350, 350);
        $min_x = 0;
        $min_y = 0;
    }

    $width_dst = imagesx($dst);
    $height_dst = imagesy($dst);
    $width_src = imagesx($src);
    $height_src = imagesy($src);
    $dst_x = $width_dst - $width_src;
    $dst_y =  $height_dst - $height_src;
    imagecopy($dst, $src, $dst_x - $min_x, $dst_y - $min_y, 0, 0, $width_src, $height_src);
    imagejpeg($dst, "../imageMontage/image/imageMontage.jpg");
    $info = exif_imagetype("../imageMontage/image/imageMontage.jpg");
    $_POST['newPicture'] = base64Image("../imageMontage/image/imageMontage.jpg");
    unlink("../imageMontage/image/imageMontage.jpg");
}

if (isset($_GET['logout'])) {
    header("location: logout.php");
}
?>