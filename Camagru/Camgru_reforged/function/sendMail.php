<?php

function activeAccount() {
    $to      = $email; // Send email to our user
    $subject = 'Signup | Verification'; // Give the email a subject 
    $message = '
    
    Thanks for signing up!
    Your account has been created, you can login with the following credentials after you have activated your account by pressing the url below.
    
    ------------------------
    Username: '.$fullName.'
    ------------------------
    
    Please click this link to activate your account:
    localhost:8008/Archive/Camagru/Camagru/Camgru_reforged/loginSystem/verifyEmail.php?username='.$fullName.'&hash='.$hash.'
    
    '; // Our message above including the link
                        
    $headers = 'From:noreply@Camagru.fr' . "\r\n"; // Set from headers
    //echo $to . "\n" . $subject . "\n" . $message . "\n" . $fullName . "\n" . $password . "\n" . $email . "\n" . $hash . "\n" . $headers;
    $validMail = mail($email, $subject, $message, $headers);
    if ($validMail = TRUE) {
        echo "check mail !!";}
    else {
        echo "fail mail";
    }
}

function forgotPassword() {
    $to      = $email; // Send email to our user
    $subject = 'Signup | Verification'; // Give the email a subject 
    $message = '
    
    Click an the link to change your password.
    ------------------------
    Username: '.$fullName.'
    ------------------------
    
    Please click this link to change your password:
    localhost:8008/Archive/Camagru/Camagru/Camgru_reforged/loginSystem/forgotPassword.php?username='.$fullName.'&hash='.$hash.'
    
    '; // Our message above including the link
                        
    $headers = 'From:noreply@Camagru.fr' . "\r\n"; // Set from headers
    //echo $to . "\n" . $subject . "\n" . $message . "\n" . $fullName . "\n" . $password . "\n" . $email . "\n" . $hash . "\n" . $headers;
    $validMail = mail($email, $subject, $message, $headers);
    if ($validMail = TRUE) {
        echo "check mail !!";}
    else {
        echo "fail mail";
    }
    
}

?>