<?php

function checkUsername() {
    include("../config/database-setup.php");
    $query = sprintf("SELECT `username` FROM `user` WHERE `username`= '%s'", $_POST['username']);
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_BOTH);
    if ($result) {
        return FALSE;
    }
    else {
        return TRUE;
    }
}

?>