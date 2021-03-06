<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
date_default_timezone_set('Europe/Riga');
//error_reporting(0);

include '_config.php';

$connect = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_db);

if ($_GET['load']) {

    $result = $connect->query("select * from projects where id = '{$_GET['load']}'");
    $response = $result->fetch_assoc();
    $result = $connect->query("select * from project_groups where project_id = '{$_GET['load']}' order by type asc");

    $i = 0;
    $g = 0;
    $c = 0;
    while ($row_group = $result->fetch_assoc()) {

        if ($row_group['type'] == 'asc') {

            $result_walls = $connect->query("select *, count(*) as count from project_walls where group_id = '{$row_group['id']}'");
            $count = $result_walls->fetch_assoc();
    
            $response['groups'][$i] = $row_group;
            $response['groups'][$i]['key'] = $row_group['id'];
            $response['groups'][$i]['startIndex'] = $c;
            $response['groups'][$i]['count'] = $count['count'];
    
            $result_walls = $connect->query("select * from project_walls where group_id = '{$row_group['id']}'");
            while ($row_wall = $result_walls->fetch_assoc()) {
                $result_finished = $connect->query("SELECT *, SUM(quantity) AS count FROM `sawinglist` WHERE `name` LIKE '{$row_wall['designation']}{$row_wall['ano']}%'");
                $finished = $result_finished->fetch_assoc();
                $row_wall['finished'] = (!$finished['count'] ? 0 : $finished['count']);
                $row_wall['finished_by'] = $finished['producer'];
                $row_wall['finished_at'] = date("Y-m-d H:i:s", $finished['date']);
                $response['items'][] = $row_wall;
            }
            $i++;

        } elseif ($row_group['type'] == 'bvn') {

            $result_parts = $connect->query("select *, count(*) as count from project_parts where group_id = '{$row_group['id']}'");
            $count = $result_parts->fetch_assoc();
    
            $response['groups_bvn'][$g] = $row_group;
            $response['groups_bvn'][$g]['key'] = $row_group['id'];
            $response['groups_bvn'][$g]['startIndex'] = $c;
            $response['groups_bvn'][$g]['count'] = $count['count'];
    
            $result_parts = $connect->query("select * from project_parts where group_id = '{$row_group['id']}'");
            while ($row_part = $result_parts->fetch_assoc()) {
                $result_finished = $connect->query("SELECT *, SUM(quantity) as count FROM sawinglist WHERE name = '{$row_part['designation']}{$row_part['ano']}'");
                $finished = $result_finished->fetch_assoc();
                $row_part['finished'] = (!$finished['count'] ? 0 : $finished['count']);
                $row_part['finished_by'] = $finished['producer'];
                $row_part['finished_at'] = date("Y-m-d H:i:s", $finished['date']);
                $response['items'][] = $row_part;
            }
            $g++;

        }

        $c = $c+$count['count'];

    }
    // Задаем задержку воизбежания утечки памяти
    sleep(3);
    echo json_encode($response);

} elseif ($_GET['import']) {

    // $_FILES (file)
    $file = $_FILES['file'];
    // Debug file
    //$file = array(
    //    'name' => 'debugasc.asc',
    //    'tmp_name' => 'debugasc.asc'
    //);
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
            $result = $connect->query("INSERT into project_groups
                (project_id, name, position, type) 
            values
                ('{$_POST['pid']}', '{$_POST['name']}', '{$time}', 'asc')");
            $id = $connect->query("select MAX(id) as last from project_groups");
            $id = $id->fetch_assoc();
            foreach ($rows as $entry) {
                $entry['designation'] ? $designation = $entry['designation'] : $designation = $entry['tot'];
                //$entry['ano'] = (int)$entry['ano'];
                $ano = str_replace("'", '', $entry['ano']);
                $result = $connect->query("insert into project_walls (group_id, designation, ano, grossa, height, length, neta, width) values ('{$id['last']}', '{$designation}', '{$ano}', '{$entry['grossa']}', '{$entry['height']}', '{$entry['length']}', '{$entry['neta']}', '{$entry['width']}')");
            }
            $response['success'] = true;
        }

    } elseif ($file_ext == 'bvn') {

        $source = file_get_contents($file['tmp_name']);
        $source = explode("\n", $source);
        $source = array_slice($source, 1, -1);

        //print_r($source);

        if (strlen($_POST['name']) < 5) {
            $response['error'][] = 'Group name must be from 5 to 30 chars.';
        }
        
        if (count($source) < 2) {
            $response['error'][] = 'Something wrong with this file.';
        }

        foreach ($source as $row) {
            $row = preg_replace("/\s+/", " ", trim($row));
            $row = explode(' ', $row);
            $parts[$row[0]][] = $row;
        }

        foreach ($parts as $part) {
            $new_part['designation'] = $part[0][1];
            $new_part['ano'] = (int)$part[0][0];
            $new_part['quantity'] = $part[1][1];
            $new_part['height'] = $part[1][3];
            $new_part['width'] = $part[1][4];
            $new_part['length'] = $part[1][5];
            $items[] = $new_part;
        }

        if (count($response['error']) == 0) {
            $time = time();
            $result = $connect->query("insert into project_groups (project_id, name, position, type) values ('{$_POST['pid']}', '{$_POST['name']}', '{$time}', 'bvn')");
            $response['sql'][] = $result;
            $id = $connect->query("select MAX(id) as last from project_groups");
            $id = $id->fetch_assoc();
            foreach ($items as $item) {
                $result = $connect->query("insert into project_parts (group_id, designation, ano, quantity, height, width, length) values ('{$id['last']}', '{$item['designation']}', '{$item['ano']}', '{$item['quantity']}', '{$item['height']}', '{$item['width']}', '{$item['length']}')");
                $response['sql'][] = $result;
            }
            $response['success'] = true;
        }

    }
    echo json_encode($response);
}

$connect->close();

?>