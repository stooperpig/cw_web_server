var wego = wego || {};

wego.MovementCostTable = (function() {
	function getHexCost(unit, fromHex, toHex) {
		var returnValue = 0;
		var toHexType = toHex.getHexType();
		var toSecondaryType = toHex.getSecondaryHexType();
		var fromSecondaryType = fromHex.getSecondaryHexType();
		var hexSide = fromHex.getSharedHexSide(toHex);
		var isVehicle = unit.isVehicle();
		var isTruck = unit.isTruck();
		var stack = toHex.getStack();
		
		if (hexSide.isRoad() && (stack == null || stack.isEmpty())) {
			returnValue = .5;
		} else if (hexSide.isForest() && isVehicle) {
			returnValue = 100;
		} else {
			if (fromSecondaryType == wego.SecondaryHexType.GULLY && (toSecondaryType != wego.SecondaryHexType.GULLY || toSecondaryType != wego.SecondaryHexType.FORD)) {
				if (isTruck) {
					returnValue = 5;
				} else if (isVehicle) {
					returnValue = 3;
				}
			}
			
			switch(toHexType) {
				case wego.HexType.CLEAR:
					if (isTruck) {
						returnValue += 2;
					} else {
						returnValue += 1;
					}
				break;
				case wego.HexType.FOREST:
					if (isTruck) {
						returnValue += 2;
					} else {
						returnValue += 1;
					}
				break;
				case wego.HexType.WATER:
					returnValue = 100;
				break;
	
				case wego.HexType.SWAMP:
					if (isVehicle) {
						returnValue = 100;
					} else {
						returnValue += 1;
					}
				break;
				case wego.HexType.TOWN:
					returnValue += .5;
				break;
			}
			
			switch(toSecondaryType) {
				case wego.SecondaryHexType.SLOPE:
					if (isTruck) {
						returnValue += 3;
					} else if (isVehicle) {
						returnValue += 2;
					} else {
						returnValue += 0;
					}
				break;
			}
		}
		
		return returnValue;
	}
	
	return {
		getHexCost: getHexCost
	}
})();
