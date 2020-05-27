var Dispatcher = (function() {
    function dispatch(action) {
        amplify.publish("DISPATCHER",action);
    }

    function register(callback) {
		amplify.subscribe("DISPATCHER",function(data) {
            callback(data);
        });
    }

    return {
        dispatch : dispatch,
        register : register
    }
})();
 
export default {};
export {Dispatcher};