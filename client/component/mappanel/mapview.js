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
        
        var map = this.state.getMap();
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

		var state = this.state;
		if (state.getDisplayLos()) {
			var currentHex = state.getCurrentHex();
			if (currentHex != null) {
				var los = state.getLos();
				if(!los.checkLos(currentHex, hex)) {
					wego.SpriteUtil.drawSprite(context, "Icons2d", wego.SpriteUtil.blockedSpriteIndex,  coord.x + 3, coord.y + 3);
				}
			}
		}
	},
	
	drawStack:function(context, stack, x, y) {
		var adjX = x + 4; // + 19 - 16; // (map.DX + (map.HEX_SIDE/2)) - (COUNTER_WIDTH/2)
		var adjY = y + 3 // + 15 - 16; // (map.DY) - (COUNTER_WIDTH/2)

		if (stack.counters.length > 0) {
			let currentPlayer = this.state.getGame().currentPlayer;
			let isFowEnabled = this.state.isFowEnabled();

		    let counterCount = 0;
			let firstCounter = null;
			let firstLeader = null;

		    for(let i = 0; i < stack.counters.length; ++i) {
				let counter = stack.counters[i];
				let displayCounter = true;

				if (isFowEnabled) {
					displayCounter = (currentPlayer.team === counter.player.team || counter.getSpotted());
				}

				if (displayCounter) {
					if (counter.type != "L") {
						++counterCount;
						if (firstCounter == null) {
							firstCounter = counter;
						}
					} else if (firstLeader == null) {
						firstLeader = counter;
					}
				}
		    }

            if (counterCount > 0) {
				let side = firstCounter.player.team.name;
		        var imageIndex = wego.SpriteUtil.getStackSpriteIndex(side, counterCount);
				wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, adjX, adjY);
				
				var moraleStatus = firstCounter.getMoraleStatus();
                var type = (moraleStatus == wego.MoraleType.ROUTED) ? "R" : firstCounter.type;

                imageIndex = wego.SpriteUtil.getMilSymbolSpriteIndex(type, firstCounter.getFormation(), firstCounter.getFacing());
                wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex,  adjX - counterCount + 1, adjY - counterCount + 1);
		    } else if (firstLeader != null) {
				let side = firstLeader.player.team.name;
                var imageIndex = wego.SpriteUtil.getStackSpriteIndex(side, 1);
                wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex, adjX, adjY);
                imageIndex = wego.SpriteUtil.getMilSymbolSpriteIndex(firstLeader.type, 0, 0);
                wego.SpriteUtil.drawSprite(context, "Icons2d", imageIndex,  adjX, adjY);
		    }
		}
	}
};