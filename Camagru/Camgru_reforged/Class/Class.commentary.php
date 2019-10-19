<?php

class Commentary {
    /* 
            DOC ==>

        This class commentary is made to SEARCH, INSERT, UPGRADE, DELETE or DISPLAY commentaries in database.
        A commentary text can't be null or edit null.
        magic function --> 
                        __construct commentary we need :
                                         - commentaries text
                                         - the client username
                                         - the image id because commentaries are unique
        
                        __toString convert a object attribut into string.

        public function -->
                         addInDatabase :
                                         - Insert a new commentary in the database `Camagru`, in the table `commentary`
                         displayCommentary :
                                         - Display all the commentaries of the image.
                                         - Create a delete and edit button for the user.
                                         - For the user, create a formulaire POST with 2 input, the delete and edit action and the commentary new text. 
    */

// variables of commentary tables columns
public $id;
public $username;
public $dataTime;
public $image_id;
public $text;

// array
public $table_var = array("commentary_id", "username", "message", "dataTime", "image_id");

//table name
public $table = "commentary";

public function __construct ($message, $username, $img_id, $id = null) {
    $this->text = $message;
    $this->username = $username;
    $this->dateTime = date("Y-m-d H:i:s");
    $this->image_id = $img_id;
    $this->id = $id;
}

public function __toString() {
    return($this->text);
}

// Add commentary

public function addInDatabase() {
    include("../config/database-setup.php");
    $query = sprintf( "INSERT INTO commentary (username, date_comm, image_id, `message`)
    VALUES ('%s', '%s', '%d', '%s')", $this->username, $this->dateTime, $this->image_id, $this->text);
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $this->id = $conn->lastInsertId();
}

// Upgrade commentary

public function upgradeCommentary() {
    include("../config/database-setup.php");
    $query = sprintf("UPDATE `commentary` SET `message`='%s' WHERE commentary_id=%d",$_POST['content'], $_POST['id']);
    $stmt = $conn->prepare($query);
    $stmt->execute();
}

// Delete commentary ne sert a rien pour l'instant dans class commentaire, util->showCommentary.php

public function deleteCommentary() {
    if (isset($_POST['deleteCommentary'])) {
        include("../config/database-setup.php");
        $query = sprintf("DELETE FROM `commentary` WHERE `commentary_id`=%d", $_POST['deleteCommentary']);
        $stmt = $conn->prepare($query);
        $stmt->execute();
    }
}

public function displayCommentaries() {
    include("../config/database-setup.php");

    }
}