<?php

header("Access-Control-Allow-Origin: *");
$time = time();
include '_config.php';
$connect = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_db);

// Загрузка всех клиентов
if ($_GET['action'] == 'load') {

    $result = $connect->query("select * from customers where removed != 'true' order by name asc");
    while ($row = $result->fetch_assoc()) { $response[] = $row; }
    echo json_encode($response);

// Добавление нового клиента
} elseif ($_GET['action'] == 'add') {

    $data = json_decode(file_get_contents("php://input"), true);
    if ($_POST) {

        $result = $connect->query("select * from customers where name = '{$data['name']}' and removed != 'true'");
    
        if ($connect->connect_errno) { $response['error'][] = "MySQL connection error: (" . $connect->connect_errno . ") " . $connect->connect_error; }
        if (strlen($data['name']) < 8) { $response['error'][] = 'Name must be longer than 8 characters.'; }
        if (strlen($data['mail']) == 0) { $response['error'][] = 'Enter customer e-mail.'; }
        elseif (!filter_var($data['mail'], FILTER_VALIDATE_EMAIL)) { $response['error'][] = 'Invalid email format.'; }
        if ($result->num_rows >= 1) { $response['error'][] = "Customer {$data['name']} alredy exist."; }
    
        if (count($response['error']) == 0) {

            $result = $connect->query("insert into customers
                (name, mail, status, date_added, date_modified)
            values
                ('{$data['name']}', '{$data['mail']}', 'Just created', '{$time}', '{$time}')");

            $result = $connect->query("insert into activity
                (user_id, activity, icon, customer_id, timestamp)
            values
                ('{$data['user_id']}', 'has created customer', 'AddFriend', (SELECT MAX(id) FROM customers), '{$time}')");
                
            $response['success'] = true;
        }
    
        echo json_encode($response);
    
    }

// Удаление клиента
} elseif ($_GET['action'] == 'remove') {

    $data = json_decode(file_get_contents("php://input"), true);
    $result = $connect->query("select * from users where id = '{$data['user_id']}'");
    $result = $result->fetch_assoc();

    if ($connect->connect_errno) { $response['error'][] = "MySQL connection error: (" . $connect->connect_errno . ") " . $connect->connect_error; }
    if ($result['password'] != md5($data['password'])) { $response['error'][] = "The password is incorrect. Try again."; }
    if (count($response['error']) == 0) {
        $result = $connect->query("update customers set removed = 'true' where id = '{$data['customer']['customerId']}'");
        $result = $connect->query("insert into activity
            (user_id, activity, icon, customer_id, timestamp)
        values
            ('{$data['user_id']}', 'has removed customer', 'Delete', '{$data['customer']['customerId']}', '{$time}')");
        $response['success'] = true;
    }

    echo json_encode($response);
    
}

$connect->close();

?>