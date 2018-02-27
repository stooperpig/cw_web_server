var wego = wego || {};

wego.MapView = function(component) {
	this.parentComponent = component;
	this.state = null;
}

wego.MapView.prototype = {
	initialize:function(state) {
		this.state = state;
		var view = this;
		amplify.subscribe(wego.Topic.CURRENT_HEX, function(data) {
			view.drawMap();
        });
	},
	
	drawMap:function() {
		var canvas = document.getElementById('mainMapCanvas');
		var context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width,canvas.height);
        
        var map = wego.Map;
        //map.draw(context);
        
        var images = map.getImages();
		
		console.log(images[0].naturalHeight);
		
		context.drawImage(images[0], map.LEFT_MARGIN, map.TOP_MARGIN);
		for(var i = 1; i < images.length; ++i) {
			context.drawImage(images[i], map.LEFT_MARGIN, map.TOP_MARGIN + (i * mBoardHeight));
		}
	
        var hexGrid = map.hexGrid;
		for(var i = 0; i < hexGrid.length; ++i) {
			for(var j = 0; j < hexGrid[i].length; ++j ) {
				this.drawHex(context, map, hexGrid[i][j]);
			}
		}
    },
    
    drawHex:function(context, map, hex) {
		var coord = map.hexToPoint(hex.column, hex.row);
		if (hex.selected) {
			var adjX = coord.x + 3; // - 35;
			var adjY = coord.y + 3; // - 30;
			var image = wego.ImageCache["Current Hex"].image;
			context.drawImage(image,adjX,adjY);
		}

		var stack = hex.stack;
		if (stack != null && !stack.isEmpty()) {
			var x = coord.x;
			var y = coord.y;
			this.drawStack(context, stack, x, y);
		}
	},
	
	drawStack:function(context, stack, x, y) {
		var adjX = x + 4; // + 19 - 16; // (map.DX + (map.HEX_SIDE/2)) - (COUNTER_WIDTH/2)
		var adjY = y + 3 // + 15 - 16; // (map.DY) - (COUNTER_WIDTH/2)

		if (stack.counters.length > 0) {
		    var counterCount = 0;
			var firstCounter = null;
			var firstLeader = null;
		    var side = stack.counters[0].player.team.id;

		    for(var i = 0; i < stack.counters.length; ++i) {
		        var counter = stack.counters[i];
		        if (counter.type != "L") {
		            ++counterCount;
		            if (firstCounter == null) {
		                firstCounter = counter;
		            }
		        } else if (firstLeader == null) {
					firstLeader = counter;
				}
		    }

            if (counterCount > 0) {
		        var imageIndex = wego.SpriteUtil.getStackSpriteIndex(side, counterCount);
				wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, adjX, adjY);
				
				var moraleStatus = firstCounter.getMoraleStatus();
                var type = (moraleStatus == 2) ? "R" : firstCounter.type;

                imageIndex = wego.SpriteUtil.getMilSymbolSpriteIndex(type, firstCounter.getFormation(), firstCounter.getFacing());
                wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex,  adjX - counterCount + 1, adjY - counterCount + 1);
		    } else {
                var imageIndex = wego.SpriteUtil.getStackSpriteIndex(side, 1);
                wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, adjX, adjY);
                imageIndex = wego.SpriteUtil.getMilSymbolSpriteIndex(firstLeader.type, 0, 0);
                wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex,  adjX, adjY);
		    }
		}
	}
};