<?php
session_start(); //Start session
include('../function/imageFunction.php');

delete_historique();
// Destroy all sessions
if(session_destroy()) {
    header("location: ../index.php"); // Redirecting to login page
}

?>