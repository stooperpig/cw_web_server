var wego = wego || {};

wego.ClockView = function(component) {
    this.component = component;  
	this.state = null;
}
    
wego.ClockView.prototype = {
	initialize: function(state) {
		this.state = state;
		var view = this;
		
		amplify.subscribe(wego.Topic.GAME_MODE,function() {
		 	view.clockUpdate();
         });
         
         amplify.subscribe(wego.Topic.TIME,function() {
            view.clockUpdate();
        });
    },
    
    clockUpdate: function() {
        $("#currentTimeDiv").html(this.state.getTime());
        console.log("setting time to: " + this.state.getTime());
    }
}