var wego = wego || {};

wego.Los = function(columns, rows, data) {
	this.columns = columns;
	this.rows = rows;
	this.bytesPerRow = Math.ceil(rows/8);
	this.bytesPerHex = this.bytesPerRow * this.columns;
	this.bytesPerColumn = this.bytesPerHex * this.rows;
	this.numberOfHexes = this.columns * this.rows;
	this.losFileSize = this.numberOfHexes * this.bytesPerHex;
	this.byteArray = null;

	this.data = data;
	if (data) {
		this.byteArray = new Uint8Array(data);
		for (var i = 0; i < this.byteArray.byteLength; i++) {
		}
		console.log("Init LOS:\nColumns: " + this.columns + " Rows: " + this.rows + "\n");
		console.log("bytesForRow: " + this.bytesPerRow + " bytesPerColumn: " + this.bytesPerColumn + "\n");
		console.log("bytesPerHex: " + this.bytesPerHex + " numberOfHexes: " + this.numberOfHexes + "\n");
		console.log("Projected LOS File Size: " + this.losFileSize + " Actual LOS File Size: " + this.byteArray.byteLength + "\n");
	}
}

wego.Los.prototype = {
	checkLos(fromHex, toHex) {
		let fromX = fromHex.column;
		let fromY = fromHex.row;
		let toX = toHex.column;
		let toY = toHex.row;
		
		let hexNumber = (fromX * this.rows) + fromY;
		let hexIndex = hexNumber * this.bytesPerHex;
		let rowIndex = Math.floor(toY/8.0);
		let losIndex = (toX * this.bytesPerRow) + rowIndex;
		let value = this.byteArray[hexIndex + losIndex];
		let mask = Math.pow(2,toY % 8);
		let visible = value & mask;
		
		if (visible) {
			console.log("checking los from (" + fromX + "," + fromY + ") to (" + toX + "," + toY + ") " +
		    	"toY: " + toY + " toX: " + toX + 
				" hexNumber: " + hexNumber + " hexIndex: " + hexIndex + " rowIndex: " + rowIndex + " losIndex: " + losIndex + " " +
			  	"value: " + (value.toString(2)) + " mask: " + (mask.toString(2)) + " -> " + visible);
		}

		return (visible != 0);
	}
}
