import {StatusReportController} from './statusreportcontroller.js';
import {StatusReportView} from './statusreportview.js';

class StatusReportComponent {
    constructor(state) {
        this.controller = new StatusReportController(this, state);
        this.view = new StatusReportView(this, state);
    }

    showReport() {
        this.view.loadContent();
        this.controller.showReport();
    }
}

export default {};
export {StatusReportComponent};