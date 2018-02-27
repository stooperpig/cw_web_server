var wego = wego || {};

wego.MapComponent = (function() {
    var controller = new wego.MapController(this);
    var view = new wego.MapView(this);

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