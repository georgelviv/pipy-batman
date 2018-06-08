const BLEModule = require('./module.master.ble').BLEModule;

const initBLE = ({ config, onCharacteristicReceive }) => {
  const bleModule = new BLEModule();
  bleModule.findDevice(config.address, onFindDevice);

  function onFindDevice(device) {
    device.connect((device, { characteristics }) => {
      let targetCharacteristic = characteristics.find(({ uuid }) => config.characteristicUUID === uuid);

      targetCharacteristic.read((data) => {
        console.log('I can read data from sensor:', data);
        onCharacteristicReceive(characteristics);
      });
      
    });
  }
};

module.exports = {
  module: require('./module.master.ble'),
  device: require('./device.master.ble'),
  initBLE: initBLE
};