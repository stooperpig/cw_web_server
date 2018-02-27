var wego = wego || {};

wego.ToolbarView = function() {
}

wego.ToolbarView.prototype = {		
	enableDisableCommandButtons:function(mode) {
		$("#loadUnloadButton").button("option","disabled",mode);
		$("#opFireButton").button("option","disabled",mode);
		$("#waitButton").button("option","disabled",mode);
		$("#directFireButton").button("option","disabled",mode);
		$("#indirectFireButton").button("option","disabled",mode);
	},

	initialize:function() {
        var that = this;
		amplify.subscribe(wego.Topic.GAME_MODE,function() {
		    var button = $('#gameModeButton span');
		    if (wego.UiState.getGameMode() == wego.GameMode.PLAN) {
			    button.html(wego.GameMode.PLAN);
			    that.enableDisableCommandButtons(false);
		    } else {
    			button.html(wego.GameMode.REPLAY);
    			that.enableDisableCommandButtons(true);
    		}
        });
	}
};