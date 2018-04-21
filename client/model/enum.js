var wego = wego || {};

wego.HexType = {
	CLEAR:{code:" ",name:"Clear"},
	TOWN:{code:"t",name:"Town"},
	FOREST:{code:"f",name:"Forest"},
	SWAMP:{code:"w",name:"Swamp"},
	WATER:{code:"a",name:"Water"},
	getType:function getType(code) {
		var returnValue = null;	
		for(var i in this) {
			if (this[i].code == code) {
				returnValue = this[i];
				break;
			}
		}
		
		return returnValue;
	}
}

wego.Formation = {
	COLUMN:"C",
	LINE:"L",
	NONE:"N",
	getType:function getType(name) {
		var returnValue = null;
		for(var i in this) {
			if (this[i] == name) {
				returnValue = this[i];
				break;
			}
		}
		
		return returnValue;
	}
}

wego.HexSideType = {
	CLEAR:{type:"Clear",code:" ",mask:0},
	SLOPE:{type:"Slope",code:"s",mask:2},
	FOREST:{type:"Forest",code:"f",mask:4},
	TOWN:{type:"Town",code:"t",mask:8},
	ROAD:{type:"Road",code:"r",mask:16},
	GULLY:{type:"Gully",code:"g",mask:32},
	getType:function getType(code) {
		var returnValue = null;
		for(var i in this) {
			if (this[i].code == code) {
				returnValue = this[i];
				break;
			}
		}
		
		return returnValue;
	}
}

wego.TaskType = {
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
		var returnValue = null;
		for(var i in this) {
			if (this[i] == name) {
				returnValue = this[i];
				break;
			}
		}
		
		return returnValue;
	}
}

wego.CounterType = {
	INFANTRY: "I",
	CAVALRY: "C",
	LEADER: "L",
	SUPPLY: "S",
	ARTILLERY: "A",
	getType:function getType(name) {
		var returnValue = null;
		for(var i in this) {
			if (this[i] == name) {
				returnValue = this[i];
				break;
			}
		}
		
		return returnValue;
	}
}

wego.WeaponType = {
	NONE: "X",
	getType:function getType(name) {
		var returnValue = null;
		for(var i in this) {
			if (this[i] == name) {
				returnValue = this[i];
				break;
			}
		}
		
		return returnValue;
	}
}

wego.MoraleType = {
	GOOD: "G",
	DISRUPTED: "D",
	ROUTED: "R",
	getType:function getType(name) {
		var returnValue = null;
		for(var i in this) {
			if (this[i] == name) {
				returnValue = this[i];
				break;
			}
		}
		
		return returnValue;
	}	
}

wego.Topic = {
	CURRENT_HEX : "currentHex",
	GAME_MODE : "gameMode",
	STATUS_MESSAGE : "statusMessage",
	SELECTED_COUNTERS : "selectedCounters",
	TIME: "time"
}

wego.CommandMode = {
		NONE:"None",
		DIRECT_FIRE:"Direct Fire"
}

wego.GameMode = {
	PLAN:"Plan Mode",
	REPLAY:"Replay Mode"
}