<?php
/*

    Formulaire Post : ref: ../register.php
        $_POST['signup'] ---> User pressed the signup button. Check if the inputs are not empty or if the username is already taken.
                            insert into the database the new user. He can now connect.

*/
session_start();
include('../function/userFunction.php');

$validAccount = 0;
if (isset($_POST['signUp'])) {
    if(empty($_POST['username']) || empty($_POST['email']) || empty($_POST['newPassword'])) {
        echo "Please fill up all the required field.";
    }

    else if (checkUsername() == FALSE) {
        echo "This username already exists.";
    }

    else if(!(preg_match('/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/', $_POST['newPassword']))) {
        echo "Password not strong enough.";
    } 
    else {
        $fullName = $_POST['username'];
        $email = $_POST['email'];
        $password = $_POST['newPassword'];
        $hash = password_hash($password, PASSWORD_DEFAULT);
        include('../config/database-setup.php');

        $sQuery = "SELECT `user_id`, `username`, `password` FROM `user` WHERE email = ?";
        $iQuery = "INSERT INTO `user` (username, email, `password`, `active`) value (?, ?, ?, ?)";

        $stmt = $conn->prepare($sQuery);
        $stmt->execute([$email]);
        $result = $stmt->fetch(PDO::FETCH_BOTH);
        if ($result['username'] == $fullName) {
            echo "<script> alert('This user already exists') </script>";
        }
        else {
        $stmt = $conn->prepare($iQuery);
        $stmt->execute(
            array(
                $fullName,
                $email,
                $hash,
                "N"
            )
        );
            $url = str_replace("register.php", "verifyEmail.php",$_SERVER['HTTP_REFERER']);
            $validAccount = 1;
            $to      = $fullName + "<" + $email + ">"; // Send email to our user
            $subject = 'Signup | Verification'; // Give the email a subject
            $message = '
            
            Thanks for signing up!
            Your account has been created, you can login with the following credentials after you have activated your account by pressing the url below.
            <br>
            <br>------------------------
            <br>Username: '.$fullName.'
            <br>Password: '.$password.'
            <br>------------------------
            <br>
            <br>Please click this link to activate your account:
            <br><a href="'. $url .'?username='.$fullName.'&hash='.$hash.'">Valid Account here</a>
            
            '; // Our message above including the link
                                
            $headers = 'From:noreply@Camagru.fr' . "\r\n"; // Set from headers
            //echo $to . "\n" . $subject . "\n" . $message . "\n" . $fullName . "\n" . $password . "\n" . $email . "\n" . $hash . "\n" . $headers;
            $headers = array("From: from@example.com",
    "Reply-To: replyto@example.com",
    "X-Mailer: PHP/" . PHP_VERSION
);
            $headers = "Content-type: text/html; charset=UTF-8";
            $validMail = mail($email, $subject, $message, $headers);
    }
}

 }
?>