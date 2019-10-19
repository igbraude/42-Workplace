<?php
/*
    Formulaire Post : ref: ../login.php
        
        $_POST['signIn'] ---> user pressed the Sign in button. Check if the password match to the username. input from login.php

*/

session_start();
include("../config/database-setup.php");

if (isset($_POST['signIn'])) {
    if (empty($_POST['username']) || empty($_POST['password'])) {
         echo "Username and Password should not be empty";
    }
    else {
        $username = $_POST['username'];
        $password = $_POST['password'];
        include('../config/database-setup.php');
        $stmt = $conn->prepare("SELECT `user_id`, `username`, `password`, `active` FROM `user` WHERE `username` = ?");
        $stmt->execute([$username]);
        if ($result = $stmt->fetch(PDO::FETCH_OBJ)) {
            if (password_verify($password, $result->password) && $result->active == 'Y')
            {
                 $conn = NULL;
                 $_SESSION['username'] =  $username;
                header('location: ../userSession/session.php');
             }
             else if ($result->active == "N") {
                 echo "Account not verified, please check your mail.";
             }
             else {
                 echo "Username or Password not valid";
             }

        }
        else {
            echo "Username or Password not valid";
        }
    }
}
?>