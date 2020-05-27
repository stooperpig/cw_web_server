import {Game} from './model/game.js';
import {Map} from './model/map.js';
import {Scenario} from './model/scenario.js';
import {GameApi} from './util/api.js';
import {Los} from './model/los.js';
import {ParametricData} from './model/parametricdata.js';
import {ImageCache} from './model/imagecache.js';

class Application {
	constructor(state) {
		this.state = state;
		let application = this;

		console.log("maincontroller:initialize " + gGameId);
		$("#dialog").dialog({autoOpen:false});
		$(window).resize(this.adjustSize);
		this.adjustSize();
		let game = new Game();
		game.id = gGameId;
		this.state.setGame(game);

		let scenario = new Scenario();
		this.state.setScenario(scenario);

		let map = new Map();
		this.state.setMap(map);

		let parametricData = new ParametricData();
		this.state.setParametricData(parametricData);

		GameApi.retrieveGame(gGameId, gPlayerId, function(data) {application.loadData(data);});
	}

	adjustSize() { 
		/*
		let windowHeight = $(window).height(); 
		let headerHeight = $('#header').height(); 
		let footerHeight = $('#footer').height();
		let centerHeight = windowHeight - headerHeight - footerHeight -35; 
		$("#center").height(centerHeight);
		
		let taskHeight = $("#sidebarTabs").height();
		let stackHeight = centerHeight - taskHeight - 10;
		if (stackHeight < 200) {
			stackHeight = 200;
		}
		
		$("#stackDiv").height(stackHeight); */
	}
	
	getCurrentHex() {
		return this.state.getCurrentHex();
	}
		
	initializeMapCanvas(images) {
		let mapCanvas = $("#mainMapCanvas");
		let context = mapCanvas[0].getContext('2d');

		let map = this.state.getMap();
		context.canvas.height = map.getPixelHeight();
		context.canvas.width = map.getPixelWidth();
		
		console.log("mapPixel height: " + map.getPixelHeight());
		console.log("mapPixel width: " + map.getPixelWidth());
		console.log("context width: " + context.canvas.width);
		console.log("context height: " + context.canvas.height);
		this.state.setCurrentHex(null);

		//let r = confirm("View Replay");
        //if (r == true) {
        //  	state.setGameMode(wego.GameMode.REPLAY);
        //}
	}
	
	loadData(data) {
		console.log(data);
		let application = this;

		let scenario = this.state.getScenario();
		scenario.initialize(data.scenario);
		let images = scenario.getImageNames(); //data.scenario.images;
		for(let name in images) {
			ImageCache[name] = {src:images[name]};
		}

		let map = this.state.getMap();
		map.initialize(data.map);
		images = map.getImageNames();
		for(let name in images) {
			ImageCache[name] = {src:images[name]};
		}

		let game = this.state.getGame();
		game.initialize(data.game, map);

		let parametricData = this.state.getParametricData();
		parametricData.initialize(data.parametricData);

        window.document.title = "Civil War: " + scenario.title;
        $("#footerTurnDiv").html("Turn " + (game.currentTurn + 1) + " (visibility: " + game.currentVisibility + " hexes)");

		this.loadImages(ImageCache, function(data) {application.initializeMapCanvas(data);});

		let oReq = new XMLHttpRequest();
		oReq.open("GET","/civilwar/server/data/maps/wc.los");
		oReq.responseType = "arraybuffer";
		oReq.onload = function(event) {
			let arrayBuffer = oReq.response; // Note: not oReq.responseText

			if (arrayBuffer) {
				let los = new Los(map.columns, map.rows, arrayBuffer);
				application.state.setLos(los);
			}
		};
		
		oReq.send(null);
	}
	
	loadImages(images, callback) {
		let loadedImages = 0;
		let numImages = 0;

		for(let imageName in images) {
			numImages++;
		}
		for(let imageName in images) {
			let src = images[imageName].src;
			let image = new Image();
			image.onload = function() {
				if(++loadedImages >= numImages) {
					callback(images);
				}
			};
			image.src = src;
			images[imageName].image = image;
		}

		let game = this.state.getGame();
		if (game.showReplay) {
			wego.StatusReportComponent.showReport();
		}
	}
	
	// updateCounterList(list,hex,selectedCounters,player) {
	// 	let counterList = $(list);
	// 	counterList.html("");
	// 	if (hex != null){
	// 		let stack = hex.getStack();
	// 		if (stack != null && !stack.isEmpty()) {
	// 			let counters = stack.counters;
	// 			for(let i = 0; i < counters.length; ++i) {
	// 				let counter = counters[i];
	// 				let selected = false;
	// 				if (selectedCounters != null) {
	// 					console.log("updateStack..selecting " + selectedCounters.length);
	// 					for(let j = 0; j < selectedCounters.length; ++j) {
	// 						if (counter.getId() == selectedCounters[j].getId()) {
	// 							selected = true;
	// 							break;
	// 						}
	// 					}
	// 				}
					
	// 				let html = '<li class="ui-widget-content';
	// 				if (selected) {
	// 					html += " ui-selected";
	// 				}
					

	// 					let disabled = false;
	// 					if (player != null) {
	// 						let owner = counter.getPlayer();
	// 						if (player != owner) {
	// 							disabled = true;
	// 						}
	// 					}
						
	// 					if (disabled) {
	// 						html += " ui-state-disabled";
	// 					} else {
	// 						html += " ui-state-enabled";
	// 					}
						
	// 					html += '" data-counter-id="' + counter.getId() + '">';
	// 					let counterName = counter.toString();
	// 					//let imageSrc = counter.getImageSrc();
	// 					let imageSrc = "monkeyBalls";
	// 					html += '<img src="' + imageSrc + '">'; 
	// 					let movementFactor = counter.getMovementFactor();
	// 					let remainingMovementFactor = counter.getRemainingMovementFactor();
	// 					html += ' MF: ' + movementFactor + '/' + remainingMovementFactor;
	// 				html += "</li>";
	// 				counterList.append(html);
	// 			}
	// 		}
	// 	}
	// }
	
	setCurrentHex(hex,counters) {
		this.state.setCurrentHex(hex,counters);
	} 
}

export default {};
export {Application};