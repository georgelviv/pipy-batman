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

    this._preserveContenxt([
      'onStateChange', 'onDiscover', 'handleWarnings', 'onExit'
    ]);

    noble.on('stateChange', this._onStateChange);
    noble.on('discover', this._onDiscover);
    noble.on('warning', this._handleWarnings);

    onExit(this._onExit);

    this._sayGreetings();
  }

  findDevice(lookingAddress, callback) {
    this._log(`looking for next uuid: ${ lookingAddress }`);

    const lookingDevice = this._getDeviceByAddress(lookingAddress);
    if (lookingDevice) return lookingDevice;
      
    let cb = (device) => {
      if (device.address !== lookingAddress) return;
      this._stopScanning();
      this.ee.removeListener(BLE_MODULE_EVENTS.discovered, cb);
      callback(device);
    }

    this.ee.on(BLE_MODULE_EVENTS.discovered, cb);
    this._scan();
  }

  _sayGreetings() {
    this.address = noble.address;
    if (this.address !=='unknown') {
      this._log(`Hello!, my address is: ${ noble.address }`);
    }
  }

  _onExit() {
    this.devices.forEach(device => {
      device.disconect(() => {
        this._log(`disconeected from ${ device.address }`);
      })
    });
    this._stopScanning();
  }

  _handleWarnings(msg) {
    this._log(`warning: ${ msg }`);
  }

  _preserveContenxt(methods = []) {
    methods.forEach(methodName => {
      this[`_${methodName}`] = this[`_${methodName}`].bind(this);
    })
  }

  _onDiscover(device) {
    const bleDevice = new BLEDevice(device);
    this._log(`founded device with next address: ${ device.address }`);
    this.devices.push(bleDevice);
    this.ee.emit(BLE_MODULE_EVENTS.discovered, bleDevice);
  }

  _onStateChange(state) {
    this.currentState = state;
    this._log(`state changed to: ${ state }`);
    this.ee.emit(BLE_MODULE_EVENTS.stateChange, state);

    if (this.isScanning && this.currentState !== BLE_MODULE_STATE.poweredOn) {
      this._stopScanning();
    }
  }

  _getDeviceByAddress(address) {
    return this.devices.find(device => device.address === address);
  }

  _log(msg) {
    console.log(`BLE: ${ msg }`);
  }

  _startScanning() {
    if (this.isScanning) return; 
    noble.startScanning();
    this.isScanning = true;
    this._log('scanning started');
  }

  _scan() {
    const cb = (state) => {
      if (this.currentState == BLE_MODULE_STATE.poweredOn) {
        this.ee.removeListener(BLE_MODULE_EVENTS.stateChange, cb);
        this._startScanning();
      };
    };

    if (this.currentState === BLE_MODULE_STATE.poweredOn) {
      this._startScanning();
    } else {
      this.ee.on(BLE_MODULE_EVENTS.stateChange, cb)
    }
  }

  _stopScanning() {
    if (!this.isScanning) return;
    this.isScanning = false;
    noble.stopScanning();
    this._log('scanning stoped');
  }

  
}


module.exports = {
  BLEModule: BLEModule
};