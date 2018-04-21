var wego = wego || {};

wego.MainMenuComponent = (function() {
    var controller = new wego.MainMenuController(this);
    var view = new wego.MainMenuView(this);

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