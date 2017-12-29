#!/usr/bin/env node

const bump = require('./index');
const helper = require('./src/helper');
const readline = require('readline');
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
	process.argv.slice(2).forEach(parseOption)
}

let selected = 0;
let stage = 0;

const version = helper.fixVersion(helper.getCurrentVersion(options.path));

function parseOption(o) {
	if(o === '--force' || o === '-f') {
		force = true;
	} else if(forces.indexOf(o) !== -1) {
		const splt = o.split('-');
		options.force = splt[splt.length-1];
		// TODO: get it!
	// } else if(o === '--package' || o === '-p') {
		// options.path = 
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
			console.log('\n');
			bump({}, e => {
				if(e) {
					throw new Error(e);
				}
				console.log('package.json saved!'.green);
				process.exit(0);
			});
		} else if(key.name === 'n') {
			console.log('\nAborted!');
			process.exit(0);
		}
	}
});

rl.on('line', (cmd) => {
	// Only listen in first stage
	if(stage === 0) {
		charm.write('Bump version from '.grey+version.white+' to '.grey+ helper.getBumpedVersion(version, availableOptions[selected]).green + '\n');
		charm.write('Bump version? (y/n):');
		stage++;
	}
}).on('close', () => {
	// only gets triggered by ^C or ^D
	rl.close();
	console.log('exiting'.red);
	process.exit(0);
});

process.on('uncaughtException', function(e) {
	if(typeof e === 'object' && e.message === 'MISSING_PACKAGE') {
		console.log('package.json was not found! Aborting'.red);
	} else {
		console.log(e);
	}
	process.exit(1);
});

charm.cursor(true);

// Render options
console.log('Bump version'.grey);
console.log('Current version is: '.grey + version.white);
renderOptions();
