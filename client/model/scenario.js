var wego = wego || {};

wego.Scenario = (function() {
	var mName = null;
	var mCounterTypes = null;
	var mMapData = null;
	var mOtherImages = null;
	
	function getName() {
		return mName;
	}
	
	function initialize(data) {
		mName = data.name;
		mMapData = data.mapData;
		mCounterTypes = data.counterTypes;
		mOtherImages = data.otherImages;

		wego.Map.initialize(mMapData);
		wego.CounterFactory.initialize(mCounterTypes);
	}
	
	function getCounterTypes() {
		return mCounterTypes;
	}
	
	function getImages() {
		var returnValue = new Array();
		for(var i = 0; i < mCounterTypes.length; ++i) {
		    if (mCounterTypes[i].image != null) {
			    returnValue[mCounterTypes[i].name] = mCounterTypes[i].image;
			}
		}

		var boards = mMapData.boards;
		for (var i = 0; i < boards.length; ++i) {
		    returnValue[boards[i].name] = boards[i].image;
		}

		for (var name in mOtherImages) {
		    returnValue[name] = mOtherImages[name];
		}
		
		return returnValue;
	}
	
	function getMapData() {
		return mMapData;
	}
	
	return {
		getCounterTypes: getCounterTypes,
		getImages: getImages,
		getMapData: getMapData,
		getName: getName,
		initialize: initialize
	}
})();