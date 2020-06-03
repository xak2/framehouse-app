<?php

$login = $_GET['login'];
$password = $_GET['password'];

if ($login && $password) {

    $conn = new mysqli('mysqldb3.ehost-services.com', 'frame_xak2', 'stefan91', 'framehouse_housekeeper');
    $result = $conn->query("select * from users where login = '{$login}'");
    $user = $result->fetch_assoc();
    $conn->close();

    if ($login == $user['login'] && md5($password) == $user['password']) {
        $response['data'] = array(
            'id' => $user['id'],
            'name' => $user['name'],
            'type' => $user['type']
        );
    } else {
        $response['data'] = array(
            'error' => 'Wrong login or password. Please try again.'
        );
    }
}

echo json_encode($response);

?>