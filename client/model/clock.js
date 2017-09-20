var wego = wego || {};

wego.Clock = (function() {
	var mTime;
	var mIsSync = false;
	var mMaxTime = 30;
	
	function decrement() {
		setTime(mTime - 1);
	}
	
	function getMaxTime() {
		return mMaxTime;
	}
	
	function getTime() {
		return mTime;
	}
	
	function hasExpired() {
		return mTime == mMaxTime;
	}
	
	function increment() {
		setTime(mTime + 1);
	}
	
	function seekEnd() {
		setTime(mMaxTime);
	}
	
	function seekFirst() {
		setTime(0);
	}
	
	function setTime(value) {
		if (value <= mMaxTime && value >= 0) {
			mTime = value;
			
			$("#currentTimeDiv").html(mTime);
			console.log("setting time to: " + mTime);
		}
	}
		
	return {
		decrement: decrement,
		getMaxTime: getMaxTime,
		getTime: getTime,
		hasExpired: hasExpired,
		increment: increment,
		seekEnd: seekEnd,
		seekFirst: seekFirst,
		setTime: setTime
	}
})();