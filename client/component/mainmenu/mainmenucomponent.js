import {MainMenuController} from './mainmenucontroller.js';
import {MainMenuView} from './mainmenuview.js';

class MainMenuComponent {
    constructor(state) {
        this.controller = new MainMenuController(this, state);
        this.view = new MainMenuView(this, state);
	}
};

export default {};
export {MainMenuComponent};