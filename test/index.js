const assert = require('assert');
const fs = require('fs');
const bumpme = require('../index');
const path = __dirname+'/fakePackage.json';

const resetJson = version => {
	const package = {
		version: version || '1.0.0'
	};

	fs.writeFileSync(path, JSON.stringify(package));
};

const getVersion = () => {
	const package = fs.readFileSync(path).toString();
	return JSON.parse(package).version;
};


describe('Bumpme', () => {
	describe('test the testcode', () => {
		it('should reset version to 1.0.0', () => {
			resetJson();
			assert.equal(getVersion(), '1.0.0');
		});
		it('should reset version to 1.1.1', () => {
			resetJson('1.1.1');
			assert.equal(getVersion(), '1.1.1');
		});
	});
	describe('#patch()', () => {
		it('should bump to 1.0.1', done => {
			resetJson();
			bumpme.patch(e => {
				assert.equal(!!e, false);
				assert.equal(getVersion(), '1.0.1');
				done();
			}, path);
		});
		it('should bump to 1.0.11', done => {
			resetJson('1.0.10');
			bumpme.patch(e => {
				assert.equal(!!e, false);
				assert.equal(getVersion(), '1.0.11');
				done();
			}, path);
		});
	});
	describe('#minor()', () => {
		it('should bump to 1.1.0', done => {
			resetJson();
			bumpme.minor(e => {
				assert.equal(!!e, false);
				assert.equal(getVersion(), '1.1.0');
				done();
			}, path);
		});
		it('should bump to 1.1.0', done => {
			resetJson('1.0.10');
			bumpme.minor(e => {
				assert.equal(!!e, false);
				assert.equal(getVersion(), '1.1.0');
				done();
			}, path);
		});
	});
	describe('#major()', () => {
		it('should bump to 2.0.0', done => {
			resetJson();
			bumpme.major(e => {
				assert.equal(!!e, false);
				assert.equal(getVersion(), '2.0.0');
				done();
			}, path);
		});
		it('should bump to 3.0.0', done => {
			resetJson('2.13.14');
			bumpme.major(e => {
				assert.equal(!!e, false);
				assert.equal(getVersion(), '3.0.0');
				done();
			}, path);
		});
		describe('provide broken path', () => {
			it('should not find package', done => {
				resetJson();
				bumpme.major(e => {
					assert.equal(e, 'MISSING_PACKAGE');
					done();
				}, {path: 'uwillneverfindme.json'});
			});
		});
	});
	after(function() {
		if(fs.existsSync(path)) {
			fs.unlinkSync(path);
		}
	});
});