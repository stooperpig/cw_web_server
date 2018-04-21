var wego = wego || {};

wego.StatusbarController = function(component) {
	this.component = component;  
	this.state = null;
}
    
wego.StatusbarController.prototype = {
	initialize: function(state) {
		this.state = state;
        var controller = this;
    }
}