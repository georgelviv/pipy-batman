const WSClient = require('./src').WSClient;
const wsClient = new WSClient({
  port: WSServer.port,
  serverLink: WSServer.ip,
  onConnection: onWSConnection
});

function onWSConnection(connection) {
  connection.onMsg(message => {
    switch (message.type) {
      case 'request':
        if (message.data === 'get_dht_sensor_data') {
          readSensorData((data) => {
            connection.sendMsg({
              type: 'response',
              data: data
            })
          })
        }
    }
  });
}

function readSensorData(cb) {
  setTimeout(() => {
    cb({ data: '120px' });
  }, 1000);
}