var wego = wego || {};

wego.UiState = (function() {
	let currentHex = null;
	let targetHex =  null;
	let mCommandMode = wego.CommandMode.NONE;
	let gameMode = wego.GameMode.PLAN; 
	let selectedCounters = new Array();
	let game = null;
	let scenario = null;
	let map = null;
	let parametricData = null;
	let time = 0;
	let lastPlanTime = 0;
	let lastReplayTime = 0;
	let displayLos = false;
	let los = null;
	let enableFow = true;
	
	function getDisplayLos() {
		return displayLos;
	}

	function toggleDisplayLos() {
		displayLos = !displayLos;
		amplify.publish(wego.Topic.CURRENT_HEX,{hex:currentHex, selectedCounters:[]});
	}

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
		if (gameMode === wego.GameMode.PLAN) {
			lastPlanTime = time;
		} else {
			lastReplayTime = time;
		}

		gameMode = value;
		
		if (value === wego.GameMode.PLAN) {
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
		let areThereMoreTasks = updateCounters();
		amplify.publish(wego.Topic.TIME,areThereMoreTasks);
		amplify.publish(wego.Topic.CURRENT_HEX,{hex:currentHex, selectedCounters:[]});
	}

	function updateCounters() {
		let areThereMoreTasks = false;

		if (gameMode === wego.GameMode.PLAN) {
			let currentPlayer = game.currentPlayer;
			let counters = currentPlayer.counters;
			for(let i = 0; i < counters.length; ++i) {
				areThereMoreTasks |= counters[i].updateCurrentTask(gameMode,time);
			}
		} else {
			let teams = game.teams;
			for(let i = 0; i < teams.length; ++i) {
				let players = teams[i].players;
				for(let j = 0; j < players.length; ++j) {
					let counters = players[j].counters;
					for(let k = 0; k < counters.length; ++k) {
						areThereMoreTasks |= counters[k].updateCurrentTask(gameMode, time);
					}
				}
			}
		}

		return areThereMoreTasks;
	}

	function getLos() {
		return los;
	}

	function setLos(value) {
		los = value;
	}

	function isFowEnabled() {
		return enableFow;
	}

	function setEnableFow(value) {
		enableFow = value; 
		amplify.publish(wego.Topic.CURRENT_HEX,{hex:currentHex, selectedCounters:[]});
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
		getParametricData : getParametricData,
		getDisplayLos : getDisplayLos,
		toggleDisplayLos : toggleDisplayLos,
		getLos : getLos,
		setLos : setLos,
		isFowEnabled : isFowEnabled,
		setEnableFow : setEnableFow
	}
})();