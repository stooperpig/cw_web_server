import {Hex} from './hex.js';

class Map {
	constructor() {
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
		this.columns;
		this.rows;
		this.hexGrid;
		this.images;
		this.boardHeight;
		this.boardWidth;
		this.boards;
	}

	getHex(col, row) {
		let  returnValue = null;
		
		if (col > -1 && row > -1) {
			returnValue = this.hexGrid[col][row];
		}
		return returnValue;
	}

	getHexCenterPoint(col, row) {
        let  coord = hexToPoint(col,row);
        let  adjX = coord.x + this.DX + (this.HEX_SIDE / 2);
        let  adjY = coord.y + this.DY;
	}
	
	getImages() {
		if (this.images == null) {
			this.images = new Array(); 
			this.images[0] = wego.ImageCache['main1'].image;		
			this.boardHeight = this.images[0].naturalHeight;
			this.boardWidth = this.images[0].naturalWidth;
			//console.log("mBoardHeight: " + this.boardHeight);
		}
		
		return this.images;
	}

	getImageNames() {
		let  returnValue = new Array();
		returnValue['main1'] = this.boards.main1;
		return returnValue;
	}
	
	getPixelHeight() {
		let  images = this.getImages();
		return (this.boardHeight * images.length) + (2 * this.TOP_MARGIN);
	}
	
	getPixelWidth() {
		return this.boardWidth + (2 * this.LEFT_MARGIN);
	}
	
	getRange(hex0, hex1) {
		let  hexX0 = Math.ceil((hex0.getColumn()+1)/2)-hex0.getRow();
		let  hexY0 = Math.floor(hex0.getColumn()/2) + hex0.getRow();
		let  hexX1 = Math.ceil((hex1.getColumn()+1)/2)-hex1.getRow();
		let  hexY1 = Math.floor(hex1.getColumn()/2) + hex1.getRow();
		
		let  dx = hexX1 - hexX0;
		let  dy = hexY1 - hexY0;
		
		let  xSign = (dx > 0)?1:((dx == 0)?0:-1);
		let  ySign = (dy > 0)?1:((dy == 0)?0:-1);
		
		let  range = -1;
		
		if (xSign != ySign) {
			range = Math.max(Math.abs(dx),Math.abs(dy));
		} else {
			range = Math.abs(dx) + Math.abs(dy);
		}
		
		return range;
	}

	//returns the coord of the upper left corner of square that
	//would enclose the hexagon
	hexToPoint(col, row) {
		let  x = 0;
		let  y = 0;
		if (col % 2 == 0) {
			x = col * this.HEX_WIDTH;
			y = this.DY; // - 1;
			y += row * this.HEX_HEIGHT;
		} else {
			x = col * this.HEX_WIDTH;
			y = row * this.HEX_HEIGHT;
		}
		
		let  returnValue = {};
		returnValue.x = x + this.LEFT_MARGIN + this.INTERNAL_LEFT_MARGIN;
		returnValue.y = y + this.TOP_MARGIN + this.INTERNAL_TOP_MARGIN;
		
		return returnValue;
	}
	
