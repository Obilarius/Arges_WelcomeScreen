<?php


if (isset($_POST['url'])) {
  $url = $_POST['url'];
  if(file_exists($url) == TRUE) {
      $data = file_get_contents($url);
      echo $data;
  }
}



?>
