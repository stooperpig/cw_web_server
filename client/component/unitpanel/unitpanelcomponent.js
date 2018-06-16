import {UnitPanelController} from './unitpanelcontroller.js';
import {UnitPanelView} from './unitpanelview.js';

class UnitPanelComponent {
    constructor(state) {
        this.controller = new UnitPanelController(this, state);
        this.view = new UnitPanelView(this, state);
    }
};

export default {};
export {UnitPanelComponent};