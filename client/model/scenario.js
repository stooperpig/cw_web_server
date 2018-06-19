class Scenario {
	constructor() {
		this.title = null;
		this.otherImages = null;
		this.description = null;
		this.startTime = null;
		this.numberOfTurns = 0;
		this.minutesPerTurn = 0;
	}

	initialize(data) {
		this.name = data.name;
		this.otherImages = data.otherImages;
		this.title = data.title;
		this.description = data.description;
		this.startTime = data.startTime;
		this.numberOfTurns = data.numberOfTurns;
		this.minutesPerTurn = data.minutesPerTurn;
	}
	
	getImageNames() {
		let returnValue = new Array();

		for (let name in this.otherImages) {
		    returnValue[name] = this.otherImages[name];
		}
		
		return returnValue;
	}
}

export default {};
export {Scenario};