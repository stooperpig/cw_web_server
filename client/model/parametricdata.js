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
};