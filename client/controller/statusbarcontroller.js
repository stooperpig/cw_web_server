var wego = wego || {};

function StatusBarModel(uiState) {
	var self = this;
	
	this.statusMessage =  ko.observable(uiState.statusMessage);
};

wego.StatusBarController = (function() {
	var self = this;
	
	function initialize() {
		amplify.subscribe(wego.Topic.STATUS_MESSAGE,function(data) {
			setStatusMessage(data);
		});
	}
	
	function setStatusMessage(message) {
		if (message != null) {
			$("#footerStatusDiv").html(message);
		} else {
			$("#footerStatusDiv").html("");
		}
	}
	
	return {
		initialize : initialize
	}
})();