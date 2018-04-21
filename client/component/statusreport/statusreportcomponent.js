var wego = wego || {};

wego.StatusReportComponent = (function() {
    var controller = new wego.StatusReportController(this);
    var view = new wego.StatusReportView(this);

	function initialize(state) {
        controller.initialize(state);
        view.initialize(state);
    }

    function showReport() {
        controller.showReport();
    }

    return {
        controller: controller,
        initialize : initialize,
        view: view,
        showReport: showReport
	}
})();