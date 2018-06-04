var wego = wego || {};

wego.HexSide = function() {
	this.mValue = 0;
}

wego.HexSide.prototype = {
	getValue:function() {
		return this.mValue;
	},

	isClear:function() {
		return this.mValue == 0;
	},
		
	isTrail:function() {
		return (this.mValue & wego.HexSideType.TRAIL.mask) != 0;
	},
		
	isRoad:function() {
		return (this.mValue & wego.HexSideType.ROAD.mask) != 0;
	},
		
	isPike:function() {
		return (this.mValue & wego.HexSideType.PIKE.mask) != 0;
	},

	isRailroad:function() {
		return (this.mValue & wego.HexSideType.RAILROAD.mask) != 0;
	},

	isStream:function() {
		return (this.mValue & wego.HexSideType.STREAM.mask) != 0;
	},

	isCreek:function() {
		return (this.mValue & wego.HexSideType.CREEK.mask) != 0;
	},

	isEmbankment:function() {
		return (this.mValue & wego.HexSideType.EMBANKMENT.mask) != 0;
	},
		
	isWall:function() {
		return (this.mValue & wego.HexSideType.WALL.mask) != 0;
	},
		
	isRailroadCut:function() {
		return (this.mValue & wego.HexSideType.RAILROAD_CUT.mask) != 0;
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
			if(this.isTrail()) {
				returnValue += "trail";
			}
			if (this.isRoad()) {
				if (returnValue.length > 0) {
					returnValue += "/";
				}
				returnValue += "road";
			}
			if (this.isPike()) {
				if (returnValue.length > 0) {
					returnValue += "/";
				}
				returnValue += "pike";
			}
			if (this.isRailroad()) {
				if (returnValue.length > 0) {
					returnValue += "/";
				}
				returnValue += "railroad";
			}
			if (this.isStream()) {
				if (returnValue.length > 0) {
					returnValue += "/";
				}
				returnValue += "stream";
			}
			if (this.isCreek()) {
				if (returnValue.length > 0) {
					returnValue += "/";
				}
				returnValue += "creek";
			}
			if (this.isEmbankment()) {
				if (returnValue.length > 0) {
					returnValue += "/";
				}
				returnValue += "embankment";
			}
			if (this.isWall()) {
				if (returnValue.length > 0) {
					returnValue += "/";
				}
				returnValue += "wall";
			}
			if (this.isRailroadCut()) {
				if (returnValue.length > 0) {
					returnValue += "/";
				}
				returnValue += "railroad cut";
			}
		}
		return returnValue;
	}
}
