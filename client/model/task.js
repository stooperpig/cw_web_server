class Task {
	constructor(type, cost, movementFactor) {
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
		this.spotted = false;
		this.id = ++Task.counter;
	}

	clone(type, cost, movementFactor) {
		let task = new Task(type, cost, movementFactor);
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
	}

	toString() {
		let hex = null;
		if (this.otherHex != null) {
			hex = this.otherHex;
		} else {
			hex = this.hex
		}
		let returnValue = this.type + "-" + ((hex != null)?hex.toString():"loaded") + "-" + this.cost;
		return returnValue;
	}
	
	save() {
		let returnValue = {};
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
			for(let i = 0; i < this.targets.length; ++i) {
				returnValue.targetIds[i] = this.targets[i].id;
			}
		}
		
		returnValue.facing = this.facing;
		returnValue.strength = this.strength;
		returnValue.fatigue = this.fatigue;
		returnValue.formation = this.formation;
		returnValue.moraleStatus = this.moraleStatus;
		returnValue.fixed = this.fixed;
		returnValue.spotted = this.spotted;
		
		return returnValue;
	}
}

export default {};
export {Task};