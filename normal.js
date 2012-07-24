/**
* @fileOverview import js normally!
* @author zhuxun
* @version 0.1
*/

/**@type {Function} norjs function in global scope*/
var norjs;

(function(w, undefined) {
		/**@type {string} namespace seperater*/
	var NS_SEP = '/',
		/**@type {string} id seperater*/
		ID_SEP = '@',
		/**@type {RegExp} split for namespace and id*/
		SEP_REGEXP = new RegExp('[' + NS_SEP + ID_SEP + ']'),
		_scope = {}
		;

	function defineNS(ns, name, value) {
		return ns[name] || (ns[name] = value || {});
	}

	function findNS(ns, path, ifdefine) {
		if (typeof path == 'string') path = path.split(SEP_REGEXP);

		path.forEach(function(name) {
			if (!ns[name] && ifdefine === false) {
				throw new Error(path.join('/') + ' has not defined');
			} else {
				ns = defineNS(ns, name);
			}
		});

		return ns;
	}

	function required(dependencies) {
		var depslist = {};

		if (dependencies && dependencies.length) {
			dependencies.forEach(function(id) {
				var module = findNS(_scope, id, false)
					;
				if (module) {
					depslist[module.id] = module.exports;
				}
			});
		}

		return function(id) {
			var exports;

			if (id.indexOf('@') < 0) id += '@';

			for (var _id in depslist) {
				if (_id.lastIndexOf(id) >=0) {
					exports = depslist[_id];
					break;
				}
			};
			
			if (exports) {
				return exports;
			} else {
				throw new Error('no dependence for ' + id);
			}
		}
	}

	/**
	 * return [require, exports, module]
	 * @param {string} id
	 * @param {Array=} dependencies
	 * @return {Array}
	 */
	norjs = function (id, dependencies) {
		var require,
			module,
			exports
			;

		// resolve dependencies
		require = required(dependencies);

		// find module scope
		module = findNS(_scope, id);

		// check if defined
		if (module.exports) {
			throw new Error(id + ' has already defined');
		} else {
			module.id = id;
			exports = module.exports = {};
		}

		return [require, exports, module];
	}
})(window);