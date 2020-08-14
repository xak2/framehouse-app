<?php

header("Access-Control-Allow-Origin: *");
error_reporting(0);

include '_config.php';

$connect = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_db);

if ($_GET['load']) {

    $result = $connect->query("select * from projects where customer_id = '{$_GET['load']}'");
    while ($row = $result->fetch_assoc()) {
        $response[] = $row;
    }
    echo json_encode($response);

} 

if ($_GET['action'] == 'create') {
    
    $data = json_decode(file_get_contents("php://input"), true);

    if (strlen($data['name']) < 5 || strlen($data['designation']) > 30) {
        $response['error'][] = 'Project name must be from 5 to 30 chars.';
    }

    if (strlen($data['designation']) < 2 || strlen($data['designation']) > 4) {
        $response['error'][] = 'Designation must be from 2 to 4 chars.';
    }

    if (count($response['error']) == 0) {
        $time = time();
        $result = $connect->query("insert into projects (customer_id, name, designation, date_added, date_modified) values ('{$data['cid']}', '{$data['name']}', '{$data['designation']}', '{$time}', '{$time}')");
        $result = $connect->query("insert into activity
            (user_id, activity, icon, customer_id, timestamp)
        values
            ('{$data['user_id']}', 'has created project', 'NewTeamProject', '{$data['cid']}', '{$time}')");
        $response['success'] = true;
    }

    echo json_encode($response);

}

$connect->close();

?>