var wego = wego || {};

wego.MainMenuController = function(component) {
	this.component = component;  
	this.state = null;
}
    
wego.MainMenuController.prototype = {
	initialize: function(state) {
		this.state = state;
		let controller = this;
		
		$("#menuItemSaveGameMenuItem").click(function() {controller.saveGame()});
		$("#menuItemSubmitTurnMenuItem").click(function() {controller.submitTurn()});
		$("#statusReportMenuItem").click(function() {controller.showStatusReport()});
		$("#releasesReportMenuItem").click(function() {controller.showUnitsReport("releases")});
		$("#reinforcementsReportMenuItem").click(function() {controller.showUnitsReport("reinforcements")});
		$("#toggleFowMenuItem").click(function() {controller.toggleFow()});
	},

	saveGame:function() {
		wego.GameApi.saveGame();
	},

	toggleFow:function() {
		this.state.setEnableFow(!this.state.isFowEnabled());
	},

	showStatusReport:function() {
		wego.StatusReportComponent.showReport();
	},

	showUnitsReport:function(type) {
		wego.UnitsReportComponent.showReport(type);
	},

	submitTurn:function() {
		wego.GameApi.submitTurn();
	}
}