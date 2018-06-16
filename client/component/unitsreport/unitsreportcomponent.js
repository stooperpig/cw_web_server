import {UnitsReportController} from './unitsreportcontroller.js';
import {UnitsReportView} from './unitsreportview.js';

class UnitsReportComponent {
    constructor(state) {
        this.controller = new UnitsReportController(this, state);
        this.view = new UnitsReportView(this, state);
    }


    showReport(type) {
        this.view.loadContent(type);
        this.controller.showReport(type);
    }
};

export default {};
export {UnitsReportComponent};