const initBLE = require('./ble').initBLE;
const WSClient = require('./ws');

const getTimeDiff = require('./helpers').getTimeDiff;

class Batman {
  constructor(configs) {
    this.configs = configs;
    this.isIOTMocked = false

    switch (this.configs.safeLevel) {
      case 2:
        this.isIOTMocked = true;
        this._emulateBLE();
        break;
      case 1:
        this.isIOTMocked = true;
        this.connectToWSS();
        break;
      default:
        this.connectToBLE();
    }
  }

  onCharacteristicReceive(characteristic) {
    this.bleService = characteristic;
    this.connectToWSS();
  }

  readSensorData(cb) {
    if (this.isIOTMocked) {
      cb(this._getMockData());
    } else {
      this.bleService.read(cb);
    }
  }

  handleWSSMsg(message) {
    switch (message.type) {
      case 'request':
        if (message.data === 'get_dht_sensor_data') {
          const timeBeforeSensorRead = new Date();
          this.readSensorData((data) => {
            data.bluetoothLatency = getTimeDiff(timeBeforeSensorRead);
            this.wssConnection.sendMsg({
              to: message.from,
              from: 'batman',
              type: 'response',
              data: data,
              messageTime: message.date
            })
          });
        }
    }
  }

  onWSConnection(connection) {
    this.wssConnection = connection;

    connection.onMsg(message => {
      this.handleWSSMsg(message)
    });

    connection.sendMsg({
      type: 'meta',
      name: 'batman'
    });
  }

  connectToBLE() {
    initBLE({
      config: this.configs.BLETarget,
      onCharacteristicReceive: this.onCharacteristicReceive.bind(this)
    });
  }

  connectToWSS() {
    const { WSServer } = this.configs;

    console.log(`connecting to wss ${ WSServer.ip }:${WSServer.port}`);

    const wsClient = new WSClient({
      port: WSServer.port,
      serverLink: WSServer.ip,
      onConnection: this.onWSConnection.bind(this),
      reconnectTimeout: WSServer.reconnectTimeout
    });
  }

  _emulateBLE() {
    console.log(`BLE: state changed to: poweredOn`);
    console.log(`BLE: looking for next uuid: b8:27:eb:bb:4d:e5`);
    setTimeout(() => {
      console.log(`BLE: scanning started`);
    }, 500);
    setTimeout(() => {
      console.log(`BLE: founded device with next address: 41:32:39:b0:af:f3`)
    }, 1500);
    setTimeout(() => {
      console.log(`BLE: founded device with next address: b8:27:eb:bb:4d:e5`);
    }, 3000);
    setTimeout(() => {
      console.log(`BLE: scanning stoped`);
      console.log(`BLE b8:27:eb:bb:4d:e5: connecting`);
    }, 3200);
    setTimeout(() => {
      console.log(`BLE b8:27:eb:bb:4d:e5: connected`);
      console.log(`BLE b8:27:eb:bb:4d:e5: looking for service and characteristics`);
    }, 4000);
    setTimeout(() => {
      console.log(`BLE b8:27:eb:bb:4d:e5: services and characteristics founded`);
      this.connectToWSS();
    }, 4500);
  }

  _getMockData() {
    return { 
      type: 'text',
      data:
        { 
          temperature: '29.0*C',
          humidity: '19.0%',
          sensorReadLatancy: 1777 
        },
      rssi: -33 
    };
  }
}

module.exports = Batman;