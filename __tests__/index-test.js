const bumpme = require('../index');
const jsonName = 'fakePackage-index';
const { resetJson, removeJson, getPathFromName, getVersionFromJson } = require('./helpers/packageHelper');

describe('Bumpme', () => {
	beforeEach(() => resetJson(jsonName));

	afterEach(async () => await removeJson(jsonName));

	describe('.patch()', () => {
		it('should bump to 1.0.1', () => {
			bumpme.patch(e => {
				expect(!!e).toEqual(false);
				expect(getVersionFromJson(jsonName)).toEqual('1.0.1');
			}, getPathFromName(jsonName));
		});

		it('should bump to 1.0.11', () => {
			resetJson(jsonName, '1.0.10');
			bumpme.patch(e => {
				expect(!!e).toEqual(false);
				expect(getVersionFromJson(jsonName)).toEqual('1.0.11');
			}, getPathFromName(jsonName));
		});

		it('should work with no callback', () => {
			resetJson(jsonName, '1.0.10');
			bumpme.patch(null, getPathFromName(jsonName));
		});

		it('should work with no callback (string)', () => {
			resetJson(jsonName, '1.0.10');
			bumpme.patch('no fn', getPathFromName(jsonName));
		});
	});

	describe('.minor()', () => {
		it('should bump to 1.1.0', () => {
			bumpme.minor(e => {
				expect(!!e).toEqual(false);
				expect(getVersionFromJson(jsonName)).toEqual('1.1.0');
			}, getPathFromName(jsonName));
		});

		it('should bump to 1.1.0', () => {
			resetJson(jsonName, '1.0.10');
			bumpme.minor(e => {
				expect(!!e).toEqual(false);
				expect(getVersionFromJson(jsonName)).toEqual('1.1.0');
			}, getPathFromName(jsonName));
		});
	});

	describe('.major()', () => {
		it('should bump to 2.0.0', () => {
			bumpme.major(e => {
				expect(!!e).toEqual(false);
				expect(getVersionFromJson(jsonName)).toEqual('2.0.0');
			}, getPathFromName(jsonName));
		});

		it('should bump to 3.0.0', () => {
			resetJson(jsonName, '2.13.14');
			bumpme.major(e => {
				expect(!!e).toEqual(false);
				expect(getVersionFromJson(jsonName)).toEqual('3.0.0');
			}, getPathFromName(jsonName));
		});

		it('should not find package', () => {
			bumpme.major(e => {
				expect(e).toEqual('MISSING_PACKAGE');
			}, {path: 'uwillneverfindme.json'});
		});
	});
});