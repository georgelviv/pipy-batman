const { BLETarget } = require('./configs');
const initBLE = require('./src').BLE.initBLE;

initBLE({
  config: BLETarget,
  onCharacteristicReceive: onCharacteristicReceive
});

function onCharacteristicReceive(characteristic) {
  characteristic.read((msg) => {
    console.log('Time passed:', Date.now() - (new Date(msg.date).getTime()));
    console.log(msg.data);
  });
}