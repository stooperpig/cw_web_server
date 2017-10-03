var wego = wego || {};

wego.Map = (function () {
    var LEFT = 1;
    var RIGHT = -1;
    var STRAIGHT = 0;
	var TOP_MARGIN = 0;
	var LEFT_MARGIN = 0;
	var HEX_HEIGHT = 0;
	var HEX_WIDTH = 0;
	var DX = 0;
	var DY = 0;
	var INTERNAL_TOP_MARGIN =  15;
	var INTERNAL_LEFT_MARGIN = 8;
	var HEX_SIDE = 0;
	
	var mMapData;
	var mHexGrid;
	var mImages;
	var mBoardHeight;
	var mBoardWidth;
	var mBoards;
	
	function draw(context) {
		var images = getImages();
		
		console.log(images[0].naturalHeight);
		
		context.drawImage(images[0], LEFT_MARGIN, TOP_MARGIN);
		for(var i = 1; i < images.length; ++i) {
			context.drawImage(images[i], LEFT_MARGIN, TOP_MARGIN + (i * mBoardHeight));
		}
	
		
		for(var i = 0; i < mHexGrid.length; ++i) {
			for(var j = 0; j < mHexGrid[i].length; ++j ) {
				mHexGrid[i][j].draw(context, this);
			}
		}
	}
	
	function getHex(col, row) {
		var returnValue = null;
		
		if (col > -1 && row > -1) {
			returnValue = mHexGrid[col][row];
		}
		return returnValue;
	}

	function getHexCenterPoint(col, row) {
        var coord = hexToPoint(col,row);
        var adjX = coord.x + DX + (HEX_SIDE / 2);
        var adjY = coord.y + DY;
    }
	
	function getImages() {
		if (mImages == null) {
			mImages = new Array(); 
			//r(var i = 0; i < mBoards.length; ++i) {
			//	console.log("board " + i + " " + mBoards[i].name);
			//	mImages[i] = wego.ImageCache[mBoards[i].name].image;
			//}
			mImages[0] = wego.ImageCache['main1'].image;
			
			mBoardHeight = mImages[0].naturalHeight;
			mBoardWidth = mImages[0].naturalWidth;
			
			console.log("mBoardHeight: " + mBoardHeight);
		}
		
		return mImages;
	}
	
	function getPixelHeight() {
		var images = getImages();
		return (mBoardHeight * images.length) + (2 * TOP_MARGIN);
	}
	
	function getPixelWidth() {
		return mBoardWidth + (2 * LEFT_MARGIN);
	}
	

	
	function getRange(hex0, hex1) {
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
	}

	//returns the coord of the upper left corner of square that
	//would enclose the hexagon
	function hexToPoint(col, row) {
		var x = 0;
		var y = 0;
		if (col % 2 == 0) {
			x = col * HEX_WIDTH;
			y = DY; // - 1;
			y += row * HEX_HEIGHT;
		} else {
			x = col * HEX_WIDTH;
			y = row * HEX_HEIGHT;
		}
		
		var returnValue = {};
		returnValue.x = x + LEFT_MARGIN + INTERNAL_LEFT_MARGIN;
		returnValue.y = y + TOP_MARGIN + INTERNAL_TOP_MARGIN;
		
		return returnValue;
	}
	
	function initialize(mapData) {
	    mHexGrid = new Array();
	    TOP_MARGIN = mapData.boardProperties.topMargin;
	    LEFT_MARGIN = mapData.boardProperties.leftMargin;
	    HEX_HEIGHT = mapData.boardProperties.hexHeight;
	    HEX_WIDTH = mapData.boardProperties.hexWidth;
	    DX = mapData.boardProperties.dx;
	    DY = mapData.boardProperties.dy;
	    HEX_SIDE = mapData.boardProperties.hexSide;

		mBoards = mapData.boards;
		var columns = mapData.columns;
		var rows = mapData.rows;
		var hexTypes = mapData.hexTypes;
		//var secondaryHexTypes = mapData.secondaryHexTypes;
		var elevations = mapData.elevations;
		var gullies = mapData.gully;
		var forests = mapData.forest;
		var slopes = mapData.slope;
		var roads = mapData.road;
		var towns = mapData.town;
		for(i = 0; i < columns; ++i) {
			mHexGrid[i] = new Array();
			for(j = 0; j < rows; ++j) {
				var type = hexTypes[j].charAt(i);
				var hexType = wego.HexType.getType(type);
				//var secondaryType = secondaryHexTypes[j].charAt(i);
				//var secondaryHexType = wego.SecondaryHexType.getType(secondaryType);
				var elevation = elevations[j].charAt(i);
				var gullyMask = gullies[j].charCodeAt(i) - 32;
				var forestMask = forests[j].charCodeAt(i) - 32;
				var slopeMask = slopes[j].charCodeAt(i) - 32;
				var roadMask = roads[j].charCodeAt(i) - 32;
				var townMask = towns[j].charCodeAt(i) - 32;
				var hex = new wego.Hex(i,j);
				hex.setHexType(hexType);
				//hex.setSecondaryHexType(secondaryHexType);
				hex.setElevation(elevation);
				hex.setHexSideType(wego.HexSideType.FOREST,forestMask);
				hex.setHexSideType(wego.HexSideType.GULLY,gullyMask);
				hex.setHexSideType(wego.HexSideType.SLOPE,slopeMask);
				hex.setHexSideType(wego.HexSideType.ROAD,roadMask);
				hex.setHexSideType(wego.HexSideType.TOWN,townMask);
				mHexGrid[i][j] = hex;
			}
		}
	}
	
	function pointToHex(x, y) {
	    y -= INTERNAL_TOP_MARGIN;

		var col = Math.floor(x/HEX_WIDTH);
		var row = -1;
			
		if (col % 2 == 0) {
			y = y - DY;
			row = Math.floor(y/HEX_HEIGHT);
			var modX = x % HEX_WIDTH;
			if (modX < DX) {
				var modY = y % HEX_HEIGHT;
				var cross = turns(DX,0,0,DY,modX,modY);
				if (cross == LEFT) {
					console.log("up to the left");
					--col;
				} else if (cross == RIGHT) {
					cross = turns(0,DY,DX,HEX_HEIGHT,modX,modY);
					if (cross == LEFT) {
						console.log("down to the left");
						--col;
						++row;
					}
				}
			}
		} else {
			row = Math.floor(y/HEX_HEIGHT);
			var modX = x % HEX_WIDTH;
			if (modX < DX) {
				var modY = y % HEX_HEIGHT;
				var cross = turns(DX,0,0,DY,modX,modY);
				if (cross == LEFT) {
					console.log("up to the left");
					--row;
					--col;
				} else if (cross == RIGHT) {
					cross = turns(0,DY,DX,HEX_HEIGHT,modX,modY);
					if (cross == LEFT) {
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
	}

	function turns(x0, y0, x1, y1, x2, y2) {
		var returnValue;
		var cross = (x1-x0)*(y2-y0) - (x2-x0)*(y1-y0);
		if(cross > 1.0) {
			returnValue = LEFT;
		} else {
			if( cross < -1.0) {
				returnValue = RIGHT;
			} else {
				returnValue = STRAIGHT;
			}
		}
		
		return returnValue;
	}
	
	return {
		draw: draw,
		getHex: getHex,
		getPixelHeight: getPixelHeight,
		getPixelWidth: getPixelWidth,
		getRange: getRange,
		hexToPoint: hexToPoint,
		initialize: initialize,
		pointToHex: pointToHex
	}
})();
