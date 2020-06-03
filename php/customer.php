<?php

header("Access-Control-Allow-Origin: *");
error_reporting(0);

$connect = new mysqli('mysqldb3.ehost-services.com', 'frame_xak2', 'stefan91', 'framehouse_housekeeper');

if ($_GET['id']) {
    $result = $connect->query("select * from customers where id = '{$_GET['id']}'");
    $response = $result->fetch_assoc();
    echo json_encode($response);
}

$connect->close();

?>