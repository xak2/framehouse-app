<?php

include '_config.php';

$login = $_GET['login'];
$password = $_GET['password'];

if ($login && $password) {

    $connect = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_db);
    $result = $connect->query("select * from users where login = '{$login}'");
    $user = $result->fetch_assoc();
    $connect->close();

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