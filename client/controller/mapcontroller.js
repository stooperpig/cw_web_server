var wego = wego || {};

wego.MapController = (function() {
	function initialize() {
		$('#mainMapCanvas').on('contextmenu',function() {return false;});
		//$('#mainMapCanvas').bind('mouseDown',function() {});
		//$('#mainMapCanvas').bind('mousemove',function() {},false);
		//$('#mainMapCanvas').bind('mouseup',canvasMouseUp);
		//$('#mainMapCanvas').bind('dblclick',canvasDoubleClick);
		
		$("#targetList").bind('mousedown', function (e) {
			e.metaKey = true;
		}).selectable();
		
		$("#dialog-form").dialog({
			autoOpen: false, height: 300, width: 350, modal: true,
			buttons: {
				"Select Targets": function() {
					directFire();
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
					singleClick.call(that, event);
				}
			}, 100);
		}).dblclick(function(event) {
		    $(this).data('double', 2);
		    doubleClick.call(this, event);
		});
	}
	
	function directFire() {
		var targets = getSelectedTargets();
		if (targets.length > 0) {
			var selectedCounters = wego.UiState.getSelectedCounters();
			for(var i = 0; i < selectedCounters.length; ++i) {
				selectedCounters[i].directFire(mTargetHex,targets);
			}
			setCurrentHex(wego.UiState.getCurrentHex(),selectedCounters);
			wego.UiState.setCommandMode(mCommandMode.NONE);
		} else {
			wego.UiState.setStatusMessage("No targets selected");
		}
	}
	
	function getSelectedTargets() {
		return getCounterSelection("#targetList",wego.UiState.getTargetHex()
				 );
	}
	
	function getCounterSelection(list,hex) {
		var returnValue = new Array();
		var selectedItems = $(list).children(".ui-selected");
		if (selectedItems.length > 0) {
			var selectedCounters = new Array();
			var stack = hex.getStack();
			var counters = stack.getCounters();
			for(var i = 0; i < selectedItems.length; ++i) {
				var counterId = parseInt(selectedItems[i].getAttribute("data-counter-id"));
				for(var j = 0; j < counters.length; ++j) {
					if (counters[j].getId() == counterId) {
						returnValue.push(counters[j]);
						break;
					}
				}
			}
		}
		return returnValue;
	}
	
	function getHex(event) {
		var hexMap = wego.Map;
		var posX = $(event.target).offset().left;
		var posY = $(event.target).offset().top;
		var coord = hexMap.pointToHex((event.pageX - posX) , (event.pageY - posY));
		console.log("clicked on hex (" + coord.col + "," + coord.row + ") point (" + posX + "," + posY + ")");
		hex = hexMap.getHex(coord.col, coord.row);
		return hex;
	}
	
	function singleClick(event) {
		wego.UiState.clearStatusMessage();
		var hex = getHex(event);
		
		if (hex != null) {
			var commandMode = wego.UiState.getCommandMode();
			switch(commandMode) {
				case wego.CommandMode.INDIRECT_FIRE:
					var canFire = canIndirectFire(hex);
					if (canFire) {
						var selectedCounters = wego.UiState.getSelectedCounters();
						for(var i = 0; i < selectedCounters.length; ++i) {
							selectedCounters[i].indirectFire(hex);
						}
						setCurrentHex(wego.UiState.getCurrentHex(),selectedCounters);
						wego.UiState.setCommandMode(wego.CommandMode.NONE);
					}
					break;
				case wego.CommandMode.DIRECT_FIRE:
					var canFire = canDirectFire(hex);
					if (canFire) {
						wego.UiState.setTargetHex(hex);
						updateTargetList(hex);
						$( "#dialog-form" ).dialog( "open" );
					}
					break;
				default:
					var gameMode = wego.UiState.getGameMode();
					if (event.button == 0) {
						setCurrentHex(hex,null);
					} else if (gameMode == wego.GameMode.PLAN){
						wego.UiState.setCommandMode(wego.CommandMode.NONE);
						var currentHex = wego.UiState.getCurrentHex();
						if (currentHex != null) {
							console.log("is adj: " + currentHex.isAdjacent(hex));
							if (currentHex.isAdjacent(hex)) {
								var selectedCounters = wego.UiState.getSelectedCounters();
								if (selectedCounters.length > 0) {
									moveCounters(selectedCounters,hex);
								} else {
									wego.UiState.setStatusMessage("No units are selected");
								}
							} else {
								wego.UiState.setStatusMessage("Hex is not adjacent to current hex");
							}
						}
					} else {
						wego.UiState.setStatusMessage("You can not move units in Replay Mode");
					}
					break;
			}
		} else {
			wego.UiState.setStatusMessage("Not a valid hex");
		}
	}
	
	function updateTargetList(hex) {
		wego.MainController.updateCounterList("#targetList",hex,null);
	}
	
	function doubleClick(event) {
		var uiState = wego.UiState;
		
		uiState.setCommandMode(wego.CommandMode.NONE);
		
		wego.UiState.clearStatusMessage();

		hex = getHex(event);
		
		var stack = hex.getStack();
		if (stack != null) {
			var counters = stack.getCounters();
			var selectedCounters = new Array();
			var currentPlayer = wego.Game.getCurrentPlayer();
			for(var i = 0; i < counters.length; ++i) {
				if (currentPlayer == counters[i].getPlayer()) {
					selectedCounters.push(counters[i]);
				}
			}
			setCurrentHex(hex,selectedCounters);
		} else {
			setCurrentHex(hex);
		}
	}
	
	function canDirectFire(hex) {
		var returnValue = false;
		var selectedCounters = wego.UiState.getSelectedCounters();
		if (selectedCounters.length > 0) {
			returnValue = true;
			for(var i = 0; i < selectedCounters.length; ++i) {
				if (!selectedCounters[i].canDirectFire(hex)) {
					returnValue = false;
					break;
				}
			}
			
			if (!returnValue) {
				wego.UiState.setStatusMessage("One of the units can not direct fire");
			}
		} else {
			wego.UiState.setStatusMessage("No units selected");
		}
		
		return returnValue;
	}
	
	function canIndirectFire(hex) {
		var returnValue = false;
		var selectedCounters = wego.UiState.getSelectedCounters();
		if (selectedCounters.length > 0) {
			returnValue = true;
			for(var i = 0; i < selectedCounters.length; ++i) {
				if (!selectedCounters[i].canIndirectFire(hex)) {
					returnValue = false;
					break;
				}
			}
			
			if (!returnValue) {
				wego.UiState.setStatusMessage("One of the units can not indirect fire");
			}
		} else {
			wego.UiState.setStatusMessage("No units selected");
		}
		
		return returnValue;
	}
	
	function moveCounters(counters,toHex) {
		var allCanMove = true;
		for(var i = 0; i < counters.length; ++i) {
			var canMove = (counters[i].isReady() && counters[i].canMoveTo(toHex));
			if (!canMove) {
				allCanMove = false;
				break;
			}
		}
		
		if (allCanMove) {
			for(var i = 0; i < counters.length; ++i) {
				counters[i].moveTo(toHex,(counters.length == 1));
			}
			setCurrentHex(toHex,counters);
		} else {
			wego.UiState.setStatusMessage("One of the counters can not complete the move");
		}
	}
	
	function setCurrentHex(hex,selectedCounters) {
		wego.UiState.setCurrentHex(hex,selectedCounters);
		wego.MainController.drawMap();
	}
	
	return {
		initialize : initialize
	}
})();