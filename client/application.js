var wego = wego || {};

wego.Application = (function() {
	function adjustSize() { 
		var windowHeight = $(window).height(); 
		var headerHeight = $('#header').height(); 
		var footerHeight = $('#footer').height();
		var centerHeight = windowHeight - headerHeight - footerHeight -35; 
		$("#center").height(centerHeight);
		
		var taskHeight = $("#sidebarTabs").height();
		var stackHeight = centerHeight - taskHeight - 10;
		if (stackHeight < 200) {
			stackHeight = 200;
		}
		
		$("#stackDiv").height(stackHeight);
	}
	

	
	function getCurrentHex() {
		return wego.UiState.getCurrentHex();
	}
	
	function initialize() {	
		console.log("maincontroller:initialize " + gGameId);
		$("#dialog").dialog({autoOpen:false});
		$(window).resize(adjustSize);
		adjustSize();
		var game = new wego.Game();
		game.id = gGameId;
		wego.UiState.setGame(game);

		var scenario = new wego.Scenario();
		wego.UiState.setScenario(scenario);

		var map = new wego.Map();
		wego.UiState.setMap(map);

		var parametricData = new wego.ParametricData();
		wego.UiState.setParametricData(parametricData);

		wego.GameApi.retrieveGame(gGameId, gPlayerId, loadData);
	}
	
	function initializeMapCanvas(images) {
		var mapCanvas = $("#mainMapCanvas");
		var context = mapCanvas[0].getContext('2d');

		var map = wego.UiState.getMap();
		context.canvas.height = map.getPixelHeight();
		context.canvas.width = map.getPixelWidth();
		
		console.log("mapPixel height: " + map.getPixelHeight());
		console.log("mapPixel width: " + map.getPixelWidth());
		console.log("context width: " + context.canvas.width);
		console.log("context height: " + context.canvas.height);
		wego.UiState.setCurrentHex(null);

		//var r = confirm("View Replay");
        //if (r == true) {
        //  	wego.UiState.setGameMode(wego.GameMode.REPLAY);
        //}
	}
	
	function loadData(data) {
		console.log(data);
		var scenario = wego.UiState.getScenario();
		scenario.initialize(data.scenario);
		var images = scenario.getImageNames(); //data.scenario.images;
		for(var name in images) {
			wego.ImageCache[name] = {src:images[name]};
		}

		var map = wego.UiState.getMap();
		map.initialize(data.map);
		images = map.getImageNames();
		for(var name in images) {
			wego.ImageCache[name] = {src:images[name]};
		}

		var game = wego.UiState.getGame();
		game.initialize(data.game, map);

		var parametricData = wego.UiState.getParametricData();
		parametricData.initialize(data.parametricData);

        window.document.title = "Civil War: " + scenario.title;
        $("#footerTurnDiv").html("Turn " + (game.turn + 1));

		loadImages(wego.ImageCache, initializeMapCanvas);

		var oReq = new XMLHttpRequest();
		oReq.open("GET","/civilwar/server/data/maps/wc.los");
		oReq.responseType = "arraybuffer";
		oReq.onload = function(event) {
			var arrayBuffer = oReq.response; // Note: not oReq.responseText

			if (arrayBuffer) {
				var los = new wego.Los(map.columns, map.rows, arrayBuffer);
				wego.UiState.setLos(los);
			}
		};
		
		oReq.send(null);
	}
	
	function loadImages(images, callback) {
		var loadedImages = 0;
		var numImages = 0;

		for(var imageName in images) {
			numImages++;
		}
		for(var imageName in images) {
			var src = images[imageName].src;
			var image = new Image();
			image.onload = function() {
				if(++loadedImages >= numImages) {
					callback(images);
				}
			};
			image.src = src;
			images[imageName].image = image;
		}

		var game = wego.UiState.getGame();
		if (game.showReplay) {
			wego.StatusReportComponent.showReport();
		}
	}
	
	function updateCounterList(list,hex,selectedCounters,player) {
		var counterList = $(list);
		counterList.html("");
		if (hex != null){
			var stack = hex.getStack();
			if (stack != null && !stack.isEmpty()) {
				var counters = stack.counters;
				for(var i = 0; i < counters.length; ++i) {
					var counter = counters[i];
					var selected = false;
					if (selectedCounters != null) {
						console.log("updateStack..selecting " + selectedCounters.length);
						for(var j = 0; j < selectedCounters.length; ++j) {
							if (counter.getId() == selectedCounters[j].getId()) {
								selected = true;
								break;
							}
						}
					}
					
					var html = '<li class="ui-widget-content';
					if (selected) {
						html += " ui-selected";
					}
					

						var disabled = false;
						if (player != null) {
							var owner = counter.getPlayer();
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
						var counterName = counter.toString();
						//var imageSrc = counter.getImageSrc();
						var imageSrc = "monkeyBalls";
						html += '<img src="' + imageSrc + '">'; 
						var movementFactor = counter.getMovementFactor();
						var remainingMovementFactor = counter.getRemainingMovementFactor();
						html += ' MF: ' + movementFactor + '/' + remainingMovementFactor;
					html += "</li>";
					counterList.append(html);
				}
			}
		}
	}
	
	function setCurrentHex(hex,counters) {
		wego.UiState.setCurrentHex(hex,counters);
	} 
	
	return {
		initialize: initialize,
		updateCounterList: updateCounterList
	}
})();