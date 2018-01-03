const helper = require('./src/helper');

exports.patch = (callback, path) => {
	helper.bump('patch', callback, path);
};

exports.minor = (callback, path) => {
	helper.bump('minor', callback, path);
};

exports.major = (callback, path) => {
	helper.bump('major', callback, path);
};