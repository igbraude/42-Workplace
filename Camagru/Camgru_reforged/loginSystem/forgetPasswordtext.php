<?php

if(isset($_POST['username'])) {
        $username = $_POST['username'];
        include('../config/database-setup.php');

        $sQuery = "SELECT `user_id`, `username`, `password`, `email` FROM `user` WHERE `username` = ?";

        $stmt = $conn->prepare($sQuery);
        $stmt->execute([$username]);
        $result = $stmt->fetch(PDO::FETCH_BOTH);
        if ($result['username'] === $username) {
            $url = str_replace("forgetPasswordtext.php", "forgotPassword.php",$_SERVER['HTTP_REFERER']);
            $validAccount = 1;
            $to      = $result['username'] + "<" + $result['email'] + ">";
            $subject = 'Change Password';
            $message = '
            Click on the link to reset your password : 
            <br><a href="'. $url .'?username='.$result['username'].'&email='.$result['email'].'">change Password here</a>
            
            ';
                                
            $headers = 'From:noreply@Camagru.fr' . "\r\n";
            $headers = array("From: from@example.com",
    "Reply-To: replyto@example.com",
    "X-Mailer: PHP/" . PHP_VERSION
);
            $headers = "Content-type: text/html; charset=UTF-8";
            $validMail = mail($result['email'], $subject, $message, $headers);
            if (!$validMail) {
                echo "error";
            }
            else {
                echo "<script>alert('An email has been send')</script>";
            }
        }
        else {
            echo '<script>alert("this user does not exist")</script>';
        }
    }
?>
<!DOCTYPE html>
<head>

    <meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Camagru</title>

    <link rel="stylesheet" href="css/header-login-signup.css">
    <link rel="stylesheet" href="css/form-login.css">
	<link href='http://fonts.googleapis.com/css?family=Cookie' rel='stylesheet' type='text/css'>

</head>

<body>

<header class="header-login-signup">

<div class="header-limiter">

    <h1><a href="#">Camagru</a></h1>

    <ul>
        <li><a href="login.php">Sign in</a></li>
        <li><a href="register.php">Sign up</a></li>
    </ul>

</div>

</header>
<p>Please, enter your username to reset you password</p>
<form method="post" action="./forgetPasswordtext.php">
<input type="username" name="username" value="" required>
<button type="submit" action="" id="sendMail">Send Mail</button>
</form>
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
