import {GameMode} from '../../model/enum.js';

class StatusReportController {
	constructor(component, state) {
		this.component = component;  
		this.state = state;
	}
    
	showReport() {
		var controller = this;
		$("#viewReplayButton").click(function() {controller.showReplay()});  //need to clean up bindings on repeated open/close
		$("#dialog").dialog({title:"Status Report"});
		$("#dialog").dialog("open");
	}

	showReplay() {
		$("#dialog").dialog("close");
		this.state.setGameMode(GameMode.REPLAY);
	}
}

export default {};
export {StatusReportController};