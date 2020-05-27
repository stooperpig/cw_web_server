import { Dispatcher } from '../dispatcher.js';

class Store {
    constructor(state) {
        this.state = state;

        let store = this;
        Dispatcher.register(function(action) {
            store.update(action);
        });
    };

    update(action) {
        debugger;
        alert(action);
        this.publish();  
    };

    publish() {
        amplify.publish("STORE",this.state);
    }

    register(callback) {
		amplify.subscribe("STORE",function(data) {
            callback(data);
        });
    };
}

export default {};
export {Store};