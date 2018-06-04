var wego = wego || {};

wego.UnitsReportComponent = (function() {
    var controller = new wego.UnitsReportController(this);
    var view = new wego.UnitsReportView(this);

	function initialize(state) {
        controller.initialize(state);
        view.initialize(state);
    }

    function showReport(type) {
        view.loadContent(type);
        controller.showReport(type);
    }

    return {
        controller: controller,
        initialize : initialize,
        view: view,
        showReport: showReport
	}
})();