<!DOCTYPE html>
<html>
<head>
	<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
	<meta content="utf-8" http-equiv="encoding">
	<title>Civil War</title>
	<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/themes/mint-choc/jquery-ui.min.css" />
	<link rel="stylesheet" type="text/css" href="/civilwar/client/css/game.css">
	
	<script>var wego = {};</script>
	
	<?php
		if (isset($_GET["gameId"])) {
			echo '<script>var gGameId = '.$_GET["gameId"].';</script>';
		} else {
			echo '<script>var gGameId = 1;</script>';
		}
		if (isset($_GET["playerId"])) {
			echo '<script>var gPlayerId = '.$_GET["playerId"].';</script>';
		} else {
			echo '<script>var gPlayerId = 1;</script>';
		}
	?>
	
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
	<script src="/civilwar/client/lib/amplify-1.1.2/amplify.min.js"></script>
	<script src="/civilwar/client/lib/handlebars/handlebars-v4.0.12.js"></script>
	<script src="/civilwar/client/lib/json2.js"></script>
	<script type="module" src="/civilwar/client/main.js"></script>
</head>
<body>
<div id="header">
	<div class="headerFirstRow">
		<div id="mainMenuDiv">
			<nav>
				<ul>
					<li><a href="#">Game</a>
						<ul>
							<li><a id="menuItemSaveGameMenuItem">Save Game</a></li>
							<li><a id="menuItemSubmitTurnMenuItem">Submit Turn</a></li>
						</ul>
					</li>
					<li><a href="#">Scenario</a>
						<ul>
							<li><a href="#">View Scenario</a></li>
							<li><a id="statusReportMenuItem" href="#">Status Report</a></li>
							<li><a id="releasesReportMenuItem" href="#">View Releases</a></li>
							<li><a id="reinforcementsReportMenuItem" href="#">View Reinforcements</a></li>
						</ul>
						
					</li>
					<li><a href="#">Units</a>
						<ul>
							<li><a href="#">View Order of Battle</a></li>
						</ul>
					</li>
					<li><a href="#">Map</a>
						<ul>
							<li><a href="#">Change map settings</a></li>
						</ul>
					</li>
					<li><a href="#">Help</a>
						<ul>
							<li><a id="terrainChartMenuItem" href="#">View Terrain Chart</a></li>
							<li><a href="#">View Combat Chart</a></li>
							<li><a href="#">View Help Guide</a></li>
						</ul>
					</li>
					<li><a href="#">[Developer]</a>
						<ul>
							<li><a id="toggleFowMenuItem" href="#">Toggle FOW</a></li>
						</ul>
					</li>
				</ul>
			</nav>
		</div>
	</div>
	<div id="mainToolbar">
		<button id="losButton">LOS</button>
		<button id="prevUnitButton">Prev Unit</button>
		<button id="nextUnitButton">Next Unit</button>
		<button id="opFireButton">OpFire</button>
		<button id="directFireButton">DirectFire</button>
		<button id="waitButton">Wait</button>
		<button id="rotateLeftButton"></button>
		<button id="rotateRightButton"></button>
		<button id="aboutFaceButton"></button>
		<button id="formationButton"></button>
		<button id="gameModeButton">Plan Mode</button>
		<div class="clear"></div>
	</div>
</div>
<div id="center">
	<div id="sidebar">
		<div id="stackDiv">
			Units
			
			<canvas id="unitBoxCanvas" width="150" height="661">
            	Your browser does not support the HTML5 canvas tag.
            </canvas>
		</div>
		<div id="sidebarTabs">
			<ul>
				<li><a href="#taskListDiv">Task</a></li>
				<li><a href="#hexInfo">Hex</a></li>
			</ul>
			<div id="taskListDiv">
				<ol id="taskList"></ol>
			</div>
			<div id="hexInfo"></div>
		</div>
	</div>
	<div id="mainMapDiv">
		<canvas id="mainMapCanvas" width="1736" height="661">
			Your browser does not support the HTML5 canvas tag.
		</canvas>
	</div>
	<div class="clear"></div>
