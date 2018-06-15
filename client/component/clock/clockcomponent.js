var wego = wego || {};

wego.ClockComponent = (function() {
    var controller = new wego.ClockController(this);
    var view = new wego.ClockView(this);

	function initialize(state) {
        controller.initialize(state);
        view.initialize(state);
    }

    return {
        controller: controller,
        initialize : initialize,
        view: view
	};
})();