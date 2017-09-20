var wego = wego || {};


wego.MenuController = (function() {
	function initialize() {
	}
	
	function saveGame() {
		wego.GameApi.saveGame();
	}
	
	function submitTurn() {
		wego.GameApi.submitTurn();
	}
	
	return {
		initialize : initialize,
		saveGame : saveGame,
		submitTurn: submitTurn
	}
})();