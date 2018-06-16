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
			echo '<script>var gGameId = 0;</script>';
		}
		if (isset($_GET["playerId"])) {
			echo '<script>var gPlayerId = '.$_GET["playerId"].';</script>';
		} else {
			echo '<script>var gPlayerId = 0;</script>';
		}
	?>
	
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
	<script src="/civilwar/client/lib/amplify-1.1.2/amplify.min.js"></script>
	<script src="/civilwar/client/lib/handlebars/handlebars-v4.0.11.js"></script>
	<script src="/civilwar/client/util/json2.js"></script>
	<script src="/civilwar/client/model/enum.js"></script>
	<script src="/civilwar/client/model/task.js"></script>
	<script src="/civilwar/client/model/counter.js"></script>
	<script src="/civilwar/client/model/counterfactory.js"></script>
	<script src="/civilwar/client/model/hexside.js"></script>
	<script src="/civilwar/client/model/hex.js"></script>
	<script src="/civilwar/client/model/map.js"></script>
	<script src="/civilwar/client/model/counterstack.js"></script>
	<script src="/civilwar/client/model/player.js"></script>
	<script src="/civilwar/client/model/team.js"></script>
	<script src="/civilwar/client/model/game.js"></script>
	<script src="/civilwar/client/model/uistate.js"></script>
	<script src="/civilwar/client/model/table.js"></script>
    <script src="/civilwar/client/model/scenario.js"></script>
    <script src="/civilwar/client/model/imagecache.js"></script>
	<script src="/civilwar/client/model/parametricdata.js"></script>
	<script src="/civilwar/client/model/los.js"></script>
	<script src="/civilwar/client/application.js"></script>
	<script src="/civilwar/client/util/api.js"></script>
	<script src="/civilwar/client/util/spriteutil.js"></script>
	<script type="module" src="/civilwar/client/main.js"></script>
</head>
<body>
<div id="header">
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
						<li><a href="#">View Terrain Chart</a></li>
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
</body>
</html>