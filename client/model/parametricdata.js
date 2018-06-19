class ParametricData {
    constructor() {
    }

    initialize(data) {
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
    }

    getFormationChangeCost(unitType) {
        return this.formationChangeCost[unitType];
    }

    getMovementAllowance(unitType, formation) {
        return this.movementAllowance[unitType + ":" + formation];
    }

    getWeaponRange(weaponType) {
        return this.weaponRange[weaponType];
    }

    getRotationCost(unitType) {
        return this.rotationCost[unitType];
    }

    getAboutFaceCost(unitType) {
        return this.aboutFaceCost[unitType];
    }

    getHexCost(unitType, formation, hexType) {
        return this.hexTypeCost[unitType + ":" + formation + ":" + hexType];
    }

    getHexSideCost(unitType, formation, hexSideType) {
        return this.hexSideTypeCost[unitType + ":" + formation + ":" + hexSideType];
    }

    getUpElevationCost(unitType, formation) {
        return this.upElevationCost[unitType + ":" + formation];
    }

    getDownElevationCost(unitType, formation) {
        return this.downElevationCost[unitType + ":" + formation];
    }

    getRearwardMovementCost() {
        return this.rearwardMovementCost;
    }
}

export default {};
export {ParametricData};