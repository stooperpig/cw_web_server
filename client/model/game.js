import {Team} from './team.js';
import {Player} from './player.js';
import {CounterFactory} from './counterfactory.js';
import {Task} from './task.js';

class Game {
	constructor() {
	this.teams = new Array();
	this.currentPlayer;
	this.turn = 0;
	this.id;
	this.counters = new Array();
	this.scenarioId = 0;
	this.showReplay = false;
	this.messageMap = {};
	}

	getCounter(id) {
		let returnValue = null;
		
		for(let i = 0; i < this.teams.length && returnValue == null; ++i) {
			returnValue = this.teams[i].getCounter(id);
		}
		
		if (returnValue == null) {
			for(let i = 0; i < counters.length && returnValue == null; ++i) {
				if (id == counters[i].getId()) {
					returnValue = counters[i];
				}
			}
		}
		
		return returnValue;
	}
	
	getPlayer(id) {
		let returnValue = null;
		
		for(let i = 0; i < this.teams.length && returnValue == null; ++i) {
			returnValue = this.teams[i].getPlayer(id);
		}
		
		return returnValue;
	}
	
	initialize(data, map) {
		this.turn = data.currentTurn;
		this.scenarioId = data.scenarioId;
		this.showReplay = data.showReplay;
		this.messageMap = data.messageMap;
		console.log("currentPlayer: " + data.currentPlayerId);
		Task.counter = data.taskCounter;

		let counters = data.counters;
		if (counters != null) {
		    for (let i = 0; i < counters.length; ++i) {
		        let counter = CounterFactory.buildCounter(counters[i].id, counters[i].type);
		        counters.push(counter);
		    }
		}

		//First pass thru data creates all the teams, players, and
		//counters. The next pass will handle tasks.  There are two
		//passes because some tasks have references to other counters
		let dataTeams = data.teams;
		for(let i = 0; i < dataTeams.length; ++i) {
			let team = new Team(dataTeams[i].id,dataTeams[i].name);
			team.releases = dataTeams[i].releases;
			team.reinforcements = dataTeams[i].reinforcements;
			team.messageMap = dataTeams[i].messageMap;
			this.teams.push(team);
			let players = dataTeams[i].players;
			for(let j = 0; j < players.length; ++j) {
				let player = new Player(players[j].id,players[j].name);
				team.addPlayer(player);
				let counters = players[j].counters;
				for (let k = 0; k < counters.length; ++k) {
				    let counter = CounterFactory.buildCounter(counters[k]);
				    if (counter == null) {
				    }
					player.addCounter(counter);
				}
			}
		}
		
		//initialize global counters (non-player)
		counters = data.counters;
		if (counters != null) {
		    for (let i = 0; i < counters.length; ++i) {
		        let counter = this.getCounter(counters[i].id);
		        this.initializeCounter(counter, counters[i], map);
		    }
		}
		
		//Second pass creates tasks for each counter
		for(let i = 0; i < dataTeams.length; ++i) {
			let players = dataTeams[i].players;
			for(let j = 0; j < players.length; ++j) {
				let player = this.getPlayer(players[j].id);
				let counters = players[j].counters;
				for(let k = 0; k < counters.length; ++k) {
					let counter = this.getCounter(counters[k].id);
					this.initializeCounter(counter, counters[k], map);
				}
			}
		}
		
		this.currentPlayer = this.getPlayer(data.currentPlayerId);
	}
	
	initializeCounter(counter,data, map) {
		let tasks = data.tasks;
		for(let m = 0; m < tasks.length; ++m) {
			let task = this.buildTask(tasks[m], map);	
			counter.addTask(task);
		}
		
		tasks = data.replayTasks;
		if (tasks != null) {
			for(let m = 0; m < tasks.length; ++m) {
				let task = this.buildTask(tasks[m], map);		
				counter.addReplayTask(task);
			}
		}		
	}

	buildTask(task, map) {
		let hex = null;
		let hexX = task.hexX;
		let hexY = task.hexY;
		if (hexX != null) {
			hex = map.getHex(hexX,hexY);
		}
		
		let taskType = wego.TaskType.getType(task.type);
		let newTask = new Task(taskType, task.cost, task.movementFactor);
		newTask.hex = hex;
		newTask.id = task.id;
		newTask.strength = task.strength;
		newTask.facing = task.facing;
		newTask.fatigue = task.fatigue;
		newTask.formation = task.formation;
		newTask.moraleStatus = task.moraleStatus;
		newTask.fixed = task.fixed;
		newTask.spotted = task.spotted;
							
		let targetIds = task.targetIds;
		if (targetIds != null) {
			let targets = new Array();
			for(let i = 0; i < targetIds.length; ++i) {
				let target = this.getCounter(targetIds[i]);
				targets.push(target);
			}
			
			newTask.targets = targets;
		}

		return newTask;
	}
	
	save() {
		let returnValue = {};
		
		returnValue.currentTurn = this.turn;
		returnValue.scenarioId = this.scenarioId;
		returnValue.currentPlayerId = this.currentPlayer.id;
		returnValue.messageMap = this.messageMap;
		returnValue.taskCounter = Task.counter;
		returnValue.teams = new Array();
		for(let i = 0; i < this.teams.length; ++i) {
			let result = this.teams[i].save();
			returnValue.teams[i] = result;
		}
		
		return returnValue;
	}
}

export default {};
export {Game};
