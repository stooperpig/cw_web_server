class MainMenuController {
	constructor(component, state) {
		this.component = component;  
		this.state = state;
		let controller = this;
		
		$("#menuItemSaveGameMenuItem").click(function() {controller.saveGame();});
		$("#menuItemSubmitTurnMenuItem").click(function() {controller.submitTurn();});
		$("#statusReportMenuItem").click(function() {controller.showStatusReport();});
		$("#releasesReportMenuItem").click(function() {controller.showUnitsReport("releases");});
		$("#reinforcementsReportMenuItem").click(function() {controller.showUnitsReport("reinforcements");});
		$("#toggleFowMenuItem").click(function() {controller.toggleFow();});
	}

	saveGame() {
		wego.GameApi.saveGame();
	}

	toggleFow() {
		this.state.setEnableFow(!this.state.isFowEnabled());
	}

	showStatusReport() {
		wego.StatusReportComponent.showReport();
	}

	showUnitsReport(type) {
		wego.UnitsReportComponent.showReport(type);
	}

	submitTurn() {
		wego.GameApi.submitTurn();
	}
};

export default {};
export {MainMenuController};