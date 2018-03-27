# bumpme
cli for bumping package.json versions. Useful for build and deploy scripts. Also includes module for programmatic implementations.

## Installation
```
npm install -g bumpme
```
Or:
```
npm install --save-dev bumpme
```

## Usage
Simply type `bumpme` from the root folder of your project

Or:

Let's say you have a npm script called `shipit` and you want to bump the version of the package.json just before you run it:

`"shipit": "sendtobuildserver --argument1"`

Just save bumpme as a dev-dependecy to your project and add it to the script:

`"shipit": "bumpme && sendtobuildserver --argument1"`

Now you will be asked major,minor or patch before `sendtobuildserver` is runned.

## Programmatic usage
The available methods are `major`, `minor` and `patch`.
```javascript
const bumpme = require('bumpme');
bumpme.patch(e => {
    console.log('Version was bumped as patch!');
});
```
