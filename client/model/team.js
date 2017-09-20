var wego = wego || {};

wego.Team = function(id,name) {
	var mName = name;
	var mId = id;
	var mPlayers = new Array();
	
	function getName() {
		return mName;
	}
	
	function getId() {
		return mId;
	}
	
	function getPlayers() {
		return mPlayers;
	}
	
	function getPlayer(id) {
		var returnValue = null;
		
		for(var i = 0; i < mPlayers.length; ++i) {
			if (mPlayers[i].getId() == id) {
				returnValue = mPlayers[i];
				break;
			}
		}
		
		
		return returnValue;
	}
	
	function getCounter(id) {
		var returnValue = null;
		
		for(var i = 0; i < mPlayers.length && returnValue == null; ++i) {
			returnValue = mPlayers[i].getCounter(id);
		}
		
		return returnValue;
	}
	
	function addPlayer(player) {
		player.setTeam(this);
		mPlayers.push(player);
	}
	
	function save() {
		var returnValue = {};
		returnValue.id = mId;
		returnValue.name = mName;
		returnValue.players = new Array();
		for(var i = 0; i < mPlayers.length; ++i) {
			var result = mPlayers[i].save();
			returnValue.players[i] = result;
		}
		
		return returnValue;
	}
	
	return {
		save: save,
		getName: getName,
		getId: getId,
		getPlayers: getPlayers,
		addPlayer: addPlayer,
		getPlayer: getPlayer,
		getCounter: getCounter
	}
}