/**
* @fileOverview import js normally!
* @author zhuxun
* @version 0.2.0
*/

/**@type {Function} norjs/define function in global scope*/
var norjs;

(function(win, undefined) {
		/**@type {string} namespace seperater*/
	var NS_SEP = '/',
		/**@type {string} id seperater*/
		ID_SEP = '@',
		/**@type {RegExp} split for namespace and id*/
		/**@deprecated*/
		SEP_REGEXP = new RegExp('[' + NS_SEP + ID_SEP + ']'),
		/**@deprecated*/
		FULL_REGEXP = new RegExp('([\\w\\d-_/]+)\\/([\\w\\d-_]+)\\@([\\d.]+)'),
		_scope = {}
		;

	function defineNS(ns, name) {
		return ns[name] || (ns[name] = {});
	}

	/**
	 * @deprecated  use full id to cache
	 */
	function findNS(ns, path, ifdefine) {
		var matches = FULL_REGEXP.exec(path),
			namespace = matches[1],
			name = matches[2],
			version = matches[3]
			;

		// namespace level
		if (!(ns = defineNS(ns, namespace, ifdefine))) { 
			throw new Error('namespace "' + namespace + '" has not defined');
		}
		// module level
		if (!(ns = defineNS(ns, name, ifdefine))) { 
			throw new Error('module "' + name + '" in "' + namespace + '" has not defined');
		}
		// version for module
		if (!(ns = defineNS(ns, version, ifdefine))) { 
			throw new Error('version "' + version + '" for "' + module + '" had not existed');
		}

		if (!(ns = defineNS(ns, path, ifdefine))) {
			throw new Error(id + ' has not defined');
		}

		return ns;
	}

	function required(deps) {
		var _cache = {};

		if (deps && deps.length) {
			deps.forEach(function(id) {
				var module = _scope[id]
					;
				if (module) {
					_cache[module.id] = module.exports;
				} else {
					throw new Error(id + ' has not defined');
				}
			});
		}

		return function(id) {
			var exports;

			if (id.indexOf(ID_SEP) < 0) id += ID_SEP;

			for (var _id in _cache) {
				if (_id.lastIndexOf(id) >=0) {
					exports = _cache[_id];
					break;
				}
			};
			
			if (exports) {
				return exports;
			} else {
				throw new Error('no declared dependence for ' + id);
			}
		}
	}

	/**
	 * return [require, exports, module]
	 * @param {string} id
	 * @param {Array=} dependencies
	 * @param {Function=} factory
	 * @return {Array}
	 */
	norjs = function (id, dependencies, factory) {
		var require,
			module,
			exports,
			returned
			;

		// resolve dependencies
		require = required(dependencies);

		// find module scope
		module = defineNS(_scope, id);

		// check if defined
		if (module.exports) {
			throw new Error(id + ' has already defined');
		} else {
			module.id = id;
			exports = module.exports = {};
		}

		if (factory) {	// 兼容CMD，使用define(id, dependencies, factory)
			returned = factory(require, exports, module);
			if (returned != undefined) module.exports = returned;
		} else {
			return [require, exports, module];
		}
	}

	// 兼容CMD
	if (win['define'] == undefined) win['define'] = norjs;
})(window);