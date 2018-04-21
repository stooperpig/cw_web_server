var wego = wego || {};

wego.ClockController = function(component) {
	this.component = component;  
	this.state = null;
	this.timer = null;
	this.isSync = false;
	this.maxTime = 15;
}
    
wego.ClockController.prototype = {
	initialize: function(state) {
		this.state = state;
		var controller = this;
		
		$("#seekFirstButton" ).button({icons: {primary: "ui-icon-seek-first"},text: false}).click(function() {controller.seekFirst()});
		$("#seekPrevButton" ).button({icons: {primary: "ui-icon-seek-prev"},text: false}).click(function() {controller.seekPrev()});
		$("#playButton" ).button({icons: {primary: "ui-icon-play"},text: false}).click(function() {controller.play()});
		$("#seekNextButton" ).button({icons: {primary: "ui-icon-seek-next"},text: false}).click(function() {controller.seekNext()});
		$("#seekEndButton" ).button({icons: {primary: "ui-icon-seek-end"},text: false}).click(function() {controller.seekEnd()});
		$("#linkButton" ).button({icons: {primary: "ui-icon-link"},text: false});

		amplify.subscribe(wego.Topic.TIME,function(data) {
            controller.clockUpdate(data);
        });
	},

	clockUpdate: function(areThereMoreTasks) {
		if (!areThereMoreTasks && this.timer != null) {
			window.clearInterval(this.timer);
			this.timer = null;
			console.log("Timer ended");
		}
	},
	
	play: function() {
		if (this.timer == null) {
			var controller = this;
			this.timer = window.setInterval(function() {controller.handleTimer()},1000);
		} else {
			window.clearInterval(this.timer);
			this.timer = null;
		}
	},
	
	handleTimer: function() {
		var time = this.state.getTime();
		if (time < this.maxTime) {
			this.seekNext();
		} else {
			window.clearInterval(this.timer);
			this.timer = null;
		}
	},
	
	seekEnd: function() {
		var time = this.maxTime;
		//this.updateCounters(time)
		this.state.setTime(time);
	},
	
	seekFirst: function() {
		var time = 0;
		//this.updateCounters(time);
		this.state.setTime(time);
	},
	
	seekNext: function() {
		var time = this.state.getTime() + 1
		if (time > this.maxTime) {
			time = maxTime;
		}
		//this.updateCounters(time);
		this.state.setTime(time);
	},
	
	seekPrev: function() {
		var time = this.state.getTime() - 1;
		if (time < 0) {
			time = 0;
		}
		//this.updateCounters(time);
		this.state.setTime(time);
	},
	
	updateCounters: function(time) {
		var mode = this.state.getGameMode();
		var game = this.state.getGame();

		var areThereMoreTasks = false;

		if (mode == wego.GameMode.PLAN) {
			var currentPlayer = game.currentPlayer;
			var counters = currentPlayer.counters;
			for(var i = 0; i < counters.length; ++i) {
				areThereMoreTasks |= counters[i].updateCurrentTask(mode,time);
			}
		} else {
			var teams = game.teams;
			for(var i = 0; i < teams.length; ++i) {
				var players = teams[i].players;
				for(var j = 0; j < players.length; ++j) {
					var counters = players[j].counters;
					for(var k = 0; k < counters.length; ++k) {
						areThereMoreTasks |= counters[k].updateCurrentTask(mode, time);
					}
				}
			}
		}

	 	if (!areThereMoreTasks && this.timer != null) {
	 		window.clearInterval(this.timer);
	 		this.timer = null;
	 	}
	}
}