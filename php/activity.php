<?php

header("Access-Control-Allow-Origin: *");
$time = time();
include '_config.php';
$connect = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_db);

// Загрузка активности для клиента
if ($_GET['cid']) {

    $result = $connect->query("select
        activity.*,
        users.name as user_name,
        customers.name as customer_name
    from
        activity,
        users,
        customers
    where
        activity.customer_id = '{$_GET['cid']}'
        and users.id = activity.user_id
        and customers.id = activity.customer_id
    order by timestamp
    desc limit 5");
    while ($row = $result->fetch_assoc()) { $response[] = $row; }
    echo json_encode($response);

}

$connect->close();

?>