#!/usr/bin/env node
// -*- js -*-

global.sys = require(/^v0\.[012]/.test(process.version) ? "sys" : "util");

var NS_SEP = '/',
	ID_SEP = '@',
	fs = require("fs"), 
	path = require("path"),
	mu = require("./mustache"),

	VERSION = '0.3.1'
	;

function build(dirname, options, packTmpl, pkgObj) {
	var // main file to build
	mainFile, mainJS,

	// parse in package.json
	id,	deps, deplist
	;

	function trim(text) {
		return text.replace(/^\s/g, '').replace(/\s$/g, '');
	}

	function build(mainJS, packTmpl, pkgObj, deplist) {
		var annotate_l = mainJS.indexOf('/**'),
			annotate_u = mainJS.indexOf('*/'),
			annotate, code
			;

			if (annotate_l != 0) {
				annotate = [
					'/**',
					' * @fileOverview ' + pkgObj.name,
					' * @author ' + pkgObj.author,
					' * @version ' + pkgObj.version,
					deplist.length ? ' * @requires ' + deplist.join(', ') : undefined,
					' */'
				].join('\n');
				code = mainJS;
			} else {
				annotate = trim(mainJS.substring(annotate_l, annotate_u + 2));
				code = trim(mainJS.substring(annotate_u + 2));
			}

		return mu.to_html(packTmpl, {
			'annotate' : annotate,
			'code' : code,
			'id' : id,
			'dependencies' : deplist.join("', '")
		});
	}

	function output(buildedJS, mainFile, pkgObj) {
	    var buildfile = path.join(
				dirname, 
				options.build_path, 
				path.basename(mainFile, '.js') + 
				(options.version_postfix ? ('-v' + pkgObj.version) : '') + 
				(options.build_postfix ? ( options.cmd_mode ? '-cmd' : '-normal') : '') + 
				'.js'
			),

		    out = fs.createWriteStream(buildfile, {
		            flags: "w",
		            encoding: "utf8",
		            mode: 0644
		    })
		    ;

	    out.write(buildedJS);
	    out.end();
	    sys.print(new Date().toTimeString().match(/\d{1,2}\:\d{1,2}\:\d{1,2}/g)[0] + 
	    			' - [build] success to "' + 
	    			buildfile + '"\n');
	}

	// load main file
	mainFile = path.join(dirname, pkgObj.main);
	mainJS = fs.readFileSync(mainFile, 'utf8');

	// infos in package.json
	id = pkgObj.namespace + NS_SEP + pkgObj.name + ID_SEP + pkgObj.version;
	deps = pkgObj.dependencies || {};
	deplist = [];

	for (var name in deps) {
		deplist.push(name + ID_SEP + deps[name]);
	}

	var buildedJS = build(mainJS, packTmpl, pkgObj, deplist);
	output(buildedJS, mainFile, pkgObj);
}

function parseArgv(argv) {
	var options = {
			build_path : './build',
			package_file : './package.json',
			version_postfix : false,
			build_postfix : false,
			cmd_mode : false
		},

		dirname = undefined
		;

	while (argv.length > 0) {
		var v = argv.shift();

		switch(v) {
			case '-b':
			case '--build-path':
				options.build_path = argv.shift();
				break;
			case '-p':
			case '--package-file':
				options.package_file =  argv.shift();
				break;
			case '--version-postfix':
				options.version_postfix = true;
				break;
			case '--build-postfix':
				options.build_postfix = true;
				break;
			case '--cmd-mode':
				options.cmd_mode = true;
				break;
			case '-v':
			case '--version':
				sys.print('version ' + VERSION);
				process.exit(0);
			default:
				dirname = v;
				break;
		}
	}

	return [dirname, options];
}

function main(dirname, options) {

	var // package.json
		pkgFile, pkgObj,

		// template for pack
		packFile, packTmpl
		;

	// parse package.json
	pkgFile = path.join(dirname, options.package_file);
	pkgObj = global.eval('([' + fs.readFileSync(pkgFile).toString() + '])');

	// load xxx.pack template
	packFile = path.join(__dirname, options.cmd_mode ? 'cmd.pack' : 'normal.pack');
	packTmpl = fs.readFileSync(packFile).toString();

	pkgObj.forEach(function(obj) {
		process.nextTick(function() {
			build(dirname, options, packTmpl, obj);
		});
	});
}

if (require.main === module) {
	var args = parseArgv(process.argv.slice(2));

	main(args[0], args[1]);
} else {
	module.exports = {
		main : main,
		parse : parseArgv,
		build : build,
	}
}