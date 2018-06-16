class UnitsReportView {
	constructor(component, state) {
    	this.component = component;  
		this.state = state;
		let view = this;

		Handlebars.registerHelper('turnHelper', function(turn) {
			return (turn + 1);
		});

		Handlebars.registerHelper('timeHelper', function(time) {
			return time.substring(0,time.length - 3);
		});
	}
    
	loadContent(type) {
		let template = $("#" + type + "Report-template").html();
		let templateScript = Handlebars.compile(template);
		let game = this.state.getGame();
		let currentPlayer = game.currentPlayer;
		let team = currentPlayer.team;
		let context = null;

		switch(type) {
			case "releases":
				context = {"releases": team.releases};
				break;
			case "reinforcements":
				context = {"reinforcements": team.reinforcements};
				break;
		}

		let html = templateScript(context);
		$("#content-placeholder").html(html);
	}
}

export default {};
export {UnitsReportView};