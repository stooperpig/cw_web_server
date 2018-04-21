var wego = wego || {};

wego.MainMenuController = function(component) {
	this.component = component;  
	this.state = null;
}
    
wego.MainMenuController.prototype = {
	initialize: function(state) {
		this.state = state;
		var controller = this;
		
		$("#menuItemSaveGame").click(function() {controller.saveGame()});
		$("#menuItemSubmitTurn").click(function() {controller.submitTurn});
	},
	saveGame:function() {
		wego.GameApi.saveGame();
	},
	submitTurn:function() {
		wego.GameApi.submitTurn();
	}
}