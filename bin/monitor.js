#!/usr/bin/env node
// -*- js -*-

global.sys = require(/^v0\.[012]/.test(process.version) ? "sys" : "util");

var fs = require("fs"), 
	path = require("path"),
	norjs = require('./build'),

	VERSION = '0.2.0',
	INTERVAL = 500
	;

function monitor(dirname, options) {
	var pkgFile = path.join(dirname, options.package_file),
		pkgIntervalId,
		mainIntervalId = []
		;

	function monitorFile(file, callback) {
		var lastTimestamp = 0;

		return setInterval(function() {
			var stat = fs.statSync(file),
				timestamp = stat.mtime.getTime()
				;

			if (timestamp !== lastTimestamp) {
				lastTimestamp = timestamp;

				callback();
			}
		}, INTERVAL);
	}

	function monitorPkgFile() {
		pkgIntervalId = monitorFile(pkgFile, function() {
			pkgObj = global.eval('([' + fs.readFileSync(pkgFile).toString() + '])');

			monitorMainFile(pkgObj);
		});
	}


	function monitorMainFile(pkgObj) {
		mainIntervalId.forEach(function(id) {
			id && clearInterval(id);
		});

		pkgObj.forEach(function(obj) {
			var packFile = path.join(__dirname, options.cmd_mode ? 'cmd.pack' : 'normal.pack'),
				packTmpl = fs.readFileSync(packFile).toString(),

				mainFile = path.join(dirname, obj.main)
				;

			mainIntervalId.push(monitorFile(mainFile, function() {
				norjs.build(dirname, options, packTmpl, obj);
			}));
		});
	}

	monitorPkgFile();
    sys.print(new Date().toTimeString().match(/\d{1,2}\:\d{1,2}\:\d{1,2}/g)[0] + 
			' - [monitor] success to "' + 
			dirname + '"\n');
}

function recurs(dirname, packfile) {
	var dirs = fs.readdirSync(dirname),
		dirlist = [];


	dirs.forEach(function(name) {
		if (!(name in ['.', '..', '.git', '.svn'])) {
			var pathname = path.join(dirname, name),
				stat = fs.statSync(pathname)
				;

			if (stat.isDirectory()) {
				dirlist = dirlist.concat(recurs(pathname, packfile));
			} else if (stat.isFile() && name === path.basename(packfile)) {
				dirlist.push(dirname);
			}
		}
	});

	return dirlist;
}

function parse(dirname, nOptions, mOptions) {
	var recursion = mOptions.recursion,
		packfile = nOptions.package_file,
		dirlist
		;

	if (recursion) {
		dirlist = recurs(dirname, packfile);
	} else {
		dirlist = [dirname];
	}

	dirlist.forEach(function(dir) {
		monitor(dir, nOptions);
	});
}

if (require.main === module) {

	var options = {},
		dirs = [],
		argv = process.argv.slice(2)
		;

	while (argv.length > 0) {
		var v = argv.shift();
		switch(v) {
			case '-r':
			case '--recursion':
				isMonitor = false;
				options.recursion = true;
				break;
			case '-v':
			case '--version':
				isMonitor = false;
				sys.print('version ' + VERSION);
				process.exit(0);
			default:
				if (isMonitor) dirs.push(v);
				break;
		}
	}

	process.stdin.resume();
	process.stdin.setEncoding('utf8');

	process.stdin.on('data', function (argv) {
	 	var args = norjs.parse(argv.replace(/\r|\n/g, '').split(' '));

	 	parse(args[0], args[1], options);
	});
} else {
	module.exports = monitor;
}