var wego = wego || {};

wego.StatusReportController = function(component) {
	this.component = component;  
	this.state = null;
}
    
wego.StatusReportController.prototype = {
	initialize: function(state) {
		this.state = state;
		var controller = this;
	},
	showReport: function() {
		var controller = this;
		$("#viewReplayButton").click(function() {controller.showReplay()});  //need to clean up bindings on repeated open/close
		$("#dialog").dialog({title:"Status Report"});
		$("#dialog").dialog("open");
	},
	showReplay: function() {
		$("#dialog").dialog("close");
		this.state.setGameMode(wego.GameMode.REPLAY);
	}
}