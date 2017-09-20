var wego = wego || {};

wego.CounterFactory = (function() {
	var counterTypeMap = {};

	function buildCounter(id,counterTypeName) {
		var returnValue = null;
		
		var counterType = counterTypeMap[counterTypeName];
		if (counterType != null) {
			returnValue = new wego.Counter(id,counterType);
		}
		
		return returnValue;
	}
	
	function initialize(counterData) {
	    for(var i = 0; i < counterData.length; ++i) {
	        var counter = counterData[i];
	        var nationality = wego.NationalityType.getType(counter.nationality);
	        var weaponClass = wego.WeaponClass.getType(counter.weaponClass);
	        var unitCategory = wego.UnitCategory.getType(counter.unitCategory);
	        var unitSubcategory = wego.UnitSubcategory.getType(counter.unitSubcategory);
	        counterTypeMap[counter.name] = new wego.CounterType(nationality, counter.name, counter.attackFactor, counter.rangeFactor, counter.defenseFactor, counter.movementFactor, weaponClass, unitCategory, unitSubcategory);
	    }
	}
	
	return {
		buildCounter: buildCounter,
		initialize: initialize
	}
})();