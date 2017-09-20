var wego = wego || {};

wego.Task = function(type, hex, movementFactor, previousTask, id) {
	this.mType = type;
	this.mHex = hex;
	this.mTransport = null;
	this.mPassengers = null;
	this.mOtherHex = null;
	this.mTargets = null;
	this.mMovementFactor = 0;
		
	if (id == null) {
		this.mId = ++wego.Task.counter;
	} else {
		this.mId = id;
	}
	
	if (movementFactor != null) {
		this.mMovementFactor = movementFactor;
	}
	
	if (previousTask != null) {
		this.mTransport = previousTask.getTransport();
		this.mPassengers = previousTask.getPassengers();
	}
}

wego.Task.prototype = {
	getId:function() {
		return this.mId;
	},
	
	setTargets:function(value) {
		this.mTargets = value;
	},
	
	getTargets:function() {
		return this.mTargets;
	},
	
	getType:function() {
		return this.mType;
	},
	
	getHex:function() {
		return this.mHex;
	},
	
	getTransport:function() {
		return this.mTransport;
	},
	
	setTransport:function(value) {
		this.mTransport = value;
	},
	
	getPassengers:function() {
		return this.mPassengers;
	},
	
	setPassengers:function(value) {
		this.mPassengers = value;
	},
	
	getOtherHex:function() {
		return this.mOtherHex;
	},
	
	setOtherHex:function(value) {
		this.mOtherHex = value;
	},
	
	getMovementFactor:function() {
		return this.mMovementFactor;
	},
	
	getSecondCounter:function() { //fix this 
		return (this.mTransport != null)?this.mTransport:this.mPassenger;
	},
	
	toString:function() {
		var hex = null;
		if (this.mOtherHex != null) {
			hex = this.mOtherHex;
		} else {
			hex = this.mHex
		}
		var returnValue = this.mType + "-" + ((hex != null)?hex.toString():"loaded") + "-" + this.mMovementFactor;
		return returnValue;
	},
	
	save:function() {
		var returnValue = {};
		returnValue.id = this.mId;
		returnValue.type = this.mType;
		
		if (this.mHex != null) {
			returnValue.hexX = this.mHex.getColumn();
			returnValue.hexY = this.mHex.getRow();
		}
		
		if (this.mTransport != null) {
			returnValue.transportId = this.mTransport.getId();
		}
		
		if (this.mPassengers != null) {
			var passengerIds = new Array();
			for(var i = 0; i < this.mPassengers; ++i) {
				passengerIds.push(this.mPassengers[i].getId());
			}
			returnValue.passengerIds = passengerIds;
		}
		
		if (this.mOtherHex != null) {
			returnValue.otherHexX = this.mOtherHex.getColumn();
			returnValue.otherHexY = this.mOtherHex.getRow();
		}
		
		if (this.mMovementFactor != null && this.mMovementFactor != 0) {
			returnValue.movementFactor = this.mMovementFactor;
		}
		
		if (this.mTargets != null) {
			returnValue.targets = new Array();
			for(var i = 0; i < this.mTargets.length; ++i) {
				returnValue.targetIds[i] = this.mTargets[i].getId();
			}
		}
		
		return returnValue;
	}
}

wego.Task.counter = 0;