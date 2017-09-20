var wego = wego || {};

wego.CounterType = function(nationality,counterName,attackFactor,rangeFactor,defenseFactor,movementFactor,weaponClass,unitCategory,unitSubcategory) {
	this.mNationality = nationality;
	this.mCounterName = counterName;
	this.mImage;
	this.mImageSrc;
	this.mMovementFactor = movementFactor;
	this.mRangeFactor = rangeFactor;
	this.mDefenseFactor = defenseFactor;
	this.mAttackFactor = attackFactor;
	this.mWeaponClass = weaponClass;
	this.mUnitCategory = unitCategory;
	this.mUnitSubcategory = unitSubcategory;
}

wego.CounterType.prototype = {
	getCounterName:function() {
		return this.mCounterName;
	},
	
	getWeaponClass:function() {
		return this.mWeaponClass;
	},
	
	getNationality:function() {
		return this.mNationality;
	},
	
	getImage:function() {
		if (this.mImage == null) {
		    var cacheValue = wego.ImageCache[this.mCounterName];
		    if (cacheValue != null) {
			    this.mImage = wego.ImageCache[this.mCounterName].image;
			}
		}
		return this.mImage;
	},
	
	getImageSrc:function() {
		if (this.mImageSrc == null) {
			this.mImageSrc = wego.ImageCache[this.mCounterName].src;
		}
		return this.mImageSrc;
	},
	
	getMovementFactor:function() {
		return this.mMovementFactor;
	},
	
	getRangeFactor:function() {
		return this.mRangeFactor;
	},
	
	getAttackFactor:function() {
		return this.mAttackFactor();
	},
	
	getDefenseFactor:function() {
		return this.mDefenseFactor();
	},
	
	getUnitCategory:function() {
		return this.mUnitCategory;
	},
	
	getUnitSubcategory:function() {
		return this.mUnitSubcategory;
	}
}