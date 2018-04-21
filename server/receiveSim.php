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

	echo 'Receive Sim ';
	$uploaddir = 'C:\\sites\\wego\\civilwar\\server\\data\\games\\';

    $file_ary = reArrayFiles($_FILES['file']);

    foreach ($file_ary as $file) {
        print 'File Name: ' . $file['name'];
        print 'File Type: ' . $file['type'];
        print 'File Size: ' . $file['size'];
        

		    $uploadfile = $uploaddir . basename($file['name']);

		    echo '<pre>';
		    if (move_uploaded_file($file['tmp_name'], $uploadfile)) {
    		    echo "File is valid, and was successfully uploaded.\n";
		    } else {
    		    echo "Possible file upload attack!\n";
		    }		
    }
 
	echo 'Here is some more debugging info:';
	print_r($_FILES);

	print "</pre>"; 
 
?>
 
