<?php

header("Access-Control-Allow-Origin: *");

$data = json_decode(file_get_contents("php://input"), true);

if ($_POST) {
    
    $connect = new mysqli('mysqldb3.ehost-services.com', 'frame_xak2', 'stefan91', 'framehouse_housekeeper');
    $result = $connect->query("select * from users where id = '{$data['user_id']}'");
    $result = $result->fetch_assoc();

    if ($connect->connect_errno) {
        $response['error'][] = "MySQL connection error: (" . $connect->connect_errno . ") " . $connect->connect_error;
    }
    if ($result['password'] != md5($data['password'])) {
        $response['error'][] = "The password is incorrect. Try again.";
    }
    
    if (count($response['error']) == 0) {
        for($i = 0; $i < count($data['customer']); $i++) {
            $result = $connect->query("update customers set removed = 'true' where id = '{$data['customer'][$i][0]}'");
        }
        $response['success'] = true;
    }

    $connect->close();

    echo json_encode($response);

}

?>