var wego = wego || {};

wego.GameApi = (function() {
	function readTurn(game) {
		
	}
	
	function saveGame() {
		var game = wego.UiState.getGame();
		var result = game.save();
		alert(JSON.stringify(result));
		$.post("/civilwar/server/api/gameApi.php", {action:"saveGame", gameId:game.id, playerId:game.currentPlayer.id, data:JSON.stringify(result)}).done(function( data ) {
			alert( "Data Loaded: " + data );
		});
	}
	
	function submitTurn() {
		var game = wego.UiState.getGame();
		var result = game.save();
		alert(JSON.stringify(result));
		$.post("/civilwar/server/api/gameApi.php", {action:"submitTurn", gameId:game.id, playerId:game.currentPlayer.id, data:JSON.stringify(result)}).done(function( data ) {
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