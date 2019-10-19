<?php

/*

    File showImagesPublic :
        Display public image of everyone.
        User can click on the image to see the commentary, like, dislike of the pointed one.

*/

session_start();

include('./Class/Class.image.php');
include('./config/database-setup.php');

if (!isset($_GET['page'])) {
    $_GET['page'] = 1;
}

function getImages() {
    global $conn;
    $imgObject = [];
    global $page;
    if (isset($_GET['page'])) {
        $page = intval($_GET['page']);
        if ($page <= 1) {
            $page = 1;
        }
    }

    $query = sprintf('SELECT * FROM `image` LIMIT 6 OFFSET '. (($page - 1) * 6));
    foreach($conn->query($query) as $row) {
        $img = new Images($row['image_id'], $row['username'], $row['path'], $row['like'], $row['dislike'], $row['private']);
        if ($imgObject == null) {
            $imgObject = array($img);
        }
        else  {
            array_push($imgObject, $img);
        }
    }
    return ($imgObject);
}


?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">

    <title>Camagru</title>
    <head>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">


<link rel="stylesheet" href="userSession/css/header-user-dropdown.css">
<link href='http://fonts.googleapis.com/css?family=Cookie' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">


</head>

<body>

<header class="header-user-dropdown">

<div class="header-limiter">
<h1><a href="#">Camagru</a></h1>
    <nav>
        <a href="./loginSystem/login.php">Login</a></li>
        <a href="./loginSystem/register.php">Sign up</a></li>
    </nav>
</div>

</header>

<div class="row">
<?php
$i = 0;
$listImages = getImages();

foreach($listImages as $img) {
    echo '<div class="col-sm-3">';
    $img->displayImagesNotLog();
    echo '</div>';
    $i++;
    if ($i % 3 == 0) {
        echo '<div class="w-100"></div>';
    }

}

?>
</div>

<?php if ($page > 1) { ?>
    <a href="#" id="prev" class="pagin">Prev</a>
<?php } ?>
    <p>Page <?php echo $_GET['page']?></p>
    <?php if (count($listImages) == 6) { ?>
    <a href="#" id="next" class="pagin">Next</a>
    <?php } ?>

</div>

<script>
   if ((paginN = document.getElementById("next")) !== null) {
        paginN.addEventListener("click", paginNext)
        function paginNext(event) {
            var pathName = window.location.pathname
            var newUrl = pathName + "?page=<?php echo intval($_GET['page']) + 1; ?>"
            console.log(newUrl);
            window.location.assign(newUrl)
        }
   }

   if ((paginP = document.getElementById("prev")) !== null) {
        paginP.addEventListener("click", paginPrev)
        function paginPrev(event) {
            var pathName = window.location.pathname
            var newUrl = pathName + "?page=<?php echo intval($_GET['page']) - 1; ?>"
            console.log(newUrl);
            window.location.assign(newUrl)
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