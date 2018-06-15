var wego = wego || {};

wego.CounterStack = function() {
	this.counters = new Array();
}

wego.CounterStack.prototype = {
	addCounter:function(counter) {
		this.counters.push(counter);
	},
	
	removeCounter:function(counter) {
		let index = this.counters.indexOf(counter);
		if (index > -1) {
			this.counters.splice(index,1);
		}
	},
	
	isEmpty:function() {
		return this.counters.length == 0;
	}
}