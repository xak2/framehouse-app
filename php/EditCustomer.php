<?php

header("Access-Control-Allow-Origin: *");

error_reporting(0);

$data = json_decode(file_get_contents("php://input"), true);

if ($_POST) {

    $connect = new mysqli('mysqldb3.ehost-services.com', 'frame_xak2', 'stefan91', 'framehouse_housekeeper');

    if ($connect->connect_errno) {
        $response['error'][] = "MySQL connection error: (" . $connect->connect_errno . ") " . $connect->connect_error;
    }
    if (strlen($data['name']) < 8) {
        $response['error'][] = 'Name must be longer than 8 characters.';
    }
    if (strlen($data['mail']) == 0) {
        $response['error'][] = 'Enter customer e-mail.';
    } elseif (!filter_var($data['mail'], FILTER_VALIDATE_EMAIL)) {
        $response['error'][] = 'Invalid email format.';
    }

    if (count($response['error']) == 0) {
        $time = time();
        $result = $connect->query("update customers set name = '{$data['name']}', mail = '{$data['mail']}'");
        $response['success'] = true;
    }

    $connect->close();

    echo json_encode($response);

}

?>