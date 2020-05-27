import {TerrainChartController} from './terrainchartcontroller.js';
import {TerrainChartView} from './terrainchartview.js';

class TerrainChartComponent {
    constructor(state) {
        this.controller = new TerrainChartController(this, state);
        this.view = new TerrainChartView(this, state);
    }


    showReport(type) {
        this.view.loadContent(type);
        this.controller.showReport(type);
    }
};

export default {};
export {TerrainChartComponent};