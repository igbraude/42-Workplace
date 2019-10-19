<?php

/*
    File ShowCommentaries :
        Display the image pointed by the user.
        Create new object for a commentary of an image and display it (commentary), loop foreach commentary.
        User can create, edit, delete his own commentaries.
        User can like or dislike the picture.
*/

include("./formPost/Post.showCommentaries.php");
include("../function/databaseRequest.php");
function getCommentaries() {

    global $conn;
    $commentaryObject = [];

    $query = sprintf("SELECT * FROM `commentary` WHERE `image_id`=%d;", $_POST['img_id']);
    foreach($conn->query($query) as $row) {
        $com = new Commentary($row['message'], $row['username'], $row['image_id'], $row['commentary_id']);
        if ($commentaryObject == null) {
            $commentaryObject = array($com);
        }
        else  {
            array_push($commentaryObject, $com);
        }
    }
    return ($commentaryObject);
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

<a href="<?php if ($_POST['Gallery'] == "Public") { echo "./showImagesPublic.php?page=1";} else { echo "./showImages.php?page=1"; } ?>">Back to Gallery</a>
<img alt="img" src="<?php echo $_POST['imgPath'] ?>" width="200" height="200">

<div id="likeNdislike">
    <?php $like = getLike();  ?>
        <?php
        if (user_like() == FALSE) {
        ?>
        <div id="like">
            <p>like : <?php echo $like['like'];?></p>
            <input type="hidden" id="imgPath" name="imgPath" value="<?php echo $_POST['imgPath']; ?>">
            <input type="hidden" id="Gallery" name="Gallery" value="<?php echo $_POST['Gallery']; ?>">
            <input type="hidden" id="img_id" name="img_id" value="<?php echo $_POST['img_id']; ?>">
            <button type="button" onclick="likeButton()">Like</button>
            </div>
            </form>
    <?php } else { ?>
    
        <div id="dislike">
            <p>like : <?php echo $like['like'];?></p>
            <input type="hidden" id="imgPath" name="imgPath" value="<?php echo $_POST['imgPath']; ?>">
            <input type="hidden" id="Gallery" name="Gallery" value="<?php echo $_POST['Gallery']; ?>">
            <input type="hidden" id="img_id" name="img_id" value="<?php echo $_POST['img_id']; ?>">
            <button type="button" onclick="dislikeButton()">Dislike</button>
        </div>
    <?php } ?>
</div>


<form method="post">
        <input type="hidden" name="imgPath" value="<?php echo $_POST['imgPath']; ?>">
        <input type="hidden" name="Gallery" value="<?php echo $_POST['Gallery']; ?>">
        <input type="hidden" name="img_id" value="<?php echo $_POST['img_id']; ?>">
        <textarea rows="12" cols="60" name="commentaryField" id="commentaryField"></textarea>
       <button class="post" name="postCommentary" id="postCommentary">Post</button>
</form>

    <?php
        $listComment = getCommentaries();

        foreach($listComment as $comment) {

            $comment->displayCommentaries();
            if ($_SESSION['username'] == $comment->username) {
                ?>
                <form class="comment" method="post">
                <input type="hidden" name="id" value="<?php echo $comment->id;?>">
                <input type="hidden" name="action" value="">
                <div class="content"><p><?php echo $comment->text; ?></p>
                <input type="hidden" name="imgPath" value="<?php echo $_POST['imgPath']; ?>">
                <input type="hidden" name="Gallery" value="<?php echo $_POST['Gallery']; ?>">
                <input type="hidden" name="img_id" value="<?php echo $_POST['img_id']; ?>">
                <a href="#" class="comment-delete">delete</a>
                <a href="#" class="comment-edit">edit</a> 
                </div>
                </form>
                <?php
        }
        else {
            echo '<div class="contentOther"><p>'. $comment->text .'</p></div>';
        }
        echo "<br>";


    }
    ?>
<script>
    (() => {
        const initElement = element => {
            const content = element.querySelector('.content').innerHTML
            element.querySelector('.comment-delete').addEventListener('click', (event) => {
                event.preventDefault()
                element.querySelector('input[name="action"]').value = "delete"
                element.submit()
            })
            element.querySelector('.comment-edit').addEventListener('click', (event) => {
                event.preventDefault()
                element.querySelector('input[name="action"]').value = "edit"
                element.querySelector('.content').innerHTML = `
                    <div class="content">
                    <input type="hidden" name="imgPath" value="<?php echo $_POST['imgPath']; ?>">
                    <input type="hidden" name="Gallery" value="<?php echo $_POST['Gallery']; ?>">
                    <input type="hidden" name="img_id" value="<?php echo $_POST['img_id']; ?>">
                        <textarea name="content">${element.querySelector('.content > p').textContent}</textarea>
                        <button type="submit">Submit</button> | <a href="#" id="cancel">Cancel</a>
                    </div>
                `
                element.querySelector('#cancel').addEventListener('click', (event) => {
                    event.preventDefault()
                    element.querySelector('.content').innerHTML = content
                    initElement(element)
                })
            })
        }
        Array.from(document.querySelectorAll('.comment'))
            .forEach(initElement)
    })()
    
    function likeButton() {
        var data = new FormData()
        data.append("imgPath", document.getElementById("imgPath").value)
        data.append("img_id", document.getElementById("img_id").value)


        var xhttp = new XMLHttpRequest()

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("likeNdislike").innerHTML = this.responseText;
                //console.log(this.responseText)
            }
        }
        xhttp.open("POST", "likeButton.php", true)

        xhttp.send(data);
    }

    function dislikeButton() {
        var data = new FormData()
        data.append("imgPath", document.getElementById("imgPath").value)
        data.append("img_id", document.getElementById("img_id").value)

        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("likeNdislike").innerHTML = this.responseText;
               //console.log(this.responseText)
            }
        }
        xhttp.open("POST", "dislikeButton.php", true)

        xhttp.send(data);
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