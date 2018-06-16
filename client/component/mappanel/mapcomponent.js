import {MapController} from './mapcontroller.js';
import {MapView} from './mapview.js';

class MapComponent {
    constructor(state) {
        this.controller = new MapController(this, state);
        this.view = new MapView(this, state);
	}
}

export default {};
export {MapComponent};