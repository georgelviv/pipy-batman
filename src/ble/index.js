const BLEModule = require('./module.master.ble').BLEModule;

const initBLE = ({ config, onCharacteristicReceive }) => {
  const bleModule = new BLEModule();
  bleModule.connectToDevice(config.address, onDeviceConnection);

  function onDeviceConnection(deviceAddress) {
    bleModule.findDeviceCharacteristic(  {
      deviceAddress: deviceAddress,
      characteristicUUID: config.characteristicUUID
    }, (characteristic) => {
      onCharacteristicReceive(characteristic);
    });
  }
};

module.exports = {
  module: require('./module.master.ble'),
  device: require('./device.master.ble'),
  initBLE: initBLE
};