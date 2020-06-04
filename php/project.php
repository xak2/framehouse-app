<?php

include '_config.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
date_default_timezone_set('Europe/Riga');
//error_reporting(0);

$connect = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_db);

if ($_GET['load']) {

    $result = $connect->query("select * from projects where id = '{$_GET['load']}'");
    $response = $result->fetch_assoc();
    $result = $connect->query("select * from project_groups where project_id = '{$_GET['load']}'");

    $i = 0;
    $c = 0;
    while ($row_group = $result->fetch_assoc()) {

        $result_walls = $connect->query("select *, count(*) as count from project_walls where group_id = '{$row_group['id']}'");
        $count_walls = $result_walls->fetch_assoc();

        $response['groups'][$i] = $row_group;
        $response['groups'][$i]['key'] = $row_group['id'];
        $response['groups'][$i]['startIndex'] = $c;
        $response['groups'][$i]['count'] = $count_walls['count'];

        $result_walls = $connect->query("select * from project_walls where group_id = '{$row_group['id']}'");
        while ($row_wall = $result_walls->fetch_assoc()) {
            $response['items'][] = $row_wall;
        }

        $c = $c+$count_walls['count'];
        $i++;

    }

    $response['tmp'] = $tmp_wall;
    echo json_encode($response);

} elseif ($_GET['import']) {

    // $_FILES (file)
    $file = $_FILES['file'];
    // $_POST (name, pid)

    $file_ext = strtolower(end(explode('.', $file['name'])));

    if ($file_ext == 'asc') {

        $source = file_get_contents($file['tmp_name']);
        $source = explode("\n", $source);

        if (strlen($_POST['name']) < 5) {
            $response['error'][] = 'Group name must be from 5 to 30 chars.';
        }
        
        if (count($source) < 2) {
            $response['error'][] = 'Something wrong with this file.';
        }

        if (empty(end($source))) {
            array_pop($source);
        }

        foreach ($source as $row) {
            $row = preg_replace('/\s+/', '', $row);
            $row = explode(';', $row);

            if ($row[0] == 1) {
                $keys = $row;
            } else {
                $new_row = array();
                for ($i = 1; $i < count($row); $i++) {
                    $new_row[strtolower($keys[$i])] = $row[$i]; 
                }
                $rows[] = array_filter($new_row);
                unset($new_row);
            }
        }

        if (count($response['error']) == 0) {
            $time = time();
            $result = $connect->query("insert into project_groups (id, project_id, name, position) values ('{$uid}', '{$_POST['pid']}', '{$_POST['name']}', '{$time}')");
            $id = $connect->query("select MAX(id) as last from project_groups");
            $id = $id->fetch_assoc();
            foreach ($rows as $entry) {
                $result = $connect->query("insert into project_walls (group_id, designation, ano, grossa, height, length, neta, width) values ('{$id['last']}', '{$entry['designation']}', '{$entry['ano']}', '{$entry['grossa']}', '{$entry['height']}', '{$entry['length']}', '{$entry['neta']}', '{$entry['width']}')");
            }
            $response['success'] = true;
        }
    }
    echo json_encode($response);
}

$connect->close();

?>