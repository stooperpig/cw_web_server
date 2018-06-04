<?php

// initialise the curl request

echo 'Monkey butter';

// Helper function courtesy of https://github.com/guzzle/guzzle/blob/3a0787217e6c0246b457e637ddd33332efea1d2a/src/Guzzle/Http/Message/PostFile.php#L90
function getCurlValue($filename, $contentType, $postname)
{
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
 
//$filename = 'C:\\sites\\wego\\civilwar\\server\\data\\scenarios\\scenario0.json';
//$cfile = getCurlValue($filename,'text/html','scenario0.json');

$filename = 'C:\\sites\\wego\\civilwar\\server\\data\\games\\game0-0.json';
$cfile = getCurlValue($filename,'text/html','game0-0.json');
 
//NOTE: The top level key in the array is important, as some apis will insist that it is 'file'.
//$data = array('file' => $cfile, 'file0' => $cfile0);
$data = array('game' => $cfile, 'gameId');
 
$ch = curl_init();
$options = array(CURLOPT_URL => 'http://localhost:8080/game/',
             CURLOPT_RETURNTRANSFER => true,
             CURLINFO_HEADER_OUT => true, //Request header
             CURLOPT_HEADER => true, //Return header
             CURLOPT_SSL_VERIFYPEER => false, //Don't veryify server certificate
             CURLOPT_POST => true,
             CURLOPT_POSTFIELDS => $data
            );
 
curl_setopt_array($ch, $options);
$result = curl_exec($ch);
$header_info = curl_getinfo($ch,CURLINFO_HEADER_OUT);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header = substr($result, 0, $header_size);
$body = substr($result, $header_size);
curl_close($ch);

echo $options
 
?>
 
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>File Upload results</title>
</head>
<body>
    <p>Raw Result: <?=$result?>
    <p>Header Sent: <?=$header_info?></p>
    <p>Header Received: <?=$header?></p>
    <p>Body: <?=$body?></p>
</body>
</html>