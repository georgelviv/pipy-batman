const Mushroom = require('./mushroomReceive');

class BLEMasterCharacteristic {
  constructor({characteristic, device}) {
    this.characteristic = characteristic;
    this.device = device;
    this.address = device.address;
    this.uuid = characteristic.uuid;
    this.value;
  }

  sendReadedData(cb) {
    this.device.updateRssi(rssi => {
      let data = this.value.getData();
      data.rssi = rssi;
      cb(data);
    });
  }

  read(cb = () => {}) {
    this._log('reading');
    this.characteristic.read((err, value) => {
      if (err) throw err;

      if (!this.value) {
        this.value = new Mushroom(value.toString('utf8'));
      } else {
        this.value.addData(value);
      }

      this._log('readed');
      
      if (this.value.hasNext()) {
        this.read(cb);
      } else {
        this.sendReadedData(cb);
      }
    });
  }

  _log(msg) {
    console.log(`BLE ${ this.address } ${ this.uuid }: ${ msg }`);
  }
}

module.exports = BLEMasterCharacteristic;