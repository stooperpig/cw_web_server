var wego = wego || {};

wego.UnitPanelView = function(component) {
    this.component = component;
    this.state = null;
};

wego.UnitPanelView.prototype = {
	initialize:function(state) {
        this.state = state;

		$("#sidebarTabs").tabs();
		let view = this;
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
		let hexInfo = $("#hexInfo");
		if (hex != null) {
            let hexSides = hex.hexSides;
            let info = `${hex.hexType.name}
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
		let canvas = document.getElementById('unitBoxCanvas');
        let context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width,canvas.height);

        if (hex != null) {
            let stack = hex.stack;
            if (stack !== null) {
                let currentTeam = this.state.getGame().currentPlayer.team;
                let isFowEnabled = this.state.isFowEnabled();

                let counters = stack.counters;
                if (counters !== null) {
                    let numCounters = counters.length;
                    let leaders = new Array();
                    for(let i = 0; i < numCounters; ++i) {
                        if (counters[i].type === wego.CounterType.LEADER) {
                            if (isFowEnabled) {
                                if (counters[i].getSpotted() || counters[i].player.team === currentTeam) {
                                    leaders.push(counters[i]);
                                }
                            } else {
                                leaders.push(counters[i]);
                            }
                        }
                    }

                    let leaderRows = Math.ceil(leaders.length / 2)
                    context.canvas.height = (wego.SpriteUtil.unitBoxHeight * numCounters) + 20 + (leaderRows * wego.SpriteUtil.leaderBoxHeight); //todo: do I really need to resize? could just set a max based on rules
                    for(let i = 0; i < leaders.length; ++i) {
                        let row = Math.floor(i / 2);
                        let column = (i % 2);
                        let baseY = row * wego.SpriteUtil.leaderBoxHeight;
                        let baseX = 60 * column;
                        let selected = (selectedCounters != null)?this.containsObject(leaders[i], selectedCounters):false;
                        this.drawLeader(context, baseX, baseY, leaders[i], selected);
                    }

                    let unitCount = 0;
                    for(let i = 0; i < numCounters; ++i) {
                        if (counters[i].type != wego.CounterType.LEADER) {
                            let displayCounter = true;
                            if (isFowEnabled) {
                                if (!counters[i].getSpotted() && counters[i].player.team !== currentTeam) {
                                    displayCounter = false;
                                }
                            }
                            
                            if (displayCounter) {
                                let baseY = unitCount * (wego.SpriteUtil.unitBoxHeight + 2) + (leaderRows * wego.SpriteUtil.leaderBoxHeight + 2);
                                let selected = (selectedCounters != null) ?this.containsObject(counters[i], selectedCounters):false;
                                console.log("unit selected: " + selected);
                                this.drawCounter(context, baseY, counters[i], selected);
                                ++unitCount;
                            }
                        }
                    }
                }
            }
        }
    },
    
    containsObject:function(obj, list) {
        let i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
    
        return false;
    },

	drawLeader:function(context, baseX, baseY, counter, selected) {
        let x = baseX + 2;
        let side = counter.player.team.name;
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
        if(counter.isFixed()) {
            imageIndex = wego.SpriteUtil.fixedSpriteIndex;
            wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, x-29, y-24);
        } else {
            context.fillText("M", x0, y);
            context.fillText(counter.getMovementFactor(), x, y);
        }

        context.fillStyle = "black";
        context.font = "10px Arial bold";
        context.textAlign = "center";
        context.fillText(counter.shortName, baseX + 30, baseY + 60);
        console.log("shortName " + counter.shortName);
	},

	drawCounter:function(context, baseY, counter, selected) {
	    let rowSpace = 19
	    let x = 3;

	    let side = counter.player.team.name;

	    let imageIndex = wego.SpriteUtil.getUnitBoxSpriteIndex(side, selected, false);
	    wego.SpriteUtil.drawSprite(context, "UnitBox", imageIndex, x, baseY);

	    wego.SpriteUtil.drawSprite(context, "Units", counter.unitImageIndex, x + 1, baseY + 1);

        context.font = "10px Arial";
        context.textAlign = "right";
        context.fillStyle = "white";

        x = 124;
        let y = baseY + 16;
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
        let range = this.state.getParametricData().getWeaponRange(counter.weapon);
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

        let formation = counter.getFormation();
        if (formation != wego.Formation.NONE) {
            imageIndex = wego.SpriteUtil.getFormationSpriteIndex(formation, counter.getFacing());
            wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, x + 16, y - 24);
        }

        let moraleStatus = counter.getMoraleStatus();
        if (moraleStatus == wego.MoraleType.ROUTED) {
            imageIndex = wego.SpriteUtil.routedSpriteIndex;
            wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, x + 34, y - 26);
        }

        if (counter.isFixed()) {
            imageIndex = wego.SpriteUtil.fixedSpriteIndex;
            wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, x - 1, y - 25);
        }

        //spotted sprite
        if (counter.getSpotted()) {
            wego.SpriteUtil.drawSprite(context, "Icons2d", 155, x + 57, y - 24);
        }

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
            let gameMode = this.state.getGameMode();
            let displayCounterName = (selectedCounters.length > 1)?true:false;
            for(let i = 0; i < selectedCounters.length; ++i) {
                let tasks = selectedCounters[i].getTasks(gameMode);
                
                if (displayCounterName) {
                     let html = `<li class="ui-widget-content ui-state-disabled">${selectedCounters[i].name}</li>`;
                 	$("#taskList").append(html);
                }
                
                for(let j = 0; j < tasks.length; ++j) {
                    let task = tasks[j];
                    let showDeleteButton = j > 0 && gameMode == wego.GameMode.PLAN;

                    let html = `<li class="ui-widget-content ui-state-enabled" data-counter-id="${selectedCounters[i].id}" data-task-slot="${j}">
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