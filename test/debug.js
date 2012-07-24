(function(require, exports, module){
	function Debug() {

	}

	Debug.prototype.log = function(w) {
		console.log(w);
	}

	module.exports = Debug;

}).apply(window, 
norjs(
'mix/norjs/test/debug@0.5'
));