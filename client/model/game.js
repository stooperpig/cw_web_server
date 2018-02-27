var wego = wego || {};

wego.Game = (function() {
	var mTeams = new Array();
	var mCurrentPlayer;
	var mTurn;
	var mId;
	var mCounters = new Array();
	
	function getCounter(id) {
		var returnValue = null;
		
		for(var i = 0; i < mTeams.length && returnValue == null; ++i) {
			returnValue = mTeams[i].getCounter(id);
		}
		
		if (returnValue == null) {
			for(var i = 0; i < mCounters.length && returnValue == null; ++i) {
				if (id == mCounters[i].getId()) {
					returnValue = mCounters[i];
				}
			}
		}
		
		return returnValue;
	}
	
	function getCurrentPlayer() {
		return mCurrentPlayer;
	}
	
	function getId() {
		return mId;
	}
	
	function getPlayer(id) {
		var returnValue = null;
		
		for(var i = 0; i < mTeams.length && returnValue == null; ++i) {
			returnValue = mTeams[i].getPlayer(id);
		}
		
		return returnValue;
	}
	
	function getTeams() {
		return mTeams;
	}
	
	function getTurn() {
		return mTurn;
	}
	
	function initialize(data) {
		mTurn = data.currentTurn;
		console.log("currentPlayer: " + data.currentPlayerId);
		wego.Task.counter = data.taskCounter;

		var counters = data.counters;
		if (counters != null) {
		    for (var i = 0; i < counters.length; ++i) {
		        var counter = wego.CounterFactory.buildCounter(counters[i].id, counters[i].type);
		        mCounters.push(counter);
		    }
		}

		//First pass thru data creates all the teams, players, and
		//counters. The next pass will handle tasks.  There are two
		//passes because some tasks have references to other counters
		var teams = data.teams;
		for(var i = 0; i < teams.length; ++i) {
			var team = new wego.Team(teams[i].id,teams[i].name);
			mTeams.push(team);
			var players = teams[i].players;
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
		        var counter = getCounter(counters[i].id);
		        initializeCounter(counter, counters[i]);
		    }
		}
		
		//Second pass creates tasks for each counter
		for(var i = 0; i < teams.length; ++i) {
			var players = teams[i].players;
			for(var j = 0; j < players.length; ++j) {
				var player = getPlayer(players[j].id);
				var counters = players[j].counters;
				for(var k = 0; k < counters.length; ++k) {
					var counter = getCounter(counters[k].id);
					initializeCounter(counter,counters[k]);
				}
			}
		}
		
		mCurrentPlayer = getPlayer(data.currentPlayerId);
	}
	
	function initializeCounter(counter,data) {
		var tasks = data.tasks;

		for(var m = 0; m < tasks.length; ++m) {
			var hex = null;
			var hexX = tasks[m].hexX;
			var hexY = tasks[m].hexY;
			if (hexX != null) {
				hex = wego.Map.getHex(hexX,hexY);
			}
			
			var taskType = wego.TaskType.getType(tasks[m].type);
			var task = new wego.Task(taskType, tasks[m].cost, tasks[m].movementFactor);
			task.hex = hex;
			task.id = tasks[m].id;
			task.strength = tasks[m].strength;
			task.facing = tasks[m].facing;
			task.fatigue = tasks[m].fatigue;
			task.formation = tasks[m].formation;
			task.moraleStatus = tasks[m].moraleStatus;
			task.fixed = tasks[m].fixed;
								
			var targetIds = tasks[m].targetIds;
			if (targetIds != null) {
				var targets = new Array();
				for(var i = 0; i < targetIds.length; ++i) {
					var target = getCounter(targetIds[i]);
					targets.push(target);
				}
				
				task.targets = targets;
			}
			
			counter.addTask(task);
		}
		
		tasks = data.replayTasks;
		if (tasks != null) {
			for(var m = 0; m < tasks.length; ++m) {
				var hex = null;
				var hexX = tasks[m].hexX;
				var hexY = tasks[m].hexY;
				if (hexX != null) {
					hex = wego.Map.getHex(hexX,hexY);
				}
				
				var taskType = wego.TaskType.getType(tasks[m].type);
				var task = new wego.Task(taskType, tasks[m].cost, tasks[m].movementFactor);
				task.hex = hex;
				task.id = tasks[m].id;
							
				var targetIds = tasks[m].targetIds;
				if (targetIds != null) {
					var targets = new Array();
					for(var i = 0; i < targetIds.length; ++i) {
						var target = getCounter(targetIds[i]);
						targets.push(target);
					}
					
					task.targets = targets;
				}
				
				counter.addReplayTask(task);
			}
		}		
	}
	
	function save() {
		var returnValue = {};
		
		returnValue.currentTurn = mTurn;
		returnValue.currentPlayerId = mCurrentPlayer.getId();
		returnValue.taskCounter = wego.Task.counter;
		returnValue.teams = new Array();
		for(var i = 0; i < mTeams.length; ++i) {
			var result = mTeams[i].save();
			returnValue.teams[i] = result;
		}
		
		return returnValue;
	}
	
	function setId(id) {
		mId = id;
	}
	
	return {
		getCurrentPlayer: getCurrentPlayer,
		getId: getId,
		getTeams: getTeams,
		getTurn: getTurn,
		initialize: initialize,
		save: save,
		setId: setId
	}
})();