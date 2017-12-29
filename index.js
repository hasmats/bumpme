const helper = require('./src/helper');
const fs = require('fs');
const path = require('path');

module.exports = (options, callback) => {
	if(!callback || typeof callback !== 'function') {
		callback = () => {};
	}

	options = Object.assign({
		type: 'patch',
		path: path.resolve(process.cwd(),'package.json')
	}, options||{});

	let package = require(options.path);

	const version = helper.getCurrentVersion(options.path);
	package.version = helper.getBumpedVersion(version, options.type);

	fs.writeFile(options.path, JSON.stringify(package, null, 4), e => {
		if(e) {
			return callback('WRITE_ERROR');
		}
		callback();
	});
};