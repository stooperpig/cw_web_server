var wego = wego || {};

wego.ToolbarComponent = (function() {
    var controller = new wego.ToolbarController(this);
    var view = new wego.ToolbarView(this);

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