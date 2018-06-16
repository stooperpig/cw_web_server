class StatusReportView {
	constructor(component, state) {
    	this.component = component;  
		this.state = state;
	}
    
	loadContent() {
		let template = $("#statusReport-template").html();
		let templateScript = Handlebars.compile(template);
		let game = this.state.getGame();
		let team = game.currentPlayer.team;
		let context = {"releases": team.messageMap.releases,
					   "reinforcements": team.messageMap.reinforcements};
		let html = templateScript(context);
		let controller = this;
		$("#content-placeholder").html(html);
	}
};

export default {};
export {StatusReportView};