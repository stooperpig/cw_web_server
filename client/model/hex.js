var wego = wego || {};

wego.Hex = function(col,row) {
	this.mStack;
	this.mColumn = col;
	this.mRow = row;
	this.mSelected = false;
	this.mHexType;
	this.mSecondaryHexType;
	this.mElevation;
	this.mHexSides = new Array();
	
	for(var i = 0; i < 6; ++i) {
		this.mHexSides[i] = new wego.HexSide();
	}
}

wego.Hex.prototype = {
	setElevation:function(value) {
		this.mElevation = value;
	},
		
	getElevation:function() {
		return this.mElevation;
	},
		
	setSecondaryHexType:function(value) {
		this.mSecondaryHexType = value;
	},
	
	getSecondaryHexType:function() {
		return this.mSecondaryHexType;
	},
		
	setHexType:function(value) {
		this.mHexType = value;
	},
	
	getHexType:function() {
		return this.mHexType;
	},
		
	addCounter:function(counter) {
		var stack = this.getStack(true);
		stack.addCounter(counter);
	},
	
	removeCounter:function(counter) {
		var stack = this.getStack();
		if (stack != null) {
			stack.removeCounter(counter);
		}
	},
	
	getStack:function(createIfNull) {
		if (this.mStack == null && createIfNull == true) {
			this.mStack = new wego.CounterStack();
		}
		
		return this.mStack;
	},
	
	draw:function(context) {
		var stack = this.getStack(false);
		var coord = wego.Map.hexToPoint(this.mColumn, this.mRow);
		if (this.mSelected) {
			var adjX = coord.x; // - 35;
			var adjY = coord.y; // - 30;
			var image = wego.ImageCache["Current Hex"].image;
			context.drawImage(image,adjX,adjY);
		}
		
		if (stack != null && !stack.isEmpty()) {
			var x = coord.x;
			var y = coord.y;
			stack.draw(context,x,y);
		}
	},
	
	setSelected:function(value) {
		this.mSelected = value;
	},
	
	getRow:function() {
		return this.mRow;
	},
	
	getColumn:function() {
		return this.mColumn;
	},
	
	isAdjacent:function(hex) {
		var returnValue = false;
		var col = hex.getColumn();
		var row = hex.getRow();
		var rowDelta = row - this.mRow;

		if (Math.abs(col-this.mColumn) <= 1) {
			if (col == this.mColumn) {
				returnValue = (Math.abs(rowDelta) == 1);
			} else {
				if (this.mColumn%2 == 0) {
					returnValue = (rowDelta == 1 || rowDelta == 0);
				} else {
					returnValue = (rowDelta == -1 || rowDelta == 0);
				}
			}
		}

		return returnValue;
	},
	
	toString:function() {
		return this.mHexType.name + " (" + this.mColumn + " ," + this.mRow + ")";
	},
	
	setHexSideType:function(hexSideType,hexSideMask) {
		var hexSide = null;
		if ((hexSideMask & 1) != 0) {
			hexSide = this.mHexSides[0];
			hexSide.updateValue(hexSideType);
		}
		
		if ((hexSideMask & 2) != 0) {
			hexSide = this.mHexSides[1];
			hexSide.updateValue(hexSideType);
		}
		
		if ((hexSideMask & 4) != 0) {
			hexSide = this.mHexSides[2];
			hexSide.updateValue(hexSideType);
		}
		
		if ((hexSideMask & 8) != 0) {
			hexSide = this.mHexSides[3];
			hexSide.updateValue(hexSideType);
		}
		
		if ((hexSideMask & 16) != 0) {
			hexSide = this.mHexSides[4];
			hexSide.updateValue(hexSideType);
		}
		
		if ((hexSideMask & 32) != 0) {
			hexSide = this.mHexSides[5];
			hexSide.updateValue(hexSideType);
		}
	},
	
	getHexSides:function() {
		return this.mHexSides;
	},
	
	getSharedHexSide:function(toHex) {
		var returnValue = null;
		var col = hex.getColumn();
		var row = hex.getRow();
		
		if (col == this.mColumn) {
			if (row < this.mRow) {
				returnValue = this.mHexSides[0];
			} else {
				returnValue = this.mHexSides[3];
			}
		} else {
			if (this.mColumn % 2 == 0) {
				if (col > this.mColumn) {
					if (row == this.mRow) {
						returnValue = this.mHexSides[1];
					} else {
						returnValue = this.mHexSides[2];
					}
				} else {
					if (row == this.mRow) {
						returnValue = this.mHexSides[5];
					} else {
						returnValue = this.mHexSides[4];
					}
				}
			} else{
				if (col > this.mColumn) {
					if (row == this.mRow) {
						returnValue = this.mHexSides[2];
					} else {
						returnValue = this.mHexSides[1];
					}
				} else {
					if (row == this.mRow) {
						returnValue = this.mHexSides[4];
					} else {
						returnValue = this.mHexSides[5];
					}
				}
			}
		}
		
		return returnValue;
	}
}
