<?php
session_start(); //Start session

// Destroy all sessions
if(session_destroy()) {
    header("location: ../index.php"); // Redirecting to login page
}

?>