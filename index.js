let { BLETarget, WSServer } = require('./configs');
const Batman = require('./src').Batman;
const argv = require('minimist')(process.argv.slice(2));

let safeLevel = 0;
if (argv.safe)  safeLevel = Number(argv.safe);
if (argv.wsip) WSServer.ip = argv.wsip;

console.log(`Running with safe level: ${ safeLevel }`);

new Batman({
  WSServer, BLETarget, safeLevel
});