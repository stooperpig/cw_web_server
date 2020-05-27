<?php

function reArrayFiles(&$file_post) {

    $file_ary = array();
    $file_count = count($file_post['name']);
    $file_keys = array_keys($file_post);

    for ($i=0; $i<$file_count; $i++) {
        foreach ($file_keys as $key) {
            $file_ary[$i][$key] = $file_post[$key][$i];
        }
    }

    return $file_ary;
}

echo "Receive Sim \n";
$uploaddir = 'C:\\sites\\wego\\civilwar\\server\\data\\games\\';

$gameId = $_GET["gameId"];
$turn = $_GET["turn"];
echo "GameId: ".$gameId."\n";
echo "Turn: ".$turn."\n";

$file_ary = reArrayFiles($_FILES['file']);

foreach ($file_ary as $file) {
    print 'File Name: ' . $file['name']."\n";
    print 'File Type: ' . $file['type']."\n";
    print 'File Size: ' . $file['size']."\n";
    

        $uploadfile = $uploaddir . basename($file['name']);

        echo '<pre>';
        if (move_uploaded_file($file['tmp_name'], $uploadfile)) {
            echo "\nFile is valid, and was successfully uploaded.\n";
        } else {
            echo "Possible file upload attack!\n";
        }		
}

echo "Here is some more debugging info:";
print_r($_FILES);

print "</pre>"; 

$servername = "localhost";
$username = "wego_app";
$password = "ferrule11";
$dbname = "wego_civilwar";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "update game set turn=".($turn + 1).", state='planning', last_update=sysdate() where id=".$gameId;
$result = $conn->query($sql);
$sql = "update player_game set state='planning', last_update=sysdate() where game=".$gameId;
$result = $conn->query($sql);
$conn->close();

?>
 
