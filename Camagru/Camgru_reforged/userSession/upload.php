<?php

include("./formPost/Post.upload.php");

if (isset($_FILES['fileToUpload'])) {
    if ($_FILES['fileToUpload']['error'] != 0) {
        header ("location: takePicture.php");
    }
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

<title>User Dropdown Header</title>

<link rel="stylesheet" href="css/demo.css">
<link rel="stylesheet" href="css/header-user-dropdown.css">
<link href='http://fonts.googleapis.com/css?family=Cookie' rel='stylesheet' type='text/css'>


</head>

<body>

<header class="header-user-dropdown">

<div class="header-limiter">
    <h1><a href="./session.php">Camagru</a></h1>

    <nav>
        <a href="./showImages.php?page=1">My Gallery</a>
        <a href="./showImagesPublic.php?page=1">Public Gallery</a>
        <a href="./takePicture.php">Take Picture</a>
        <a href="./setting.php">Settings</a>
        <input type="hidden" name="logout" value="">
        <a href="./logout.php">Logout</a>

    </nav>
</div>

</header>


<?php if (isset($_POST['selectedImage'])) {?>
    <form class="newPic" action="takePicture.php" enctype="multipart/form-data" method="post">
         <input type=hidden name="imagePath" value="<?php echo $_POST['uploadedImage'] ?>">
         <input type="hidden" name="addImage" value="addImage">
         <img width="500px" height="500px" src="<?php echo $_POST['uploadedImage'] ?>" alt="cadre">
         <a href="#" class="addPicture">Add image</a>
    </form>

<script>
    (() => {
    const initElement = element => {
        element = element.querySelector('.addPicture')
        element.addEventListener("click", (event) => {
        event.preventDefault()
        document.querySelector(".newPic").submit();
        })
    }
    Array.from(document.querySelectorAll('.newPic'))
            .forEach(initElement)
    })()
</script>

<?php } ?>

<form class="img" enctype="multipart/form-data" method="post">
    Click on the montage you prefer
      <div class="montageImage">
        <input type="hidden" name="selectedImage" value="">
         <a href="#" class="imageMontage"><img width="50px" height="50px" src="../imageMontage/image/cadre.png" alt="cadre"></a>
         <a href="#" class="imageMontage"><img width="50px" height="50px" src="../imageMontage/image/camera.png" alt="cadre"></a>
         <a href="#" class="imageMontage"><img width="50px" height="50px" src="../imageMontage/image/cigarette.png" alt="cadre"></a>
         <a href="#" class="imageMontage"><img width="50px" height="50px" src="../imageMontage/image/down.png" alt="cadre"></a>
         <a href="#" class="imageMontage"><img width="50px" height="50px" src="../imageMontage/image/hat.png" alt="cadre"></a>
         <a href="#" class="imageMontage"><img width="50px" height="50px" src="../imageMontage/image/load.png" alt="cadre"></a>
         <a href="#" class="imageMontage"><img width="50px" height="50px" src="../imageMontage/image/up.png" alt="cadre"></a>
      </div>
</form>

<br>

<?php if ($uploadOk == 0) { ?>
<form class="upload" action="upload.php" method="post" enctype="multipart/form-data">
    Select image to upload:
    <input type="submit" value="UploadImage" name="submit" value="">
    <input type="file" name="fileToUpload" id="fileToUpload" accept="image/jpeg" value="">
</form>
<?php } ?>

<script type="text/javascript">

image = document.getElementsByClassName("imageMontage")
for (var i = 0; i < image.length; i++) {
        image[i].addEventListener('click', function(event) {
        event.preventDefault()
        document.querySelector('input[name="selectedImage"]').value = event.target.getAttribute("src")
        document.querySelector(".img").submit()
    }, false)
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