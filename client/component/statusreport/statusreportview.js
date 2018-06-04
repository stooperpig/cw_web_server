var wego = wego || {};

wego.StatusReportView = function(component) {
    this.component = component;  
	this.state = null;
}
    
wego.StatusReportView.prototype = {
	initialize: function(state) {
		this.state = state;
		var view = this;
	},
	loadContent: function() {
		var template = $("#statusReport-template").html();
		var templateScript = Handlebars.compile(template);
		var game = this.state.getGame();
		var team = game.currentPlayer.team;
		var context = {"releases": team.messageMap.releases,
					   "reinforcements": team.messageMap.reinforcements};
		var html = templateScript(context);
		var controller = this;
		$("#content-placeholder").html(html);
	}
}