var wego = wego || {};

wego.StatusbarComponent = (function() {
    var controller = new wego.StatusbarController(this);
    var view = new wego.StatusbarView(this);

	function initialize(state) {
        controller.initialize(state);
        view.initialize(state);
    }

    return {
        controller: controller,
        initialize : initialize,
        view: view
	}
})();