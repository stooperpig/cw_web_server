var wego = wego || {};

wego.Map = function () {
    this.LEFT = 1;
    this.RIGHT = -1;
    this.STRAIGHT = 0;
	this.TOP_MARGIN = 0;
	this.LEFT_MARGIN = 0;
	this.HEX_HEIGHT = 0;
	this.HEX_WIDTH = 0;
	this.DX = 0;
	this.DY = 0;
	this.INTERNAL_TOP_MARGIN =  15;
	this.INTERNAL_LEFT_MARGIN = 8;
	this.HEX_SIDE = 0;
	this.mapData;
	this.hexGrid;
	this.images;
	this.boardHeight;
	this.boardWidth;
	this.boards;
}

wego.Map.prototype = {
	getHex: function(col, row) {
		var returnValue = null;
		
		if (col > -1 && row > -1) {
			returnValue = this.hexGrid[col][row];
		}
		return returnValue;
	},

	getHexCenterPoint:function(col, row) {
        var coord = hexToPoint(col,row);
        var adjX = coord.x + this.DX + (this.HEX_SIDE / 2);
        var adjY = coord.y + this.DY;
	},
	
	getImages:function() {
		if (this.images == null) {
			this.images = new Array(); 
			this.images[0] = wego.ImageCache['main1'].image;		
			this.boardHeight = this.images[0].naturalHeight;
			this.boardWidth = this.images[0].naturalWidth;
			//console.log("mBoardHeight: " + this.boardHeight);
		}
		
		return this.images;
	},

	getImageNames:function() {
		var returnValue = new Array();
		returnValue['main1'] = this.boards.main1;
		return returnValue;
	},
	
	getPixelHeight:function() {
		var images = this.getImages();
		return (this.boardHeight * images.length) + (2 * this.TOP_MARGIN);
	},
	
	getPixelWidth:function() {
		return this.boardWidth + (2 * this.LEFT_MARGIN);
	},
	
	getRange:function(hex0, hex1) {
		var hexX0 = Math.ceil((hex0.getColumn()+1)/2)-hex0.getRow();
		var hexY0 = Math.floor(hex0.getColumn()/2) + hex0.getRow();
		var hexX1 = Math.ceil((hex1.getColumn()+1)/2)-hex1.getRow();
		var hexY1 = Math.floor(hex1.getColumn()/2) + hex1.getRow();
		
		var dx = hexX1 - hexX0;
		var dy = hexY1 - hexY0;
		
		var xSign = (dx > 0)?1:((dx == 0)?0:-1);
		var ySign = (dy > 0)?1:((dy == 0)?0:-1);
		
		var range = -1;
		
		if (xSign != ySign) {
			range = Math.max(Math.abs(dx),Math.abs(dy));
		} else {
			range = Math.abs(dx) + Math.abs(dy);
		}
		
		return range;
	},

	//returns the coord of the upper left corner of square that
	//would enclose the hexagon
	hexToPoint:function(col, row) {
		var x = 0;
		var y = 0;
		if (col % 2 == 0) {
			x = col * this.HEX_WIDTH;
			y = this.DY; // - 1;
			y += row * this.HEX_HEIGHT;
		} else {
			x = col * this.HEX_WIDTH;
			y = row * this.HEX_HEIGHT;
		}
		
		var returnValue = {};
		returnValue.x = x + this.LEFT_MARGIN + this.INTERNAL_LEFT_MARGIN;
		returnValue.y = y + this.TOP_MARGIN + this.INTERNAL_TOP_MARGIN;
		
		return returnValue;
	},
	
	initialize:function(mapData) {
	    this.hexGrid = new Array();
	    this.TOP_MARGIN = mapData.boardProperties.topMargin;
	    this.LEFT_MARGIN = mapData.boardProperties.leftMargin;
	    this.HEX_HEIGHT = mapData.boardProperties.hexHeight;
	    this.HEX_WIDTH = mapData.boardProperties.hexWidth;
	    this.DX = mapData.boardProperties.dx;
	    this.DY = mapData.boardProperties.dy;
	    this.HEX_SIDE = mapData.boardProperties.hexSide;

		this.boards = mapData.boards;
		var columns = mapData.columns;
		var rows = mapData.rows;
		var hexTypes = mapData.hexTypes;
		var elevations = mapData.elevations;
		var gullies = mapData.gully;
		var forests = mapData.forest;
		var slopes = mapData.slope;
		var roads = mapData.road;
		var towns = mapData.town;
		for(i = 0; i < columns; ++i) {
			this.hexGrid[i] = new Array();
			for(j = 0; j < rows; ++j) {
				var type = hexTypes[j].charAt(i);
				var hexType = wego.HexType.getType(type);
				var elevation = elevations[j].charAt(i);
				var gullyMask = gullies[j].charCodeAt(i) - 32;
				var forestMask = forests[j].charCodeAt(i) - 32;
				var slopeMask = slopes[j].charCodeAt(i) - 32;
				var roadMask = roads[j].charCodeAt(i) - 32;
				var townMask = towns[j].charCodeAt(i) - 32;
				var hex = new wego.Hex(i,j);
				hex.hexType = hexType;
				hex.elevation = elevation;
				hex.setHexSideType(wego.HexSideType.FOREST,forestMask);
				hex.setHexSideType(wego.HexSideType.GULLY,gullyMask);
				hex.setHexSideType(wego.HexSideType.SLOPE,slopeMask);
				hex.setHexSideType(wego.HexSideType.ROAD,roadMask);
				hex.setHexSideType(wego.HexSideType.TOWN,townMask);
				this.hexGrid[i][j] = hex;
			}
		}
	},
	
	pointToHex:function(x, y) {
	    y -= this.INTERNAL_TOP_MARGIN;

		var col = Math.floor(x/this.HEX_WIDTH);
		var row = -1;
			
		if (col % 2 == 0) {
			y = y - this.DY;
			row = Math.floor(y/this.HEX_HEIGHT);
			var modX = x % this.HEX_WIDTH;
			if (modX < this.DX) {
				var modY = y % this.HEX_HEIGHT;
				var cross = this.turns(this.DX,0,0,this.DY,modX,modY);
				if (cross == this.LEFT) {
					console.log("up to the left");
					--col;
				} else if (cross == this.RIGHT) {
					cross = this.turns(0,this.DY,this.DX,this.HEX_HEIGHT,modX,modY);
					if (cross == this.LEFT) {
						console.log("down to the left");
						--col;
						++row;
					}
				}
			}
		} else {
			row = Math.floor(y/this.HEX_HEIGHT);
			var modX = x % this.HEX_WIDTH;
			if (modX < this.DX) {
				var modY = y % this.HEX_HEIGHT;
				var cross = this.turns(this.DX,0,0,this.DY,modX,modY);
				if (cross == this.LEFT) {
					console.log("up to the left");
					--row;
					--col;
				} else if (cross == this.RIGHT) {
					cross = this.turns(0,this.DY,this.DX,this.HEX_HEIGHT,modX,modY);
					if (cross == this.LEFT) {
						console.log("down to the left");
						--col;
					}
				}
			}
			console.log("odd column");
		}
		
		var returnValue = {};
		returnValue.row = row;
		returnValue.col = col;
		
		return returnValue;
	},

	turns:function(x0, y0, x1, y1, x2, y2) {
		var returnValue;
		var cross = (x1-x0)*(y2-y0) - (x2-x0)*(y1-y0);
		if(cross > 1.0) {
			returnValue = this.LEFT;
		} else {
			if( cross < -1.0) {
				returnValue = this.RIGHT;
			} else {
				returnValue = this.STRAIGHT;
			}
		}
		
		return returnValue;
	}
};