var wego = wego || {};

wego.Counter = function() {
	this.mTasks = new Array();
	this.mReplayTasks = new Array();
	this.mPlayer = null;
	this.mCurrentTask = null;
	this.mRemainingMovementFactor = 10;

    this.type = "";
    this.quality = "";
    this.weapon = "";
	this.unitImageIndex = 3;
	this.unitSymbolIndex = 0;
	this.name = "";
	this.parentName = "";
	this.facing = "";
	this.strength = "";
	this.id = "";
	this.fatigue = "";
	this.formation = 0;
	this.fixed = false;
	this.moraleStatus = 0;
	this.leadership = 0;
	this.command = 0;
};

wego.Counter.prototype = {
		
	addReplayTask:function(task) {
		this.mReplayTasks.push(task);
	},
	
	addTask:function(task) {
		var cost = task.getMovementFactor();
		this.mRemainingMovementFactor -= cost;
		if (this.mRemainingMovementFactor < 0) {
			this.mRemainingMovementFactor = 0;
		}
		
		var currentHex = this.getHex();
		var newHex = task.getHex();
		if (currentHex != newHex) {
			if (currentHex != null) {
				currentHex.removeCounter(this);
			}
			
			if (task.getTransport() == null) {
				console.log("add to hex " + newHex);
				if (newHex != null) {
					newHex.addCounter(this);
				}
			} else {
				console.log(this.toString() + " not adding to hex because I am loaded.  currentHex:" + currentHex);
			}
		}
		
		this.mTasks.push(task);
		this.mCurrentTask = task;
	},
	
	canMoveTo:function(toHex) {
		var returnValue = false;
		
		if (this.mRemainingMovementFactor > 0) {
			var fromHex = this.getHex();
			var movementCost = this.getMoveCost(fromHex,toHex);
			if (movementCost <= this.mRemainingMovementFactor) {
				returnValue = true;
			}
		}
		
		return returnValue;
	},
	
	canOpportunityFire:function() {
		return this.canDirectFire(null);
	},

	deleteTask:function(time,adjustPassengersOrTransport) {
		var length = this.mTasks.length;
		
		//fixme need to detect if current unit is carrier or not
		
		for(var i = time; i < length; ++i) {
			var task = this.mTasks[i];
			this.mRemainingMovementFactor += task.getMovementFactor();
			if (adjustPassengersOrTransport) {
				switch(task.getType()) {
					case wego.TaskType.LOAD:
						var secondCounter = this.mTasks[i-1].getSecondCounter();   
						secondCounter.deleteTask(i,false);
						break;
					case wego.TaskType.UNLOAD:
						var secondCounter = this.mTasks[i-1].getSecondCounter();
						secondCounter.deleteTask(i,false);
						break;
				}
			}
		}
		
		this.mTasks.splice(time,length-time);
		this.update(time-1,wego.GameMode.PLAN);
	},
	
	directFire:function(hex,targets) {
		var currentHex = this.getHex();
		var cost = this.getMovementFactor();
		var task = new wego.Task(wego.TaskType.DIRECT_FIRE,currentHex,cost);
		task.setOtherHex(hex);
		task.setTargets(targets);
		this.addTask(task);
	},
	
	getCounterName: function () {
		return this.name;
	},
	
	getId:function () {
		return this.id;
	},
	
	getImage:function () {
		return null;
	},
	
	getImageSrc:function () {
		return "";
	},
	
	getHex:function () {
		var returnValue = null;
		
		if (this.mCurrentTask != null) {
			returnValue = this.mCurrentTask.getHex();
		}
		
		return returnValue;
	},
	
	getLastTask:function() {
		var returnValue = null;
		if (this.mTasks.length > 0) {
			returnValue = this.mTasks[this.mTasks.length - 1];
		}
		
		return returnValue;
	},
	
	getMoveCost:function(fromHex,toHex) {
		var hexCost = wego.MovementCostTable.getHexCost(this, fromHex, toHex);
		return hexCost;
	},
	
	getMovementFactor:function() {
		return this.movementFactor;
	},
	
	getPassengers:function() {
		var returnValue = null;
		
		if (this.mCurrentTask != null) {
			returnValue = this.mCurrentTask.getPassengers();
		}
		
		return returnValue;
	},
	
	getPlayer:function () {
		return this.mPlayer;
	},
	
	getRemainingMovementFactor:function() {
		return this.mRemainingMovementFactor;
	},
	
	getTaskDataAtTime:function(time, mode) {
		var returnValue = {};
		returnValue.hasMoreTasks = true;
		
		switch(mode) {
			case wego.GameMode.PLAN:
				if (time < this.mTasks.length - 1) {
					returnValue.task = this.mTasks[time]; 
				} else {
					returnValue.task = this.mTasks[this.mTasks.length - 1];
					returnValue.hasMoreTasks = false;
				}
				break;
			case wego.GameMode.REPLAY:
				if (time < this.mReplayTasks.length - 1) {
					returnValue.task = this.mReplayTasks[time]; 
				} else {
					returnValue.task = this.mReplayTasks[this.mReplayTasks.length - 1];
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
			returnValue = this.mTasks;
			break;
		case wego.GameMode.REPLAY:
			returnValue = this.mReplayTasks;
			break;
		}
		
		return returnValue;
	},
		
	getTransport:function() {
		var task = this.getLastTask();
		return task.getTransport();
	},
	
	hasPassenger:function() {
		var returnValue = false;
		var passengers = this.getPassengers();
		if (passengers != null && passengers.length > 0) {
			returnValue = true;
		}
		
		return returnValue;
	},
	
	indirectFire:function(hex) {
		var currentHex = this.getHex();
		var cost = this.getMovementFactor();
		var task = new wego.Task(wego.TaskType.INDIRECT_FIRE,currentHex,cost);
		task.setOtherHex(hex);
		this.addTask(task);
	},
	
	isFinished:function() {
		var returnValue = true;
		var movementFactor = this.getMovementFactor();
		
		if (this.mTasks.length < wego.Clock.getMaxTime()) {
			if (movementFactor > 0) {
				if (this.mRemainingMovementFactor > 0) {
					returnValue = false;
				}
			} else {
				if (this.mTasks.length == 1) {
					returnValue = false;
				}
			}
		}
		
		return returnValue;
	},
	

	isReady:function() {
		var returnValue = false;
		
		var task = this.getLastTask();
		if (task == this.mCurrentTask) {
			returnValue = true;
		}
		
		return returnValue;
	}, 
	
	moveTo:function(toHex) {
		var fromHex = this.getHex();
		var movementCost = this.getMoveCost(fromHex, toHex);
		if (movementCost <= this.mRemainingMovementFactor) {
			var lastTask = this.getLastTask();
			var task = new wego.Task(wego.TaskType.MOVE,toHex,movementCost,lastTask);
			this.addTask(task);
		}
	},
	
	opportunityFire:function() {
		var currentHex = this.getHex();
		var cost = this.getMovementFactor();
		var task = new wego.Task(wego.TaskType.OPPORTUNITY_FIRE,currentHex,cost);
		this.addTask(task);
	},
	
	padWithWaitTasks:function(numberOfWaitTasks, startingTask) {
		var hex = startingTask.getHex();
		for(var i = 0; i < numberOfWaitTasks; ++i) {
			newTask = new wego.Task(wego.TaskType.WAIT,hex,0,startingTask);
			this.addTask(newTask);
		}
	},
	

	save:function() {
		var returnValue = {};
		returnValue.id = this.id;
		//returnValue.type = this.mCounterType.getCounterName();
		returnValue.tasks = new Array();
		for(var i = 0; i < this.mTasks.length; ++i) {
			var result = this.mTasks[i].save();
			returnValue.tasks[i] = result;
		}
		
		returnValue.replayTasks = new Array();
		for(var i = 0; i < this.mReplayTasks.length; ++i) {
			var result = this.mReplayTasks[i].save();
			returnValue.replayTasks[i] = result;
		}
		
		return returnValue;
	},
	
	setPlayer:function(value) {
		this.mPlayer = value;
	},
	
	toString:function() {
		return ""; //this.mCounterType.getCounterName();
	},
	
	unload:function() {
		var movementCost = 0;
		var task = this.getLastTask();
		var hex = task.getHex();
		var transport = task.getTransport();
		console.log(this.toString() + " unloading. hex: " + hex + " transport: " + transport + " currentHex: " + this.getHex());
		if (transport != null) {
			hex = transport.getHex();
			movementCost = this.getMovementFactor();
			var transportsTasks = transport.getTasks(wego.GameMode.PLAN);
			var numberOfTasks = transportsTasks.length;
			var lastTask = transportsTasks[numberOfTasks-1];
			
			var numberOfWaitTasks = 0;
			if (lastTask.getType() == wego.TaskType.UNLOAD) {
				numberOfWaitTasks = numberOfTasks - 2;
			} else {
				numberOfWaitTasks = numberOfTasks - 1;
			}
			
			var startingTask = this.getLastTask();
			this.padWithWaitTasks(numberOfWaitTasks, startingTask);
		} 
		
		var newTask = new wego.Task(wego.TaskType.UNLOAD,hex,movementCost);
		this.addTask(newTask);
	},
	
	update:function(time, mode) {
		var taskData = this.getTaskDataAtTime(time, mode);
		var task = taskData.task;
		
		var hex = task.getHex();
		var currentHex = this.getHex();
		if (hex != currentHex) {
			if (currentHex != null) {
				currentHex.removeCounter(this);
			}
			
			if (hex != null && task.getTransport() == null) {
				hex.addCounter(this);
			}
		}
		
		this.mCurrentTask = task;
		
		return taskData.hasMoreTasks;
	},
	
	wait:function() {
		var movementFactor = this.getMovementFactor();
		
		if (movementFactor > 0) {
			if (this.mRemainingMovementFactor > 0) {
				var task = new wego.Task(wego.TaskType.WAIT,this.getHex(),0.0);
				this.addTask(task);
			}
		} else {
			if (this.mTasks.length == 1) {
				var task = new wego.Task(wego.TaskType.WAIT,this.getHex(),0);
				this.addTask(task);
			}
		}
	},
}