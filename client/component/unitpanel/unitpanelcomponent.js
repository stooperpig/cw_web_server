var wego = wego || {};

wego.UnitPanelComponent = (function() {
    var controller = new wego.UnitPanelController(this);
    var view = new wego.UnitPanelView(this);

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