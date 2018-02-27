$(document).ready(function (e) {
	wego.UnitPanelComponent.initialize(wego.UiState);
	wego.ClockComponent.initialize(wego.UiState);
	wego.MapComponent.initialize(wego.UiState);
	wego.MenuController.initialize();
	wego.StatusBarController.initialize();
	wego.ToolbarComponent.initialize(wego.UiState);
	wego.Application.initialize();
});