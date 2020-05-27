import {CommandMode, GameMode, CounterType, Formation, TaskType, HexSideType} from '../../model/enum.js';

class MapController {
	constructor(component, state) {
		this.component = component;
		this.state = state;

		let controller = this;

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
			let that = this;
			setTimeout(function() {
				let dblclick = parseInt($(that).data('double'), 10);
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
	}
	
	// directFire:function() {
	// 	let targets = this.getSelectedTargets();
	// 	if (targets.length > 0) {
	// 		let selectedCounters = this.state.getSelectedCounters();
	// 		for(let i = 0; i < selectedCounters.length; ++i) {
	// 			selectedCounters[i].directFire(mTargetHex,targets);
	// 		}
	// 		this.setCurrentHex(this.state.getCurrentHex(),selectedCounters);
	// 		this.state.setCommandMode(mCommandMode.NONE);
	// 	} else {
	// 		this.state.setStatusMessage("No targets selected");
	// 	}
	// },
	
	// getSelectedTargets:function() {
	// 	return this.getCounterSelection("#targetList",this.state.getTargetHex());
	// },
	
	// getCounterSelection:function(list,hex) {
	// 	let returnValue = new Array();
	// 	let selectedItems = $(list).children(".ui-selected");
	// 	if (selectedItems.length > 0) {
	// 		let selectedCounters = new Array();
	// 		let stack = hex.getStack();
	// 		let counters = stack.counters;
	// 		for(let i = 0; i < selectedItems.length; ++i) {
	// 			let counterId = parseInt(selectedItems[i].getAttribute("data-counter-id"));
	// 			for(let j = 0; j < counters.length; ++j) {
	// 				if (counters[j].getId() == counterId) {
	// 					returnValue.push(counters[j]);
	// 					break;
	// 				}
	// 			}
	// 		}
	// 	}
	// 	return returnValue;
	// },
	
	getHex(event) {
		let hexMap = this.state.getMap();
		let posX = $(event.target).offset().left;
		let posY = $(event.target).offset().top;
		let coord = hexMap.pointToHex((event.pageX - posX) , (event.pageY - posY));
		//console.log("clicked on hex (" + coord.col + "," + coord.row + ") point (" + posX + "," + posY + ")");
		let hex = hexMap.getHex(coord.col, coord.row);
		return hex;
	}
	
	singleClick(event) {
		this.state.clearStatusMessage();
		let hex = this.getHex(event);
		let canFire = false;
		
		if (hex != null) {
			let commandMode = this.state.getCommandMode();
			switch(commandMode) {
				case CommandMode.INDIRECT_FIRE:
					canFire = this.canIndirectFire(hex);
					if (canFire) {
						let selectedCounters = this.state.getSelectedCounters();
						for(let i = 0; i < selectedCounters.length; ++i) {
							selectedCounters[i].indirectFire(hex);
						}
						this.state.setCurrentHex(this.state.getCurrentHex(),selectedCounters);
						this.state.setCommandMode(CommandMode.NONE);
					}
					break;
				case CommandMode.DIRECT_FIRE:
					canFire = this.canDirectFire(hex);
					if (canFire) {
						this.state.setTargetHex(hex);
						this.updateTargetList(hex);
						$( "#dialog-form" ).dialog( "open" );
					}
					break;
				default:
					let gameMode = this.state.getGameMode();
					if (event.button === 0) {
						this.state.setCurrentHex(hex,null);
					} else if (gameMode === GameMode.PLAN){
						this.state.setCommandMode(CommandMode.NONE);
						let currentHex = this.state.getCurrentHex();
						if (currentHex != null) {
							console.log("is adj: " + currentHex.isAdjacent(hex));
							if (currentHex.isAdjacent(hex)) {
								let selectedCounters = this.state.getSelectedCounters();
								if (selectedCounters.length > 0) {
									let direction = currentHex.getSharedHexSideIndex(hex);
									this.moveCounters(selectedCounters,hex,direction);
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
	}
	
	updateTargetList(hex) {
		wego.MainController.updateCounterList("#targetList",hex,null);
	}
	
	doubleClick(event) {
		this.state.setCommandMode(CommandMode.NONE);
		this.state.clearStatusMessage();

		let hex = this.getHex(event);
		
		let stack = hex.stack;
		if (stack != null) {
			let counters = stack.counters;
			let selectedCounters = new Array();
			if (counters != null) {
				let currentPlayer = this.state.getGame().currentPlayer;
				for(let i = 0; i < counters.length; ++i) {
					if (currentPlayer === counters[i].player) {
						selectedCounters.push(counters[i]);
					}
				}
			}

			this.state.setCurrentHex(hex,selectedCounters);
		} else {
			this.state.setCurrentHex(hex,null);
		}
	}
	
	// canDirectFire:function(hex) {
	// 	let returnValue = false;
	// 	let selectedCounters = this.state.getSelectedCounters();
	// 	if (selectedCounters.length > 0) {
	// 		returnValue = true;
	// 		for(let i = 0; i < selectedCounters.length; ++i) {
	// 			if (!selectedCounters[i].canDirectFire(hex)) {
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

	canMove(counter, toHex) {
		let returnValue = false;
		if (counter.isReady()) {
			if (counter.type === CounterType.ARTILLERY && counter.getFormation() === Formation.LINE) {
				returnValue = false;
			} else {
				let cost = this.getMovementCost(counter, toHex);
				let lastTask = counter.getLastTask();
				if (lastTask.movementFactor >= cost) {
					returnValue = true;
				}
			}
		}
		return returnValue;
	}
	
	moveCounters(counters, toHex, direction) {
		let allCanMove = true;
		for(let i = 0; i < counters.length; ++i) {
			if(!this.canMove(counters[i], toHex)) {
				allCanMove = false;
				break;
			}
		}
		
		if (allCanMove) {
			for(let i = 0; i < counters.length; ++i) {
				let counter = counters[i];
				let cost = this.getMovementCost(counter, toHex);
				let lastTask = counter.getLastTask();
				let task = lastTask.clone(TaskType.MOVE, cost, lastTask.movementFactor - cost);
				switch(lastTask.formation) {
					case Formation.COLUMN:
						task.facing = task.hex.getSharedHexSideIndex(toHex);
					break;
				}
				task.direction = direction;
				task.hex = toHex;
				counter.addTask(task);
			}

			this.state.setCurrentHex(toHex,counters);
		} else {
			this.state.setStatusMessage("One or more of the counters can not complete the move");
		}
	}

	getMovementCost(counter, toHex) {
		let parametricData = this.state.getParametricData();
		let hexType = toHex.hexType;
		let lastTask = counter.getLastTask();
		let formation = lastTask.formation;
		let fromHex = lastTask.hex;
		let direction = fromHex.getSharedHexSideIndex(toHex);
		let hexSide = fromHex.hexSides[direction];
		let cost = 0;

		if (formation === Formation.COLUMN || formation === Formation.NONE) {
			if (hexSide.isTrail()) {
				cost += parametricData.getHexSideCost(counter.type, formation, HexSideType.TRAIL.code);
			} else if (hexSide.isRoad()) {
				cost += parametricData.getHexSideCost(counter.type, formation, HexSideType.ROAD.code);
			} else if (hexSide.isPike()) {
				cost += parametricData.getHexSideCost(counter.type, formation, HexSideType.PIKE.code);
			} else {
				if (hexSide.isCreek()) {
					cost = 99;
				} else {
					if (hexSide.isStream()) {
						cost += parametricData.getHexSideCost(counter.type, formation, HexSideType.STREAM.code);
					}

					cost += parametricData.getHexCost(counter.type, formation, hexType.code);
				}

			}
		} else {
			if (hexSide.isCreek()) {
				cost = 99;
			} else {
				if (hexSide.isStream()) {
					cost += parametricData.getHexSideCost(counter.type, formation, HexSideType.STREAM.code);
				}
				
				cost += parametricData.getHexCost(counter.type, formation, hexType.code);
				let facing = lastTask.facing;
				let direction = fromHex.getSharedHexSideIndex(toHex);
				let delta = Math.abs(facing - direction);
				if (delta !== 0 && delta !== 1 && delta !== 5) {
					cost += parametricData.getRearwardMovementCost();
				}
			}
		}

		let elevationChange = toHex.elevation - fromHex.elevation;
		if (elevationChange > 0) {
			cost += elevationChange * parametricData.getUpElevationCost(counter.type, formation);
		} else if (elevationChange < 0) {
			cost += Math.abs(elevationChange) * parametricData.getDownElevationCost(counter.type, formation);
		}

		return cost;
	}
};

export default {};
export {MapController};