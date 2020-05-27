
<html>
    <head>
    </head>
    <body>
        <h1>Games</h1>
        <table border=1>
            <tr>
                <th>Game<br>Id</th>
                <th>Scenario</th>
                <th>Name</th>
                <th>Turn</th>
                <th>Game<br>State</th>
                <th>Last<br>Update</th>
                <th>Side</th>
                <th>Player<br>Id</th>
                <th>Nickname</th>
                <th>State</th>
                <th>Last<br>Update</th>
                <th>Launch</th>
            </tr>
<?php
$servername = "localhost";
$username = "wego_app";
$password = "ferrule11";
$dbname = "wego_civilwar";


$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT a.id as 'gameId', name, scenario, a.last_update as 'gameUpdated', a.state as 'gameState', b.last_update as 'playerUpdated', b.player, b.side, b.state as 'playerState', c.nickname, a.turn FROM game a inner join player_game b on a.id = b.game inner join player c on b.player = c.id";
$result = $conn->query($sql);


if ($result->num_rows > 0) {
    $lastGameId = 0;
    while($row = $result->fetch_assoc()) {
        $gameId = $row["gameId"];

        if ($lastGameId != $gameId) {
            $lastGameId = $gameId;
            echo "<tr><td>" . $row["gameId"]. "</td>><td>" . $row["scenario"]."</td><td>" .$row["name"]. "</td><td>".$row["turn"]."</td>";
            echo "<td>".$row["gameState"]."</td><td>". $row["gameUpdated"]."</td>";
        } else {
            echo "<tr><td colspan='6'></td>";
        }

        echo "<td>". $row["side"]. "</td><td>". $row["player"]. "</td><td>" . $row["nickname"]. "</td><td>" . $row["playerState"]. "</td><td>".$row["playerUpdated"]."</td>";
        echo "<td><a href='index.php?gameId=".$row["gameId"]."&playerId=".$row["player"]."' target='_blank'>Launch</a></tr>";
    }
} else {
    echo "0 results";
}
$conn->close();
?>
        </table>
    </body>
</html>