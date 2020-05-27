import {SpriteUtil} from '../../util/spriteutil.js';
import {ImageCache} from '../../model/imagecache.js';
import {Topic, MoraleType, GameMode, TaskType} from '../../model/enum.js';
import { Task } from '../../model/task.js';

class MapView {
	constructor(component, state) {
		this.component = component;
		this.state = state;
		let view = this;
		amplify.subscribe(Topic.CURRENT_HEX, function(data) {
			view.drawMap();
        });
	}

	drawMap() {
		let canvas = document.getElementById('mainMapCanvas');
		let context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width,canvas.height);
        
        let map = this.state.getMap();
        //map.draw(context);
        
        let images = map.getImages();
		
		console.log(images[0].naturalHeight);
		
		context.drawImage(images[0], map.LEFT_MARGIN, map.TOP_MARGIN);
		for(let i = 1; i < images.length; ++i) {
			context.drawImage(images[i], map.LEFT_MARGIN, map.TOP_MARGIN + (i * mBoardHeight));
		}
	
        let hexGrid = map.hexGrid;
		for(let i = 0; i < hexGrid.length; ++i) {
			for(let j = 0; j < hexGrid[i].length; ++j ) {
				this.drawHex(context, map, hexGrid[i][j]);
			}
		}
    }
    
    drawHex(context, map, hex) {
		let coord = map.hexToPoint(hex.column, hex.row);
		if (hex.selected) {
			let adjX = coord.x + 3; // - 35;
			let adjY = coord.y + 3; // - 30;
			let image = ImageCache["Current Hex"].image;
			context.drawImage(image,adjX,adjY);
		}

		let stack = hex.stack;
		if (stack != null && !stack.isEmpty()) {
			let x = coord.x;
			let y = coord.y;
			this.drawStack(context, map, stack, x, y);
		}

		let state = this.state;
		if (state.getDisplayLos()) {
			let currentHex = state.getCurrentHex();
			if (currentHex != null) {
				let los = state.getLos();
				if(!los.checkLos(currentHex, hex)) {
					SpriteUtil.drawSprite(context, "Icons2d", SpriteUtil.blockedSpriteIndex,  coord.x + 3, coord.y + 3);
				}
			}
		}
	}
	
	drawStack(context, map, stack, x, y) {
		let adjX = x + 4; // + 19 - 16; // (map.DX + (map.HEX_SIDE/2)) - (COUNTER_WIDTH/2)
		let adjY = y + 3; // + 15 - 16; // (map.DY) - (COUNTER_WIDTH/2)

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
			
			let drawArrow = false;
            if (counterCount > 0) {
				let side = firstCounter.player.team.name;
		        let imageIndex = SpriteUtil.getStackSpriteIndex(side, counterCount);
				SpriteUtil.drawSprite(context, "Icons2d", imageIndex, adjX, adjY);
				
				let moraleStatus = firstCounter.getMoraleStatus();
                let type = (moraleStatus == MoraleType.ROUTED) ? "R" : firstCounter.type;

                imageIndex = SpriteUtil.getMilSymbolSpriteIndex(type, firstCounter.getFormation(), firstCounter.getFacing());
				SpriteUtil.drawSprite(context, "Icons2d", imageIndex,  adjX - counterCount + 1, adjY - counterCount + 1);
				drawArrow = true;
		    } else if (firstLeader != null) {
				let side = firstLeader.player.team.name;
                let imageIndex = SpriteUtil.getStackSpriteIndex(side, 1);
                SpriteUtil.drawSprite(context, "Icons2d", imageIndex, adjX, adjY);
                imageIndex = SpriteUtil.getMilSymbolSpriteIndex(firstLeader.type, 0, 0);
				SpriteUtil.drawSprite(context, "Icons2d", imageIndex,  adjX, adjY);
				drawArrow = true;
			}
			
			let mode = this.state.getGameMode();
			let time = this.state.getTime(); 
			if (drawArrow && mode == GameMode.REPLAY && time > 0) {
				let directions = [];
				for(let i = 0; i < stack.counters.length; ++i) {
					let counter = stack.counters[i];
					let displayCounter = true;
	
					if (isFowEnabled) {
						displayCounter = (currentPlayer.team === counter.player.team || counter.getSpotted());
					}
	
					if (displayCounter) {
						let taskData = counter.getTaskDataAtTime(mode, time);
						let currentTask = taskData.task;
						if (currentTask.type == TaskType.MOVE) {
							taskData = counter.getTaskDataAtTime(mode, time - 1);
							let currentHex = currentTask.hex;
							let previousHex = taskData.task.hex;
							if (currentHex !== previousHex) {
								let coord = map.hexToPoint(previousHex.column, previousHex.row);
								let arrowIndex = SpriteUtil.firstArrowIndex + currentTask.direction;
								SpriteUtil.drawSprite(context, "Icons2d", arrowIndex,  coord.x, coord.y);
								//TODO: draw arrow in previous hex if direction has not
								//already been drawn
							}
						}
					}
				}
			}
		}
	}
};

export default {};
export {MapView};