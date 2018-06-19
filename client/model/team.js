class Team {
	constructor(id,name) {
		this.name = name;
		this.id = id;
		this.players = new Array();
		this.releases = new Array();
		this.reinforcements = new Array();
		this.messageMap = {};
	}

	getPlayer(id) {
		let returnValue = null;
		
		for(let i = 0; i < this.players.length; ++i) {
			if (this.players[i].id == id) {
				returnValue = this.players[i];
				break;
			}
		}
		
		return returnValue;
	}
	
	getCounter(id) {
		let returnValue = null;
		
		for(let i = 0; i < this.players.length && returnValue == null; ++i) {
			returnValue = this.players[i].getCounter(id);
		}
		
		return returnValue;
	}
	
	addPlayer(player) {
		player.team = this;
		this.players.push(player);
	}
	
	save() {
		let returnValue = {};
		returnValue.id = this.id;
		returnValue.name = this.name;
		returnValue.releases = this.releases;
		returnValue.reinforcements = this.reinforcements;
		returnValue.messageMap = this.messageMap;
		returnValue.players = new Array();
		for(let i = 0; i < this.players.length; ++i) {
			let result = this.players[i].save();
			returnValue.players[i] = result;
		}
		
		return returnValue;
	}
}

export default {};
export {Team};