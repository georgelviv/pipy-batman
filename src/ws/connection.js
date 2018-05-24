class WSSConnection {
  constructor(connection) {
    this.connection = connection;

    this.onConnectionCloseCb = () => {};
  
    this.connection.on('error', err => {
      console.log(`connection error: ${ err }`);
      this.onConnectionCloseCb();
    });

    this.connection.on('close', () => {
      console.log('connection closed');
      this.onConnectionCloseCb();
    });
  }

  onMsg(cb) {
    this.connection.on('message', (message) => {
      cb(JSON.parse(message.utf8Data))
    });
  }

  onConnectionClose(cb) {
    this.onConnectionCloseCb = cb;
  }

  sendMsg(msg) {
    this.connection.sendUTF(JSON.stringify(msg));
  }
};

module.exports =  WSSConnection;