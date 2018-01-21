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
        
        amplify.subscribe(wego.Topic.SELECTED_COUNTERS, function(data) {
			updateStack(data.hex,data.selectedCounters);
		});
		
		$("#unitBoxCanvas").bind('mousedown', function (e) {
			e.metaKey = true;
	        console.log("click event: " + e);
	        var counter = getCounter(e);
            console.log("clicked counter: " + counter);
            if (counter != null) {
                var selectedCounters = wego.UiState.getSelectedCounters();
                selectedCounters.push(counter);
                wego.UiState.setSelectedCounters(selectedCounters);
            }
		});
		
		$("#taskList").bind('mousedown', function (e) {
			e.metaKey = true;
		}).selectable({
			selected: handleSelectTask,
			unselected: handleSelectTask,
			filter:".ui-state-enabled"
		});
	}

    function getCounter(event) {
        debugger;
        var counter = null;
        var posX = $(event.target).offset().left;
        var posY = $(event.target).offset().top;
        var x = event.pageX - posX;
        var y = event.pageY - posY;
        console.log("clickEvent: (" + x + "," + y + ")");

        var currentHex = wego.UiState.getCurrentHex();
        var stack = currentHex.getStack();
        if (stack != null) {
            var counters = stack.getCounters();
            var leaders = getLeaders(counters);

            var leaderRows = Math.ceil(leaders.length / 2);
            var leaderMaxY = leaderRows * wego.SpriteUtil.leaderBoxHeight;
            if (y > leaderMaxY) {
                console.log("clicked on a unit");
                var adjY = y - leaderMaxY;
                var unitRow = Math.floor(adjY / wego.SpriteUtil.unitBoxHeight);
                console.log("clicked on unit " + unitRow);
                if (leaders.length == 0) {
                    counter = counters[unitRow];
                } else {
                    var units = getUnits(counters);
                    counter = units[unitRow];    
                }

            } else {
                console.log("clicked on a leader");
                var leaderRow = Math.floor(y / (wego.SpriteUtil.leaderBoxHeight));
                var leaderColumn = Math.floor(x / (wego.SpriteUtil.leaderBoxWidth));
                console.log("clicked on leader " + leaderRow + "," + leaderColumn + " -> " + ((leaderRow * 2) + leaderColumn));
            }
        }

        //var coord = hexMap.pointToHex((event.pageX - posX) , (event.pageY - posY));
        //console.log("clicked on hex (" + coord.col + "," + coord.row + ") point (" + posX + "," + posY + ")");
        //hex = hexMap.getHex(coord.col, coord.row);
        return counter;
    }
	
	function updateHexInfo(hex) {
		var hexInfo = $("#hexInfo");
		if (hex != null) {
			var info = hex.getHexType().name;
			
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
    
    function getUnits(counters) {
        var units = new Array();
        var numCounters = counters.length;
        for(var i = 0; i < numCounters; ++i) {
            if (counters[i].type != "L") {
                units.push(counters[i]);
            }
        }
        return units;
    }

	function getLeaders(counters) {
	    var leaders = new Array();
        var numCounters = counters.length;
        for(var i = 0; i < numCounters; ++i) {
            if (counters[i].type == "L") {
                leaders.push(counters[i]);
            }
        }
        return leaders;
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
                var leaders = new Array();
                for(var i = 0; i < numCounters; ++i) {
                    if (counters[i].type == "L") {
                        leaders.push(counters[i]);
                    }
                }

                var leaderRows = Math.ceil(leaders.length / 2)

                context.canvas.height = (wego.SpriteUtil.unitBoxHeight * numCounters) + 20 + (leaderRows * wego.SpriteUtil.leaderBoxHeight);
                var unitCount = 0;
                for(var i = 0; i < leaders.length; ++i) {
                    var baseY = 0;
                    drawLeader(context, baseY, counters[i]);
                }

                var unitCount = 0;
                for(var i = 0; i < numCounters; ++i) {
                    if (counters[i].type != "L") {
                        var baseY = unitCount * (wego.SpriteUtil.unitBoxHeight + 2) + (leaderRows * wego.SpriteUtil.leaderBoxHeight + 2);
                        var selected = (selectedCounters != null) ?containsObject(counters[i], selectedCounters):false;
                        console.log("unit selected: " + selected);
                        drawCounter(context, baseY, counters[i]);
                        ++unitCount;
                    }
                }
             }
         }
    }
    
    function containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
    
        return false;
    }

	function drawLeader(context, baseY, counter) {
        var x = 2;
        wego.SpriteUtil.drawSprite(context, "Leaders", counter.unitImageIndex, x, baseY);

        context.font = "10px Arial";
        context.textAlign = "right";
        context.fillStyle = "white";

        x = 58;

        context.fillText(getLetterValue(counter.command), x, 12);
        context.fillText(getLetterValue(counter.leadership), x, 28);

        y = 44;
        if (counter.formation == 0) {
            context.fillText(counter.lineMovement, x, y);
        } else {
            context.fillText(counter.columnMovement, x, y);
        }

        context.fillStyle = "black";
        context.font = "10px Arial bold";
        context.textAlign = "center";
        context.fillText(counter.shortName, 30, 60);
        console.log("shortName " + counter.shortName);
	}

	function drawCounter(context, baseY, counter) {
	    var rowSpace = 19
	    var x = 3;

	    var side = counter.getPlayer().getTeam().getId();

	    var imageIndex = wego.SpriteUtil.getUnitBoxSpriteIndex(side, false, false);
	    wego.SpriteUtil.drawSprite(context, "UnitBox", imageIndex, x, baseY);

	    wego.SpriteUtil.drawSprite(context, "Units", counter.unitImageIndex, x + 1, baseY + 1);

        context.font = "10px Arial";
        context.textAlign = "right";
        context.fillStyle = "white";

        x = 124;
        var y = baseY + 16;
        context.fillText("S", x - 28, y);
        switch(counter.type) {
            case "I":
            case "C":
                context.fillText(counter.strength * 25, x, y);
            break;
            default:
                context.fillText(counter.strength, x, y);
            break;
        }

        y += rowSpace;
        context.fillText("RG", x - 21, y);
        if (counter.range != 0) {
            context.fillText(counter.range, x, y);
        } else {
            context.fillText("--", x, y);
        }

        y += rowSpace

        context.fillText("MV", x - 21, y);
        if (counter.formation == 0) {
            context.fillText(counter.lineMovement, x, y);
        } else {
            context.fillText(counter.columnMovement, x, y);
        }
        y += rowSpace

        context.fillText("QL", x - 21, y);
        if (counter.quality != 0) {
            context.fillText(getLetterValue(counter.quality), x, y);
        } else {
            context.fillText("--", x, y);
        }
        y += rowSpace

        context.fillText("FA", x - 21, y);
        if (counter.type != "S") {
            context.fillText(counter.fatigue, x, y);
         } else {
            context.fillText("--", x, y);
         }

        x = 34;
        y += rowSpace - 4;
        context.fillStyle = "black";
        if (counter.weapon != null) {
            context.fillText(counter.weapon,x,y);
        }

        if (counter.formation != -1) {
            imageIndex = wego.SpriteUtil.getFormationSpriteIndex(counter.formation, counter.facing);
            wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, x + 16, y - 24);
        }

        if (counter.moraleStatus == 2) {
            imageIndex = wego.SpriteUtil.routedSpriteIndex;
            wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, x + 34, y - 26);
        }

        if (counter.fixed) {
            imageIndex = wego.SpriteUtil.fixedSpriteIndex;
            wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, x - 1, y - 25);
        }

        //spotted sprite
        wego.SpriteUtil.drawSprite(context, "Icons2d", 155, x + 57, y - 24);

        //unit symbol
        if (side == 1) {
            wego.SpriteUtil.drawSprite(context, "Icons2d", counter.unitSymbolIndex + 171, 0, y - 5);
        } else {
            wego.SpriteUtil.drawSprite(context, "Icons2d", counter.unitSymbolIndex + 156, 0, y - 5); 
        }

        context.fillStyle = "black";
        context.font = "9px Arial";
        context.textAlign = "center";
        context.fillText(counter.name, 72, y + 14);

        if (counter.parentName != null) {
            context.fillText(counter.parentName, 72, y + 24);
        }
	}

	function getLetterValue(intValue) {
	console.log("quality: " + intValue);
	    returnValue = "";
	    switch(intValue) {
	        case 1:
	            returnValue = "F";
	            break;
	        case 2:
	        	returnValue = "E";
            	break;
	        case 3:
	        	returnValue = "D";
            	break;
	        case 4:
	        	returnValue = "C";
            	break;
	        case 5:
	        	returnValue = "B";
            	break;
            case 6:
                returnValue = "A";
                break;
	    }

	    return returnValue;
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

	return {
		deleteTask : deleteTask,
		initialize : initialize
	}
})();