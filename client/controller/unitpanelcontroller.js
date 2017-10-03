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
		var canvas = document.getElementById('unitBoxCanvas');
        var context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width,canvas.height);

        var stack = hex.getStack();
        if (stack != null) {
            var counters = stack.getCounters();
            if (counters != null) {
                var numCounters = counters.length;
               context.canvas.height = (109 * numCounters) + 20;
                for(var i = 0; i < numCounters; ++i) {
                    drawCounter(context, i, counters[i]);
                }
             }
         }
	}

	function drawCounter(context, index, counter) {
	    var rowSpace = 15
	    var x = 3;
	    var baseY = index * (109 + 2);

	    wego.SpriteUtil.drawSprite(context, "UnitBox", 3, x, baseY);
	    wego.SpriteUtil.drawSprite(context, "Units", counter.unitPicture, x + 1, baseY + 1);

        context.font = "10px Arial";
        context.textAlign = "right";
        context.fillStyle = "white";

        x = 102;
        var y = baseY + 11;
        context.fillText(counter.strength, x, y);
        y += rowSpace;
        context.fillText(counter.range, x, y);
        y += rowSpace
        context.fillText(counter.movement, x, y);
        y += rowSpace
        context.fillText(counter.quality, x, y);
        y += rowSpace
        context.fillText(counter.fatigue, x, y);

        x = 31;
        y += rowSpace - 1;
        context.fillStyle = "black";
        context.fillText("M",x,y);

        wego.SpriteUtil.drawSprite(context, "Icons2d", 204, x + 10, y - 20);
        wego.SpriteUtil.drawSprite(context, "Icons2d", 155, x + 43, y - 20);
        wego.SpriteUtil.drawSprite(context, "Icons2d", 180, 0, y - 5);

        context.fillStyle = "black";
        context.font = "8px Arial";
                         context.textAlign = "center";
        context.fillText(counter.parentOrgName, 63, y + 12);
        context.fillText(counter.orgName, 63, y + 20);

//        context.font = "10px Arial";
//        context.fillStyle = "white";
//        context.textAlign = "right";

//        x = 102;
//        y = 11 + 109 + 1;
//        context.fillText("999",x,y);
//        y += rowSpace;
//        context.fillText("10",x,y);
//        y += rowSpace
//        context.fillText("12",x,y);
//        y += rowSpace
//        context.fillText("A",x,y);
//        y += rowSpace
//        context.fillText("0",x,y);
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

//	function drawUnitBox(context, spriteNumber, x, y) {
//        var spriteSheet = wego.ImageCache["UnitBox"].image;
//        var spritesPerRow = 3;
//        var spritesRows = 2;
//        var spriteWidth = 101;
//        var spriteHeight = 109;
//
//        var spriteRow = Math.floor(spriteNumber / spritesPerRow);
//        var spriteColumn = spriteNumber % spritesPerRow;
//
//        var spriteX = (spriteColumn * spriteWidth);
//        var spriteY = (spriteRow * spriteHeight);
//
//        context.drawImage(spriteSheet, spriteX, spriteY, spriteWidth, spriteHeight, x, y, spriteWidth, spriteHeight);
//    }

//    function drawUnit(context, spriteNumber, x, y) {
//        var spriteSheet = wego.ImageCache["Units"].image;
//        var spritesPerRow = 10;
//        var spritesRows = 5;
//        var spriteWidth = 66;
//        var spriteHeight = 74;
//
//        var spriteRow = Math.floor(spriteNumber / spritesPerRow);
//        var spriteColumn = spriteNumber % spritesPerRow;
//
//        var spriteX = (spriteColumn * spriteWidth);
//        var spriteY = (spriteRow * spriteHeight);
//
//        context.drawImage(spriteSheet, spriteX, spriteY, spriteWidth, spriteHeight, x, y, spriteWidth, spriteHeight);
//    }
	
	return {
		deleteTask : deleteTask,
		initialize : initialize
	}
})();