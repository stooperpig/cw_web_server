var wego = wego || {};

wego.GameApi = (function() {
	function readTurn(game) {
		
	}
	
	function saveGame() {
		var result = wego.Game.save();
		alert(JSON.stringify(result));
		$.post("/civilwar/server/api/gameApi.php", {action:"saveGame", gameId:wego.Game.getId(), playerId:wego.Game.getCurrentPlayer().getId(), data:JSON.stringify(result)}).done(function( data ) {
			alert( "Data Loaded: " + data );
		});
	}
	
	function submitTurn(game) {
		var result = wego.Game.save();
		alert(JSON.stringify(result));
		$.post("/civilwar/server/api/gameApi.php", {action:"submitTurn", gameId:wego.Game.getId(), playerId:wego.Game.getCurrentPlayer().getId(), data:JSON.stringify(result)}).done(function( data ) {
			alert( "Data Loaded: " + data );
		});		
	}
	
	function retrieveGame(gameId, playerId, callback) {
		var url = "/civilwar/server/api/gameApi.php?action=retrieveGame&gameId=" + gameId + "&playerId=" + playerId;
		$.getJSON(url, callback);
	}
	
	return {
		readTurn: readTurn,
		saveGame: saveGame,
		submitTurn: submitTurn,
		retrieveGame: retrieveGame
	}
})();