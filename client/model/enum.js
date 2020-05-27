var HexType = {
	CLEAR:{code:" ",name:"Clear"},
	ROUGH:{code:"r",name:"Rough"},
	FOREST:{code:"f",name:"Forest"},
	getType:function getType(code) {
		let returnValue = null;	
		for(let i in this) {
			if (this[i].code == code) {
				returnValue = this[i];
				break;
			}
		}
		
		return returnValue;
	}
}

var Formation = {
	COLUMN:"C",
	LINE:"L",
	NONE:"N",
	getType:function getType(name) {
		let returnValue = null;
		for(let i in this) {
			if (this[i] == name) {
				returnValue = this[i];
				break;
			}
		}
		
		return returnValue;
	}
}

var HexSideType = {
	CLEAR:{type:"Clear",code:" ",mask:0},
	TRAIL:{type:"Trail",code:"t",mask:2},
	ROAD:{type:"Road",code:"r",mask:4},
	PIKE:{type:"Pike",code:"p",mask:8},
	RAILROAD:{type:"Railroad",code:"a",mask:16},
	STREAM:{type:"Stream",code:"s",mask:32},
	CREEK:{type:"Creek",code:"c",mask:64},
	EMBANKMENT:{type:"Embankment",code:"e",mask:128},
	WALL:{type:"Wall",code:"w",mask:256},
	RAILROAD_CUT:{type:"Railroad Cut",code:"i",mask:512},
	getType:function getType(code) {
		let returnValue = null;
		for(let i in this) {
			if (this[i].code == code) {
				returnValue = this[i];
				break;
			}
		}
		
		return returnValue;
	}
}

var TaskType = {
	WAIT:"Wt",
	INITIAL:"In",
	MOVE:"Mv",
	ROTATE_LEFT:"Rl",
	ROTATE_RIGHT:"Rr",
	CHANGE_FORMATION:"Cf",
	DIRECT_FIRE:"Df",
	OPPORTUNITY_FIRE:"Of",
	ABOUT_FACE: "Af",
	getType:function getType(name) {
		let returnValue = null;
		for(let i in this) {
			if (this[i] == name) {
				returnValue = this[i];
				break;
			}
		}
		
		return returnValue;
	}
}

var CounterType = {
	INFANTRY: "I",
	CAVALRY: "C",
	LEADER: "L",
	SUPPLY: "S",
	ARTILLERY: "A",
	getType:function getType(name) {
		let returnValue = null;
		for(let i in this) {
			if (this[i] == name) {
				returnValue = this[i];
				break;
			}
		}
		
		return returnValue;
	}
}

var WeaponType = {
	NONE: "X",
	getType:function getType(name) {
		let returnValue = null;
		for(let i in this) {
			if (this[i] == name) {
				returnValue = this[i];
				break;
			}
		}
		
		return returnValue;
	}
}

var MoraleType = {
	GOOD: "G",
	DISRUPTED: "D",
	ROUTED: "R",
	getType:function getType(name) {
		let returnValue = null;
		for(let i in this) {
			if (this[i] == name) {
				returnValue = this[i];
				break;
			}
		}
		
		return returnValue;
	}	
}

var Topic = {
	CURRENT_HEX : "currentHex",
	GAME_MODE : "gameMode",
	STATUS_MESSAGE : "statusMessage",
	SELECTED_COUNTERS : "selectedCounters",
	TIME: "time"
}

var CommandMode = {
		NONE:"None",
		DIRECT_FIRE:"Direct Fire"
}

var GameMode = {
	PLAN:"Plan Mode",
	REPLAY:"Replay Mode"
}

export default {};
export {HexType,Formation,GameMode,CommandMode,Topic,MoraleType,WeaponType,CounterType,TaskType,HexSideType};