</div>
<div id="footer">
	<div id="footerClockDiv">
		<div id="currentTimeDiv">0</div>
		<div id="clockControlsDiv">
			<button id="seekFirstButton"></button>
			<button id="seekPrevButton"></button>
			<button id="playButton"></button>
			<button id="seekNextButton"></button>
			<button id="seekEndButton"></button>
			<button id="linkButton"></button>
			<div class="clear"></div>
		</div>
	</div>
	<div id="footerStatusDiv"></div>
	<div id="footerTurnDiv"></div>
	<div class="clear"></div>
</div>
<div id="dialog">
	<div id="content-placeholder"></div>
</div>
<script id="statusReport-template" type="text/x-handlers-template">
	{{#if releases}}
		<b>Releases</b></br>
		{{#each releases}}
			&nbsp{{this}}<br>
		{{/each}}
	{{/if}}
	<br>
	{{#if reinforcements}}
		<b>Reinforcements</b></br>
		{{#each reinforcements}}
			&nbsp{{this}}<br>
		{{/each}}
	{{/if}}
	<br>
	<input id="viewReplayButton" type="button" value="Press to View Replay"/>
</script>
<script id="releasesReport-template" type="text/x-handlers-template">
		{{#each releases}}
			&nbsp[{{turnHelper turn}}] {{timeHelper time}} {{description}}<br>
		{{/each}}
</script>
<script id="reinforcementsReport-template" type="text/x-handlers-template">
		{{#each reinforcements}}
			&nbsp[{{turnHelper turn}}] {{timeHelper time}} {{description}} ({{hexX}},{{hexY}})<br>
		{{/each}}
</script>
<script id="terrainChart-template" type="text/x-handlers-template">
	<h2>Terrain Chart</h2>
	<h3>Hex Movement Costs</h3>
	<table border="1">
		<tr>
			<th>UnitType</th>
			<th>Formation<th>
			<th>Clear</th>
			<th>Rough</th>
			<th>Forest</th>
		</tr>
		{{#each hexTypeCost}}
			<tr>
				<td>{{counterType}}</td>
				<td>{{formation}}</td>
			</tr>
		{{/each}}
		<tr>
			<td>Infantry</td>
			<td>Line</td>
			<td></td>
			<td></td>
			<td></td>
		</tr>
		<tr>
			<td></td>
			<td>Column</td>
			<td></td>
			<td></td>
			<td></td>
		</tr>
		<tr>
			<td>Cavalry</td>
			<td>Line</td>
			<td></td>
			<td></td>
			<td></td>
		</tr>
		<tr>
			<td></td>
			<td>Mounted</td>
			<td></td>
			<td></td>
			<td></td>
		</tr>
		<tr>
			<td>Leader</td>
			<td>On Foot</td>
			<td></td>
			<td></td>
			<td></td>
		</tr>
		<tr>
			<td></td>
			<td>Mounted</td>
			<td></td>
			<td></td>
			<td></td>
		</tr>
		<tr>
			<td>Artillery</td>
			<td>Unlimbered</td>
			<td></td>
			<td></td>
			<td></td>
		</tr>
		<tr>
			<td></td>
			<td>Limbered</td>
			<td></td>
			<td></td>
			<td></td>
		</tr>
		<tr>
			<td>Supply Wagon</td>
			<td>Unlimbered</td>
			<td></td>
			<td></td>
			<td></td>
		</tr>
	</table>
	<h3>Hexside Movement Costs</h3>
	<table>
		<tr>
			<td>Stuff</td>
		</tr>
	</table>
	<h3>Terrain Descriptions</h3>
	<table>
		<tr>
			<td>Stuff</td>
		</tr>
	</table>
</script>
<script id="combatChart-template" type="text/x-handlers-template">
	<h2>Combat Chart</h2>
	<h3>Weapon Effectiveness</h3>
	<table>
		<tr>
			<td>Stuff</td>
		</tr>
	</table>
</script>
</body>
</html>