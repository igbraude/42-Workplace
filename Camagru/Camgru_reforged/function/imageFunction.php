<?php
/*
        The 1st function (resize_image) is made to resize the .png image to make easier the montage,
            it take for argument, the file (path) his future width and height
        
        The 2nd function (resize_imagejpeg) is made for the upload image. It resize it into a 500px * 500px image,
            it's to make esier the stock of it else some image can be too big.

        The 3rd function (imageResize) is made for <html> balise to get a new width and height on <img> for exemple.
        
        The 4th function (base64Image) id made to encode the image, the path of the image is needed to make that.
*/

function resize_image($file, $w, $h, $crop=FALSE) {
    list($width, $height) = getimagesize($file);
    $r = $width / $height;
    if ($crop) {
        if ($width > $height) {
            $width = ceil($width-($width*abs($r-$w/$h)));
        } else {
            $height = ceil($height-($height*abs($r-$w/$h)));
        }
        $newwidth = $w;
        $newheight = $h;
    } else {
        if ($w/$h > $r) {
            $newwidth = $h*$r;
            $newheight = $h;
        } else {
            $newheight = $w/$r;
            $newwidth = $w;
        }
    }
    $src = imagecreatefrompng($file);
    $dst = imagecreatetruecolor($newwidth, $newheight);
    imagesavealpha($dst, true);

    $trans_colour = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefill($dst, 0, 0, $trans_colour);
    
    $red = imagecolorallocate($dst, 255, 0, 0);
    imagefilledellipse($dst, 500, 500, $newwidth, $newheight, $red);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
    return $dst;
}

/*

*/

function resize_imagejpeg($file, $w, $h, $crop=FALSE) {
    list($width, $height) = getimagesize($file);
    $r = $width / $height;
    if ($crop) {
        if ($width > $height) {
            $width = ceil($width-($width*abs($r-$w/$h)));
        } else {
            $height = ceil($height-($height*abs($r-$w/$h)));
        }
        $newwidth = $w;
        $newheight = $h;
    } else {
        if ($w/$h > $r) {
            $newwidth = 500;
            $newheight = 500;
        } else {
            $newheight = 500;
            $newwidth = 500;
        }
    }
    $src = imagecreatefromjpeg($file);
    $dst = imagecreatetruecolor($newwidth, $newheight);
    imagesavealpha($dst, true);

    $trans_colour = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefill($dst, 0, 0, $trans_colour);
    
    $red = imagecolorallocate($dst, 255, 0, 0);
    imagefilledellipse($dst, 500, 500, $newwidth, $newheight, $red);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
    return $dst;
}

/*

*/

function imageResize($width, $height, $target) {

    if ($width > $height) {
    $percentage = ($target / $width);
    }
    else {
    $percentage = ($target / $height);
    }
    $width = round($width * $percentage);
    $height = round($height * $percentage);
    return 'width="'. $width .'" height="' .$height .'"';
}

/*

*/

function base64Image($path) {
    $type = pathinfo($path, PATHINFO_EXTENSION);
    $data = file_get_contents($path);
    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
    return $base64;
}

?>