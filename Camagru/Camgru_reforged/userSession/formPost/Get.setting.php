<?php

/*
    Formulaire Get : ref: ../setting.php

     This formulaire is made to change setting.
     User can change his password, email, username.
     Variable $_GET are here to check if the user has the right input to change it.

     $_GET['logout'] --> user logout

*/
session_start();
include("../config/database-setup.php");

$query = sprintf('SELECT * FROM `user` WHERE `username`="%s"', $_SESSION['username']);
$stmt = $conn->prepare($query);
$stmt->execute();
$search = $stmt->fetch(PDO::FETCH_OBJ);

if (isset($_GET['oldPassword'])) {
    if (password_verify($_GET['oldPassword'], $search->password)) {
        // here change Password
        include("../config/database-setup.php");
        echo '<script> alert("Your Password has been change") </script>';
        $query = sprintf('UPDATE `user` SET `password`="%s" WHERE `username`="%s"',password_hash($_GET['newPassword'], PASSWORD_DEFAULT), $_SESSION['username']);
        $stmt = $conn->prepare($query);
        $stmt->execute();
    }
    else {
        echo '<script> alert("Old password does not match") </script>';
    }
}

if (isset($_GET['newUsername'])) {
    include("../config/database-setup.php");
    $query = sprintf('SELECT * FROM `user` WHERE `username`="%s"', $_GET['newUsername']);
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $usernameCheck = $stmt->fetch(PDO::FETCH_OBJ);

    if ($usernameCheck == null) {
        // here change username
        $query = sprintf('UPDATE `user` SET `username`="%s" WHERE `username`="%s"',$_GET['newUsername'], $_SESSION['username']);
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $_SESSION['username'] = $_GET['newUsername'];
    }
    else {
        echo '<script> alert("This username is already taken") </script>';
    }

}

if (isset($_GET['changeEmail'])) {
    //here change mail
    include("../config/database-setup.php");
    $query = sprintf('UPDATE `user` SET `email`="%s" WHERE `username`="%s"',$_GET['newEmail'], $_SESSION['username']);
    $stmt = $conn->prepare($query);
    $stmt->execute();
}

if (isset($_GET['logout'])) {
    header("location: logout.php");
}
?>