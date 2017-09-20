var wego = wego || {};

wego.Counter = function(id,counterType) {
	this.mId =id;
	this.mCounterType = counterType;
	this.mTasks = new Array();
	this.mReplayTasks = new Array();
	this.mRemainingMovementFactor = counterType.getMovementFactor();
	this.mPlayer = null;
	this.mCurrentTask = null;
}

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
	
	canDirectFire:function(hex) {
		var returnValue = false;
		if (this.mTasks.length == 1) {
			var weaponClass = this.mCounterType.getWeaponClass();
			if (weaponClass != wego.WeaponClass.CARRIER) {
				returnValue = true;
			}
			
			if (returnValue == true && hex != null) {
				var map = wego.Map;
				var currentHex = this.getHex();
				var range = map.getRange(currentHex,hex);
				if (range > this.mCounterType.getRangeFactor()) {
					returnValue = false;
				}
			}
		}
		
		return returnValue;
	},
	
	canIndirectFire:function(hex) {
		var returnValue = false;
		if (this.mTasks.length == 1) {
			var counterType = this.getCounterType();
			var weaponClass = counterType.getWeaponClass();
			switch(weaponClass) {
				case wego.WeaponClass.MORTAR:
					returnValue = true;
					break;
				case wego.WeaponClass.HIGH_EXPLOSIVE:
					var unitCategory = counterType.getUnitCategory();
					if (unitCategory == wego.UnitCategory.SELF_PROPELLED_GUN && this.mNationality == wego.NationalityType.GERMAN) {
						returnValue = true;
					}
					break;
			}
			
			if (returnValue == true && hex != null) {
				var map = wego.Map;
				var currentHex = this.getHex();
				var range = map.getRange(currentHex,hex);
				if (range > counterType.getRangeFactor()) {
					returnValue = false;
				}
			}
		}
		
		return returnValue;
	},
	
	canLoad:function(otherUnit) {
		var returnValue = false;
		
		if (this.mTasks.length == 1) {
			var myUnitCategory = this.mCounterType.getUnitCategory();
			var otherUnitCategory = otherUnit.getCounterType().getUnitCategory();
			switch(myUnitCategory) {
				case wego.UnitCategory.TRANSPORT:
					switch(otherUnitCategory) {
						case wego.UnitCategory.INFANTRY:
						case wego.UnitCategory.COMMAND_POST:
						case wego.UnitCategory.TOWED_GUN:
							returnValue = true;
							break;
					}
					break;
				case wego.UnitCategory.ASSAULT_GUN:
				case wego.UnitCategory.TANK:
					if (otherUnitCategory == wego.UnitCategory.INFANTRY) {
						returnValue = true;
					}
					break;
			}
			
			if (!returnValue) {
				switch(myUnitCategory) {
					case wego.UnitCategory.INFANTRY:
						switch(otherUnitCategory) {
							case wego.UnitCategory.ASSAULT_GUN:
							case wego.UnitCategory.TANK:
							case wego.UnitCategory.TRANSPORT:
								returnValue = true;
							break;
						}
						break
					case wego.UnitCategory.COMMAND_POST:
					case wego.UnitCategory.TOWED_GUN:
						if (otherUnitCategory == wego.UnitCategory.TRANSPORT) {
							returnValue = true;
						}
						break;
				}
			}
		}
		
		return returnValue;
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
	
	canUnload:function() {
		var returnValue = false;
		var passengers = this.getPassengers();
		if (passengers != null && passengers.length > 0) {
			returnValue = true;
		} else {
			if (this.mTasks.length == 1) {
				var transport = this.getTransport();
				returnValue = (transport != null);
			}
		}
		
		return returnValue;
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
		return this.mCounterType.mCounterName;
	},
	
	getCounterType:function () {
		return this.mCounterType;
	},
	
	getId:function () {
		return this.mId;
	},
	
	getImage:function () {
		return this.mCounterType.getImage();
	},
	
	getImageSrc:function () {
		return this.mCounterType.getImageSrc();
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
		return this.mCounterType.getMovementFactor();
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
	
	isFort:function() {
		var returnValue = false;
		var category = this.mCounterType.getUnitCategory();
		if (category == wego.UnitCategory.FORT) {
			returnValue = true;
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
	
	isTruck:function() {
		var returnValue = false;
		var subcategory = this.mCounterType.getUnitSubcategory();
		if (subcategory == wego.UnitSubcategory.TRUCK) {
			returnValue = true;
		}
		
		return returnValue;
	},
	
	isVehicle:function() {
		var returnValue = false;
		var category = this.mCounterType.getUnitCategory();
		switch(category) {
			case wego.UnitCategory.TRANSPORT:
			case wego.UnitCategory.ARMORED_CAR:
			case wego.UnitCategory.SELF_PROPELLED_GUN:
			case wego.UnitCategory.ASSAULT_GUN:
			case wego.UnitCategory.TANK_DESTORYER:
			case wego.UnitCategory.TANK:
				returnValue = true;
		
		}
		return returnValue;
	},
	
	loadPassengers:function(passengers) {
		var unitCategory = this.mCounterType.getUnitCategory();
		var movementCost = this.getMovementFactor();
//		switch(unitCategory) {
//			case wego.UnitCategory.TRANSPORT:
//			case wego.UnitCategory.ASSAULT_GUN:
//			case wego.UnitCategory.TANK:
				var hex = this.getHex();
				var task = new wego.Task(wego.TaskType.LOAD,hex,movementCost);
				task.addPassengers(passengers);
				this.addTask(task);
//				break;
//			default:
//				var task = new wego.Task(wego.TaskType.LOAD,null,movementCost);
//				task.setTransport(otherUnits);
//				this.addTask(task);
//				break;
//		}
	},
	
	loadTransport:function(transport) {
		var unitCategory = this.mCounterType.getUnitCategory();
		var movementCost = this.getMovementFactor();
		var task = new wego.Task(wego.TaskType.LOAD,null,movementCost);
		task.setTransport(transport);
		this.addTask(task);
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
	
	/*public boolean isAfv() {
		boolean returnValue = false;
		UnitCategory category = getCategory();
		switch(category) {
			case ARMORED_CAR:
			case ASSAULT_GUN:
			case TANK_DESTORYER:
			case TANK:
				returnValue = true;
		
		}
		return returnValue;
	}*/
	
	save:function() {
		var returnValue = {};
		returnValue.id = this.mId;
		returnValue.type = this.mCounterType.getCounterName();
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
		return this.mCounterType.getCounterName();
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