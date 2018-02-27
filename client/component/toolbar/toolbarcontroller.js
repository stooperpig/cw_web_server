var wego = wego || {};

wego.ToolbarController = function(component) {
	this.component = component;
	this.state = null;
	this.currentUnitIndex = -1;
}

wego.ToolbarController.prototype = {
	canDirectFire:function() {
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
	},
	
	canOpportunityFire:function() {
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
	},
	
	directFireCommand:function() {
		wego.UiState.setCommandMode(wego.CommandMode.NONE);
		var canFire = canDirectFire();
		if (canFire) {
			wego.UiState.setCommandMode(wego.CommandMode.DIRECT_FIRE);
			wego.UiState.setStatusMessage("Select target hex");
		}
	},
	
	gameModeCommand:function(button) {
		if (wego.UiState.getGameMode() == wego.GameMode.PLAN) {
			wego.UiState.setGameMode(wego.GameMode.REPLAY);
		} else {
			wego.UiState.setGameMode(wego.GameMode.PLAN);
		}
	},
	
	initialize:function(state) {
		this.state = state;
		var controller = this;
		$("#losButton").button();
		$("#prevUnitButton").button().click(function() {controller.prevNextUnitCommand("prev");});
		$("#nextUnitButton").button().click(function() {controller.prevNextUnitCommand("next");});
		$("#opFireButton").button().click(controller.opportunityFireCommand);
		$("#waitButton").button().click(controller.waitCommand);
		$("#rotateLeftButton").button().click(function() {controller.rotateCommand("left")});
		$("#rotateRightButton").button().click(function() {controller.rotateCommand("right")});
		$("#reverseButton").button();
		$("#formationButton").button();
		
		$("#directFireButton").button().click(controller.directFireCommand);
		
		$('#gameModeButton').button().click(controller.gameModeCommand);
	},
	
	opportunityFireCommand:function() {
		this.state.setCommandMode(wego.CommandMode.NONE);
		var canFire = canOpportunityFire();
		if (canFire) {
			var selectedCounters = wego.UiState.getSelectedCounters();
			for(var i = 0; i < selectedCounters.length; ++i) {
				selectedCounters[i].opportunityFire();
			}
			this.state.setStatusMessage("Opportunity fire task added");
			this.state.setCurrentHex(wego.UiState.getCurrentHex(),selectedCounters);
			//todo should be -> updateTaskList();
		}
	},
	
	prevNextUnitCommand:function(direction) {
		var player = this.state.getGame().getCurrentPlayer();
		var mode = this.state.getGameMode();
		var time = this.state.getTime();
		var result = null;
		if (direction == "next") {
			result = player.getNextUnit(mode, time, this.currentUnitIndex);
		} else {
			result = player.getPrevUnit(mode, time, this.currentUnitIndex);
		}
		
		var unit = result.unit;
		console.log("unit: " + unit);
		console.log("next index: " + result.nextIndex);
		
		if (unit != null) {
			this.currentUnitIndex = result.nextIndex;
			var hex = unit.getHex(mode, time);
			if (hex != null) {
				var selectedUnits = new Array(unit);
				this.state.setCurrentHex(hex, selectedUnits);
			}
		} else {
			this.state.setStatusMessage("All units have been moved/fired");
		}	
	},

	canRotate:function(counter) {
		var returnValue = false;
		if (counter.isReady()) {
			var lastTask = counter.getLastTask();
			if (lastTask.movementFactor >= 2) {
				returnValue = true;
			}
		}
		return returnValue;
	},

	rotateCommand:function(direction) {
		this.state.setStatusMessage("");
		var gameMode = this.state.getGameMode();
		var time = this.state.getTime();
		var selectedCounters = this.state.getSelectedCounters();

		if (selectedCounters != null && selectedCounters.length > 0) {
			var allCanRotate = true;
			for(var i = 0; i < selectedCounters.length; ++i) {
				if (!this.canRotate(selectedCounters[i])) {
					allCanRotate = false;
					break;
				}
			}

			if (allCanRotate) {
				var hex = this.state.getCurrentHex();
				for(var i = 0; i < selectedCounters.length; ++i) {
					var counter = selectedCounters[i];
					var lastTask = counter.getLastTask();
					var facing = lastTask.facing;
					var newFacing = facing;
					if (direction == "left") {
						newFacing = (facing == 0)?5:facing - 1;
					} else {
						newFacing = (facing == 5)?0:facing + 1;
					}
					var task = lastTask.clone(wego.TaskType.ROTATE_LEFT, 2, lastTask.movementFactor - 2);
					task.facing = newFacing;
					counter.addTask(task);
				}
				this.state.setCurrentHex(hex, selectedCounters, ++time);
			} else {
				this.state.setStatusMessage("One or more of the units are unable to rotate");
			}
		} else {
			this.state.setStatusMessage("No units selected");
		}
	},
	
	waitCommand:function() {
		var selectedCounters = wego.UiState.getSelectedCounters();
		if (selectedCounters.length > 0) {
			for(var i = 0; i < selectedCounters.length; ++i) {
				if (!selectedCounters[i].isFinished()) {
					selectedCounters[i].wait();
				} else {
					wego.UiState.setStatusMessage("Unit " + selectedCounters[i].toString() + " can not WAIT");
				}
			}
			
			this.state.setCurrentHex(wego.UiState.getCurrentHex(),selectedCounters);
			//todo should be -> updateTaskList();
		} else {
			wego.UiState.setStatusMessage("No units selected");
		}
	}
};