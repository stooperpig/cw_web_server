var wego = wego || {};

wego.MainMenuView = function(component) {
    this.component = component;  
	this.state = null;
}
    
wego.MainMenuView.prototype = {
	initialize: function(state) {
		this.state = state;
		var view = this;
		
		// amplify.subscribe(wego.Topic.STATUS_MESSAGE,function(data) {
		// 	view.setStatusMessage(data);
		// });
	}
	
	// setStatusMessage:function(message) {
	// 	if (message != null) {
	// 		$("#footerStatusDiv").html(message);
	// 	} else {
	// 		$("#footerStatusDiv").html("");
	// 	}
	// }
}