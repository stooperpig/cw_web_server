var wego = wego || {};

wego.UiState = (function() {
	var mCurrentHex = null;
	var mTargetHex =  null;
	var mCommandMode = wego.CommandMode.NONE;
	var mGameMode = wego.GameMode.PLAN; 
	var selectedCounters = new Array();
	//var currentUnitIndex = -1;
	
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
		return mCurrentHex;
	}
	
	function getSelectedCounters() {
		return selectedCounters;
		// var returnValue = new Array();
		// var selectedItems = $("#counterList").find(".ui-selected");
		// if (selectedItems.length > 0) {
		// 	console.log(selectedItems.length + " units selected");
		// 	var selectedCounters = new Array();
		// 	var stack = mCurrentHex.getStack();
		// 	var counters = stack.getCounters();
		// 	for(var i = 0; i < selectedItems.length; ++i) {
		// 		var counterId = parseInt(selectedItems[i].getAttribute("data-counter-id"));
		// 		for(var j = 0; j < counters.length; ++j) {
		// 			if (counters[j].getId() == counterId) {
		// 				returnValue.push(counters[j]);
		// 				break;
		// 			} else if (counters[j].isFort()) {
		// 				var passengers = counters[j].getPassengers();
		// 				if (passengers != null) {
		// 					for(var k = 0; k < passengers.length; ++k) {
		// 						if (passengers[k].getId() == counterId) {
		// 							returnValue.push(passengers[k]);
		// 							break;
		// 						}
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// } else {
		// 	console.log("no units selected");
		// }
		// return returnValue;
	}
	
	function getTargetHex() {
		return targetHex;
	}
	
	function setCommandMode(mode) {
		mCommandMode = mode;
	}
	
	function setCurrentHex(hex,counters) {
		if (mCurrentHex != null) {
			mCurrentHex.setSelected(false);
		}
				
		mCurrentHex = hex;
		
		if (mCurrentHex != null) {
			mCurrentHex.setSelected(true);
		}
		
		amplify.publish(wego.Topic.CURRENT_HEX,{hex:hex, selectedCounters:counters});
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
		amplify.publish(wego.Topic.SELECTED_COUNTERS,{hex:hex, selectedCounters:selectedCounters});
	}
	
	function setTargetHex(hex) {
		targetHex = hex;
	}

	return {
		clearStatusMessage : clearStatusMessage,
		getCommandMode : getCommandMode,
		getCurrentHex : getCurrentHex,
		getGameMode : getGameMode,
		getSelectedCounters: getSelectedCounters,
		getTargetHex : getTargetHex,
		setCommandMode : setCommandMode,
		setCurrentHex : setCurrentHex,
		setGameMode : setGameMode,
		setSelectedCounters : setSelectedCounters,
		setStatusMessage : setStatusMessage,
		setTargetHex : setTargetHex
	}
})();