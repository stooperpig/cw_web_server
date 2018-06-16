class ClockView {
    constructor(component, state) {
        this.component = component;  
        this.state = state;
        
        let view = this;
		
		amplify.subscribe(wego.Topic.GAME_MODE,function() {
		 	view.clockUpdate();
         });
         
         amplify.subscribe(wego.Topic.TIME,function() {
            view.clockUpdate();
        });
    }
   
    clockUpdate() {
        $("#currentTimeDiv").html(this.state.getTime());
        console.log("setting time to: " + this.state.getTime());
    }
}

export default {};
export {ClockView};