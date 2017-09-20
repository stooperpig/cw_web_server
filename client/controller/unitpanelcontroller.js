var wego = wego || {};

wego.UnitPanelController = (function() {
	function deleteTask(counterId,taskSlot) {
		var selectedCounters = wego.UiState.getSelectedCounters();
		for(var j = 0; j < selectedCounters.length; ++j) {
			var counter = selectedCounters[j];
			if (counter.getId() == counterId) {
				counter.deleteTask(taskSlot,true);
				var hex = counter.getHex();
				wego.UiState.setCurrentHex(hex,[counter]);
				wego.MainController.drawMap();
				break;
			}
		}
	}
	
	function handleSelectTask(event,ui) {
		var selected = $(ui.selected);
		//selected.siblings().removeClass("ui-selected");
		
		if (selected.hasClass("ui-selected")) {
			var counterId = $(ui.selected).attr("data-counter-id");
			var taskSlot = $(ui.selected).attr("data-task-slot");
			var selectedCounters = wego.UiState.getSelectedCounters();
			var gameMode = wego.UiState.getGameMode();
			for(var j = 0; j < selectedCounters.length; ++j) {
				var counter = selectedCounters[j];
				if (counter.getId() == counterId) {
					counter.update(taskSlot, gameMode);
					var hex = counter.getHex();
					wego.UiState.setCurrentHex(hex,[counter]);
					wego.MainController.drawMap();
					break;
				}
			}
		} else {
			alert("not updating");
		}
	}
	
	function initialize() {
		$("#sidebarTabs").tabs();
		
		amplify.subscribe(wego.Topic.CURRENT_HEX, function(data) {
			updateStack(data.hex,data.selectedCounters);
			updateHexInfo(data.hex);
		});
		
		$("#counterList").bind('mousedown', function (e) {
			e.metaKey = true;
		}).selectable({
			selected: updateTaskList,
			unselected: updateTaskList,
			filter:".ui-state-enabled"
		});
		
		$("#taskList").bind('mousedown', function (e) {
			e.metaKey = true;
		}).selectable({
			selected: handleSelectTask,
			unselected: handleSelectTask,
			filter:".ui-state-enabled"
		});
	}
	
	function updateHexInfo(hex) {
		var hexInfo = $("#hexInfo");
		if (hex != null) {
			var info = hex.getHexType().name;
			
			var secondaryHexType = hex.getSecondaryHexType();
			if (secondaryHexType != wego.SecondaryHexType.CLEAR) {
				info += "/" + hex.getSecondaryHexType().name;
			}
			info += " (" + hex.getColumn() + "," + hex.getRow() + ")<br>";
			info += "elev: " + hex.getElevation() + "<br>";
			
			info += "<table>"
			var hexSides = hex.getHexSides();
			
			info += "<tr><td></td><td>" + hexSides[0].toString() + "</td><td></td></tr>";
			info += "<tr><td>" + hexSides[5].toString() + "</td><td></td><td>" + hexSides[1].toString() + "</td></tr>";
			info += "<tr><td>" + hexSides[4].toString() + "</td><td></td><td>" + hexSides[2].toString() + "</td></tr>";
			info += "<tr><td></td><td>" + hexSides[3].toString() + "</td><td></td></tr>";
			info += "</table>";
			
			hexInfo.html(info);
		} else {
			hexInfo.html("");
		}
	}
	
	function updateStack(hex,selectedCounters) {
		//wego.MainController.updateCounterList("#counterList",hex,selectedCounters,wego.Game.getCurrentPlayer());
				var canvas = document.getElementById('unitBoxCanvas');
        		var context = canvas.getContext('2d');
        		context.canvas.height = (109 * 2) + 5
        		context.clearRect(0,0,canvas.width,canvas.height);
        		drawUnitBox(context, 3, 5, 0);
        		drawUnit(context, 2, 6, 1);
        		drawUnitBox(context, 3, 5, 110);
                drawUnit(context, 5, 6, 111);

                context.font = "10px Arial";
                context.textAlign = "right";
                context.fillStyle = "white";

                var x = 102;
                var rowSpace = 15
                y = 11;
                context.fillText("999",x,y);
                y += rowSpace;
                context.fillText("10",x,y);
                y += rowSpace
                context.fillText("12",x,y);
                y += rowSpace
                context.fillText("A",x,y);
                y += rowSpace
                context.fillText("0",x,y);

                x = 31;
                y += rowSpace - 1;
                context.fillStyle = "black";
                context.fillText("M",x,y);

                var spriteNumber = 204;
                var spriteSheet = wego.ImageCache["Icons2d"].image;
                var spritesPerRow = 12;
                var spritesRows = 20;

                var spriteRow = Math.floor(spriteNumber / spritesPerRow);
                var spriteColumn = spriteNumber % spritesPerRow;

                var spriteX = (spriteColumn * 32);
                var spriteY = (32 * spriteRow);
                var width = 32;
                var height = 32;
                context.drawImage(spriteSheet, spriteX, spriteY, width, height, x+10, y-20, width, height);

                var spriteNumber = 155;
                var spriteSheet = wego.ImageCache["Icons2d"].image;
                var spritesPerRow = 12;
                var spritesRows = 20;

                var spriteRow = Math.floor(spriteNumber / spritesPerRow);
                var spriteColumn = spriteNumber % spritesPerRow;

                var spriteX = (spriteColumn * 32);
                var spriteY = (32 * spriteRow);
                var width = 32;
                var height = 32;
                context.drawImage(spriteSheet, spriteX, spriteY, width, height, x+43, y-20, width, height);

                 var spriteNumber = 180;
                 var spriteSheet = wego.ImageCache["Icons2d"].image;
                 var spritesPerRow = 12;
                 var spritesRows = 20;

                 var spriteRow = Math.floor(spriteNumber / spritesPerRow);
                 var spriteColumn = spriteNumber % spritesPerRow;

                 x = 0;
                 var spriteX = (spriteColumn * 32);
                 var spriteY = (32 * spriteRow);
                 var width = 32;
                 var height = 32;
                 context.drawImage(spriteSheet, spriteX, spriteY, width, height, x, y-5, width, height);

                 context.fillStyle = "black";
                 context.font = "8px Arial";
                                 context.textAlign = "center";
                 context.fillText("1st US Reg Btln",x + 63,y + 12);
                 context.fillText("1st Brig (Sturgis)",x + 63,y + 20);

                context.font = "10px Arial";
                context.fillStyle = "white";
                                context.textAlign = "right";
                x = 102;
                y = 11 + 109 + 1;
                context.fillText("999",x,y);
                y += rowSpace;
                context.fillText("10",x,y);
                y += rowSpace
                context.fillText("12",x,y);
                y += rowSpace
                context.fillText("A",x,y);
                y += rowSpace
                context.fillText("0",x,y);
	}
	
	function updateTaskList() {
		$("#taskList").html("");
		var selectedCounters = wego.UiState.getSelectedCounters();
		var gameMode = wego.UiState.getGameMode();
		var displayCounterName = (selectedCounters.length > 1)?true:false;
		for(var i = 0; i < selectedCounters.length; ++i) {
			var tasks = selectedCounters[i].getTasks(gameMode);
			
			if (displayCounterName) {
				var html = '<li class="ui-widget-content ui-state-disabled">';
				html += selectedCounters[i].getCounterName();
				html += "</li>";
				$("#taskList").append(html);
			}
			
			for(var j = 0; j < tasks.length; ++j) {
				var html = '<li class="ui-widget-content ui-state-enabled" data-counter-id="' + selectedCounters[i].getId() + '" data-task-slot="' + j + '" >';
				var task = tasks[j];
				if (j > 0 && gameMode == wego.GameMode.PLAN) {
					html += '<input type="button" value="x" onclick="wego.UnitPanelController.deleteTask(' + selectedCounters[i].getId() + ',' + j + ')">&nbsp;';
				}
				html += task.toString();
				html += "</li>";
				$("#taskList").append(html);
			}
		}
	}

	function drawUnitBox(context, spriteNumber, x, y) {
        var spriteSheet = wego.ImageCache["UnitBox"].image;
        var spritesPerRow = 3;
        var spritesRows = 2;
        var spriteWidth = 101;
        var spriteHeight = 109;

        var spriteRow = Math.floor(spriteNumber / spritesPerRow);
        var spriteColumn = spriteNumber % spritesPerRow;

        var spriteX = (spriteColumn * spriteWidth);
        var spriteY = (spriteRow * spriteHeight);

        context.drawImage(spriteSheet, spriteX, spriteY, spriteWidth, spriteHeight, x, y, spriteWidth, spriteHeight);
    }

    function drawUnit(context, spriteNumber, x, y) {
        var spriteSheet = wego.ImageCache["Units"].image;
        var spritesPerRow = 10;
        var spritesRows = 5;
        var spriteWidth = 66;
        var spriteHeight = 74;

        var spriteRow = Math.floor(spriteNumber / spritesPerRow);
        var spriteColumn = spriteNumber % spritesPerRow;

        var spriteX = (spriteColumn * spriteWidth);
        var spriteY = (spriteRow * spriteHeight);

        context.drawImage(spriteSheet, spriteX, spriteY, spriteWidth, spriteHeight, x, y, spriteWidth, spriteHeight);
    }
	
	return {
		deleteTask : deleteTask,
		initialize : initialize
	}
})();