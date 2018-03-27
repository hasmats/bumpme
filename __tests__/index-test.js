const fs = require('fs');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');
const bumpme = require('../index');
const jsonPath = path.resolve(__dirname,'../.tmp/fakePackage.json');

const resetJson = version => {
	const packageJson = {
		version: version || '1.0.0'
	};

	fs.writeFileSync(jsonPath, JSON.stringify(packageJson));
};

const getVersion = () => {
	const packageJson = fs.readFileSync(jsonPath).toString();
	return JSON.parse(packageJson).version;
};


describe('Bumpme', () => {
	beforeEach(() => resetJson());

	afterEach(async () => {
		if(fs.existsSync(jsonPath)) {
			await exec(`rm -rf ${jsonPath}`);
		}
	});

	describe('test the testcode', () => {
		it('should reset version to 1.0.0', () => {
			expect(getVersion()).toEqual('1.0.0');
		});

		it('should reset version to 1.1.1', () => {
			resetJson('1.1.1');
			expect(getVersion()).toEqual('1.1.1');
		});
	});

	describe('.patch()', () => {
		it('should bump to 1.0.1', () => {
			bumpme.patch(e => {
				expect(!!e).toEqual(false);
				expect(getVersion()).toEqual('1.0.1');
			}, jsonPath);
		});

		it('should bump to 1.0.11', () => {
			resetJson('1.0.10');
			bumpme.patch(e => {
				expect(!!e).toEqual(false);
				expect(getVersion()).toEqual('1.0.11');
			}, jsonPath);
		});

		it('should work with no callback', () => {
			resetJson('1.0.10');
			bumpme.patch(null, jsonPath);
		});

		it('should work with no callback (string)', () => {
			resetJson('1.0.10');
			bumpme.patch('no fn', jsonPath);
		});
	});

	describe('.minor()', () => {
		it('should bump to 1.1.0', () => {
			bumpme.minor(e => {
				expect(!!e).toEqual(false);
				expect(getVersion()).toEqual('1.1.0');
			}, jsonPath);
		});

		it('should bump to 1.1.0', () => {
			resetJson('1.0.10');
			bumpme.minor(e => {
				expect(!!e).toEqual(false);
				expect(getVersion()).toEqual('1.1.0');
			}, jsonPath);
		});
	});

	describe('.major()', () => {
		it('should bump to 2.0.0', () => {
			bumpme.major(e => {
				expect(!!e).toEqual(false);
				expect(getVersion()).toEqual('2.0.0');
			}, jsonPath);
		});

		it('should bump to 3.0.0', () => {
			resetJson('2.13.14');
			bumpme.major(e => {
				expect(!!e).toEqual(false);
				expect(getVersion()).toEqual('3.0.0');
			}, jsonPath);
		});

		it('should not find package', () => {
			bumpme.major(e => {
				expect(e).toEqual('MISSING_PACKAGE');
			}, {path: 'uwillneverfindme.json'});
		});
	});
});