<?php
include("../config/database-setup.php");
if (isset($_POST['newPassword']) && isset($_POST['confirmPassword']) && isset($_POST['username'])) {
        $username = $_POST['username'];
        $password = $_POST['newPassword'];
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $query = "UPDATE `user` SET `password` = ? WHERE `username` = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute(array($hash, $username));
}
if (isset($_GET['username']) && isset($_GET['email'])) {
?>

<!DOCTYPE html>
<html>
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

    <h1><a href="../index.php">Camagru</a></h1>

    <ul>
        <li><a href="login.php">Sign In</a></li>
        <li><a href="register.php">Sign up</a></li>
    </ul>

</div>

</header>
<body>

<form method="post" id="changePw" action="./forgotPassword.php" oninput="validatePassword()">
<p>New Password</p>
<input type="password" name="newPassword" value="" id="newPass" required>
<p>Confirm Password</p>
<input type="password" name="confirmPassword" value="" id="confirmPass" required>
<input type="hidden" name="username" value="<?php echo $_GET['username'] ?>">
<input type="submit" id="action" name="action" value="changePassword">
</form>
<script>


    elem = document.getElementById('action').addEventListener('click', (e) => {
        pw = document.getElementById('confirmPass').value
        e.preventDefault()
        const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
        if (!pw.match(mediumRegex)) {
            alert('Password not secured.')
        }
        else {
            document.getElementById('changePw').submit()
        }
    })
   

function validatePassword() {
                if(newPass.value != confirmPass.value) {
                    confirmPass.setCustomValidity('Password do not match.');
                }
                else {
                    confirmPass.setCustomValidity('');
                }
            }
</script>
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
<?php 
}
else {
    header("location: ../index.php");
}
?>