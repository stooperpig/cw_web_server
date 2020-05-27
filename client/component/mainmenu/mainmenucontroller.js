import {GameApi} from '../../util/api.js';

class MainMenuController {
	constructor(component, state) {
		this.component = component;  
		this.state = state;
		let controller = this;
		
		$("#menuItemSaveGameMenuItem").click(function() {controller.saveGame();});
		$("#menuItemSubmitTurnMenuItem").click(function() {controller.submitTurn();});
		$("#statusReportMenuItem").click(function() {controller.showStatusReport();});
		$("#terrainChartMenuItem").click(function() {controller.showTerrainChart();});
		$("#releasesReportMenuItem").click(function() {controller.showUnitsReport("releases");});
		$("#reinforcementsReportMenuItem").click(function() {controller.showUnitsReport("reinforcements");});
		$("#toggleFowMenuItem").click(function() {controller.toggleFow();});
	}

	saveGame() {
		GameApi.saveGame(this.state.getGame());
	}

	toggleFow() {
		this.state.setEnableFow(!this.state.isFowEnabled());
	}

	showStatusReport() {
		wego.StatusReportComponent.showReport();
	}

	showTerrainChart() {
		wego.TerrainChartComponent.showReport();
	}

	showUnitsReport(type) {
		wego.UnitsReportComponent.showReport(type);
	}

	submitTurn() {
		GameApi.submitTurn(this.state.getGame());
	}
};

export default {};
export {MainMenuController};