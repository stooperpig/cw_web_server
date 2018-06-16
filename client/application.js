var wego = wego || {};

wego.Application = (function() {
	let state = null;

	function adjustSize() { 
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
		
		$("#stackDiv").height(stackHeight);
	}
	

	
	function getCurrentHex() {
		return state.getCurrentHex();
	}
	
	function initialize(uiState) {	
		state = uiState;

		console.log("maincontroller:initialize " + gGameId);
		$("#dialog").dialog({autoOpen:false});
		$(window).resize(adjustSize);
		adjustSize();
		let game = new wego.Game();
		game.id = gGameId;
		state.setGame(game);

		let scenario = new wego.Scenario();
		state.setScenario(scenario);

		let map = new wego.Map();
		state.setMap(map);

		let parametricData = new wego.ParametricData();
		state.setParametricData(parametricData);

		wego.GameApi.retrieveGame(gGameId, gPlayerId, loadData);
	}
	
	function initializeMapCanvas(images) {
		let mapCanvas = $("#mainMapCanvas");
		let context = mapCanvas[0].getContext('2d');

		let map = state.getMap();
		context.canvas.height = map.getPixelHeight();
		context.canvas.width = map.getPixelWidth();
		
		console.log("mapPixel height: " + map.getPixelHeight());
		console.log("mapPixel width: " + map.getPixelWidth());
		console.log("context width: " + context.canvas.width);
		console.log("context height: " + context.canvas.height);
		state.setCurrentHex(null);

		//let r = confirm("View Replay");
        //if (r == true) {
        //  	state.setGameMode(wego.GameMode.REPLAY);
        //}
	}
	
	function loadData(data) {
		console.log(data);
		let scenario = state.getScenario();
		scenario.initialize(data.scenario);
		let images = scenario.getImageNames(); //data.scenario.images;
		for(let name in images) {
			wego.ImageCache[name] = {src:images[name]};
		}

		let map = state.getMap();
		map.initialize(data.map);
		images = map.getImageNames();
		for(let name in images) {
			wego.ImageCache[name] = {src:images[name]};
		}

		let game = state.getGame();
		game.initialize(data.game, map);

		let parametricData = state.getParametricData();
		parametricData.initialize(data.parametricData);

        window.document.title = "Civil War: " + scenario.title;
        $("#footerTurnDiv").html("Turn " + (game.turn + 1));

		loadImages(wego.ImageCache, initializeMapCanvas);

		let oReq = new XMLHttpRequest();
		oReq.open("GET","/civilwar/server/data/maps/wc.los");
		oReq.responseType = "arraybuffer";
		oReq.onload = function(event) {
			let arrayBuffer = oReq.response; // Note: not oReq.responseText

			if (arrayBuffer) {
				let los = new wego.Los(map.columns, map.rows, arrayBuffer);
				state.setLos(los);
			}
		};
		
		oReq.send(null);
	}
	
	function loadImages(images, callback) {
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

		let game = state.getGame();
		if (game.showReplay) {
			wego.StatusReportComponent.showReport();
		}
	}
	
	function updateCounterList(list,hex,selectedCounters,player) {
		let counterList = $(list);
		counterList.html("");
		if (hex != null){
			let stack = hex.getStack();
			if (stack != null && !stack.isEmpty()) {
				let counters = stack.counters;
				for(let i = 0; i < counters.length; ++i) {
					let counter = counters[i];
					let selected = false;
					if (selectedCounters != null) {
						console.log("updateStack..selecting " + selectedCounters.length);
						for(let j = 0; j < selectedCounters.length; ++j) {
							if (counter.getId() == selectedCounters[j].getId()) {
								selected = true;
								break;
							}
						}
					}
					
					let html = '<li class="ui-widget-content';
					if (selected) {
						html += " ui-selected";
					}
					

						let disabled = false;
						if (player != null) {
							let owner = counter.getPlayer();
							if (player != owner) {
								disabled = true;
							}
						}
						
						if (disabled) {
							html += " ui-state-disabled";
						} else {
							html += " ui-state-enabled";
						}
						
						html += '" data-counter-id="' + counter.getId() + '">';
						let counterName = counter.toString();
						//let imageSrc = counter.getImageSrc();
						let imageSrc = "monkeyBalls";
						html += '<img src="' + imageSrc + '">'; 
						let movementFactor = counter.getMovementFactor();
						let remainingMovementFactor = counter.getRemainingMovementFactor();
						html += ' MF: ' + movementFactor + '/' + remainingMovementFactor;
					html += "</li>";
					counterList.append(html);
				}
			}
		}
	}
	
	function setCurrentHex(hex,counters) {
		state.setCurrentHex(hex,counters);
	} 
	
	return {
		initialize: initialize,
		updateCounterList: updateCounterList
	}
})();