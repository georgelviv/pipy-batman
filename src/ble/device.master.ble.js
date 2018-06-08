const BLEMasterCharacteristic = require('./characteristic.master.ble');

class BLEDevice {
  constructor(device) {
    this.device = device;
    this.services;
    this.rssi;
    this.isConnected = false;
    this.address = device.address;
  }

  getAddress() {
    return this.device._noble.address;
  }

  connect(cb = () => {}) {
    this._log('connecting');
    this._checkStatus();
    if (this.isConnected) {
      this.disconect(() => {
        this.connect(cb);
      });
      return;
    }

    this.device.connect((err) => {
      if (err) throw err;
      this.isConnected = true;
      this._log('connected');

      this.discoverAllServicesAndCharacteristics((data) => {
        cb(this, data);
      });
    });
  }

  disconect(cb = () => {}) {
    if (this.isConnected) {
      this.isConnected = false;
      this.device.disconnect((err) => {
        if (err) throw err;
        cb(this);
      });
    }
  }

  updateRssi(cb = () => {}) {
    this.device.updateRssi((err, rssi) => {
      if (err) throw err;
      this.rssi = rssi;
      cb(rssi);
    });
  }

  discoverAllServicesAndCharacteristics(cb = () => {}) {
    if (this.services && this.characteristics) {
      cb({ services: this.services, characteristics: this.characteristics });
    }

    this._log('looking for service and characteristics');

    this.device.discoverAllServicesAndCharacteristics((err, services, characteristics) => {
      if (err) throw err;

      this._log('services and characteristics founded');

      this.services = services;
      this.characteristics = characteristics.map(characteristic => {
        return new BLEMasterCharacteristic({
          characteristic, device: this
        });
      });
      cb({ services: this.services, characteristics: this.characteristics });
    })
  }

  discoverServices(cb = () => {}) {
    if (this.services) {
      cb(this.services);
      return;
    }
    this.device.discoverServices(null, (err, services) => {
      if (err) throw err;
      this.services = services;
      cb(services);
    });
  }

  findCharacteristic(characteristicUUID, cb = () => {}) {
    this.discoverAllServicesAndCharacteristics(() => {
      const characteristic = this.characteristics.find(({ uuid }) => characteristicUUID === uuid);
      cb(characteristic);
    });
  }

  _checkStatus() {
    this.isConnected = this.device.state === 'connected';
  }

  _log(msg) {
    console.log(`BLE ${ this.address }: ${ msg }`)
  }
}



module.exports = {
  BLEDevice: BLEDevice
};