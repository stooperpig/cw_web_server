class StatusbarView {
	constructor(component, state) {
		this.component = component;  
		this.state = state;

		let view = this;
		amplify.subscribe(wego.Topic.STATUS_MESSAGE,function(data) {
			view.setStatusMessage(data);
		});
	}

	setStatusMessage(message) {
		if (message != null) {
			$("#footerStatusDiv").html(message);
		} else {
			$("#footerStatusDiv").html("");
		}
	}
}

export default {};
export {StatusbarView};