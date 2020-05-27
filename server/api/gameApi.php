<?php

$servername = "localhost";
$username = "wego_app";
$password = "ferrule11";
$dbname = "wego_civilwar";

function getCurlValue($filename, $contentType, $postname) {
    if (function_exists('curl_file_create')) {
        return curl_file_create($filename, $contentType, $postname);
    }
 
    // Use the old style if using an older version of PHP
    $value = "@{$filename};filename=" . $postname;
    if ($contentType) {
        $value .= ';type=' . $contentType;
    }
 
    return $value;
}

function saveGame($gameId, $playerId, $data) {
	$date = date('YmdHis');
	$file = '../data/games/game'.$gameId.'-'.$playerId.'.json';
	//$newFile = '../data/games/archive/game'.$gameId.'-'.$playerId.'-'.$date.'.json';
	//copy($file,$newFile);
	file_put_contents('../data/games/game'.$gameId.'-'.$playerId.'.json',$data);
    echo "successfully saved game";
}

function sendGame($gameId) {
    global $username, $password, $servername, $dbname;

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "update game state='submitted', last_update=sysdate() where id=".$gameId;
    $result = $conn->query($sql);

    $sql = "select player from player_game where game=".$gameId;
    $result = $conn->query($sql);

    $files = array();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $files[] = 'C:\\sites\\wego\\civilwar\\server\\data\\games\\game'.$gameId.'-'.$row["player"].'.json';
        }
    }

    $conn->close();
    
    // Set postdata array
    $postData = ['gameId' => $gameId];
    
    // Create array of files to post
    foreach ($files as $index => $file) {
        $postData['file[' . $index . ']'] = curl_file_create(
            realpath($file),
            mime_content_type($file),
            basename($file)
        );
    }
    
    $request = curl_init('http://localhost:8080/game/');
    curl_setopt($request, CURLOPT_POST, true);
    curl_setopt($request, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($request, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($request);
    if ($result === false) {
        error_log(curl_error($request));
    }
    
    curl_close($request);

    echo $result;
    echo "\nd";
}

if (isset($_GET["action"])) {
	$action = $_GET["action"];
} elseif (isset($_POST["action"])) {
	$action = $_POST["action"];
}

if ($action == "retrieveGame") {
	if (isset($_GET["gameId"])) {
		$gameId = $_GET["gameId"];
		$playerId = $_GET["playerId"];
        $scenario = file_get_contents('../data/scenarios/scenario_wc_a.json');
        $map = file_get_contents('../data/maps/map_wc.json');
        $parametricData = file_get_contents('../data/parametric/parametric_wc.json');
        $game = file_get_contents('../data/games/game'.$gameId.'-'.$playerId.'.json');
        
		//	header('Content-type: application/json');
		echo '{"scenario":'.$scenario.',"map":'.$map.',"parametricData":'.$parametricData.',"game":'.$game.'}';
	} else {
		echo '{"message":"Game id missing on request"}';
	}
} elseif ($action == "saveGame") {
		$gameId = $_POST["gameId"];
		$playerId = $_POST["playerId"];
		$data = $_POST["data"];
    saveGame($gameId, $playerId, $data);
} elseif ($action == "submitTurn") {
	$gameId = $_POST["gameId"];
	$playerId = $_POST["playerId"];
	$data = $_POST["data"];
    saveGame($gameId, $playerId, $data);

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "update player_game set state='submitted', last_update=sysdate() where game=".$gameId." and player=".$playerId;
    $result = $conn->query($sql);

    $sql = "select distinct state from player_game where game=".$gameId;
    $result = $conn->query($sql);
    $rowCount = $result->num_rows;
    $conn->close();

    if ($rowCount == 1) {
        sendGame($gameId);
    }
} else {
	echo "no action specified";
}
?>