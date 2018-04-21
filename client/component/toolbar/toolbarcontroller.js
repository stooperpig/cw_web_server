var wego = wego || {};

wego.ToolbarController = function(component) {
	this.component = component;
	this.state = null;
	this.currentUnitIndex = -1;
}

wego.ToolbarController.prototype = {
	canDirectFire:function() {
		var returnValue = false;
		var selectedCounters = this.state.getSelectedCounters();
		if (selectedCounters.length > 0) {
			returnValue = true;
			for(var i = 0; i < selectedCounters.length; ++i) {
				if (!selectedCounters[i].canDirectFire(null)) {
					returnValue = false;
					break;
				}
			}
			
			if (!returnValue) {
				this.state.setStatusMessage("One of the units can not direct fire");
			}
		} else {
			this.state.setStatusMessage("No units selected");
		}
		
		return returnValue;
	},
	
	canOpportunityFire:function() {
		var returnValue = false;
		var selectedCounters = this.state.getSelectedCounters();
		if (selectedCounters.length > 0) {
			returnValue = true;
			for(var i = 0; i < selectedCounters.length; ++i) {
				if (!selectedCounters[i].canOpportunityFire()) {
					returnValue = false;
					break;
				}
			}
			
			if (!returnValue) {
				this.state.setStatusMessage("One of the units can not opportunity fire");
			}
		} else {
			this.state.setStatusMessage("No units selected");
		}
		
		return returnValue;
	},
	
	directFireCommand:function() {
		this.state.setCommandMode(wego.CommandMode.NONE);
		var canFire = canDirectFire();
		if (canFire) {
			this.state.setCommandMode(wego.CommandMode.DIRECT_FIRE);
			this.state.setStatusMessage("Select target hex");
		}
	},
	
	gameModeCommand:function(button) {
		if (this.state.getGameMode() == wego.GameMode.PLAN) {
			this.state.setGameMode(wego.GameMode.REPLAY);
		} else {
			this.state.setGameMode(wego.GameMode.PLAN);
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
		$("#aboutFaceButton").button().click(function() {controller.rotateCommand("aboutFace")});
		$("#formationButton").button().click(function() {controller.formationCommand()});
		
		$("#directFireButton").button().click(function() {controller.directFireCommand()});
		
		$('#gameModeButton').button().click(function() {controller.gameModeCommand()});
	},
	
	opportunityFireCommand:function() {
		this.state.setCommandMode(wego.CommandMode.NONE);
		var canFire = canOpportunityFire();
		if (canFire) {
			var selectedCounters = this.state.getSelectedCounters();
			for(var i = 0; i < selectedCounters.length; ++i) {
				selectedCounters[i].opportunityFire();
			}
			this.state.setStatusMessage("Opportunity fire task added");
			this.state.setCurrentHex(this.state.getCurrentHex(),selectedCounters);
			//todo should be -> updateTaskList();
		}
	},
	
	prevNextUnitCommand:function(direction) {
		debugger;
		var player = this.state.getGame().currentPlayer;
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

	canRotate:function(counter, cost) {
		var returnValue = false;
		if (counter.isReady()) {
			switch(counter.type) {
				case wego.CounterType.SUPPLY:
				case wego.CounterType.LEADER:
					returnValue = true;
				break;
				default:
					var lastTask = counter.getLastTask();
					if (lastTask.movementFactor >= cost) {
						returnValue = true;
					}
				break;
			}
		}
		return returnValue;
	},

	rotateCommand:function(direction) {
		this.state.setStatusMessage("");
		var gameMode = this.state.getGameMode();
		var time = this.state.getTime();
		var selectedCounters = this.state.getSelectedCounters();
		var parametricData = this.state.getParametricData();

		if (selectedCounters != null && selectedCounters.length > 0) {
			var allCanRotate = true;
			for(var i = 0; i < selectedCounters.length; ++i) {
				var cost = 0;
				if (direction == "aboutFace") {
					cost = parametricData.getAboutFaceCost(selectedCounters[i].type);
				} else {
					cost = parametricData.getRotationCost(selectedCounters[i].type);
				}
				if (!this.canRotate(selectedCounters[i],cost)) {
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
					var task = null;
					var cost = 0;

					if (direction == "left") {
						cost = parametricData.getRotationCost(counter.type);
						newFacing = (facing == 0)?5:facing - 1;
						task = lastTask.clone(wego.TaskType.ROTATE_LEFT, cost, lastTask.movementFactor - cost);
					} else if (direction == "right") {
						cost = parametricData.getRotationCost(counter.type);
						newFacing = (facing == 5)?0:facing + 1;
						task = lastTask.clone(wego.TaskType.ROTATE_RIGHT, cost, lastTask.movementFactor - cost);
					} else {
						newFacing = (facing + 3) % 6;
						cost = parametricData.getAboutFaceCost(counter.type);
						task = lastTask.clone(wego.TaskType.ABOUT_FACE, cost, lastTask.movementFactor - cost);
					}

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

	canChangeFormation:function(counter) {
		var returnValue = false;
		if (counter.isReady()) {
			var lastTask = counter.getLastTask();
			switch(counter.type) {
				case wego.CounterType.SUPPLY:
					returnValue = false;
				break;
				case wego.CounterType.LEADER:
					returnValue = true;
				break;
				case wego.CounterType.CAVALRY:
				case wego.CounterType.ARTILLERY:
					var formationChangeCost = this.state.getParametricData().getFormationChangeCost(counter.type);
					returnValue = (lastTask.movementFactor >= formationChangeCost);
				break;
				case wego.CounterType.INFANTRY:
					returnValue = (lastTask.type == wego.TaskType.INITIAL);
				break;
			}
		}
		return returnValue;
	},

	formationCommand:function() {
		debugger;
		this.state.setStatusMessage("");
		var gameMode = this.state.getGameMode();
		var time = this.state.getTime();
		var selectedCounters = this.state.getSelectedCounters();

		if (selectedCounters != null && selectedCounters.length > 0) {
			var allCanChangeFormation = true;
			for(var i = 0; i < selectedCounters.length; ++i) {
				if (!this.canChangeFormation(selectedCounters[i])) {
					allCanChangeFormation = false;
					break;
				}
			}

			if (allCanChangeFormation) {
				var hex = this.state.getCurrentHex();
				for(var i = 0; i < selectedCounters.length; ++i) {
					var counter = selectedCounters[i];
					var lastTask = counter.getLastTask();
					var task = null;
					var newFormation = wego.Formation.LINE

					if (lastTask.formation == wego.Formation.LINE) {
						newFormation = wego.Formation.COLUMN;
					}

					var formationChangeCost = this.state.getParametricData().getFormationChangeCost(counter.type);
					switch(counter.type) {
						case wego.CounterType.CAVALRY:
						case wego.CounterType.LEADER:
							var lineMovementAllowance = this.state.getParametricData().getMovementAllowance(counter.type, wego.Formation.LINE);
							var columnMovementAllowance = this.state.getParametricData().getMovementAllowance(counter.type, wego.Formation.COLUMN);
							var movementFactor = 0;
							if (newFormation == wego.Formation.LINE) {
								movementFactor = lineMovementAllowance - ((columnMovementAllowance - lastTask.movementFactor + formationChangeCost) / 2);
							} else {
								movementFactor = columnMovementAllowance - ((lineMovementAllowance - lastTask.movementFactor + formationChangeCost) * 2);
							}
							task = lastTask.clone(wego.TaskType.CHANGE_FORMATION, formationChangeCost, movementFactor);
						break;
						case wego.CounterType.ARTILLERY:
						case wego.CounterType.INFANTRY:
							task = lastTask.clone(wego.TaskType.CHANGE_FORMATION, formationChangeCost, lastTask.movementFactor - formationChangeCost);
						break;
					}

					task.formation = newFormation;
					counter.addTask(task);
				}
				this.state.setCurrentHex(hex, selectedCounters, ++time);
			} else {
				this.state.setStatusMessage("One or more of the units are unable to change formation");
			}
		} else {
			this.state.setStatusMessage("No units selected");
		}

	},
	
	waitCommand:function() {
		var selectedCounters = this.state.getSelectedCounters();
		if (selectedCounters.length > 0) {
			for(var i = 0; i < selectedCounters.length; ++i) {
				if (!selectedCounters[i].isFinished()) {
					selectedCounters[i].wait();
				} else {
					this.state.setStatusMessage("Unit " + selectedCounters[i].toString() + " can not WAIT");
				}
			}
			
			this.state.setCurrentHex(this.state.getCurrentHex(),selectedCounters);
			//todo should be -> updateTaskList();
		} else {
			this.state.setStatusMessage("No units selected");
		}
	}
};