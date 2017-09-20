var wego = wego || {};

wego.ClockController = (function() {
	var timer = null;
	
	function clockUpdate() {
		var time = wego.Clock.getTime();
		updateCounters(time);
		var selectedCounters = wego.UiState.getSelectedCounters();
		setCurrentHex(getCurrentHex(),selectedCounters);
	}
	
	function getCurrentHex() {
		return wego.UiState.getCurrentHex();
	}
	
	function initialize() {
		wego.Clock.setTime(0);
		
		$("#seekFirstButton" ).button({icons: {primary: "ui-icon-seek-first"},text: false}).click(seekFirst);
		$("#seekPrevButton" ).button({icons: {primary: "ui-icon-seek-prev"},text: false}).click(seekPrev);
		$("#playButton" ).button({icons: {primary: "ui-icon-play"},text: false}).click(play);
		$("#seekNextButton" ).button({icons: {primary: "ui-icon-seek-next"},text: false}).click(seekNext);
		$("#seekEndButton" ).button({icons: {primary: "ui-icon-seek-end"},text: false}).click(seekEnd);
		$("#linkButton" ).button({icons: {primary: "ui-icon-link"},text: false});
		
		amplify.subscribe(wego.Topic.GAME_MODE,function() {
			wego.Clock.setTime(0);
			clockUpdate();
		});
	}
	
	function play() {
		timer = window.setInterval(handleTimer,1000);
	}
	
	function handleTimer() {
		var time = wego.Clock.getTime();
		var maxTime = wego.Clock.getMaxTime();
		if (time < maxTime) {
			seekNext();
		} else {
			window.clearInterval(timer);
			timer = null;
		}
	}
	
	function seekEnd() {
		wego.Clock.seekEnd();
		clockUpdate();
	}
	
	function seekFirst() {
		wego.Clock.seekFirst();
		clockUpdate();
	}
	
	function seekNext() {
		wego.Clock.increment();
		clockUpdate();
	}
	
	function seekPrev() {
		wego.Clock.decrement();
		clockUpdate();
	}
	
	function setCurrentHex(hex,counters) {
		wego.UiState.setCurrentHex(hex,counters);
		wego.MainController.drawMap();
	} 
	
	function updateCounters(time) {
		var areThereMoreTasks = false;
		
		var gameMode = wego.UiState.getGameMode();
		
		//fixme: need to get all counters in REPLAY mode; not just current player
		var currentPlayer = wego.Game.getCurrentPlayer();
		
		var counters = currentPlayer.getCounters();
		for(var i = 0; i < counters.length; ++i) {
			areThereMoreTasks |= counters[i].update(time, gameMode);
		}
		
		if (!areThereMoreTasks && timer != null) {
			window.clearInterval(timer);
			timer = null;
		}
	}
	
	return {
		initialize : initialize
	}
})();