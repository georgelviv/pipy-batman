const { BLETarget, WSServer } = require('./configs');
const initBLE = require('./src').BLE.initBLE;
const WSClient = require('./src').WSClient;

class Batman {
  constructor(configs) {
    this.configs = configs;

    this.connectToBLE();
  }

  onCharacteristicReceive(characteristic) {
    this.bleService = characteristic;
    this.connectToWSS();
  }

  readSensorData(cb) {
    characteristic.read((msg) => {
      cb(msg);
    });
  }

  handleWSSMsg(msg) {
    console.log('message received', msg);
    switch (message.type) {
      case 'request':
        if (message.data === 'get_dht_sensor_data') {
          this.readSensorData((data) => {
            connection.sendMsg({
              type: 'response',
              data: data
            })
          })
        }
    }
  }

  onWSConnection(connection) {
    this.wssConnection = connection;

    connection.onMsg(message => this.handleWSSMsg);
  }

  connectToBLE() {
    initBLE({
      config: this.configs.BLETarget,
      onCharacteristicReceive: this.onCharacteristicReceive.bind(this)
    });
  }

  connectToWSS() {
    const { WSServer } = this.configs;

    const wsClient = new WSClient({
      port: WSServer.port,
      serverLink: WSServer.ip,
      onConnection: this.onWSConnection.bind(this)
    });
  }
}

new Batman({
  WSServer, BLETarget
});