var wego = wego || {};

wego.ParametricData = function() {
}

wego.ParametricData.prototype = {
    initialize:function(data) {
        this.movementAllowance = data.movementAllowance;
        this.formationChangeCost = data.formationChangeCost;
        this.weaponRange = data.weaponRange;
        this.rotationCost = data.rotationCost;
        this.aboutFaceCost = data.aboutFaceCost;
        this.hexTypeCost = data.hexTypeCost;
        this.hexSideTypeCost = data.hexSideTypeCost;
        this.upElevationCost = data.upElevationCost;
        this.rearwardMovementCost = data.rearwardMovementCost;
        this.downElevationCost = data.downElevationCost;
    },
    getFormationChangeCost:function(unitType) {
        return this.formationChangeCost[unitType];
    },
    getMovementAllowance:function(unitType, formation) {
        return this.movementAllowance[unitType + ":" + formation];
    },
    getWeaponRange:function(weaponType) {
        return this.weaponRange[weaponType];
    },
    getRotationCost:function(unitType) {
        return this.rotationCost[unitType];
    },
    getAboutFaceCost:function(unitType) {
        return this.aboutFaceCost[unitType];
    },
    getHexCost:function(unitType, formation, hexType) {
        return this.hexTypeCost[unitType + ":" + formation + ":" + hexType];
    },
    getHexSideCost:function(unitType, formation, hexSideType) {
        return this.hexSideTypeCost[unitType + ":" + formation + ":" + hexSideType];
    },
    getUpElevationCost(unitType, formation) {
        return this.upElevationCost[unitType + ":" + formation];
    },
    getDownElevationCost(unitType, formation) {
        return this.downElevationCost[unitType + ":" + formation];
    },
    getRearwardMovementCost() {
        return this.rearwardMovementCost;
    }
};