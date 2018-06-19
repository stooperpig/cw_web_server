class Player {
	constructor(id,name) {
		this.counters = new Array();
		this.id = id;
		this.name = name;
		this.team;
	}

	addCounter(counter) {
		counter.player = this;
		this.counters.push(counter);
	}

	addRelease(release) {
		this.releases.push(release);
	}
	
	getCounter(id) {
		let returnValue = null;
		
		for(let i = 0; i < this.counters.length; ++i) {
			if (this.counters[i].id == id) {
				returnValue = this.counters[i];
				break;
			}
		}
		
		return returnValue;
	}
	
	getNextUnit(mode, time, index) {
		let newIndex = index + 1;
		let counter = null;
		for(let i = newIndex; i < this.counters.length; ++i) {
			if (!this.counters[i].isFinished() && this.counters[i].getHex(mode, time) != null) {
				counter = this.counters[i];
				newIndex = i;
				break;
			}
		}
		
		if (counter == null) {
			for(let i = 0; i < newIndex; ++i) {
				if (!this.counters[i].isFinished() && this.counters[i].getHex(mode, time) != null) {
					counter = this.counters[i];
					newIndex = i;
					break;
				}
			}
		}
		
		return ({nextIndex:newIndex, unit:counter});
	}
	
	getPrevUnit(mode, time, index) {
		let newIndex = index - 1;
		let counter = null;
		for(let i = newIndex; i >= 0; --i) {
			if (!this.counters[i].isFinished() && this.counters[i].getHex(mode, time) != null) {
				counter = this.counters[i];
				newIndex = i;
				break;
			}
		}
		
		if (counter == null) {
			for(let i = this.counters.length - 1; i > newIndex; --i) {
				if (!this.counters[i].isFinished() && this.counters[i].getHex(mode, time) != null) {
					counter = this.counters[i];
					newIndex = i;
					break;
				}
			}
		}
		
		return ({nextIndex:newIndex, unit:counter});
	}
	
	save() {
		let returnValue = {};
		returnValue.id = this.id;
		returnValue.name = this.name;
		returnValue.counters = new Array();
		for(let i = 0; i < this.counters.length; ++i) {
			let result = this.counters[i].save();
			returnValue.counters[i] = result;
		}
		
		return returnValue;
	}
}

export default {};
export {Player};