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
		var currentHex = null;
		if (this.currentTask != null) {
			currentHex = this.currentTask.hex;
		}
		
		var newHex = task.hex;
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
		return this.currentTask.facing;
	},

	getFatigue:function() {
		return this.currentTask.fatigue;
	},

	getFormation:function() {
		return this.currentTask.formation;
	},
	
	// canMoveTo:function(toHex) {
	// 	var returnValue = false;
		
	// 	if (this.mRemainingMovementFactor > 0) {
	// 		var fromHex = this.getHex();
	// 		var movementCost = this.getMoveCost(fromHex,toHex);
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
	 	var length = this.tasks.length;
		this.tasks.splice(time, length-time);
		this.currentTask = this.tasks[this.tasks.length - 1];
	},
	
	// directFire:function(hex,targets) {
	// 	var currentHex = this.getHex();
	// 	var cost = this.getMovementFactor();
	// 	var task = new wego.Task(wego.TaskType.DIRECT_FIRE,currentHex,cost);
	// 	task.otherHex = hex;
	// 	task.targets = targets;
	// 	this.addTask(task);
	// },
	
	getHex:function() {
		return this.currentTask.hex;
	},
	
	getLastTask:function() {
		var returnValue = null;
		if (this.tasks.length > 0) {
			returnValue = this.tasks[this.tasks.length - 1];
		}
		
		return returnValue;
	},
	
	// getMoveCost:function(fromHex,toHex) {
	// 	var hexCost = wego.MovementCostTable.getHexCost(this, fromHex, toHex);
	// 	return hexCost;
	// },
	
	getMoraleStatus:function() {
		return this.currentTask.moraleStatus;
	},

	getMovementFactor:function() {
		return this.currentTask.movementFactor;
	},

	getSpotted:function() {
		return this.currentTask.spotted;
	},

	getStrength:function() {
		return this.currentTask.strength;
	},
	
	getTaskDataAtTime:function(mode, time) {
		var returnValue = {};
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
		var returnValue = null;
		
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
		var returnValue = true;
		var lastTask = this.getLastTask();

		if (!lastTask.fixed && lastTask.movementFactor > 0) {
			returnValue = false;
		}
		
		return returnValue;
	},

	isReady:function() {
		var returnValue = false;
		
		var lastTask = this.getLastTask();
		if (!lastTask.fixed && lastTask == this.currentTask) {
			returnValue = true;
		}
		
		return returnValue;
	}, 

	isFixed:function() {
		return this.currentTask.fixed;
	},

	isRouted:function() {
		var lastTask = this.getLastTask();
		return lastTask.moraleStatus == wego.MoraleType.ROUTED;
	},
	
	// padWithWaitTasks:function(numberOfWaitTasks, startingTask) {
	// 	var hex = startingTask.getHex();
	// 	for(var i = 0; i < numberOfWaitTasks; ++i) {
	// 		newTask = new wego.Task(wego.TaskType.WAIT,hex,0,startingTask);
	// 		this.addTask(newTask);
	// 	}
	// },

	save:function() {
		var returnValue = {};
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
		for(var i = 0; i < this.tasks.length; ++i) {
			var result = this.tasks[i].save();
			returnValue.tasks[i] = result;
		}
		
		returnValue.replayTasks = new Array();
		for(var i = 0; i < this.replayTasks.length; ++i) {
			var result = this.replayTasks[i].save();
			returnValue.replayTasks[i] = result;
		}
		
		return returnValue;
	},
	
	toString:function() {
		return this.id; //this.mCounterType.getCounterName();
	},
	
	updateCurrentTask:function(mode, time) {
		var taskData = this.getTaskDataAtTime(mode, time);
		var task = taskData.task;
		
		var hex = task.hex;
		var currentHex = this.getHex();
		if (hex != currentHex) {
			if (currentHex != null) {
				currentHex.removeCounter(this);
			}
			
			if (hex != null) {
				hex.addCounter(this);
			}
		}

		this.currentTask = task;			
		return taskData.hasMoreTasks;
	},
	
	// wait:function() {
	// 	var movementFactor = this.getMovementFactor();
		
	// 	if (movementFactor > 0) {
	// 		if (this.mRemainingMovementFactor > 0) {
	// 			var task = new wego.Task(wego.TaskType.WAIT,this.getHex(),0.0);
	// 			this.addTask(task);
	// 		}
	// 	} else {
	// 		if (this.mTasks.length == 1) {
	// 			var task = new wego.Task(wego.TaskType.WAIT,this.getHex(),0);
	// 			this.addTask(task);
	// 		}
	// 	}
	// },
}