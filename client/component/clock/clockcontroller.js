import {Topic, GameMode} from '../../model/enum.js';
import { Dispatcher } from '../../dispatcher.js';

class ClockController {
	constructor(component, state) {
		this.component = component;  
		this.state = state;
		this.timer = null;
		this.isSync = false;
		this.maxTime = 15;

		let controller = this;
		
		$("#seekFirstButton" ).button({icons: {primary: "ui-icon-seek-first"},text: false}).click(function() {controller.seekFirst();});
		$("#seekPrevButton" ).button({icons: {primary: "ui-icon-seek-prev"},text: false}).click(function() {controller.seekPrev();});
		$("#playButton" ).button({icons: {primary: "ui-icon-play"},text: false}).click(function() {controller.play();});
		$("#seekNextButton" ).button({icons: {primary: "ui-icon-seek-next"},text: false}).click(function() {controller.seekNext();});
		$("#seekEndButton" ).button({icons: {primary: "ui-icon-seek-end"},text: false}).click(function() {controller.seekEnd();});
		$("#linkButton" ).button({icons: {primary: "ui-icon-link"},text: false});

		amplify.subscribe(Topic.TIME,function(data) {
            controller.clockUpdate(data);
        });
	}

	clockUpdate(areThereMoreTasks) {
		if (!areThereMoreTasks && this.timer != null) {
			window.clearInterval(this.timer);
			this.timer = null;
			console.log("Timer ended");
		}
	}
	
	play() {
		if (this.timer == null) {
			let controller = this;
			this.timer = window.setInterval(function() {controller.handleTimer();},1000);
		} else {
			window.clearInterval(this.timer);
			this.timer = null;
		}
	}
	
	handleTimer() {
		let time = this.state.getTime();
		if (time < this.maxTime) {
			this.seekNext();
		} else {
			window.clearInterval(this.timer);
			this.timer = null;
		}
	}
	
	seekEnd() {
		Dispatcher.dispatch({action:"Monkey",payload:"Stuff"});
		let time = this.maxTime;
		//this.updateCounters(time)
		this.state.setTime(time);
	}
	
	seekFirst() {
		let time = 0;
		//this.updateCounters(time);
		this.state.setTime(time);
	}
	
	seekNext() {
		let time = this.state.getTime() + 1;
		if (time > this.maxTime) {
			time = maxTime;
		}
		//this.updateCounters(time);
		this.state.setTime(time);
	}
	
	seekPrev() {
		let time = this.state.getTime() - 1;
		if (time < 0) {
			time = 0;
		}
		//this.updateCounters(time);
		this.state.setTime(time);
	}
	
	// updateCounters(time) {
	// 	let mode = this.state.getGameMode();
	// 	let game = this.state.getGame();

	// 	let areThereMoreTasks = false;

	// 	if (mode == GameMode.PLAN) {
	// 		let currentPlayer = game.currentPlayer;
	// 		let counters = currentPlayer.counters;
	// 		for(let i = 0; i < counters.length; ++i) {
	// 			areThereMoreTasks |= counters[i].updateCurrentTask(mode,time);
	// 		}
	// 	} else {
	// 		let teams = game.teams;
	// 		for(let i = 0; i < teams.length; ++i) {
	// 			let players = teams[i].players;
	// 			for(let j = 0; j < players.length; ++j) {
	// 				let counters = players[j].counters;
	// 				for(let k = 0; k < counters.length; ++k) {
	// 					areThereMoreTasks |= counters[k].updateCurrentTask(mode, time);
	// 				}
	// 			}
	// 		}
	// 	}

	//  	if (!areThereMoreTasks && this.timer != null) {
	//  		window.clearInterval(this.timer);
	//  		this.timer = null;
	//  	}
	// }
}

export default {};
export {ClockController};