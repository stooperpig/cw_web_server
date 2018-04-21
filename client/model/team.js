var wego = wego || {};

wego.Team = function(id,name) {
	this.name = name;
	this.id = id;
	this.players = new Array();
	this.releases = new Array();
}

wego.Team.prototype = {
	getPlayer:function(id) {
		var returnValue = null;
		
		for(var i = 0; i < this.players.length; ++i) {
			if (this.players[i].id == id) {
				returnValue = this.players[i];
				break;
			}
		}
		
		return returnValue;
	},
	
	getCounter:function(id) {
		var returnValue = null;
		
		for(var i = 0; i < this.players.length && returnValue == null; ++i) {
			returnValue = this.players[i].getCounter(id);
		}
		
		return returnValue;
	},
	
	addPlayer:function(player) {
		player.team = this;
		this.players.push(player);
	},
	
	save:function() {
		var returnValue = {};
		returnValue.id = this.id;
		returnValue.name = this.name;
		returnValue.releases = this.releases;
		returnValue.players = new Array();
		for(var i = 0; i < this.players.length; ++i) {
			var result = this.players[i].save();
			returnValue.players[i] = result;
		}
		
		return returnValue;
	}
}