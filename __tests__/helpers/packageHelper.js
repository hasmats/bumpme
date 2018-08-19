const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const jsonPath = path.resolve(__dirname,'../.tmp/');

exports.getPathFromName = name => jsonPath+'/'+name+'.json';

exports.resetJson = (name, version) => {
	const packageJson = {
		version: version || '1.0.0'
	};

	fs.writeFileSync(exports.getPathFromName(name), JSON.stringify(packageJson));
};

exports.resetInvalidJson = name => {
	fs.writeFileSync(exports.getPathFromName(name), '{version:"1.2.3}');
};

exports.removeJson = async name => {
	if(fs.existsSync(exports.getPathFromName(name))) {
		await exec(`rm -rf ${exports.getPathFromName(name)}`);
	}
};

exports.getVersionFromJson = name => {
	const packageJson = fs.readFileSync(exports.getPathFromName(name)).toString();
	return JSON.parse(packageJson).version;
};