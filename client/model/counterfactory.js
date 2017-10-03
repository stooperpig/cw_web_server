var wego = wego || {};

wego.CounterFactory = (function() {
	//var counterTypeMap = {};

	function buildCounter(counterData) {
        var counter = new wego.Counter();

        counter.type = counterData.type;
        counter.quality = counterData.quality;
        counter.weapon = counterData.weapon;
	    counter.unitImageIndex = counterData.unitImageIndex;
        counter.unitSymbolIndex = counterData.unitSymbolIndex;
    	counter.name = counterData.name;
       	counter.parentName = counterData.parentName;
    	counter.facing = counterData.facing;
       	counter.strength = counterData.strength;
    	counter.id = counterData.id;
    	counter.fatigue = counterData.fatigue;
    	counter.formation = counterData.formation;
    	counter.fixed = counterData.fixed;
    	counter.moraleStatus = counterData.moraleStatus;
    	counter.leadership = counterData.leadership;
    	counter.command = counterData.command;
		
		return counter;
	}
	
	function initialize(counterData) {
	}
	
	return {
		buildCounter: buildCounter,
		initialize: initialize
	}
})();