var wego = wego || {};

wego.Player = function(id,name) {
	this.mCounters = new Array();
	this.mId = id;
	this.mName = name;
	this.mTeam;
}

wego.Player.prototype = {	
	addCounter:function(counter) {
		counter.setPlayer(this);
		this.mCounters.push(counter);
	},
	
	getCounter:function(id) {
		var returnValue = null;
		
		for(var i = 0; i < this.mCounters.length; ++i) {
			if (this.mCounters[i].getId() == id) {
				returnValue = this.mCounters[i];
				break;
			}
		}
		
		return returnValue;
	},
	
	getCounters:function() {
		return this.mCounters;
	},
	
	getId:function() {
		return this.mId;
	},
	
	getName:function() {
		return this.mName;
	},
	
	getNextUnit:function(index) {
		var newIndex = index + 1;
		var counter = null;
		for(var i = newIndex; i < this.mCounters.length; ++i) {
			if (!this.mCounters[i].isFinished() && this.mCounters[i].getHex() != null) {
				counter = this.mCounters[i];
				newIndex = i;
				break;
			}
		}
		
		if (counter == null) {
			for(var i = 0; i < newIndex; ++i) {
				if (!this.mCounters[i].isFinished() && this.mCounters[i].getHex() != null) {
					counter = this.mCounters[i];
					newIndex = i;
					break;
				}
			}
		}
		
		return ({nextIndex:newIndex, unit:counter});
	},
	
	getPrevUnit:function(index) {
		var newIndex = index - 1;
		var counter = null;
		for(var i = newIndex; i >= 0; --i) {
			if (!this.mCounters[i].isFinished() && this.mCounters[i].getHex() != null) {
				counter = this.mCounters[i];
				newIndex = i;
				break;
			}
		}
		
		if (counter == null) {
			for(var i = this.mCounters.length - 1; i > newIndex; --i) {
				if (!this.mCounters[i].isFinished() && this.mCounters[i].getHex() != null) {
					counter = this.mCounters[i];
					newIndex = i;
					break;
				}
			}
		}
		
		return ({nextIndex:newIndex, unit:counter});
	},
	
	getTeam:function() {
		return this.mTeam;
	},
	
	save:function() {
		var returnValue = {};
		returnValue.id = this.mId;
		returnValue.name = this.mName;
		returnValue.counters = new Array();
		for(var i = 0; i < this.mCounters.length; ++i) {
			var result = this.mCounters[i].save();
			returnValue.counters[i] = result;
		}
		
		return returnValue;
	},
	
	setTeam:function(value) {
		this.mTeam = value;
	}
}