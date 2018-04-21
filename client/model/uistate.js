var wego = wego || {};

wego.UiState = (function() {
	var currentHex = null;
	var mTargetHex =  null;
	var mCommandMode = wego.CommandMode.NONE;
	var gameMode = wego.GameMode.PLAN; 
	var selectedCounters = new Array();
	var game = null;
	var scenario = null;
	var map = null;
	var parametricData = null;
	var time = 0;
	var lastPlanTime = 0;
	var lastReplayTime = 0;
	
	function clearStatusMessage() {
		amplify.publish(wego.Topic.STATUS_MESSAGE,null);
	}
	
	function getGameMode() {
		return gameMode;
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
		if (gameMode == wego.GameMode.PLAN) {
			lastPlanTime = time;
		} else {
			lastReplayTime = time;
		}

		gameMode = value;
		
		if (value == wego.GameMode.PLAN) {
			time = lastPlanTime;
		} else {
			time = lastReplayTime;
		}

		amplify.publish(wego.Topic.GAME_MODE,{gameMode});
		setTime(time);
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

	function setScenario(value) {
		scenario = value;
	}

	function getScenario() {
		return scenario;
	}

	function setMap(value) {
		map = value;
	}

	function getMap() {
		return map;
	}

	function setParametricData(value) {
		parametricData = value;
	}

	function getParametricData() {
		return parametricData;
	}

	function getTime() {
		return time;
	}

	function setTime(value) {
		time = value;
		var areThereMoreTasks = updateCounters();
		amplify.publish(wego.Topic.TIME,areThereMoreTasks);
		amplify.publish(wego.Topic.CURRENT_HEX,{hex:currentHex, selectedCounters:[]});
	}

	function updateCounters() {
		var areThereMoreTasks = false;

		if (gameMode == wego.GameMode.PLAN) {
			var currentPlayer = game.currentPlayer;
			var counters = currentPlayer.counters;
			for(var i = 0; i < counters.length; ++i) {
				areThereMoreTasks |= counters[i].updateCurrentTask(gameMode,time);
			}
		} else {
			var teams = game.teams;
			for(var i = 0; i < teams.length; ++i) {
				var players = teams[i].players;
				for(var j = 0; j < players.length; ++j) {
					var counters = players[j].counters;
					for(var k = 0; k < counters.length; ++k) {
						areThereMoreTasks |= counters[k].updateCurrentTask(gameMode, time);
					}
				}
			}
		}

		return areThereMoreTasks;
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
		getGame : getGame,
		setScenario : setScenario,
		getScenario : getScenario,
		setMap : setMap,
		getMap : getMap,
		setParametricData : setParametricData,
		getParametricData : getParametricData
	}
})();