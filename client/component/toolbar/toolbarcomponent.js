import {ToolbarController} from './toolbarcontroller.js';
import {ToolbarView} from './toolbarview.js';

class ToolbarComponent {
    constructor(state) {
        this.controller = new ToolbarController(this, state);
        this.view = new ToolbarView(this, state);
    }
};

export default {};
export {ToolbarComponent};