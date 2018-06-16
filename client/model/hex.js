var wego = wego || {};

wego.Hex = function(col,row) {
	this.stack = null;
	this.column = col;
	this.row = row;
	this.selected = false;
	this.hexType;
	this.secondaryHexType;
	this.elevation;
	this.hexSides = new Array();
	
	for(let i = 0; i < 6; ++i) {
		this.hexSides[i] = new wego.HexSide();
	}
}

wego.Hex.prototype = {
	addCounter:function(counter) {
		if (this.stack == null) {
			this.stack = new wego.CounterStack();
		}

		this.stack.addCounter(counter);
	},
	
	removeCounter:function(counter) {
		if (this.stack != null) {
			this.stack.removeCounter(counter);
		}
	},
	
	// getStack:function(createIfNull) {
	// 	if (this.stack == null && createIfNull == true) {
	// 		this.stack = new wego.CounterStack();
	// 	}
		
	// 	return this.stack;
	// },
	
	isAdjacent:function(hex) {
		let returnValue = false;
		let col = hex.column;
		let row = hex.row;
		let rowDelta = row - this.row;

		if (Math.abs(col-this.column) <= 1) {
			if (col == this.column) {
				returnValue = (Math.abs(rowDelta) == 1);
			} else {
				if (this.column%2 == 0) {
					returnValue = (rowDelta == 1 || rowDelta == 0);
				} else {
					returnValue = (rowDelta == -1 || rowDelta == 0);
				}
			}
		}

		return returnValue;
	},
	
	toString:function() {
		return this.hexType.name + " (" + this.column + " ," + this.row + ")";
	},
	
	setHexSideType:function(hexSideType,hexSideMask) {
		let hexSide = null;
		if ((hexSideMask & 1) != 0) {
			hexSide = this.hexSides[0];
			hexSide.updateValue(hexSideType);
		}
		
		if ((hexSideMask & 2) != 0) {
			hexSide = this.hexSides[1];
			hexSide.updateValue(hexSideType);
		}
		
		if ((hexSideMask & 4) != 0) {
			hexSide = this.hexSides[2];
			hexSide.updateValue(hexSideType);
		}
		
		if ((hexSideMask & 8) != 0) {
			hexSide = this.hexSides[3];
			hexSide.updateValue(hexSideType);
		}
		
		if ((hexSideMask & 16) != 0) {
			hexSide = this.hexSides[4];
			hexSide.updateValue(hexSideType);
		}
		
		if ((hexSideMask & 32) != 0) {
			hexSide = this.hexSides[5];
			hexSide.updateValue(hexSideType);
		}
	},

	getSharedHexSideIndex:function(toHex) {
		let returnValue = null;
		let col = toHex.column;
		let row = toHex.row;
		
		if (col == this.column) {
			if (row < this.row) {
				returnValue = 0;
			} else {
				returnValue = 3;
			}
		} else {
			if (this.column % 2 == 0) {
				if (col > this.column) {
					if (row == this.row) {
						returnValue = 1;
					} else {
						returnValue = 2;
					}
				} else {
					if (row == this.row) {
						returnValue = 5;
					} else {
						returnValue = 4;
					}
				}
			} else{
				if (col > this.column) {
					if (row == this.row) {
						returnValue = 2;
					} else {
						returnValue = 1;
					}
				} else {
					if (row == this.row) {
						returnValue = 4;
					} else {
						returnValue = 5;
					}
				}
			}
		}
		
		return returnValue;
	},
	
	getSharedHexSide:function(toHex) {
		let index = this.getSharedHexSideIndex(toHex);
		return this.mHexSides[index];
	}
}
