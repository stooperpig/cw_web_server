class UnitPanelController {
    constructor(component, state) {
        this.component = component;
        this.state = state;	

        let controller = this;
		$("#unitBoxCanvas").bind('mousedown', function (e) {
			e.metaKey = true;
	        console.log("click event: " + e);
	        let counter = controller.getCounter(e);
            console.log("clicked counter: " + counter);
            let currentPlayer = controller.state.getGame().currentPlayer;
            if (counter != null && counter.player.id == currentPlayer.id) {
                let selectedCounters = controller.state.getSelectedCounters();
                if (selectedCounters != null) {
                    let index = selectedCounters.indexOf(counter);
                    if (index != -1) {
                        selectedCounters.splice(index,1);
                    } else {
                        selectedCounters.push(counter);
                    }
                } else {
                    selectedCounters = new Array();
                    selectedCounters.push(counter);
                }

                controller.state.setSelectedCounters(selectedCounters);
            }
		});
		
		$("#taskList").bind('mousedown', function (e) {
			e.metaKey = true;
		}).selectable({
			selected: controller.handleSelectTask,
			unselected: controller.handleSelectTask,
			filter:".ui-state-enabled"
		});        
    }

    deleteTask(counterId,taskSlot) {
        let selectedCounters = this.state.getSelectedCounters();
		 for(let j = 0; j < selectedCounters.length; ++j) {
		 	let counter = selectedCounters[j];
		 	if (counter.id == counterId) {
                let lastTask = counter.getLastTask();
                let lastHex = lastTask.hex;
                counter.deleteTask(taskSlot);
                let hex = counter.getHex();
                if (hex != lastHex) {
                    lastHex.removeCounter(counter);
                    hex.addCounter(counter);
                }
		        this.state.setCurrentHex(hex,[counter]);
				break;
		 	}
		}
	}
	
	handleSelectTask(event,ui) {
		let selected = $(ui.selected);
		//selected.siblings().removeClass("ui-selected");
		
		if (selected.hasClass("ui-selected")) {
			let counterId = $(ui.selected).attr("data-counter-id");
			let taskSlot = $(ui.selected).attr("data-task-slot");
			let selectedCounters =this.state.getSelectedCounters();
			let gameMode = this.state.getGameMode();
			for(let j = 0; j < selectedCounters.length; ++j) {
				let counter = selectedCounters[j];
				if (counter.getId() == counterId) {
					counter.update(taskSlot, gameMode);
					let hex = counter.getHex();
					this.state.setCurrentHex(hex,[counter]);
					//wego.MainController.drawMap();
					break;
				}
			}
		} else {
			alert("not updating");
		}
	}

    getCounter(event) {
        let counter = null;
        let posX = $(event.target).offset().left;
        let posY = $(event.target).offset().top;
        let x = event.pageX - posX;
        let y = event.pageY - posY;
        console.log("clickEvent: (" + x + "," + y + ")");

        let currentHex = this.state.getCurrentHex();
        if (currentHex != null) {
            let stack = currentHex.stack;
            if (stack != null) {
                let counters = stack.counters;
                let leaders = this.getLeaders(counters);

                let leaderRows = Math.ceil(leaders.length / 2);
                let leaderMaxY = leaderRows * wego.SpriteUtil.leaderBoxHeight;
                if (y > leaderMaxY) {
                    console.log("clicked on a unit");
                    let adjY = y - leaderMaxY;
                    let unitRow = Math.floor(adjY / wego.SpriteUtil.unitBoxHeight);
                    console.log("clicked on unit " + unitRow);
                    if (leaders.length == 0) {
                        counter = counters[unitRow];
                    } else {
                        let units = this.getUnits(counters);
                        counter = units[unitRow];    
                    }
                } else {
                    console.log("clicked on a leader");
                    let leaderRow = Math.floor(y / (wego.SpriteUtil.leaderBoxHeight));
                    let leaderColumn = Math.floor(x / (wego.SpriteUtil.leaderBoxWidth));
                    let leaderIndex = (leaderRow * 2) + leaderColumn;
                    counter = leaders[leaderIndex];    
                    console.log("clicked on leader " + leaderRow + "," + leaderColumn + " -> " + leaderIndex);
                }
            }
        }

        //let coord = hexMap.pointToHex((event.pageX - posX) , (event.pageY - posY));
        //console.log("clicked on hex (" + coord.col + "," + coord.row + ") point (" + posX + "," + posY + ")");
        //hex = hexMap.getHex(coord.col, coord.row);
        return counter;
    }
	   
    getUnits(counters) {
        let units = new Array();
        let numCounters = counters.length;
        for(let i = 0; i < numCounters; ++i) {
            if (counters[i].type != "L") {
                units.push(counters[i]);
            }
        }
        return units;
    }

	getLeaders(counters) {
	    let leaders = new Array();
        let numCounters = counters.length;
        for(let i = 0; i < numCounters; ++i) {
            if (counters[i].type == "L") {
                leaders.push(counters[i]);
            }
        }
        return leaders;
	}
};

export default {};
export {UnitPanelController};