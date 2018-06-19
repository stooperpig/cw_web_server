class CounterStack {
	constructor() {
		this.counters = new Array();
	}

	addCounter(counter) {
		this.counters.push(counter);
	}
	
	removeCounter(counter) {
		let index = this.counters.indexOf(counter);
		if (index > -1) {
			this.counters.splice(index,1);
		}
	}
	
	isEmpty() {
		return this.counters.length == 0;
	}
}

export default {};
export {CounterStack};