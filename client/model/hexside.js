class HexSide {
	constructor() {
		this.mValue = 0;
	}

	getValue() {
		return this.mValue;
	}

	isClear() {
		return this.mValue == 0;
	}
		
	isTrail() {
		return (this.mValue & wego.HexSideType.TRAIL.mask) != 0;
	}
		
	isRoad() {
		return (this.mValue & wego.HexSideType.ROAD.mask) != 0;
	}
		
	isPike() {
		return (this.mValue & wego.HexSideType.PIKE.mask) != 0;
	}

	isRailroad() {
		return (this.mValue & wego.HexSideType.RAILROAD.mask) != 0;
	}

	isStream() {
		return (this.mValue & wego.HexSideType.STREAM.mask) != 0;
	}

	isCreek() {
		return (this.mValue & wego.HexSideType.CREEK.mask) != 0;
	}

	isEmbankment() {
		return (this.mValue & wego.HexSideType.EMBANKMENT.mask) != 0;
	}
		
	isWall() {
		return (this.mValue & wego.HexSideType.WALL.mask) != 0;
	}
		
	isRailroadCut() {
		return (this.mValue & wego.HexSideType.RAILROAD_CUT.mask) != 0;
	}
			
	isType(hexSideType) {
		return (this.mValue & hexSideType.mask) != 0;
	}
		
	updateValue(hexSideType) {
		let mask = hexSideType.mask;
		if (mask == 0) {
			this.mValue = 0;
		} else {
			this.mValue = this.mValue | mask;
		}
	}
		
	toString() {
		let returnValue = "";
			
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

export default {};
export {HexSide};