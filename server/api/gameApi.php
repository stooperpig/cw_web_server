<?php

function getCurlValue($filename, $contentType, $postname) {
    // PHP 5.5 introduced a CurlFile object that deprecates the old @filename syntax
    // See: https://wiki.php.net/rfc/curl-file-upload
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
	$newFile = '../data/games/archive/game'.$gameId.'-'.$playerId.'-'.$date.'.json';
	copy($file,$newFile);
	file_put_contents('../data/games/game'.$gameId.'-'.$playerId.'.json',$data);
    echo "successfully saved game";
}

function sendGame($gameId, $playerId) {
    echo "\nmonkey shit ".$gameId."  ".$playerId;
    $filename = 'C:\\sites\\wego\\civilwar\\server\\data\\games\\game'.$gameId.'-'.$playerId.'.json';
    $cfile = getCurlValue($filename,'text/html','game'.$gameId.'-'.$playerId.'.json');
    echo "\nb";
    //NOTE: The top level key in the array is important, as some apis will insist that it is 'file'.
    $data = array('game' => $cfile, 'gameId' => $gameId, 'playerId' => $playerId);
 
    $ch = curl_init();
    $options = array(CURLOPT_URL => 'http://localhost:8080/game',
                 CURLOPT_RETURNTRANSFER => true,
                 CURLINFO_HEADER_OUT => true, //Request header
                 CURLOPT_HEADER => true, //Return header
                 CURLOPT_SSL_VERIFYPEER => false, //Don't veryify server certificate
                 CURLOPT_POST => true,
                 CURLOPT_POSTFIELDS => $data
                );
 
    curl_setopt_array($ch, $options);
    echo "\nc";
    $result = curl_exec($ch);
    $header_info = curl_getinfo($ch,CURLINFO_HEADER_OUT);
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $header = substr($result, 0, $header_size);
    $body = substr($result, $header_size);
    curl_close($ch);
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
    sendGame($gameId, $playerId);
} else {
	echo "no action specified";
}
?>