$(document).ready(function (e) {
	wego.UnitPanelComponent.initialize(wego.UiState);
	wego.ClockComponent.initialize(wego.UiState);
	wego.MapComponent.initialize(wego.UiState);
	wego.StatusbarComponent.initialize(wego.UiState);
	wego.ToolbarComponent.initialize(wego.UiState);
	wego.StatusReportComponent.initialize(wego.UiState);
	wego.MainMenuComponent.initialize(wego.UiState);
	wego.Application.initialize();
});