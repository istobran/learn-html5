<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding("UTF-8");
$files = $_FILES["files"];
$storage_path = "upload";
$len = count($files["name"]);
for ($i = 0; $i < $len; $i++) {
  if (is_uploaded_file($files["tmp_name"][$i])) {
    move_uploaded_file($files["tmp_name"][$i],
    "./upload/".mb_convert_encoding($files["name"][$i], "GBK", "UTF-8"));
  }
}
