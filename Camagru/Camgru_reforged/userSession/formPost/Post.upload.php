<?php 
/*

    Formulaire Post ref: ../upload.php

        $_POST['submit'] ---> to check if the file is an image.jpeg else it redirect user to takePicture.php. input from ../takePicture.php.

        $_POST['selectedImage'] ---> $_POST['uploadedImage'] ---> was the uploadedImage image base64.
               -> to create the montage, the user clicked on an image. input from ../uploads.php 

        $_GET['logout'] --> user logout
*/

session_start();
include("../Class/Class.image.php");
include("../config/database-setup.php");
include("../function/imageFunction.php");

$uploadOk = 0;

if (isset($_POST['submit'])) {
    $target_dir = "../imageMontage/uploads/";
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    if($imageFileType != "jpg" && $imageFileType != "jpeg") {
        echo "Sorry, only JPG, JPEG files are allowed.";
        $uploadOk = 0;
        header("location: takePicture.php");
    }
else {
    if(isset($_POST["submit"])) {
        $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
        if($check !== false) {
            $uploadOk = 1;
            move_uploaded_file($_FILES['fileToUpload']['tmp_name'], '../imageMontage/uploads/' . basename($_FILES['fileToUpload']['name']));
        } else {
                $uploadOk = 0;
                header("location: takePicture.php");
            }
        } 
    }
}

if(isset($_POST['submit']) && $uploadOk == 1) {
    $dst = imagecreatefromjpeg('../imageMontage/uploads/' .basename($_FILES["fileToUpload"]["name"]));
    $src = resize_imagejpeg('../imageMontage/uploads/' .basename($_FILES["fileToUpload"]["name"]), 500, 500);
    imagejpeg($dst, "../imageMontage/uploads/imageMontage2.jpg");
    $info = exif_imagetype("../imageMontage/uploads/imageMontage2.jpg");
}

if(isset($_POST['selectedImage'])) {
    $dst = imagecreatefromjpeg("../imageMontage/uploads/imageMontage2.jpg");
    $src = imagecreatefrompng($_POST['selectedImage']);
    $dst = resize_imagejpeg("../imageMontage/uploads/imageMontage2.jpg", 500, 500);
    if ($_POST['selectedImage'] == "../imageMontage/image/cigarette.png") {
        $src = resize_image($_POST['selectedImage'], 150, 150);
        $min_x = 250;
        $min_y = 150;
    }
    else if ($_POST['selectedImage'] == "../imageMontage/image/cadre.png") {
        $src = resize_image($_POST['selectedImage'], 480, 430);
        $min_x = 12;
        $min_y = 75;
    }
    else if ($_POST['selectedImage'] == "../imageMontage/image/camera.png") {
        $src = resize_image($_POST['selectedImage'], 150, 150);
        $min_x = 350;
        $min_y = 350;
    }
    else if ($_POST['selectedImage'] == "../imageMontage/image/down.png") {
        $src = resize_image($_POST['selectedImage'], 150, 150);
        $min_x = 350;
        $min_y = 350;
    }
    else if ($_POST['selectedImage'] == "../imageMontage/image/up.png") {
        $src = resize_image($_POST['selectedImage'], 150, 150);
        $min_x = 350;
        $min_y = 350;
    }
    else if ($_POST['selectedImage'] == "../imageMontage/image/hat.png") {
        $src = resize_image($_POST['selectedImage'], 200, 200);
        $min_x = 150;
        $min_y = 350;
    }
    else if ($_POST['selectedImage'] == "../imageMontage/image/load.png") {
        $src = resize_image($_POST['selectedImage'], 150, 150);
        $min_x = 350;
        $min_y = 350;
    }
    else {
        $src = resize_image($_POST['selectedImage'], 350, 350);
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
    imagejpeg($dst, "../imageMontage/uploads/imageMontage.jpg");
    $_POST['uploadedImage'] = base64Image("../imageMontage/uploads/imageMontage.jpg");
}


if (isset($_GET['logout'])) {
    header("location: logout.php");
}
?>