var wego = wego || {};

wego.ClockController = function(component) {
	this.component = component;  
	this.state = null;
	this.timer = null;
	this.isSync = false;
	this.maxTime = 30;
}
    
wego.ClockController.prototype = {
	// clockUpdate: function() {
	// 	var time = wego.Clock.getTime();
	// 	updateCounters(time);
	// 	var selectedCounters = this.state.getSelectedCounters();
	// 	setCurrentHex(getCurrentHex(),selectedCounters);
	// },

	// decrement:function() {
	// 	setTime(mTime - 1);
	// },
	
	// getMaxTime:function() {
	// 	return mMaxTime;
	// },
	
	// getTime:function() {
	// 	return mTime;
	// },
	
	// hasExpired:function() {
	// 	return mTime == mMaxTime;
	// },
	
	// increment:function() {
	// 	setTime(mTime + 1);
	// },
	
	// seekEnd:function() {
	// 	setTime(mMaxTime);
	// },
	
	// seekFirst:function() {
	// 	setTime(0);
	// },
	
	// setTime:function(value) {
	// 	if (value <= mMaxTime && value >= 0) {
	// 		mTime = value;
			
	// 		$("#currentTimeDiv").html(mTime);
	// 		console.log("setting time to: " + mTime);
	// 	}
	// },

	initialize: function(state) {
		this.state = state;
		var controller = this;
		
		$("#seekFirstButton" ).button({icons: {primary: "ui-icon-seek-first"},text: false}).click(controller.seekFirst);
		$("#seekPrevButton" ).button({icons: {primary: "ui-icon-seek-prev"},text: false}).click(controller.seekPrev);
		$("#playButton" ).button({icons: {primary: "ui-icon-play"},text: false}).click(controller.play);
		$("#seekNextButton" ).button({icons: {primary: "ui-icon-seek-next"},text: false}).click(controller.seekNext);
		$("#seekEndButton" ).button({icons: {primary: "ui-icon-seek-end"},text: false}).click(controller.seekEnd);
		$("#linkButton" ).button({icons: {primary: "ui-icon-link"},text: false});
	},
	
	play: function() {
		var controller = this;
		this.timer = window.setInterval(controller.handleTimer,1000);
	},
	
	handleTimer: function() {
		var time = this.state.getTime();
		if (time < this.maxTime) {
			this.seekNext();
		} else {
			window.clearInterval(timer);
			this.timer = null;
		}
	},
	
	seekEnd: function() {
		var time = this.maxTime;
		updateCounters(time)
		this.state.setTime(time);
	},
	
	seekFirst: function() {
		var time = 0;
		updateCounters(time);
		this.state.setTime(time);
	},
	
	seekNext: function() {
		var time = this.state.getTime() + 1
		updateCounters(time);
		this.state.setTime(time);
	},
	
	seekPrev: function() {
		var time = this.state.getTime() - 1;
		updateCounters(time);
		this.state.setTime(time);
	},
	
	updateCounters: function(time) {
	}

	// updateCounters: function(time) {
	// 	var areThereMoreTasks = false;
		
	// 	var gameMode = wego.UiState.getGameMode();
		
	// 	//fixme: need to get all counters in REPLAY mode; not just current player
	// 	var currentPlayer = wego.Game.getCurrentPlayer();
		
	// 	var counters = currentPlayer.getCounters();
	// 	for(var i = 0; i < counters.length; ++i) {
	// 		areThereMoreTasks |= counters[i].update(time, gameMode);
	// 	}
		
	// 	if (!areThereMoreTasks && timer != null) {
	// 		window.clearInterval(timer);
	// 		timer = null;
	// 	}
	// }
}