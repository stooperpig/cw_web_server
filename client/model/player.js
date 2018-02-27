var wego = wego || {};

wego.Player = function(id,name) {
	this.counters = new Array();
	this.id = id;
	this.name = name;
	this.team;
}

wego.Player.prototype = {	
	addCounter:function(counter) {
		counter.player = this;
		this.counters.push(counter);
	},
	
	getCounter:function(id) {
		var returnValue = null;
		
		for(var i = 0; i < this.counters.length; ++i) {
			if (this.counters[i].id == id) {
				returnValue = this.counters[i];
				break;
			}
		}
		
		return returnValue;
	},
	
	getNextUnit:function(mode, time, index) {
		var newIndex = index + 1;
		var counter = null;
		for(var i = newIndex; i < this.counters.length; ++i) {
			if (!this.counters[i].isFinished() && this.counters[i].getHex(mode, time) != null) {
				counter = this.counters[i];
				newIndex = i;
				break;
			}
		}
		
		if (counter == null) {
			for(var i = 0; i < newIndex; ++i) {
				if (!this.counters[i].isFinished() && this.counters[i].getHex(mode, time) != null) {
					counter = this.counters[i];
					newIndex = i;
					break;
				}
			}
		}
		
		return ({nextIndex:newIndex, unit:counter});
	},
	
	getPrevUnit:function(mode, time, index) {
		var newIndex = index - 1;
		var counter = null;
		for(var i = newIndex; i >= 0; --i) {
			if (!this.counters[i].isFinished() && this.counters[i].getHex(mode, time) != null) {
				counter = this.counters[i];
				newIndex = i;
				break;
			}
		}
		
		if (counter == null) {
			for(var i = this.counters.length - 1; i > newIndex; --i) {
				if (!this.counters[i].isFinished() && this.counters[i].getHex(mode, time) != null) {
					counter = this.counters[i];
					newIndex = i;
					break;
				}
			}
		}
		
		return ({nextIndex:newIndex, unit:counter});
	},
	
	save:function() {
		var returnValue = {};
		returnValue.id = this.id;
		returnValue.name = this.name;
		returnValue.counters = new Array();
		for(var i = 0; i < this.counters.length; ++i) {
			var result = this.counters[i].save();
			returnValue.counters[i] = result;
		}
		
		return returnValue;
	}
}