	initialize(mapData) {
	    this.hexGrid = new Array();
	    this.TOP_MARGIN = mapData.boardProperties.topMargin;
	    this.LEFT_MARGIN = mapData.boardProperties.leftMargin;
	    this.HEX_HEIGHT = mapData.boardProperties.hexHeight;
	    this.HEX_WIDTH = mapData.boardProperties.hexWidth;
	    this.DX = mapData.boardProperties.dx;
	    this.DY = mapData.boardProperties.dy;
	    this.HEX_SIDE = mapData.boardProperties.hexSide;

		this.boards = mapData.boards;
		this.columns = mapData.columns;
		this.rows = mapData.rows;
		let  hexTypes = mapData.hexTypes;
		let  elevations = mapData.elevations;

		let  trails = mapData.trails;
		let  roads = mapData.roads;
		let  pikes = mapData.pikes;
		let  railroads = mapData.railroads;
		let  streams = mapData.streams;
		let  creeks = mapData.creeks;
		let  embankments = mapData.embankments;
		let  walls = mapData.walls;
		let  railroadCuts = mapData.railroadCuts;

		for(let i = 0; i < this.columns; ++i) {
			this.hexGrid[i] = new Array();
			for(let j = 0; j < this.rows; ++j) {
				let  type = hexTypes[j].charAt(i);
				let  hexType = wego.HexType.getType(type);
				let  elevation = elevations[j].charAt(i);

				let  hex = new Hex(i,j);
				hex.hexType = hexType;
				hex.elevation = elevation;

				this.updateHexSides(hex, trails, i, j, wego.HexSideType.TRAIL);
				this.updateHexSides(hex, roads, i, j, wego.HexSideType.ROAD);
				this.updateHexSides(hex, pikes, i, j, wego.HexSideType.PIKE);
				this.updateHexSides(hex, railroads, i, j, wego.HexSideType.RAILROAD);
				this.updateHexSides(hex, streams, i, j, wego.HexSideType.STREAM);												
				this.updateHexSides(hex, creeks, i, j, wego.HexSideType.CREEK);
				this.updateHexSides(hex, embankments, i, j, wego.HexSideType.EMBANKMENT);
				this.updateHexSides(hex, walls, i, j, wego.HexSideType.WALL);
				this.updateHexSides(hex, railroadCuts, i, j, wego.HexSideType.RAIDROAD_CUT);

				this.hexGrid[i][j] = hex;
			}
		}
	}

	updateHexSides(hex, values, column, row, type) {
		if (values != null) {
			let  mask = values[row].charCodeAt(column) - 32;
			hex.setHexSideType(type, mask);
		}
	}
	
	pointToHex(x, y) {
		//console.log(`original x,y: ${x},${y}`);

		y -= this.INTERNAL_TOP_MARGIN;
		x -= this.INTERNAL_LEFT_MARGIN;
		
		//console.log(`hex_width: ${this.HEX_WIDTH}`);
		//console.log(`internal_top_margin: ${this.INTERNAL_TOP_MARGIN}`);
		//console.log(`internal_left_margin: ${this.INTERNAL_LEFT_MARGIN}`);
		//console.log(`dx: ${this.DX}`);
		//console.log(`dy: ${this.DY}`);
		//console.log(`hex_height: ${this.HEX_HEIGHT}`);
		//console.log(`x,y adjusted for internal margins: ${x},${y}`);

		let  col = Math.floor(x/this.HEX_WIDTH);
		let  row = -1;
			
		//console.log(`column: ${col}`);

		if (col % 2 == 0) {
			//console.log("even column");
			y = y - this.DY;
			//console.log(`y adjusted for DY: ${x},${y}`);

			row = Math.floor(y/this.HEX_HEIGHT);
			//console.log(`row: ${row}`);

			let  modX = x % this.HEX_WIDTH;
			//console.log(`modX: ${modX}`);

			if (modX < this.DX) {
				let  modY = y % this.HEX_HEIGHT;
				let  cross = this.turns(this.DX,0,0,this.DY,modX,modY);
				if (cross == this.LEFT) {
					//console.log("up to the left");
					--col;
				} else if (cross == this.RIGHT) {
					cross = this.turns(0,this.DY,this.DX,this.HEX_HEIGHT,modX,modY);
					if (cross == this.LEFT) {
						//console.log("down to the left");
						--col;
						++row;
					}
				}
			}
		} else {
			//console.log("odd column");
			row = Math.floor(y/this.HEX_HEIGHT);
			let  modX = x % this.HEX_WIDTH;
			if (modX < this.DX) {
				let  modY = y % this.HEX_HEIGHT;
				let  cross = this.turns(this.DX,0,0,this.DY,modX,modY);
				if (cross == this.LEFT) {
					//console.log("up to the left");
					--row;
					--col;
				} else if (cross == this.RIGHT) {
					cross = this.turns(0,this.DY,this.DX,this.HEX_HEIGHT,modX,modY);
					if (cross == this.LEFT) {
						//console.log("down to the left");
						--col;
					}
				}
			}
		}
		
		let  returnValue = {};
		returnValue.row = row;
		returnValue.col = col;
		
		return returnValue;
	}

	turns(x0, y0, x1, y1, x2, y2) {
		let  returnValue;
		let  cross = (x1-x0)*(y2-y0) - (x2-x0)*(y1-y0);
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

export default {};
export {Map};