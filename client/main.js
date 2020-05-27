	import {StatusbarComponent} from './component/statusbar/statusbarcomponent.js';
	import {ClockComponent} from './component/clock/clockcomponent.js';
	import {UnitPanelComponent} from './component/unitpanel/unitpanelcomponent.js';
	import {MapComponent} from './component/mappanel/mapcomponent.js';
	import {ToolbarComponent} from './component/toolbar/toolbarcomponent.js';
	import {StatusReportComponent} from './component/statusreport/statusreportcomponent.js';
	import {TerrainChartComponent} from './component/terrainchart/terrainchartcomponent.js';
	import {UnitsReportComponent} from './component/unitsreport/unitsreportcomponent.js';
	import {MainMenuComponent} from './component/mainmenu/mainmenucomponent.js';
	import {Application} from './application.js';
	import {UiState} from './model/uistate.js';
	import {Store} from './store/store.js';
	import {Dispatcher} from './dispatcher.js';

	wego.Store = new Store(UiState);

	wego.Store.register(function(data) {
		debugger;
		alert(data);
	});
	
	wego.UnitPanelComponent = new UnitPanelComponent(UiState);
	wego.ClockComponent = new ClockComponent(UiState);
	wego.MapComponent = new MapComponent(UiState);
	wego.StatusbarComponent = new StatusbarComponent(UiState);
	wego.ToolbarComponent = new ToolbarComponent(UiState);
	wego.StatusReportComponent = new StatusReportComponent(UiState);
	wego.TerrainChartComponent = new TerrainChartComponent(UiState);
	wego.UnitsReportComponent = new UnitsReportComponent(UiState);
	wego.MainMenuComponent = new MainMenuComponent(UiState);
	wego.Application = new Application(UiState);