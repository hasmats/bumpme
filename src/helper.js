const fs = require('fs');

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

exports.getCurrentVersion = (packagePath) => {
	if(!fs.existsSync(packagePath)) {
		throw new Error('MISSING_PACKAGE');
	}

	const package = require(packagePath);

	return package.version;
}

// TODO: 1.0 => 1.0.0 - add 0 until 3 happy numbers
exports.fixVersion = (v) => {
	return v;
};