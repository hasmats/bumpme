const jsonName = 'fakePackage-cli';
const { promisify } = require('util');
const { strip } = require('colors');
const spawn = require('child_process').spawn;
const syncExec = require('child_process').exec;
const exec = promisify(syncExec);
const { resetJson, removeJson, getVersionFromJson, getPathFromName } = require('./helpers/packageHelper');

describe('cli', () => {
	beforeEach(() => resetJson(jsonName));

	afterEach(async () => await removeJson(jsonName));

	it('should run without errors', async () => {
		await expect(
			exec(`node ${__dirname}/../cli.js --force-patch --package ${getPathFromName(jsonName)}`)
		).resolves.toEqual(expect.any(Object));
	});
	
	it('should force update package (patch)', async () => {
		await exec(`node ${__dirname}/../cli.js --force-patch --package ${getPathFromName(jsonName)}`);
		
		expect(getVersionFromJson(jsonName)).toEqual('1.0.1');
	});
	
	it('should force update package (minor)', async () => {
		await exec(`node ${__dirname}/../cli.js --force-minor --package ${getPathFromName(jsonName)}`);
		
		expect(getVersionFromJson(jsonName)).toEqual('1.1.0');
	});
	
	it('should force update package (major)', async () => {
		await exec(`node ${__dirname}/../cli.js --force-major --package ${getPathFromName(jsonName)}`);
		
		expect(getVersionFromJson(jsonName)).toEqual('2.0.0');
	});
	
	// it('should render options', async () => {		
	// 	const spy = jest.spyOn(console, 'log');
	// 	// jest.spyOn(process, 'exit').mockImplementationOnce(() => {
	// 	// 	throw new Error('process.exit() was called.');
	// 	// });
		
	// 	expect(() => {
	// 		require('../cli');
	// 	}).not.toThrow();
	// 	expect(spy.mock.calls.map(v => strip(v[0]))).toEqual(['Bump version', 'Current version is: 1.1.0']);
	// 	expect(spy).toHaveBeenCalledTimes(2);
	// });
});