var wego = wego || {};

wego.Game = function() {
	this.teams = new Array();
	this.currentPlayer;
	this.turn = 0;
	this.id;
	this.counters = new Array();
	this.scenarioId = 0;
	this.showReplay = false;
}

wego.Game.prototype = {
	
	getCounter:function(id) {
		var returnValue = null;
		
		for(var i = 0; i < this.teams.length && returnValue == null; ++i) {
			returnValue = this.teams[i].getCounter(id);
		}
		
		if (returnValue == null) {
			for(var i = 0; i < counters.length && returnValue == null; ++i) {
				if (id == counters[i].getId()) {
					returnValue = counters[i];
				}
			}
		}
		
		return returnValue;
	},
	
	getPlayer:function(id) {
		var returnValue = null;
		
		for(var i = 0; i < this.teams.length && returnValue == null; ++i) {
			returnValue = this.teams[i].getPlayer(id);
		}
		
		return returnValue;
	},
	
	initialize:function(data, map) {
		this.turn = data.currentTurn;
		this.scenarioId = data.scenarioId;
		this.showReplay = data.showReplay;
		console.log("currentPlayer: " + data.currentPlayerId);
		wego.Task.counter = data.taskCounter;

		var counters = data.counters;
		if (counters != null) {
		    for (var i = 0; i < counters.length; ++i) {
		        var counter = wego.CounterFactory.buildCounter(counters[i].id, counters[i].type);
		        counters.push(counter);
		    }
		}

		//First pass thru data creates all the teams, players, and
		//counters. The next pass will handle tasks.  There are two
		//passes because some tasks have references to other counters
		var dataTeams = data.teams;
		for(var i = 0; i < dataTeams.length; ++i) {
			var team = new wego.Team(dataTeams[i].id,dataTeams[i].name);
			this.teams.push(team);
			var players = dataTeams[i].players;
			for(var j = 0; j < players.length; ++j) {
				var player = new wego.Player(players[j].id,players[j].name);
				team.addPlayer(player);
				var counters = players[j].counters;
				for (var k = 0; k < counters.length; ++k) {
				    var counter = wego.CounterFactory.buildCounter(counters[k]);
				    if (counter == null) {
				        debugger;
				    }
					player.addCounter(counter);
				}
			}
		}
		
		//initialize global counters (non-player)
		counters = data.counters;
		if (counters != null) {
		    for (var i = 0; i < counters.length; ++i) {
		        var counter = this.getCounter(counters[i].id);
		        this.initializeCounter(counter, counters[i], map);
		    }
		}
		
		//Second pass creates tasks for each counter
		for(var i = 0; i < dataTeams.length; ++i) {
			var players = dataTeams[i].players;
			for(var j = 0; j < players.length; ++j) {
				var player = this.getPlayer(players[j].id);
				var counters = players[j].counters;
				for(var k = 0; k < counters.length; ++k) {
					var counter = this.getCounter(counters[k].id);
					this.initializeCounter(counter, counters[k], map);
				}
			}
		}
		
		this.currentPlayer = this.getPlayer(data.currentPlayerId);
	},
	
	initializeCounter:function(counter,data, map) {
		var tasks = data.tasks;
		for(var m = 0; m < tasks.length; ++m) {
			var task = this.buildTask(tasks[m], map);	
			counter.addTask(task);
		}
		
		tasks = data.replayTasks;
		if (tasks != null) {
			for(var m = 0; m < tasks.length; ++m) {
				var task = this.buildTask(tasks[m], map);		
				counter.addReplayTask(task);
			}
		}		
	},

	buildTask:function(task, map) {
		var hex = null;
		var hexX = task.hexX;
		var hexY = task.hexY;
		if (hexX != null) {
			hex = map.getHex(hexX,hexY);
		}
		
		var taskType = wego.TaskType.getType(task.type);
		var newTask = new wego.Task(taskType, task.cost, task.movementFactor);
		newTask.hex = hex;
		newTask.id = task.id;
		newTask.strength = task.strength;
		newTask.facing = task.facing;
		newTask.fatigue = task.fatigue;
		newTask.formation = task.formation;
		newTask.moraleStatus = task.moraleStatus;
		newTask.fixed = task.fixed;
							
		var targetIds = task.targetIds;
		if (targetIds != null) {
			var targets = new Array();
			for(var i = 0; i < targetIds.length; ++i) {
				var target = this.getCounter(targetIds[i]);
				targets.push(target);
			}
			
			newTask.targets = targets;
		}

		return newTask;
	},
	
	save:function() {
		var returnValue = {};
		
		returnValue.currentTurn = this.turn;
		returnValue.scenarioId = this.scenarioId;
		returnValue.currentPlayerId = this.currentPlayer.id;
		returnValue.taskCounter = wego.Task.counter;
		returnValue.teams = new Array();
		for(var i = 0; i < this.teams.length; ++i) {
			var result = this.teams[i].save();
			returnValue.teams[i] = result;
		}
		
		return returnValue;
	}
}