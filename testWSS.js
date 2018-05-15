const { BLETarget, WSServer } = require('./configs');
const WSClient = require('./src').WSClient;

class Batman {
  constructor(configs) {
    this.configs = configs;

    this.connectToWSS();
  }

  onCharacteristicReceive(characteristic) {
    this.bleService = characteristic;
    this.connectToWSS();
  }

  readSensorData(cb) {
    setTimeout(() => {
      cb({ 
        date: new Date(),
        type: 'text',
        data: { temperature: '28.0*C', humidity: '20.0%' },
        rssi: -79 
      });
    }, 200);
  }

  handleWSSMsg(message) {
    switch (message.type) {
      case 'request':
        if (message.data === 'get_dht_sensor_data') {
          this.readSensorData((data) => {
            console.log(data);
            this.wssConnection.sendMsg({
              type: 'response',
              data: data
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
