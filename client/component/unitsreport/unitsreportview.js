var wego = wego || {};

wego.UnitsReportView = function(component) {
    this.component = component;  
	this.state = null;
}
    
wego.UnitsReportView.prototype = {
	initialize: function(state) {
		this.state = state;
		var view = this;

		Handlebars.registerHelper('turnHelper', function(turn) {
			return (turn + 1);
		});

		Handlebars.registerHelper('timeHelper', function(time) {
			return time.substring(0,time.length - 3);
		});
	},
	loadContent: function(type) {
		var template = $("#" + type + "Report-template").html();
		var templateScript = Handlebars.compile(template);
		var game = this.state.getGame();
		var currentPlayer = game.currentPlayer;
		var team = currentPlayer.team;
		var context = null;

		switch(type) {
			case "releases":
				context = {"releases": team.releases};
				break;
			case "reinforcements":
				context = {"reinforcements": team.reinforcements};
				break;
		}

		var html = templateScript(context);
		$("#content-placeholder").html(html);
	}
}