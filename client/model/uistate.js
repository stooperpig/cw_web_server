var wego = wego || {};

wego.UiState = (function() {
	var currentHex = null;
	var mTargetHex =  null;
	var mCommandMode = wego.CommandMode.NONE;
	var mGameMode = wego.GameMode.PLAN; 
	var selectedCounters = new Array();
	var game = null;
	var time = 0;
	
	function clearStatusMessage() {
		amplify.publish(wego.Topic.STATUS_MESSAGE,null);
	}
	
	function getGameMode() {
		return mGameMode;
	}
	
	function getCommandMode() {
		return mCommandMode;
	}
	
	function getCurrentHex() {
		return currentHex;
	}
	
	function getSelectedCounters() {
		return selectedCounters;
	}
	
	function getTargetHex() {
		return targetHex;
	}
	
	function setCommandMode(mode) {
		mCommandMode = mode;
	}
	
	function setCurrentHex(hex, counters, newTime) {
		if (currentHex != null) {
			currentHex.selected = false;
		}
				
		currentHex = hex;
		
		if (currentHex != null) {
			currentHex.selected = true;
		}

		if (newTime != null) {
			time = newTime;
		}

		selectedCounters = counters;
		amplify.publish(wego.Topic.CURRENT_HEX,{hex:currentHex, selectedCounters:counters});
	}
	
	function setGameMode(value) {
		mGameMode = value;
		amplify.publish(wego.Topic.GAME_MODE,{mGameMode});
	}
	
	function setStatusMessage(message) {
		amplify.publish(wego.Topic.STATUS_MESSAGE,message);
	}

	function setSelectedCounters(value) {
		selectedCounters = value;
		amplify.publish(wego.Topic.SELECTED_COUNTERS,{hex:currentHex, selectedCounters:selectedCounters});
	}
	
	function setTargetHex(hex) {
		targetHex = hex;
	}

	function setGame(value) {
		game = value;
	}

	function getGame() {
		return game;
	}

	function getTime() {
		return time;
	}

	function setTime(value) {
		time = value;
		amplify.publish(wego.Topic.TIME,null);
	}

	return {
		clearStatusMessage : clearStatusMessage,
		getCommandMode : getCommandMode,
		getCurrentHex : getCurrentHex,
		getGameMode : getGameMode,
		getSelectedCounters: getSelectedCounters,
		getTargetHex : getTargetHex,
		getTime : getTime,
		setCommandMode : setCommandMode,
		setCurrentHex : setCurrentHex,
		setGameMode : setGameMode,
		setSelectedCounters : setSelectedCounters,
		setStatusMessage : setStatusMessage,
		setTargetHex : setTargetHex,
		setTime : setTime,
		setGame : setGame,
		getGame : getGame
	}
})();