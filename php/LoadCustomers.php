<?php

header("Access-Control-Allow-Origin: *");

$connect = new mysqli('mysqldb3.ehost-services.com', 'frame_xak2', 'stefan91', 'framehouse_housekeeper');
$result = $connect->query("select * from customers where removed != 'true' order by name asc");

while ($row = $result->fetch_assoc()) {
    $response[] = $row;
}

$connect->close();

echo json_encode($response);

?>