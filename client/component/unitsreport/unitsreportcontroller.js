var wego = wego || {};

wego.UnitsReportController = function(component) {
	this.component = component;  
	this.state = null;
}
    
wego.UnitsReportController.prototype = {
	initialize: function(state) {
		this.state = state;
		var controller = this;
	},
	showReport: function(type) {
		switch(type) {
			case "releases":
				$("#dialog").dialog({title:"Scheduled Releases"});
				break;
			case "reinforcements":
				$("#dialog").dialog({title:"Scheduled Reinforcements"});
				break;
		}
		$("#dialog").dialog("open");

	},
	showReplay: function() {
		$("#dialog").dialog("close");
		this.state.setGameMode(wego.GameMode.REPLAY);
	}
}