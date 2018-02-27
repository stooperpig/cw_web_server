var wego = wego || {};

wego.ClockView = function(component) {
    this.component = component;  
	this.state = null;
}
    
wego.ClockView.prototype = {
	// clockUpdate: function() {
	// 	var time = wego.Clock.getTime();
	// 	updateCounters(time);
	// 	var selectedCounters = this.state.getSelectedCounters();
	// 	setCurrentHex(getCurrentHex(),selectedCounters);
	// },

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
        $("#currentTimeDiv").html(mTime);
        console.log("setting time to: " + mTime);
    }
}