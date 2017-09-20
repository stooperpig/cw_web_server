var wego = wego || {};

wego.ToolbarController = (function() {
	var mCurrentUnitIndex = -1;
	
	function canDirectFire() {
		var returnValue = false;
		var selectedCounters = wego.UiState.getSelectedCounters();
		if (selectedCounters.length > 0) {
			returnValue = true;
			for(var i = 0; i < selectedCounters.length; ++i) {
				if (!selectedCounters[i].canDirectFire(null)) {
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
	
	function canIndirectFire() {
		var returnValue = false;
		var selectedCounters = wego.UiState.getSelectedCounters();
		if (selectedCounters.length > 0) {
			returnValue = true;
			for(var i = 0; i < selectedCounters.length; ++i) {
				if (!selectedCounters[i].canIndirectFire(null)) {
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
	
	function canOpportunityFire() {
		var returnValue = false;
		var selectedCounters = wego.UiState.getSelectedCounters();
		if (selectedCounters.length > 0) {
			returnValue = true;
			for(var i = 0; i < selectedCounters.length; ++i) {
				if (!selectedCounters[i].canOpportunityFire()) {
					returnValue = false;
					break;
				}
			}
			
			if (!returnValue) {
				wego.UiState.setStatusMessage("One of the units can not opportunity fire");
			}
		} else {
			wego.UiState.setStatusMessage("No units selected");
		}
		
		return returnValue;
	}
	
	function directFireCommand() {
		wego.UiState.setCommandMode(wego.CommandMode.NONE);
		var canFire = canDirectFire();
		if (canFire) {
			wego.UiState.setCommandMode(wego.CommandMode.DIRECT_FIRE);
			wego.UiState.setStatusMessage("Select target hex");
		}
	}
	
	function enableDisableCommandButtons(mode) {
		$("#loadUnloadButton").button("option","disabled",mode);
		$("#opFireButton").button("option","disabled",mode);
		$("#waitButton").button("option","disabled",mode);
		$("#directFireButton").button("option","disabled",mode);
		$("#indirectFireButton").button("option","disabled",mode);
	}
	
	function gameModeCommand(button) {
	debugger;
		if (wego.UiState.getGameMode() == wego.GameMode.PLAN) {
			wego.UiState.setGameMode(wego.GameMode.REPLAY);
		} else {
			wego.UiState.setGameMode(wego.GameMode.PLAN);
		}
	}
	
	function indirectFireCommand() {
		wego.UiState.setCommandMode(wego.CommandMode.NONE);
		var canFire = canIndirectFire();
		if (canFire) {
			wego.UiState.setCommandMode(wego.CommandMode.INDIRECT_FIRE);
			wego.UiState.setStatusMessage("Select target hex");
		}
	}
	
	function initialize() {
		$("#losButton").button();
		$("#prevUnitButton").button().click(function() {prevNextUnitCommand("prev");});
		$("#nextUnitButton").button().click(function() {prevNextUnitCommand("next");});
		$("#loadUnloadButton").button().click(loadUnloadCommand);
		$("#opFireButton").button().click(opportunityFireCommand);
		$("#waitButton").button().click(waitCommand);
		
		$("#directFireButton").button().click(directFireCommand);
		$("#indirectFireButton").button().click(indirectFireCommand);
		
		$('#gameModeButton').button().click(gameModeCommand);

		amplify.subscribe(wego.Topic.GAME_MODE,function() {
		    var button = $('#gameModeButton span');
		    if (wego.UiState.getGameMode() == wego.GameMode.PLAN) {
			    button.html(wego.GameMode.PLAN);
			    enableDisableCommandButtons(false);
		    } else {
    			button.html(wego.GameMode.REPLAY);
    			enableDisableCommandButtons(true);
    		}
        });
	}
	
	function loadUnloadCommand() {
		wego.UiState.setCommandMode(wego.CommandMode.NONE);
		
		var enterExitFort = false;
		var selectedCounters = wego.UiState.getSelectedCounters();
		
		for(var i = 0; i < selectedCounters.length && !enterExitFort; ++i) {
			enterExitFort = selectedCounters[i].isFort();
		}
		
		if (enterExitFort) {
			console.log("this is a fort load/unload");
			if (selectedCounters.length == 1) {
				wego.UiState.setStatusMessage("Invalid number of units selected");
			} else {
				var enteringCounters = new Array();
				var exitingCounters = new Array();
				var fort = null;
				
				for(var i = 0; i < selectedCounters.length; ++i) {
					var counter = selectedCounters[i];
					
					if (counter.isFort()) {
						fort = counter;
					} else {
						var transport = counter.getTransport();
						if (transport == null) {
							enteringCounters.push(counter);
						} else {
							exitingCounters.push(counter);
						}
					}
				}
				
				console.log("fort: " + fort.toString());
				console.log("entering counters: " + enteringCounters.length);
				console.log("existing counters: " + exitingCounters.length);
				
				
				
			}
		} else if (selectedCounters.length == 1) {
			var counter = selectedCounters[0];
			var passengers = counter.getPassengers();
			if (passengers != null && passengers.length > 0) {
				var passengersCanUnload = true;
				for(var i = 0; i < passengers.length && passengersCanUnload; ++i) {
					passengersCanUnload = passengers[i].canUnload(); 
				}
				
				if (passengersCanUnload && counter.canUnload()) {
					counter.unload();
					
					for(var i = 0; i < passengers.length; ++i) {
						passengers[i].unLoad(); 
					}
					setCurrentHex(wego.UiState.getCurrentHex(),selectedCounters);
				} else {
					wego.UiState.setStatusMessage("Can not unload if transport or passenger(s) has moved/fired");
				}
			} else {
				wego.UiState.setStatusMessage("Unit does not have passengers");
			}
		} else if (selectedCounters.length == 2) { //fix to handle multiple passengers
			var unit0 = selectedCounters[0];
			var unit1 = selectedCounters[1];
			if (unit0.canLoad(unit1) && unit1.canLoad(unit0)) {
				unit0.load(unit1);
				unit1.load(unit0);
				setCurrentHex(wego.UiState.getCurrentHex(),selectedCounters);
			} else {
				wego.UiState.setStatusMessage("Units are unable to load");
			}
		} else {
			wego.UiState.setStatusMessage("Invalid number of units selected");
		}
	}	

	function opportunityFireCommand() {
		wego.UiState.setCommandMode(wego.CommandMode.NONE);
		var canFire = canOpportunityFire();
		if (canFire) {
			var selectedCounters = wego.UiState.getSelectedCounters();
			for(var i = 0; i < selectedCounters.length; ++i) {
				selectedCounters[i].opportunityFire();
			}
			wego.UiState.setStatusMessage("Opportunity fire task added");
			setCurrentHex(wego.UiState.getCurrentHex(),selectedCounters);
			//todo should be -> updateTaskList();
		}
	}
	
	function prevNextUnitCommand(direction) {
		var player = wego.Game.getCurrentPlayer();
		var result = null;
		if (direction == "next") {
			result = player.getNextUnit(mCurrentUnitIndex);
		} else {
			result = player.getPrevUnit(mCurrentUnitIndex);
		}
		
		var unit = result.unit;
		console.log("unit: " + unit);
		console.log("next index: " + result.nextIndex);
		
		if (unit != null) {
			mCurrentUnitIndex = result.nextIndex;
			var hex = unit.getHex();
			if (hex != null) {
				var selectedUnits = new Array(unit);
				setCurrentHex(hex,selectedUnits);
			}
		} else {
			wego.UiState.setStatusMessage("All units have been moved/fired");
		}	
	}
	
	function setCurrentHex(hex,selectedCounters) {
		wego.UiState.setCurrentHex(hex,selectedCounters);
		wego.MainController.drawMap();
	}
	
	function waitCommand() {
		var selectedCounters = wego.UiState.getSelectedCounters();
		if (selectedCounters.length > 0) {
			for(var i = 0; i < selectedCounters.length; ++i) {
				if (!selectedCounters[i].isFinished()) {
					selectedCounters[i].wait();
				} else {
					wego.UiState.setStatusMessage("Unit " + selectedCounters[i].toString() + " can not WAIT");
				}
			}
			
			setCurrentHex(wego.UiState.getCurrentHex(),selectedCounters);
			//todo should be -> updateTaskList();
		} else {
			wego.UiState.setStatusMessage("No units selected");
		}
	}
	
	return {
		initialize : initialize
	}
})();