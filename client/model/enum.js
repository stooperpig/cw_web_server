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

wego.SecondaryHexType = {
	CLEAR:{code:" ",name:"Clear"},
	GULLY:{code:"g",name:"Gully"},
	FORD:{code:"d",name:"Ford"},
	SLOPE:{code:"s",name:"Slope"},
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

wego.NationalityType = {
	NEUTRAL:{name:"Neutral",stackingLimit:10},
	RUSSIAN:{name:"Russian",stackingLimit:3},
	GERMAN:{name:"German",stackingLimit:2},
	getType:function getType(name) {
		var returnValue = null;	
		for(var i in this) {
			if (this[i].name == name) {
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
	LOAD:"Ld",
	UNLOAD:"Ul",
	DIRECT_FIRE:"Df",
	INDIRECT_FIRE:"If",
	OPPORTUNITY_FIRE:"Of",
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
	SELECTED_COUNTERS : "selectedCounters"
}

wego.CommandMode = {
		NONE:"None",
		INDIRECT_FIRE:"Indirect Fire",
		DIRECT_FIRE:"Direct Fire"
}

wego.GameMode = {
	PLAN:"Plan Mode",
	REPLAY:"Replay Mode"
}

wego.UnitCategory = {
	MINE:"Mine", FORT:"Fort", BLOCK:"block", WRECK:"Wreck",
	TOWED_GUN:"Towed Gun", INFANTRY:"Infantry", COMMAND_POST:"Command Post", 
	TRANSPORT:"Transport", ARMORED_CAR:"Armored Car", SELF_PROPELLED_GUN:"Self-propelled Gun", 
	ASSAULT_GUN: "Assault Gun", TANK_DESTORYER: "Tank Destroyer", TANK: "Tank", CAVALRY: "Cavalry",
	getType: function getType(name) {
	    var returnValue = null;
	    for (var i in this) {
	        if (this[i] == name) {
	            returnValue = this[i];
	            break;
	        }
	    }

	    return returnValue;
	}
}


wego.UnitSubcategory = {
	NONE:"None", MORTAR:"Mortar", HOWITZER:"Howitzer", LIGHT_FLAK:"Light Flak", 
	ANTI_TANK_GUN: "Anti-tank Gun", TRUCK: "Truck",
	getType: function getType(name) {
	    var returnValue = null;
	    for (var i in this) {
	        if (this[i] == name) {
	            returnValue = this[i];
	            break;
	        }
	    }

	    return returnValue;
	}
}

wego.WeaponClass = {
    INFANTRY: "I", ARMOR_PIERCING: "A", HIGH_EXPLOSIVE: "H", MORTAR: "M", CARRIER: "C", CARRIER_INFANTRY: "C(I)", NONE: "None",
    getType: function getType(name) {
        var returnValue = null;
        for (var i in this) {
            if (this[i] == name) {
                returnValue = this[i];
                break;
            }
        }

        return returnValue;
    }
}