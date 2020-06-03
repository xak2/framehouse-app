<?php

header("Access-Control-Allow-Origin: *");

error_reporting(0);

$data = json_decode(file_get_contents("php://input"), true);

if ($_POST) {

    $connect = new mysqli('mysqldb3.ehost-services.com', 'frame_xak2', 'stefan91', 'framehouse_housekeeper');
    $result = $connect->query("select * from customers where name = '{$data['name']}' and removed != 'true'");

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
    if ($result->num_rows >= 1) {
        $response['error'][] = "Customer {$data['name']} alredy exist.";
    }

    if (count($response['error']) == 0) {
        $time = time();
        $result = $connect->query("insert into customers (name, mail, status, date_added, date_modified) values ('{$data['name']}', '{$data['mail']}', 'Just created', '{$time}', '{$time}')");
        $response['success'] = true;
    }

    $connect->close();

    echo json_encode($response);

}

?>