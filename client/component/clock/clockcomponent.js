import {ClockController} from './clockcontroller.js';
import {ClockView} from './clockview.js';

class ClockComponent {
    constructor(state) {
        this.controller = new ClockController(this, state);
        this.view = new ClockView(this, state);
    }
};

export default {};
export {ClockComponent};