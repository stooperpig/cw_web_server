var wego = wego || {};

wego.HexSide = function() {
	this.mValue = 0;
}

wego.HexSide.prototype = {
	getValue:function() {
		return this.mValue;
	},
		
	isSlope:function() {
		return (this.mValue & wego.HexSideType.SLOPE.mask) != 0;
	},
		
	isRoad:function() {
		return (this.mValue & wego.HexSideType.ROAD.mask) != 0;
	},
		
	isClear:function() {
		return this.mValue == 0;
	},
		
	isForest:function() {
		return (this.mValue & wego.HexSideType.FOREST.mask) != 0;
	},
		
	isGully:function() {
		return (this.mValue & wego.HexSideType.GULLY.mask) != 0;
	},
		
	isTown:function() {
		return (this.mValue & wego.HexSideType.TOWN.mask) != 0;
	},
		
	isType:function(hexSideType) {
		return (this.mValue & hexSideType.mask) != 0;
	},
		
	updateValue:function(hexSideType) {
		var mask = hexSideType.mask;
		if (mask == 0) {
			this.mValue = 0;
		} else {
			this.mValue = this.mValue | mask;
		}
	},
		
	toString:function() {
		var returnValue = "";
			
		if (this.isClear()) {
			returnValue = "clear";
		} else {
			if(this.isForest()) {
				returnValue += "forest";
			}
			if (this.isGully()) {
				if (returnValue.length > 0) {
					returnValue += "/";
				}
				returnValue += "gully";
			}
			if (this.isRoad()) {
				if (returnValue.length > 0) {
					returnValue += "/";
				}
				returnValue += "road";
			}
			if (this.isSlope()) {
				if (returnValue.length > 0) {
					returnValue += "/";
				}
				returnValue += "slope";
			}
			if (this.isTown()) {
				if (returnValue.length > 0) {
					returnValue += "/";
				}
				returnValue += "town";
			}
		}
		return returnValue;
	}
}
