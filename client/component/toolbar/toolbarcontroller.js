import {CommandMode, GameMode, CounterType, TaskType, Formation} from '../../model/enum.js';

class ToolbarController {
	constructor(component, state) {
		this.component = component;
		this.currentUnitIndex = -1;

		this.state = state;
		let controller = this;
		$("#losButton").button().click(function() {controller.losCommand();});
		$("#prevUnitButton").button().click(function() {controller.prevNextUnitCommand("prev");});
		$("#nextUnitButton").button().click(function() {controller.prevNextUnitCommand("next");});
		$("#opFireButton").button().click(controller.opportunityFireCommand);
		$("#waitButton").button().click(controller.waitCommand);
		$("#rotateLeftButton").button().click(function() {controller.rotateCommand("left");});
		$("#rotateRightButton").button().click(function() {controller.rotateCommand("right");});
		$("#aboutFaceButton").button().click(function() {controller.rotateCommand("aboutFace");});
		$("#formationButton").button().click(function() {controller.formationCommand();});
		
		$("#directFireButton").button().click(function() {});
		
		$('#gameModeButton').button().click(function() {controller.gameModeCommand();});
	}

	// canDirectFire:function() {
	// 	let returnValue = false;
	// 	let selectedCounters = this.state.getSelectedCounters();
	// 	if (selectedCounters.length > 0) {
	// 		returnValue = true;
	// 		for(let i = 0; i < selectedCounters.length; ++i) {
	// 			if (!selectedCounters[i].canDirectFire(null)) {
	// 				returnValue = false;
	// 				break;
	// 			}
	// 		}
			
	// 		if (!returnValue) {
	// 			this.state.setStatusMessage("One of the units can not direct fire");
	// 		}
	// 	} else {
	// 		this.state.setStatusMessage("No units selected");
	// 	}
		
	// 	return returnValue;
	// },
	
	// canOpportunityFire:function() {
	// 	let returnValue = false;
	// 	let selectedCounters = this.state.getSelectedCounters();
	// 	if (selectedCounters.length > 0) {
	// 		returnValue = true;
	// 		for(let i = 0; i < selectedCounters.length; ++i) {
	// 			if (!selectedCounters[i].canOpportunityFire()) {
	// 				returnValue = false;
	// 				break;
	// 			}
	// 		}
			
	// 		if (!returnValue) {
	// 			this.state.setStatusMessage("One of the units can not opportunity fire");
	// 		}
	// 	} else {
	// 		this.state.setStatusMessage("No units selected");
	// 	}
		
	// 	return returnValue;
	// },
	
	// directFireCommand:function() {
	// 	this.state.setCommandMode(CommandMode.NONE);
	// 	let canFire = canDirectFire();
	// 	if (canFire) {
	// 		this.state.setCommandMode(CommandMode.DIRECT_FIRE);
	// 		this.state.setStatusMessage("Select target hex");
	// 	}
	// },
	
	gameModeCommand(button) {
		if (this.state.getGameMode() == GameMode.PLAN) {
			this.state.setGameMode(GameMode.REPLAY);
		} else {
			this.state.setGameMode(GameMode.PLAN);
		}
	}
	
	losCommand() {
		this.state.toggleDisplayLos();
	}
	
	// opportunityFireCommand:function() {
	// 	this.state.setCommandMode(CommandMode.NONE);
	// 	let canFire = canOpportunityFire();
	// 	if (canFire) {
	// 		let selectedCounters = this.state.getSelectedCounters();
	// 		for(let i = 0; i < selectedCounters.length; ++i) {
	// 			selectedCounters[i].opportunityFire();
	// 		}
	// 		this.state.setStatusMessage("Opportunity fire task added");
	// 		this.state.setCurrentHex(this.state.getCurrentHex(),selectedCounters);
	// 		//todo should be -> updateTaskList();
	// 	}
	// },
	
	prevNextUnitCommand(direction) {
		let player = this.state.getGame().currentPlayer;
		let mode = this.state.getGameMode();
		let time = this.state.getTime();
		let result = null;
		if (direction == "next") {
			result = player.getNextUnit(mode, time, this.currentUnitIndex);
		} else {
			result = player.getPrevUnit(mode, time, this.currentUnitIndex);
		}
		
		let unit = result.unit;
		console.log("unit: " + unit);
		console.log("next index: " + result.nextIndex);
		
		if (unit != null) {
			this.currentUnitIndex = result.nextIndex;
			let hex = unit.getHex(mode, time);
			if (hex != null) {
				let selectedUnits = new Array(unit);
				this.state.setCurrentHex(hex, selectedUnits);
			}
		} else {
			this.state.setStatusMessage("All units have been moved/fired");
		}	
	}

