import {Counter} from './counter.js';

var CounterFactory = (function() {
	function buildCounter(counterData) {
        let counter = new Counter();

        counter.type = counterData.type;
        counter.quality = counterData.quality;
        counter.weapon = counterData.weapon;
	    counter.unitImageIndex = counterData.unitImageIndex;
        counter.unitSymbolIndex = counterData.unitSymbolIndex;
		counter.name = counterData.name;
		counter.shortName = counterData.shortName;
       	counter.parentName = counterData.parentName;
       	counter.originalStrength = counterData.originalStrength;
    	counter.id = counterData.id;
    	counter.leadership = counterData.leadership;
    	counter.command = counterData.command;
    	counter.range = counterData.range;
	    counter.canChangeFormation = counterData.canChangeFormation;
	    counter.canMoveInLine = counterData.canMoveInLine;
		
		return counter;
	}

	return {
		buildCounter : buildCounter
	}
})();

export default {};
export {CounterFactory};