import {StatusbarView} from './statusbarview.js';
import {StatusbarController} from './statusbarcontroller.js';

class StatusbarComponent {
    constructor(state) {
        this.controller = new StatusbarController(this, state);
        this.view = new StatusbarView(this, state);
    }
};

export default {};
export {StatusbarComponent};