	canRotate(counter, cost) {
		let returnValue = false;
		if (counter.isReady()) {
			switch(counter.type) {
				case CounterType.SUPPLY:
				case CounterType.LEADER:
					returnValue = true;
				break;
				default:
					let lastTask = counter.getLastTask();
					if (lastTask.movementFactor >= cost) {
						returnValue = true;
					}
				break;
			}
		}
		return returnValue;
	}

	rotateCommand(direction) {
		this.state.setStatusMessage("");
		let gameMode = this.state.getGameMode();
		let time = this.state.getTime();
		let selectedCounters = this.state.getSelectedCounters();
		let parametricData = this.state.getParametricData();

		if (selectedCounters != null && selectedCounters.length > 0) {
			let allCanRotate = true;
			for(let i = 0; i < selectedCounters.length; ++i) {
				let cost = 0;
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
				let hex = this.state.getCurrentHex();
				for(let i = 0; i < selectedCounters.length; ++i) {
					let counter = selectedCounters[i];
					let lastTask = counter.getLastTask();
					let facing = lastTask.facing;
					let newFacing = facing;
					let task = null;
					let cost = 0;

					if (direction == "left") {
						cost = parametricData.getRotationCost(counter.type);
						newFacing = (facing == 0)?5:facing - 1;
						task = lastTask.clone(TaskType.ROTATE_LEFT, cost, lastTask.movementFactor - cost);
					} else if (direction == "right") {
						cost = parametricData.getRotationCost(counter.type);
						newFacing = (facing == 5)?0:facing + 1;
						task = lastTask.clone(TaskType.ROTATE_RIGHT, cost, lastTask.movementFactor - cost);
					} else {
						newFacing = (facing + 3) % 6;
						cost = parametricData.getAboutFaceCost(counter.type);
						task = lastTask.clone(TaskType.ABOUT_FACE, cost, lastTask.movementFactor - cost);
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
	}

	canChangeFormation(counter) {
		let returnValue = false;
		if (counter.isReady() && !counter.isRouted()) {
			let lastTask = counter.getLastTask();
			switch(counter.type) {
				case CounterType.SUPPLY:
					returnValue = false;
				break;
				case CounterType.LEADER:
					returnValue = true;
				break;
				case CounterType.CAVALRY:
				case CounterType.ARTILLERY:
					let formationChangeCost = this.state.getParametricData().getFormationChangeCost(counter.type);
					returnValue = (lastTask.movementFactor >= formationChangeCost);
				break;
				case CounterType.INFANTRY:
					returnValue = (lastTask.type == TaskType.INITIAL);
				break;
			}
		}
		return returnValue;
	}

	formationCommand() {
		this.state.setStatusMessage("");
		let gameMode = this.state.getGameMode();
		let time = this.state.getTime();
		let selectedCounters = this.state.getSelectedCounters();

		if (selectedCounters != null && selectedCounters.length > 0) {
			let allCanChangeFormation = true;
			for(let i = 0; i < selectedCounters.length; ++i) {
				if (!this.canChangeFormation(selectedCounters[i])) {
					allCanChangeFormation = false;
					break;
				}
			}

			if (allCanChangeFormation) {
				let hex = this.state.getCurrentHex();
				for(let i = 0; i < selectedCounters.length; ++i) {
					let counter = selectedCounters[i];
					let lastTask = counter.getLastTask();
					let task = null;
					let newFormation = Formation.LINE;

					if (lastTask.formation == Formation.LINE) {
						newFormation = Formation.COLUMN;
					}

					let formationChangeCost = this.state.getParametricData().getFormationChangeCost(counter.type);
					switch(counter.type) {
						case CounterType.CAVALRY:
						case CounterType.LEADER:
							let lineMovementAllowance = this.state.getParametricData().getMovementAllowance(counter.type, Formation.LINE);
							let columnMovementAllowance = this.state.getParametricData().getMovementAllowance(counter.type, Formation.COLUMN);
							let movementFactor = 0;
							if (newFormation == Formation.LINE) {
								movementFactor = lineMovementAllowance - ((columnMovementAllowance - lastTask.movementFactor + formationChangeCost) / 2);
							} else {
								movementFactor = columnMovementAllowance - ((lineMovementAllowance - lastTask.movementFactor + formationChangeCost) * 2);
							}
							task = lastTask.clone(TaskType.CHANGE_FORMATION, formationChangeCost, movementFactor);
						break;
						case CounterType.ARTILLERY:
						case CounterType.INFANTRY:
							task = lastTask.clone(TaskType.CHANGE_FORMATION, formationChangeCost, lastTask.movementFactor - formationChangeCost);
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

	}
	
	waitCommand() {
		let selectedCounters = this.state.getSelectedCounters();
		if (selectedCounters.length > 0) {
			for(let i = 0; i < selectedCounters.length; ++i) {
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

export default {};
export {ToolbarController};