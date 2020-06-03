<?php

include '_config.php';
header("Access-Control-Allow-Origin: *");
error_reporting(0);

$connect = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_db);

if ($_GET['load']) {

    $result = $connect->query("select * from projects where id = '{$_GET['load']}'");
    $response = $result->fetch_assoc();
    echo json_encode($response);

} 

$connect->close();

?>