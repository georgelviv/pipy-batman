const { BLETarget, WSServer } = require('./configs');
const Batman = require('./src').Batman;

let safeLevel = 0;

const argv = process.argv[2];
const level = process.argv[3];

if (argv === '--safe' && level) {
  safeLevel = Number(level);
}

console.log(`Running with safe level: ${ safeLevel }`);

new Batman({
  WSServer, BLETarget, safeLevel
});