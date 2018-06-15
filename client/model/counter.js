var wego = wego || {};

wego.Counter = function() {
	this.tasks = new Array();
	this.replayTasks = new Array();
	this.player = null;
	this.currentTask = null;

    this.type = "";
    this.quality = 0;
    this.weapon = "";
	this.unitImageIndex = 3;
	this.unitSymbolIndex = 0;
	this.name = "";
	this.shortName = "";
	this.parentName = "";
	this.originalStrength = 0;
	this.id = "";
	this.leadership = 0;
	this.command = 0;
	this.range = 0;
	this.canChangeFormation = true;
	this.canMoveInLine = true;
};

wego.Counter.prototype = {
	addReplayTask:function(task) {
		this.replayTasks.push(task);
	},
	
	addTask:function(task) {
		let currentHex = null;
		if (this.currentTask != null) {
			currentHex = this.currentTask.hex;
		}
		
		let newHex = task.hex;
		if (currentHex != newHex) {
			if (currentHex != null) {
				currentHex.removeCounter(this);
			}
			
			console.log("add to hex " + newHex);
			if (newHex != null) {
				newHex.addCounter(this);
			}
		}
		
		this.currentTask = task;
		this.tasks.push(task);
	},

	getFacing:function() {
		return (this.currentTask != null)?this.currentTask.facing:null;
	},

	getFatigue:function() {
		return (this.currentTask != null)?this.currentTask.fatigue:null;
	},

	getFormation:function() {
		return (this.currentTask != null)?this.currentTask.formation:null;
	},
	
	// canMoveTo:function(toHex) {
	// 	let returnValue = false;
		
	// 	if (this.mRemainingMovementFactor > 0) {
	// 		let fromHex = this.getHex();
	// 		let movementCost = this.getMoveCost(fromHex,toHex);
	// 		if (movementCost <= this.mRemainingMovementFactor) {
	// 			returnValue = true;
	// 		}
	// 	}
		
	// 	return returnValue;
	// },
	
	// canOpportunityFire:function() {
	// 	return this.canDirectFire(null);
	// },

	deleteTask:function(time) {
	 	let length = this.tasks.length;
		this.tasks.splice(time, length-time);
		this.currentTask = this.tasks[this.tasks.length - 1];
	},
	
	// directFire:function(hex,targets) {
	// 	let currentHex = this.getHex();
	// 	let cost = this.getMovementFactor();
	// 	let task = new wego.Task(wego.TaskType.DIRECT_FIRE,currentHex,cost);
	// 	task.otherHex = hex;
	// 	task.targets = targets;
	// 	this.addTask(task);
	// },
	
	getHex:function() {
		return (this.currentTask != null)?this.currentTask.hex:null;
	},
	
	getLastTask:function() {
		let returnValue = null;
		if (this.tasks.length > 0) {
			returnValue = this.tasks[this.tasks.length - 1];
		}
		
		return returnValue;
	},
	
	// getMoveCost:function(fromHex,toHex) {
	// 	let hexCost = wego.MovementCostTable.getHexCost(this, fromHex, toHex);
	// 	return hexCost;
	// },
	
	getMoraleStatus:function() {
		return (this.currentTask != null)?this.currentTask.moraleStatus:null;
	},

	getMovementFactor:function() {
		return (this.currentTask != null)?this.currentTask.movementFactor:null;
	},

	getSpotted:function() {
		return (this.currentTask != null)?this.currentTask.spotted:null;
	},

	getStrength:function() {
		return (this.currentTask != null)?this.currentTask.strength:null;
	},
	
	getTaskDataAtTime:function(mode, time) {
		let returnValue = {};
		returnValue.hasMoreTasks = true;
		
		switch(mode) {
			case wego.GameMode.PLAN:
				if (time < this.tasks.length) {
					returnValue.task = this.tasks[time]; 
				} else {
					returnValue.task = this.tasks[this.tasks.length - 1];
					returnValue.hasMoreTasks = false;
				}
				break;
			case wego.GameMode.REPLAY:
				if (time < this.replayTasks.length) {
					returnValue.task = this.replayTasks[time]; 
				} else {
					returnValue.task = this.replayTasks[this.replayTasks.length - 1];
					returnValue.hasMoreTasks = false;
				}
				break;
		}
		
		return returnValue; 
	},
	
	getTasks:function (gameMode) {
		let returnValue = null;
		
		switch(gameMode) {
		case wego.GameMode.PLAN:
			returnValue = this.tasks;
			break;
		case wego.GameMode.REPLAY:
			returnValue = this.replayTasks;
			break;
		}
		
		return returnValue;
	},
		
	isFinished:function() {
		let returnValue = true;
		let lastTask = this.getLastTask();

		if (!lastTask.fixed && lastTask.movementFactor > 0) {
			returnValue = false;
		}
		
		return returnValue;
	},

	isReady:function() {
		let returnValue = false;
		
		let lastTask = this.getLastTask();
		if (!lastTask.fixed && lastTask == this.currentTask) {
			returnValue = true;
		}
		
		return returnValue;
	}, 

	isFixed:function() {
		return (this.currentTask != null)?this.currentTask.fixed:null;
	},

	isRouted:function() {
		let lastTask = this.getLastTask();
		return lastTask.moraleStatus == wego.MoraleType.ROUTED;
	},
	
	// padWithWaitTasks:function(numberOfWaitTasks, startingTask) {
	// 	let hex = startingTask.getHex();
	// 	for(let i = 0; i < numberOfWaitTasks; ++i) {
	// 		newTask = new wego.Task(wego.TaskType.WAIT,hex,0,startingTask);
	// 		this.addTask(newTask);
	// 	}
	// },

	save:function() {
		let returnValue = {};
		returnValue.id = this.id;
		returnValue.type = this.type;
		returnValue.quality = this.quality;
		returnValue.weapon = this.weapon;
		returnValue.unitImageIndex = this.unitImageIndex;
		returnValue.unitSymbolIndex = this.unitSymbolIndex;
		returnValue.name = this.name;
		returnValue.shortName = this.shortName;
		returnValue.parentName = this.parentName;
		returnValue.originalStrength = this.originalStrength;
		returnValue.leadership = this.leadership;
		returnValue.command = this.command;
		returnValue.range = this.range;
		returnValue.canChangeFormation = this.canChangeFormation;
		returnValue.canMoveInLine = this.canMoveInLine;

		returnValue.tasks = new Array();
		for(let i = 0; i < this.tasks.length; ++i) {
			let result = this.tasks[i].save();
			returnValue.tasks[i] = result;
		}
		
		returnValue.replayTasks = new Array();
		for(let i = 0; i < this.replayTasks.length; ++i) {
			let result = this.replayTasks[i].save();
			returnValue.replayTasks[i] = result;
		}
		
		return returnValue;
	},
	
	toString:function() {
		return this.id; //this.mCounterType.getCounterName();
	},
	
	updateCurrentTask:function(mode, time) {
		let taskData = this.getTaskDataAtTime(mode, time);
		let task = taskData.task;

		if (task != null) {
			let hex = task.hex;
			let currentHex = this.getHex();
			if (hex != currentHex) {
				if (currentHex != null) {
					currentHex.removeCounter(this);
				}
				
				if (hex != null) {
					hex.addCounter(this);
				}
			}

			this.currentTask = task;			
		} else {
			let currentHex = this.getHex();
			if (currentHex != null) {
				currentHex.removeCounter(this);
			}
			this.currentTask = null;
		}

		return taskData.hasMoreTasks;
	},
	
	// wait:function() {
	// 	let movementFactor = this.getMovementFactor();
		
	// 	if (movementFactor > 0) {
	// 		if (this.mRemainingMovementFactor > 0) {
	// 			let task = new wego.Task(wego.TaskType.WAIT,this.getHex(),0.0);
	// 			this.addTask(task);
	// 		}
	// 	} else {
	// 		if (this.mTasks.length == 1) {
	// 			let task = new wego.Task(wego.TaskType.WAIT,this.getHex(),0);
	// 			this.addTask(task);
	// 		}
	// 	}
	// },
}