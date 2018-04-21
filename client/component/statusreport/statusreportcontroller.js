var wego = wego || {};

wego.StatusReportController = function(component) {
	this.component = component;  
	this.state = null;
}
    
wego.StatusReportController.prototype = {
	initialize: function(state) {
		this.state = state;
		var controller = this;
		
		$("#dialog").dialog({autoOpen:false});
		$("#viewReplayButton").click(function() {controller.showReplay()});
	},
	showReport: function() {
		$("#dialog").dialog("open");
	},
	showReplay: function() {
		$("#dialog").dialog("close");
		this.state.setGameMode(wego.GameMode.REPLAY);
	}
}