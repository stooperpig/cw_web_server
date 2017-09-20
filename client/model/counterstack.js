var wego = wego || {};

wego.CounterStack = function() {
	this.mCounters = new Array();
	this.COUNTER_WIDTH = 20;
	this.COUNTER_OFFSET = this.COUNTER_WIDTH / 2;
}

wego.CounterStack.prototype = {
	addCounter:function(counter) {
		this.mCounters.push(counter);
	},
	
	removeCounter:function(counter) {
		var index = this.mCounters.indexOf(counter);
		if (index > -1) {
			this.mCounters.splice(index,1);
		}
	},
	
	isEmpty:function() {
		return this.mCounters.length == 0;
	},
	
	draw:function(context, x, y) {
		var adjX = x + 19 - 16; // (map.DX + (map.HEX_SIDE/2)) - (COUNTER_WIDTH/2)
		var adjY = y + 15 - 16; // (map.DY) - (COUNTER_WIDTH/2)
		console.log("counter count: " + this.mCounters.length);
		for(var i = 0; i < this.mCounters.length; ++i) {
			var counter = this.mCounters[i];
			var image = counter.getImage();
			if (image == null) {
               this.drawSprite(context, 50, adjX, adjY);
               this.drawSprite(context, 99,  adjX - 3, adjY - 3);
			} else {
			    context.drawImage(image, adjX, adjY);
			}
			adjX += 6;
			adjY += 6;
		}
	},
	
	getCounters:function() {
		return this.mCounters;
	},

	drawSprite:function(context, spriteNumber, x, y) {
        var spriteSheet = wego.ImageCache["Icons2d"].image;
        var spritesPerRow = 12;
        var spritesRows = 20;

        var spriteRow = Math.floor(spriteNumber / spritesPerRow);
        var spriteColumn = spriteNumber % spritesPerRow;

        var spriteX = (spriteColumn * 32);
        var spriteY = (32 * spriteRow);
        var width = 32;
        var height = 32;
        context.drawImage(spriteSheet, spriteX, spriteY, width, height, x, y, width, height);
	}

	//      context.beginPath();
    //      context.arc(adjX, adjY, 1, 0, 2 * Math.PI, false);
    //      context.fillStyle = 'green';
    //      context.fill();
    //      context.lineWidth = 1;
    //      context.strokeStyle = '#003300';
    //      context.stroke();
}