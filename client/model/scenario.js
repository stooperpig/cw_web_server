var wego = wego || {};

wego.Scenario = function() {
	this.title = null;
	this.otherImages = null;
	this.description = null;
	this.startTime = null;
	this.numberOfTurns = 0;
	this.minutesPerTurn = 0;
}

wego.Scenario.prototype= {
	initialize:function(data) {
		this.name = data.name;
		this.otherImages = data.otherImages;
		this.title = data.title;
		this.description = data.description;
		this.startTime = data.startTime;
		this.numberOfTurns = data.numberOfTurns;
		this.minutesPerTurn = data.minutesPerTurn;
	},
	
	getImageNames:function() {
		var returnValue = new Array();

		for (var name in this.otherImages) {
		    returnValue[name] = this.otherImages[name];
		}
		
		return returnValue;
	}
}