<?php
if (isset($_GET['username']) && isset($_GET['verifAcc'])) {
    include("../config/database-setup.php");
    $query = sprintf('UPDATE `user` SET `active` = "Y" WHERE `username` = "%s"', $_GET['username']);
    $stmt = $conn->prepare($query);
    $stmt->execute();
    header('location: ./login.php');
}
if (!isset($_GET) || !isset($_GET['username']) && !isset($_GET['hash'])) {
    header('location: ./login.php');
}

?>
<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Camagru</title>

    <link rel="stylesheet" href="css/form-register.css">
	<link rel="stylesheet" href="css/header-login-signup.css">
	<link href='http://fonts.googleapis.com/css?family=Cookie' rel='stylesheet' type='text/css'>

</head>

<body>

<header class="header-login-signup">

<div class="header-limiter">

    <h1><a href="./login.php">Camagru</a></h1>

    <ul>
        <li><a href="./register.php">Register</a></li>
        <li><a href="login.php">Sign in</a></li>
    </ul>
</div>

</header>
<body>
<form method="get" action="./verifyEmail.php">
<p>Press the button to valid account !</p>
<input type="submit" action="./login.php" name="verifAcc" value="verifAccount">
<input type="hidden" name="username" value="<?php echo $_GET['username']; ?>">
</form>
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