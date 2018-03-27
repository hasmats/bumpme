const fs = require('fs');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');
const bumpme = require('../index');
const jsonPath = path.resolve(__dirname,'../.tmp/fakePackage-helper.json');

const resetJson = version => {
	const packageJson = {
		version: version || '1.0.0'
	};

	fs.writeFileSync(jsonPath, JSON.stringify(packageJson));
};

const resetInvalidJson = () => {
	fs.writeFileSync(jsonPath, '{version:"1.2.3}');
};

describe('src/helper.js', () => {
	beforeEach(() => resetJson());

	afterEach(async () => {
		if(fs.existsSync(jsonPath)) {
			await exec(`rm -rf ${jsonPath}`);
		}
	});

	describe('.getCurrentVersion()', () => {
		it('should return 1.0.0', () => {
			const { fixVersion } = require('../src/helper');
			expect(fixVersion('1.0.0')).toEqual('1.0.0');
		});
	});
	describe('.getCurrentVersion()', () => {
		it('should return 1.0.0', () => {
			const { getCurrentVersion } = require('../src/helper');
			expect(getCurrentVersion(jsonPath)).toEqual('1.0.0');
		});
		it('should throw if missing path', () => {
			const { getCurrentVersion } = require('../src/helper');
			expect(() => getCurrentVersion('jsonPath')).toThrow(Error('MISSING_PACKAGE'));
		});

		it('should throw if invalid json', () => {
			resetInvalidJson();
			const { getCurrentVersion } = require('../src/helper');
			expect(() => getCurrentVersion(jsonPath)).toThrow(Error('INVALID_PACKAGE'));
		});
	});
});