var wego = wego || {};

wego.MainController = (function() {
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
	
	function drawMap() {
		var canvas = document.getElementById('mainMapCanvas');
		var context = canvas.getContext('2d');
		context.clearRect(0,0,canvas.width,canvas.height);
		
		wego.Map.draw(context);
		adjustSize();
	}
	
	function getCurrentHex() {
		return wego.UiState.getCurrentHex();
	}
	
	function initialize() {	
		console.log("maincontroller:initialize " + gGameId);
		$(window).resize(adjustSize);
		
		adjustSize();
		wego.Game.setId(gGameId);
		wego.GameApi.retrieveGame(gGameId, gPlayerId, loadData);
	}
	
	function initializeMap(images) {
		var mapCanvas = $("#mainMapCanvas");
		var context = mapCanvas[0].getContext('2d');
		context.canvas.height = wego.Map.getPixelHeight();
		context.canvas.width = wego.Map.getPixelWidth();
		
		console.log("mapPixel height: " + wego.Map.getPixelHeight());
		console.log("mapPixel width: " + wego.Map.getPixelWidth());
		console.log("context width: " + context.canvas.width);
		console.log("context height: " + context.canvas.height);
		drawMap();

		//var r = confirm("View Replay");
        //if (r == true) {
        //  	wego.UiState.setGameMode(wego.GameMode.REPLAY);
        //}
	}
	
	function loadData(data) {
		console.log(data);
		wego.Scenario.initialize(data.scenario);
		
		var images = wego.Scenario.getImages(); //data.scenario.images;
		for(var name in images) {
			wego.ImageCache[name] = {src:images[name]};
		}

		wego.Game.initialize(data.game);

        window.document.title = "Civil War: " + wego.Scenario.getName();
        $("#footerTurnDiv").html("Turn " + wego.Game.getTurn());

		loadImages(wego.ImageCache, initializeMap);


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
	}
	
	function updateCounterList(list,hex,selectedCounters,player) {
		var counterList = $(list);
		counterList.html("");
		if (hex != null){
			var stack = hex.getStack();
			if (stack != null && !stack.isEmpty()) {
				var counters = stack.getCounters();
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
		drawMap();
	} 
	
	return {
		drawMap: drawMap,
		initialize: initialize,
		updateCounterList: updateCounterList
	}
})();