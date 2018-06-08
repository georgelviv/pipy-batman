const { BLETarget } = require('../configs');
const initBLE = require('../src').BLE.initBLE;
const getTimeDiff = require('../src/helpers').getTimeDiff;

initBLE({
  config: BLETarget,
  onCharacteristicReceive: onCharacteristicReceive
});

function onCharacteristicReceive(characteristic) {
  const timeBeforeRead = new Date();
  characteristic.read((msg) => {
    console.log('Time passed:', getTimeDiff(timeBeforeRead));
    console.log(msg.data);
  });
}