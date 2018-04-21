var wego = wego || {};

wego.UnitPanelController = function(component) {
    this.component = component;
    this.state = null;
};

wego.UnitPanelController.prototype = {
	deleteTask:function(counterId,taskSlot) {
        var selectedCounters = this.state.getSelectedCounters();
		 for(var j = 0; j < selectedCounters.length; ++j) {
		 	var counter = selectedCounters[j];
		 	if (counter.id == counterId) {
                var lastTask = counter.getLastTask();
                var lastHex = lastTask.hex;
                counter.deleteTask(taskSlot);
                var hex = counter.getHex();
                if (hex != lastHex) {
                    lastHex.removeCounter(counter);
                    hex.addCounter(counter);
                }
		        this.state.setCurrentHex(hex,[counter]);
				break;
		 	}
		}
	},
	
	handleSelectTask:function(event,ui) {
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
					//wego.MainController.drawMap();
					break;
				}
			}
		} else {
			alert("not updating");
		}
	},
	
	initialize:function(state) {
        this.state = state;	
        var controller = this;
		$("#unitBoxCanvas").bind('mousedown', function (e) {
			e.metaKey = true;
	        console.log("click event: " + e);
	        var counter = controller.getCounter(e);
            console.log("clicked counter: " + counter);
            var currentPlayer = controller.state.getGame().currentPlayer;
            if (counter != null && counter.player.id == currentPlayer.id) {
                var selectedCounters = controller.state.getSelectedCounters();
                if (selectedCounters != null) {
                    var index = selectedCounters.indexOf(counter);
                    if (index != -1) {
                        selectedCounters.splice(index,1);
                    } else {
                        selectedCounters.push(counter);
                    }
                } else {
                    selectedCounters = new Array();
                    selectedCounters.push(counter);
                }

                controller.state.setSelectedCounters(selectedCounters);
            }
		});
		
		$("#taskList").bind('mousedown', function (e) {
			e.metaKey = true;
		}).selectable({
			selected: controller.handleSelectTask,
			unselected: controller.handleSelectTask,
			filter:".ui-state-enabled"
		});
	},

    getCounter:function(event) {
        var counter = null;
        var posX = $(event.target).offset().left;
        var posY = $(event.target).offset().top;
        var x = event.pageX - posX;
        var y = event.pageY - posY;
        console.log("clickEvent: (" + x + "," + y + ")");

        var currentHex = this.state.getCurrentHex();
        if (currentHex != null) {
            var stack = currentHex.stack;
            if (stack != null) {
                var counters = stack.counters;
                var leaders = this.getLeaders(counters);

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
                        var units = this.getUnits(counters);
                        counter = units[unitRow];    
                    }
                } else {
                    console.log("clicked on a leader");
                    var leaderRow = Math.floor(y / (wego.SpriteUtil.leaderBoxHeight));
                    var leaderColumn = Math.floor(x / (wego.SpriteUtil.leaderBoxWidth));
                    var leaderIndex = (leaderRow * 2) + leaderColumn;
                    counter = leaders[leaderIndex];    
                    console.log("clicked on leader " + leaderRow + "," + leaderColumn + " -> " + leaderIndex);
                }
            }
        }

        //var coord = hexMap.pointToHex((event.pageX - posX) , (event.pageY - posY));
        //console.log("clicked on hex (" + coord.col + "," + coord.row + ") point (" + posX + "," + posY + ")");
        //hex = hexMap.getHex(coord.col, coord.row);
        return counter;
    },
	   
    getUnits:function(counters) {
        var units = new Array();
        var numCounters = counters.length;
        for(var i = 0; i < numCounters; ++i) {
            if (counters[i].type != "L") {
                units.push(counters[i]);
            }
        }
        return units;
    },

	getLeaders:function(counters) {
	    var leaders = new Array();
        var numCounters = counters.length;
        for(var i = 0; i < numCounters; ++i) {
            if (counters[i].type == "L") {
                leaders.push(counters[i]);
            }
        }
        return leaders;
	}
};