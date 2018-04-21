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
	this.formation = wego.Formation.LINE;
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
		
		if (this.hex != null) {
			returnValue.hexX = this.hex.column;
			returnValue.hexY = this.hex.row;
		}
			
		if (this.otherHex != null) {
			returnValue.otherHexX = this.otherHex.column;
			returnValue.otherHexY = this.otherHex.row;
		}
		
		if (this.movementFactor != null) {
			returnValue.movementFactor = this.movementFactor;
		}

		if (this.cost != null && this.cost != 0) {
			returnValue.cost = this.cost;
		}
		
		if (this.targets != null) {
			returnValue.targets = new Array();
			for(var i = 0; i < this.targets.length; ++i) {
				returnValue.targetIds[i] = this.targets[i].id;
			}
		}
		
		returnValue.facing = this.facing;
		returnValue.strength = this.strength;
		returnValue.fatigue = this.fatigue;
		returnValue.formation = this.formation;
		returnValue.moraleStatus = this.moraleStatus;
		returnValue.fixed = this.fixed;
		
		return returnValue;
	}
}

wego.Task.counter = 0;