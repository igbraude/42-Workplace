<?php
include("./formPost/Post.showCommentaries.php");



dislike_data();
?>

<!DOCTYPE html>

<html>
<body>

<?php $like = getLike();  ?>
<p>like : <?php echo $like['like'];?></p>
<form method="get" class="dislikeForm">
<div id="likeNdislike">
<input type="hidden" id="imgPath" name="imgPath" value="<?php echo $_POST['imgPath']; ?>">
<input type="hidden" id="img_id" name="img_id" value="<?php echo $_POST['img_id']; ?>">
<button type="button" name="like" onclick="likeButton()">Like</button>
</div>
</form>


</body>
</html>