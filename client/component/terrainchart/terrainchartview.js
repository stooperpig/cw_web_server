import {CounterType, Formation, HexType} from '../../model/enum.js';

class TerrainChartView {
	constructor(component, state) {
    	this.component = component;  
		this.state = state;
		let view = this;

		Handlebars.registerHelper('turnHelper', function(turn) {
			return (turn + 1);
		});

		Handlebars.registerHelper('timeHelper', function(time) {
			return time.substring(0,time.length - 3);
		});
	}
    
	loadContent(type) {
		let template = $("#terrainChart-template").html();
		let templateScript = Handlebars.compile(template);
		let game = this.state.getGame();
		let team = game.currentPlayer.team;
		let context = this.buildChart();
		let html = templateScript(context);
		let controller = this;
		$("#content-placeholder").html(html);
	}

	buildChart() {
		let parametricData = this.state.getParametricData();
		let hexTypeCost = parametricData.hexTypeCost;

		var movementCost = [];
		for(let counterTypeProp in CounterType) {
			if (typeof CounterType[counterTypeProp] !== 'function') {
				for(let formationProp in Formation) {
					if (typeof Formation[formationProp] !== 'function') {
						//for(let hexTypeProp in HexType)
							//if (typeof HexType[hexTypeProp] !== 'function') {
								let row = [];
								row.push(counterTypeProp.toLowerCase());
								row.push(formationPro.toLowerCase());
								movementCost.push(row);
							//}
						//}
					}
				}	
			}
		}

		return {hexTypeCost: movementCost};
	}
}

export default {};
export {TerrainChartView};