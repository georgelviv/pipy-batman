const WebsocketClient = require('websocket').client;

class WsClientSimple {
  constructor({ name, port, link, isLog }) {
    this.client = new WebsocketClient();
    this.clientName = name;
    this.isConnected = false;
    this.isLog = isLog;

    
    this._handleClientEvents();
    this._connect({ port, link });
  }

  onMessage(cb) {
    if (!this.isConnected) {
      this._log('I should connecte before I can receive messages');
      return;
    }

    this.connection.on('message', (message) => {
      cb(JSON.parse(message.utf8Data))
    });
  }

  onConnection(cb) {
    this.client.on('connect', (connection) => {
      cb();
    });
  }

  sendMessage(msg) {
    if (!this.isConnected) {
      this._log('I should connecte before I can send messages');
      return;
    }

    this._log('sending message...');
    this.connection.sendUTF(JSON.stringify(msg));
  }

  _connect({ port, link }) {
    this.client.connect(`ws://${ link }:${ port }/`, 'echo-protocol');
  }

  _handleConnectionEvents() {
    if (!this.isConnected) return;

    this.connection.on('error', err => {
      this._log(`connection error: ${ err }`);
    });

    this.connection.on('close', () => {
      this._log('connection closed');
    });
  }

  _handleClientEvents() {
    this.client.on('connectFailed', (err) => {
      this.isConnected = false;
      this._log(`connectFailed: ${ err }`);
    });
  
    this.client.on('connect', (connection) => {
      this.isConnected = true;
      this.connection = connection;
      this._log('connected');
      this._handleConnectionEvents();
    });
  }

  _log(msg) {
    if (!this.isLog) return;
    console.log(`${ this.clientName }: ${ msg }`);
  }
}

module.exports = WsClientSimple;