<?php
session_start ();
header('location: takePicture.php');
include('../config/database-setup.php');

if (isset($_GET['logout'])) {
    header("location: logout.php");
}

if (isset($_GET['takeNewPicture'])) {
    header("location: takePicture.php");
}
if (!isset($_SESSION['username'])) {
  header('location: ../showImagesPublic.php');
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">

    <title>Camagru</title>
    <head>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>User Dropdown Header</title>

<link rel="stylesheet" href="css/header-user-dropdown.css">
<link href='http://fonts.googleapis.com/css?family=Cookie' rel='stylesheet' type='text/css'>


</head>

<body>

<header class="header-user-dropdown">

<div class="header-limiter">
    <h1><a href="./session.php">Camagru</a></h1>

    <nav>
        <a href="./showImages.php?page=1">My Gallery</a>
        <a href="./showImagesPublic.php?page=1">Public Gallery</a>
        <a href="./takePicture.php">Take Picture</a>
        <a href="./setting.php">Settings</a>
        <input type="hidden" name="logout" value="">
        <a href="./logout.php">Logout</a>

    </nav>
</div>

</header>
</body>
<footer style="background-color:#292c2f;color: white;" class="page-footer font-small blue pt-4">
  <div class="container-fluid text-center text-md-left">
    <div class="row">
      <div class="col-md-6 mt-md-0 mt-3">
        <h5 class="text-uppercase">Camagru</h5>
        <p>Share and stock picture</p>
      </div>
      <hr class="clearfix w-100 d-md-none pb-3">
      <div class="col-md-3 mb-md-0 mb-3">
      </div>
  <div class="footer-copyright text-center py-3">© 2018 Copyright: Camagru
  </div>
</footer>
</html>