	import {StatusbarComponent} from './component/statusbar/statusbarcomponent.js';
	import {ClockComponent} from './component/clock/clockcomponent.js';
	import {UnitPanelComponent} from './component/unitpanel/unitpanelcomponent.js';
	import {MapComponent} from './component/mappanel/mapcomponent.js';
	import {ToolbarComponent} from './component/toolbar/toolbarcomponent.js';
	import {StatusReportComponent} from './component/statusreport/statusreportcomponent.js';
	import {UnitsReportComponent} from './component/unitsreport/unitsreportcomponent.js';
	import {MainMenuComponent} from './component/mainmenu/mainmenucomponent.js';
	
	wego.UnitPanelComponent = new UnitPanelComponent(wego.UiState);
	wego.ClockComponent = new ClockComponent(wego.UiState);
	wego.MapComponent = new MapComponent(wego.UiState);
	wego.StatusbarComponent = new StatusbarComponent(wego.UiState);
	wego.ToolbarComponent = new ToolbarComponent(wego.UiState);
	wego.StatusReportComponent = new StatusReportComponent(wego.UiState);
	wego.UnitsReportComponent = new UnitsReportComponent(wego.UiState);
	wego.MainMenuComponent = new MainMenuComponent(wego.UiState);
	wego.Application.initialize(wego.UiState);