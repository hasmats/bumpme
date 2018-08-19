#!/usr/bin/env node

const helper = require('./src/helper');
const readline = require('readline');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const path = require('path');
const charm = require('charm')(process.stdout);
const rl = readline.createInterface(process.stdin, process.stdout);
const forces = ['--force-patch','--force-minor','--force-major'];
const availableOptions = [
	'major',
	'minor',
	'patch'
];

const options = {
	force: false,
	selected: 0,
	path: path.resolve(process.cwd(),'package.json')
};

if(process.argv.length > 2) {
	const argsArr = process.argv.slice(2);
	argsArr.forEach((op, i) => parseOption(op, argsArr[i+1]));
}

let selected = 0;
let stage = 0;

const version = helper.fixVersion(helper.getCurrentVersion(options.path));

function print(m) {
	// eslint-disable-next-line no-console
	console.log(m);
}

function parseOption(o, nextO) {
	if(forces.indexOf(o) !== -1) {
		const splt = o.split('-');
		options.force = splt[splt.length-1];
	} else if(o === '--package' || o === '-p') {
		options.path = path.resolve(process.cwd(), nextO);
	}
}

function getSelectedIndicator(i) {
	return (i === selected ? '[x] ' : '[ ] ').green;
}

function clearOptions() {
	charm.erase('line');
	availableOptions.forEach(() => {
		charm.up(1);
		charm.erase('line');
	});
}

function renderOptions() {
	// let msg = '';
	availableOptions.forEach((opt,i) => {
		// msg += opt+'\n';
		charm.write(getSelectedIndicator(i)+opt.white + ' => ' + helper.getBumpedVersion(version, opt).grey + '\r\n');
	});
}

function bumpVersion(version) {
	helper.bump(version, e => {
		if(e) {
			throw new Error(e);
		}
		print('package.json saved!'.green);
		process.exit(0);
	}, options.path);
}

process.stdin.on('keypress', (s, key) => {
	if(stage === 0) {
		if(key.name === 'up' && selected !== 0) {
			selected--;
		} else if(key.name === 'down' && selected !== availableOptions.length-1) {
			selected++;
		} else {
			return;
		}

		clearOptions();
		renderOptions();
	} else {
		if(key.name === 'y') {
			print('\n');
			bumpVersion(availableOptions[selected]);
		} else if(key.name === 'n') {
			print('\nAborted!');
			process.exit(0);
		}
	}
});

rl.on('line', () => {
	// Only listen in first stage
	if(stage === 0) {
		charm.write('Bump version from '.grey+version.white+' to '.grey+ helper.getBumpedVersion(version, availableOptions[selected]).green + '\n');
		charm.write('Bump version? (y/n):');
		stage++;
	}
}).on('close', () => {
	// only gets triggered by ^C or ^D
	rl.close();
	print('exiting'.red);
	process.exit(0);
});

process.on('uncaughtException', function(e) {
	if(typeof e === 'object' && e.message === 'MISSING_PACKAGE') {
		print('package.json was not found! Aborting'.red);
	} else {
		print(e);
	}
	process.exit(1);
});

charm.cursor(true);

// Render options
print('Bump version'.grey);
print('Current version is: '.grey + version.white);

if(options.force) {
	print('Forcing '.grey + options.force.white);
	bumpVersion(options.force);
} else {
	renderOptions();
}