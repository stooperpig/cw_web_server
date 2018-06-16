class UnitsReportController {
	constructor(component, state) {
		this.component = component;  
		this.state = state;
	}
    
	showReport(type) {
		switch(type) {
			case "releases":
				$("#dialog").dialog({title:"Scheduled Releases"});
				break;
			case "reinforcements":
				$("#dialog").dialog({title:"Scheduled Reinforcements"});
				break;
		}
		$("#dialog").dialog("open");

	}

	showReplay() {
		$("#dialog").dialog("close");
		this.state.setGameMode(wego.GameMode.REPLAY);
	}
};

export default {};
export {UnitsReportController};