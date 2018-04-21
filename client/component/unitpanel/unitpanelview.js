var wego = wego || {};

wego.UnitPanelView = function(component) {
    this.component = component;
    this.state = null;
};

wego.UnitPanelView.prototype = {
	initialize:function(state) {
        this.state = state;

		$("#sidebarTabs").tabs();
		var view = this;
		amplify.subscribe(wego.Topic.CURRENT_HEX, function(data) {
            view.updateStack(data.hex,data.selectedCounters);
            view.updateTaskList(data.selectedCounters);
			view.updateHexInfo(data.hex);
        });
        
        amplify.subscribe(wego.Topic.SELECTED_COUNTERS, function(data) {
            view.updateStack(data.hex,data.selectedCounters);
            view.updateTaskList(data.selectedCounters);
		});		
	},

	updateHexInfo:function(hex) {
		var hexInfo = $("#hexInfo");
		if (hex != null) {
            var hexSides = hex.hexSides;
            var info = `${hex.hexType.name}
                (${hex.column},${hex.row})<br>
                elev: ${hex.elevation}<br>
                <table>
                    <tr><td></td><td>${hexSides[0].toString()}</td><td></td></tr>
                    <tr><td>${hexSides[5].toString()}</td><td></td><td>${hexSides[1].toString()}</td></tr>
                    <tr><td>${hexSides[4].toString()}</td><td></td><td>${hexSides[2].toString()}</td></tr>
                    <tr><td></td><td>${hexSides[3].toString()}</td><td></td></tr>
                </table>`;
			hexInfo.html(info);
		} else {
			hexInfo.html("");
		}
    },
    	
	updateStack:function(hex, selectedCounters) {
		var canvas = document.getElementById('unitBoxCanvas');
        var context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width,canvas.height);

        if (hex != null) {
            var stack = hex.stack;
            if (stack != null) {
                var counters = stack.counters;
                if (counters != null) {
                    var numCounters = counters.length;
                    var leaders = new Array();
                    for(var i = 0; i < numCounters; ++i) {
                        if (counters[i].type == wego.CounterType.LEADER) {
                            leaders.push(counters[i]);
                        }
                    }

                    var leaderRows = Math.ceil(leaders.length / 2)
                    context.canvas.height = (wego.SpriteUtil.unitBoxHeight * numCounters) + 20 + (leaderRows * wego.SpriteUtil.leaderBoxHeight);
                    for(var i = 0; i < leaders.length; ++i) {
                        var row = Math.floor(i / 2);
                        var column = (i % 2);
                        var baseY = row * wego.SpriteUtil.leaderBoxHeight;
                        var baseX = 60 * column;
                        var selected = (selectedCounters != null)?this.containsObject(leaders[i], selectedCounters):false;
                        this.drawLeader(context, baseX, baseY, leaders[i], selected);
                    }

                    var unitCount = 0;
                    for(var i = 0; i < numCounters; ++i) {
                        if (counters[i].type != wego.CounterType.LEADER) {
                            var baseY = unitCount * (wego.SpriteUtil.unitBoxHeight + 2) + (leaderRows * wego.SpriteUtil.leaderBoxHeight + 2);
                            var selected = (selectedCounters != null) ?this.containsObject(counters[i], selectedCounters):false;
                            console.log("unit selected: " + selected);
                            this.drawCounter(context, baseY, counters[i], selected);
                            ++unitCount;
                        }
                    }
                }
            }
        }
    },
    
    containsObject:function(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
    
        return false;
    },

	drawLeader:function(context, baseX, baseY, counter, selected) {
        var x = baseX + 2;
        var side = counter.player.team.id;
        wego.SpriteUtil.drawLeaderSprite(context, counter.unitImageIndex, side, selected, x, baseY);

        context.font = "10px Arial";
        context.textAlign = "right";
        context.fillStyle = "white";

        x = baseX + 58;
        x0 = baseX + 45;
        context.fillText("C", x0, 12);
        context.fillText("L", x0, 28);

        context.fillText(this.getLetterValue(counter.command), x, baseY + 12);
        context.fillText(this.getLetterValue(counter.leadership), x, baseY + 28);

        y = baseY + 44;
        context.fillText("M", x0, y);
        context.fillText(counter.getMovementFactor(), x, y);

        context.fillStyle = "black";
        context.font = "10px Arial bold";
        context.textAlign = "center";
        context.fillText(counter.shortName, baseX + 30, baseY + 60);
        console.log("shortName " + counter.shortName);
	},

	drawCounter:function(context, baseY, counter, selected) {
	    var rowSpace = 19
	    var x = 3;

	    var side = counter.player.team.id;

	    var imageIndex = wego.SpriteUtil.getUnitBoxSpriteIndex(side, selected, false);
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
                context.fillText(counter.getStrength() * 25, x, y);
            break;
            default:
                context.fillText(counter.getStrength(), x, y);
            break;
        }

        y += rowSpace;
        context.fillText("RG", x - 21, y);
        var range = this.state.getParametricData().getWeaponRange(counter.weapon);
        if (range != 0) {
            context.fillText(range, x, y);
        } else {
            context.fillText("--", x, y);
        }

        y += rowSpace

        context.fillText("MV", x - 21, y);
        context.fillText(counter.getMovementFactor(), x, y);
        
        y += rowSpace

        context.fillText("QL", x - 21, y);
        if (counter.quality != 0) {
            context.fillText(this.getLetterValue(counter.quality), x, y);
        } else {
            context.fillText("--", x, y);
        }
        y += rowSpace

        context.fillText("FA", x - 21, y);
        if (counter.type != "S") {
            context.fillText(counter.getFatigue(), x, y);
         } else {
            context.fillText("--", x, y);
         }

        x = 34;
        y += rowSpace - 4;
        context.fillStyle = "black";
        if (counter.weapon != wego.WeaponType.NONE) {
            context.fillText(counter.weapon,x,y);
        }

        var formation = counter.getFormation();
        if (formation != wego.Formation.NONE) {
            imageIndex = wego.SpriteUtil.getFormationSpriteIndex(formation, counter.getFacing());
            wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, x + 16, y - 24);
        }

        var moraleStatus = counter.getMoraleStatus();
        if (moraleStatus == wego.MoraleType.ROUTED) {
            imageIndex = wego.SpriteUtil.routedSpriteIndex;
            wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, x + 34, y - 26);
        }

        if (counter.getFixed()) {
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
	},

	getLetterValue:function(intValue) {
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
	},
	
	updateTaskList:function(selectedCounters) {
        $("#taskList").html("");
        if (selectedCounters != null) {
            var gameMode = this.state.getGameMode();
            var displayCounterName = (selectedCounters.length > 1)?true:false;
            for(var i = 0; i < selectedCounters.length; ++i) {
                var tasks = selectedCounters[i].getTasks(gameMode);
                
                if (displayCounterName) {
                     var html = `<li class="ui-widget-content ui-state-disabled">${selectedCounters[i].name}</li>`;
                 	$("#taskList").append(html);
                }
                
                for(var j = 0; j < tasks.length; ++j) {
                    var task = tasks[j];
                    var showDeleteButton = j > 0 && gameMode == wego.GameMode.PLAN;

                    var html = `<li class="ui-widget-content ui-state-enabled" data-counter-id="${selectedCounters[i].id}" data-task-slot="${j}">
                        ${(showDeleteButton)?this.buildDeleteTaskLink(selectedCounters[i].id,j):''}
                        ${task.type}-${task.hex.column}:${task.hex.row}</li>`;
                    $("#taskList").append(html);
                }
            }
        }
    },
    
    buildDeleteTaskLink:function(counterId,taskIndex) {
        //todo: i really hate this binding assuming global unitpanel component. maybe use jquery to bind after doc element is created.
        //either way I hate the fact the view is doing the binding for the controller.
        return `<input type="button" value="x" onclick="wego.UnitPanelComponent.controller.deleteTask('${counterId}','${taskIndex}')">&nbsp;`
    }
};