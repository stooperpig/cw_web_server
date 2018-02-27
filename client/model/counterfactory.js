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
		counter.shortName = counterData.shortName;
       	counter.parentName = counterData.parentName;
    	//counter.facing = counterData.facing;
       	counter.originalStrength = counterData.originalStrength;
    	counter.id = counterData.id;
    	//counter.fatigue = counterData.fatigue;
    	//counter.formation = counterData.formation;
    	//counter.fixed = counterData.fixed;
    	//counter.moraleStatus = counterData.moraleStatus;
    	counter.leadership = counterData.leadership;
    	counter.command = counterData.command;
    	counter.range = counterData.range;
	    //counter.lineMovement = counterData.lineMovement;
	    //counter.columnMovement = counterData.columnMovement;
	    counter.canChangeFormation = counterData.canChangeFormation;
	    counter.canMoveInLine = counterData.canMoveInLine;
		
		return counter;
	}
	
	function initialize(counterData) {
	}
	
	return {
		buildCounter: buildCounter,
		initialize: initialize
	}
})();