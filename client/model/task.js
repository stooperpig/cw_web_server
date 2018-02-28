var wego = wego || {};

wego.Task = function(type, cost, movementFactor) {
	this.type = type;
	this.movementFactor = movementFactor;
	this.cost = cost;
	this.hex = null;
	this.otherHex = null;
	this.targets = null;
	this.facing = 0;
	this.strength = 0;
	this.fatigue = 0;
	this.formation = 0;
	this.moraleStatus = 0;
	this.fixed = false;
	this.id = ++wego.Task.counter;
}

wego.Task.prototype = {
	clone: function(type, cost, movementFactor) {
		var task = new wego.Task(type, cost, movementFactor);
		task.hex = this.hex;
		task.otherHex = this.otherHex;
		task.targets = this.targets;
		task.facing = this.facing;
		task.strength = this.strength;
		task.fatigue = this.fatigue;
		task.formation = this.formation;
		task.moraleStatus = this.moraleStatus;
		task.fixed = this.fixed;
		
		return task;
	},

	toString:function() {
		var hex = null;
		if (this.otherHex != null) {
			hex = this.otherHex;
		} else {
			hex = this.hex
		}
		var returnValue = this.type + "-" + ((hex != null)?hex.toString():"loaded") + "-" + this.cost;
		return returnValue;
	},
	
	save:function() {
		var returnValue = {};
		returnValue.id = this.id;
		returnValue.type = this.type;
		
		if (this.mHex != null) {
			returnValue.hexX = this.hex.getColumn();
			returnValue.hexY = this.hex.getRow();
		}
			
		if (this.mOtherHex != null) {
			returnValue.otherHexX = this.otherHex.getColumn();
			returnValue.otherHexY = this.otherHex.getRow();
		}
		
		if (this.movementFactor != null && this.movementFactor != 0) {
			returnValue.movementFactor = this.movementFactor;
		}

		if (this.remainingMovementFactor != null && this.remainingMovementFactor != 0) {
			returnValue.remainingMovementFactor = this.remainingMovementFactor;
		}
		
		if (this.targets != null) {
			returnValue.targets = new Array();
			for(var i = 0; i < this.targets.length; ++i) {
				returnValue.targetIds[i] = this.targets[i].getId();
			}
		}
		
		return returnValue;
	}
}

wego.Task.counter = 0;