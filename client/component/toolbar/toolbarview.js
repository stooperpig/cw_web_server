import {Topic, GameMode} from '../../model/enum.js';

class ToolbarView {
	constructor(component, state) {
		this.component = component;
		this.state = state;
        let view = this;
		amplify.subscribe(Topic.GAME_MODE,function() {
		    var button = $('#gameModeButton span');
		    if (view.state.getGameMode() === GameMode.PLAN) {
			    button.html(GameMode.PLAN);
			    view.enableDisableCommandButtons(false);
		    } else {
    			button.html(GameMode.REPLAY);
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