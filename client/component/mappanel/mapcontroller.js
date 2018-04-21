var wego = wego || {};

wego.MapController = function(component) {
	this.component = component;
	this.state = null;
}

wego.MapController.prototype = {
	initialize:function(state) {
		this.state = state;
		var controller = this;

		$('#mainMapCanvas').on('contextmenu',function() {return false;});

		$("#targetList").bind('mousedown', function (e) {
			e.metaKey = true;
		}).selectable();
		
		$("#dialog-form").dialog({
			autoOpen: false, height: 300, width: 350, modal: true,
			buttons: {
				"Select Targets": function() {
					controller.directFire();
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			close: function() {
			}
		});

		$('#mainMapCanvas').bind('mouseup',function(event) {
			var that = this;
			setTimeout(function() {
				var dblclick = parseInt($(that).data('double'), 10);
				if (dblclick > 0) {
					$(that).data('double', 0);
				} else {
					controller.singleClick.call(controller, event);
				}
			}, 100);
		}).dblclick(function(event) {
		    $(this).data('double', 2);
		    controller.doubleClick.call(controller, event);
		});
	},
	
	// directFire:function() {
	// 	var targets = this.getSelectedTargets();
	// 	if (targets.length > 0) {
	// 		var selectedCounters = wego.UiState.getSelectedCounters();
	// 		for(var i = 0; i < selectedCounters.length; ++i) {
	// 			selectedCounters[i].directFire(mTargetHex,targets);
	// 		}
	// 		this.setCurrentHex(this.state.getCurrentHex(),selectedCounters);
	// 		wego.UiState.setCommandMode(mCommandMode.NONE);
	// 	} else {
	// 		wego.UiState.setStatusMessage("No targets selected");
	// 	}
	// },
	
	// getSelectedTargets:function() {
	// 	return this.getCounterSelection("#targetList",wego.UiState.getTargetHex());
	// },
	
	// getCounterSelection:function(list,hex) {
	// 	var returnValue = new Array();
	// 	var selectedItems = $(list).children(".ui-selected");
	// 	if (selectedItems.length > 0) {
	// 		var selectedCounters = new Array();
	// 		var stack = hex.getStack();
	// 		var counters = stack.counters;
	// 		for(var i = 0; i < selectedItems.length; ++i) {
	// 			var counterId = parseInt(selectedItems[i].getAttribute("data-counter-id"));
	// 			for(var j = 0; j < counters.length; ++j) {
	// 				if (counters[j].getId() == counterId) {
	// 					returnValue.push(counters[j]);
	// 					break;
	// 				}
	// 			}
	// 		}
	// 	}
	// 	return returnValue;
	// },
	
	getHex:function(event) {
		var hexMap = this.state.getMap();
		var posX = $(event.target).offset().left;
		var posY = $(event.target).offset().top;
		var coord = hexMap.pointToHex((event.pageX - posX) , (event.pageY - posY));
		//console.log("clicked on hex (" + coord.col + "," + coord.row + ") point (" + posX + "," + posY + ")");
		hex = hexMap.getHex(coord.col, coord.row);
		return hex;
	},
	
	singleClick:function(event) {
		wego.UiState.clearStatusMessage();
		var hex = this.getHex(event);
		
		if (hex != null) {
			var commandMode = wego.UiState.getCommandMode();
			switch(commandMode) {
				case wego.CommandMode.INDIRECT_FIRE:
					var canFire = this.canIndirectFire(hex);
					if (canFire) {
						var selectedCounters = wego.UiState.getSelectedCounters();
						for(var i = 0; i < selectedCounters.length; ++i) {
							selectedCounters[i].indirectFire(hex);
						}
						this.state.setCurrentHex(wego.UiState.getCurrentHex(),selectedCounters);
						this.state.setCommandMode(wego.CommandMode.NONE);
					}
					break;
				case wego.CommandMode.DIRECT_FIRE:
					var canFire = this.canDirectFire(hex);
					if (canFire) {
						this.state.setTargetHex(hex);
						this.updateTargetList(hex);
						$( "#dialog-form" ).dialog( "open" );
					}
					break;
				default:
					var gameMode = wego.UiState.getGameMode();
					if (event.button == 0) {
						this.state.setCurrentHex(hex,null);
					} else if (gameMode == wego.GameMode.PLAN){
						this.state.setCommandMode(wego.CommandMode.NONE);
						var currentHex = wego.UiState.getCurrentHex();
						if (currentHex != null) {
							console.log("is adj: " + currentHex.isAdjacent(hex));
							if (currentHex.isAdjacent(hex)) {
								var selectedCounters = wego.UiState.getSelectedCounters();
								if (selectedCounters.length > 0) {
									this.moveCounters(selectedCounters,hex);
								} else {
									this.state.setStatusMessage("No units are selected");
								}
							} else {
								this.state.setStatusMessage("Hex is not adjacent to current hex");
							}
						}
					} else {
						this.state.setStatusMessage("You can not move units in Replay Mode");
					}
					break;
			}
		} else {
			this.state.setStatusMessage("Not a valid hex");
		}
	},
	
	updateTargetList:function(hex) {
		wego.MainController.updateCounterList("#targetList",hex,null);
	},
	
	doubleClick:function(event) {
		this.state.setCommandMode(wego.CommandMode.NONE);
		this.state.clearStatusMessage();

		hex = this.getHex(event);
		
		var stack = hex.stack;
		if (stack != null) {
			var counters = stack.counters;
			var selectedCounters = new Array();
			if (counters != null) {
				var currentPlayer = this.state.getGame().currentPlayer;
				for(var i = 0; i < counters.length; ++i) {
					if (currentPlayer == counters[i].player) {
						selectedCounters.push(counters[i]);
					}
				}
			}

			this.state.setCurrentHex(hex,selectedCounters);
		} else {
			this.state.setCurrentHex(hex,null);
		}
	},
	
	// canDirectFire:function(hex) {
	// 	var returnValue = false;
	// 	var selectedCounters = wego.UiState.getSelectedCounters();
	// 	if (selectedCounters.length > 0) {
	// 		returnValue = true;
	// 		for(var i = 0; i < selectedCounters.length; ++i) {
	// 			if (!selectedCounters[i].canDirectFire(hex)) {
	// 				returnValue = false;
	// 				break;
	// 			}
	// 		}
			
	// 		if (!returnValue) {
	// 			wego.UiState.setStatusMessage("One of the units can not direct fire");
	// 		}
	// 	} else {
	// 		wego.UiState.setStatusMessage("No units selected");
	// 	}
		
	// 	return returnValue;
	// },

	getMovementCost(counter, toHex) {
		return 2;
	},

	canMove:function(counter, toHex) {
		var returnValue = false;
		if (counter.isReady()) {
			if (counter.type == wego.CounterType.ARTILLERY && counter.getFormation() == wego.Formation.LINE) {
				returnValue = false;
			} else {
				var cost = this.getMovementCost(counter, toHex);
				var lastTask = counter.getLastTask();
				if (lastTask.movementFactor >= cost) {
					returnValue = true;
				}
			}
		}
		return returnValue;
	},
	
	moveCounters:function(counters, toHex) {
		var allCanMove = true;
		for(var i = 0; i < counters.length; ++i) {
			if(!this.canMove(counters[i], toHex)) {
				allCanMove = false;
				break;
			}
		}
		
		if (allCanMove) {
			for(var i = 0; i < counters.length; ++i) {
				var counter = counters[i];
				var cost = this.getMovementCost(counter, toHex);
				var lastTask = counter.getLastTask();
				var task = lastTask.clone(wego.TaskType.MOVE, 2, lastTask.movementFactor - 2);
				switch(lastTask.formation) {
					case wego.Formation.COLUMN:
						task.facing = task.hex.getSharedHexSideIndex(toHex);
					break;
				}
				var formation = lastTask.formation;
				task.hex = toHex;
				counter.addTask(task);
			}

			this.state.setCurrentHex(toHex,counters);
		} else {
			this.state.setStatusMessage("One or more of the counters can not complete the move");
		}
	}
};