class ToolbarView {
	constructor(component, state) {
		this.component = component;
		this.state = state;
        let view = this;
		amplify.subscribe(wego.Topic.GAME_MODE,function() {
		    var button = $('#gameModeButton span');
		    if (view.state.getGameMode() === wego.GameMode.PLAN) {
			    button.html(wego.GameMode.PLAN);
			    view.enableDisableCommandButtons(false);
		    } else {
    			button.html(wego.GameMode.REPLAY);
    			view.enableDisableCommandButtons(true);
    		}
        });
	}
		
	enableDisableCommandButtons(mode) {
		$("#loadUnloadButton").button("option","disabled",mode);
		$("#opFireButton").button("option","disabled",mode);
		$("#waitButton").button("option","disabled",mode);
		$("#directFireButton").button("option","disabled",mode);
		$("#indirectFireButton").button("option","disabled",mode);
	}
};

export default {};
export {ToolbarView};