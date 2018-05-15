const noble = require('noble');
const BLEDevice = require('./device.master.ble').BLEDevice;
const EventEmitter = require('events');
const onExit = require('./../helpers').onExit;

const BLE_MODULE_STATE = {
  poweredOn: 'poweredOn'
};

const BLE_MODULE_EVENTS = {
  stateChange: 'stateChange',
  discovered: 'discovered'
};

class BLEModule {
  constructor() {
    this.devices = [];
    this.isScanning = false;
    this.currentState = '';
    this.ee = new EventEmitter();

    this.preserveContenxt([
      'onStateChange', 'onDiscover', 'onDeviceConnect', 'handleWarnings', 'onExit'
    ]);

    noble.on('stateChange', this.onStateChange);
    noble.on('discover', this.onDiscover);
    noble.on('warning', this.handleWarnings);
    onExit(this.onExit);
  }

  onExit() {
    this.devices.forEach(device => {
      device.disconect(() => {
        this.log(`disconeected from ${ device.address }`);
      })
    });
    this.stopScanning();
  }

  findDeviceCharacteristic({deviceAddress, characteristicUUID}, cb = () => {}) {
    const device = this.devices.find(({ address }) => deviceAddress);

    this.log(`device ${ deviceAddress } looking for character with next uuid`);
    this.log(characteristicUUID);
    device.findCharacteristic(characteristicUUID, (characteristic) => {
      this.log(`device ${ deviceAddress } founded character with next uuid`);
      this.log(characteristicUUID);
      cb(characteristic);
    });
  }

  handleWarnings(msg) {
    this.log(`warning: ${ msg }`);
  }

  preserveContenxt(methods = []) {
    methods.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    })
  }

  onDiscover(device) {
    const bleDevice = new BLEDevice(device);
    this.log(`founded device with address: ${ bleDevice.address }`);
    this.devices.push(bleDevice);
    this.ee.emit(BLE_MODULE_EVENTS.discovered, bleDevice);
  }

  onStateChange(state) {
    this.currentState = state;
    this.log(`state changed to: ${ state }`);
    this.ee.emit(BLE_MODULE_EVENTS.stateChange, state);

    if (this.isScanning && this.currentState !== BLE_MODULE_STATE.poweredOn) {
      this.stopScanning();
    }
  }

  connectToDevice(address, callback) {
    const lookingDevice = this.getDeviceByAddress(address);
    if (lookingDevice) {
      lookingDevice.connect(this.onDeviceConnect.bind(this, callback));
      return;
    }
    let cb = (device) => {
      if (device.address === address) {
        this.ee.removeListener(BLE_MODULE_EVENTS.discovered, cb);
        this.stopScanning();
        device.connect(this.onDeviceConnect.bind(this, callback));
      }
    }

    this.scan();
    this.ee.on(BLE_MODULE_EVENTS.discovered, cb);
  }

  onDeviceConnect(callback = () => {}, device) {
    const deviceAddr = device.address;
    this.log(`connected to ${ deviceAddr }`);
    device.updateRssi(rssi => {
      this.log(`device ${ deviceAddr } rssi: ${ rssi }`);
    });

    // this.log(`looking for deivce ${ deviceAddr } services`);
    // device.discoverAllServicesAndCharacteristics(({ services, characteristics }) => {
    //   this.log(`founded for device ${ deviceAddr } next services`);
    //   this.log(services);
    //   this.log(`founded for device ${ deviceAddr } next characteristics`);
    //   this.log(characteristics);
    // });

    callback(device.address);
  }

  getDeviceByAddress (address) {
    return this.devices.find(device => device.address === address);
  }

  log(msg) {
    console.log(`BLE: ${ msg }`);
  }

  startScanning() {
    if (this.isScanning) return; 
    noble.startScanning();
    this.isScanning = true;
    this.log('scanning stated');
  }

  scan() {
    const cb = (state) => {
      if (this.currentState == BLE_MODULE_STATE.poweredOn) {
        this.ee.removeListener(BLE_MODULE_EVENTS.stateChange, cb);
        this.startScanning();
      };
    };

    if (this.currentState === BLE_MODULE_STATE.poweredOn) {
      this.startScanning();
    } else {
      this.ee.on(BLE_MODULE_EVENTS.stateChange, cb)
    }
  }

  stopScanning() {
    if (!this.isScanning) return;
    this.isScanning = false;
    noble.stopScanning();
    this.log('scanning stoped');
  }

  
}


module.exports = {
  BLEModule: BLEModule
};