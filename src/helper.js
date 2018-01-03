const fs = require('fs');
const path = require('path');

exports.errors = {
	MISSING_PACKAGE: {
		name: 'MISSING_PACKAGE',
		description: 'Error loading package.json'
	},
	INVALID_PACKAGE: {
		name: 'INVALID_PACKAGE',
		description: 'Error parsing package.json'
	}
};

const runCallback = (cb, e) => {
	if(!cb || typeof cb !== 'function') {
		return;
	}
	cb(e);
};

exports.getBumpedVersion = (current, type) => {
	const split = current.split('.');

	switch(type) {
		case 'major':
			split[0]++;
			split[1] = 0;
			split[2] = 0;
			break;
		case 'minor':
			split[1]++;
			split[2] = 0;
			break;
		case 'patch':
			split[2]++;
			break;
	}
	return split.join('.');
};

exports.getCurrentVersion = packagePath => {
	if(!fs.existsSync(packagePath)) {
		throw new Error(exports.errors.MISSING_PACKAGE.name);
	}

	try {
		const package = fs.readFileSync(packagePath).toString();
		return JSON.parse(package).version;
	} catch(e) {
		throw new Error(exports.errors.INVALID_PACKAGE.name);
	}
}

// TODO: 1.0 => 1.0.0 - add 0 until 3 happy numbers
exports.fixVersion = v => {
	return v;
};

// TODO: add promise support
exports.bump = (type, callback, packagePath) => {
	const options = {
		type: type,
		path: packagePath ? packagePath : path.resolve(process.cwd(),'package.json')
	};

	let package;
	try {
		package = require(options.path);
	} catch(e) {
		return runCallback(callback, exports.errors.MISSING_PACKAGE.name);
	}

	const version = exports.getCurrentVersion(options.path);
	package.version = exports.getBumpedVersion(version, options.type);

	fs.writeFile(options.path, JSON.stringify(package, null, 4), e => {
		runCallback(callback, e);
	});
};