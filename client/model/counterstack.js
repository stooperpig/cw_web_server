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
		var adjX = x; // + 19 - 16; // (map.DX + (map.HEX_SIDE/2)) - (COUNTER_WIDTH/2)
		var adjY = y; // + 15 - 16; // (map.DY) - (COUNTER_WIDTH/2)

		if (this.mCounters.length > 0) {
		    var counterCount = 0;
		    var firstCounter = null;
		    var side = this.mCounters[0].getPlayer().getTeam().getId();

		    for(var i = 0; i < this.mCounters.length; ++i) {
		        var counter = this.mCounters[i];
		        if (counter.type != "L") {
		            ++counterCount;
		            if (firstCounter == null) {
		                firstCounter = counter;
		            }
		        }
		    }

            if (counterCount > 0) {
		        var imageIndex = wego.SpriteUtil.getStackSpriteIndex(side, counterCount);
                wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, adjX, adjY);

                var type = (firstCounter.moraleStatus == 2) ? "R" : firstCounter.type;

                imageIndex = wego.SpriteUtil.getMilSymbolSpriteIndex(type, firstCounter.formation, firstCounter.facing);
                wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex,  adjX - counterCount + 1, adjY - counterCount + 1);
		    } else {
                var imageIndex = wego.SpriteUtil.getStackSpriteIndex(side, 1);
                wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, adjX, adjY);
                imageIndex = wego.SpriteUtil.getMilSymbolSpriteIndex(firstCounter.type, 0, 0);
                wego.SpriteUtil.drawSprite(context, "Icons2d", 99,  adjX, adjY);
		    }
		}
	},
	
	getCounters:function() {
		return this.mCounters;
	}
	//      context.beginPath();
    //      context.arc(adjX, adjY, 1, 0, 2 * Math.PI, false);
    //      context.fillStyle = 'green';
    //      context.fill();
    //      context.lineWidth = 1;
    //      context.strokeStyle = '#003300';
    //      context.stroke();
}