<?php

header("Access-Control-Allow-Origin: *");
error_reporting(0);

include '_config.php';

$connect = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_db);

if ($_GET['id']) {
    $result = $connect->query("select * from customers where id = '{$_GET['id']}'");
    $response = $result->fetch_assoc();
    echo json_encode($response);
}

$connect->close();

?>