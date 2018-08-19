const jsonName = 'fakePackage-helper';
const { resetJson, resetInvalidJson, removeJson, getPathFromName } = require('./helpers/packageHelper');

describe('src/helper.js', () => {
	beforeEach(() => resetJson(jsonName));

	afterEach(async () => await removeJson(jsonName));

	describe('.getCurrentVersion()', () => {
		it('should return 1.0.0', () => {
			const { fixVersion } = require('../src/helper');
			expect(fixVersion('1.0.0')).toEqual('1.0.0');
		});
	});
	describe('.getCurrentVersion()', () => {
		it('should return 1.0.0', () => {
			const { getCurrentVersion } = require('../src/helper');
			expect(getCurrentVersion(getPathFromName(jsonName))).toEqual('1.0.0');
		});
		it('should throw if missing path', () => {
			const { getCurrentVersion } = require('../src/helper');
			expect(() => getCurrentVersion('invalidPath')).toThrow(Error('MISSING_PACKAGE'));
		});

		it('should throw if invalid json', () => {
			resetInvalidJson(jsonName);
			const { getCurrentVersion } = require('../src/helper');
			expect(() => getCurrentVersion(getPathFromName(jsonName))).toThrow(Error('INVALID_PACKAGE'));
		});
	});
});