const WebsocketClient = require('websocket').client;
const WSConnection = require('./connection');

class WSClient {

  static get defaultSettings() {
    return { 
      port: 8080,
      serverLink: 'localhost',
      reconnectTimeout: 5000,
      onConnection: () => {}
    }
  }

  constructor(settings) {
    this.setSettings(settings);
    this.client = this.initClient();
  }

  setSettings(settings) {
    this.settings = Object.assign({}, WSClient.defaultSettings, settings);
  }

  connectToWS(client) {
    client.connect(`ws://${ this.settings.serverLink }:${ this.settings.port }/`, 'echo-protocol');
  }

  initClient() {
    const client = new WebsocketClient();

    client.on('connectFailed', (err) => {
      this.log(`connectFailed: ${ err }`);
      this.reconnect(client);
    });

    client.on('connect', (connection) => {
      this.connection = new WSConnection(connection);
      this.log('connected');

      this.settings.onConnection(this.connection);

      this.connection.onConnectionClose(this.reconnect.bind(this, client));
    });

    this.connectToWS(client);

    return client;
  }

  reconnect(client) {
    this.log(`will try reconnect in ${ this.settings.reconnectTimeout } ms`);
    setTimeout(() => {
      this.log(`trying to reconnect`);
      this.connectToWS(client);
    }, this.settings.reconnectTimeout);
  }

  log(msg) {
    console.log(`wss client: ${ msg }`)
  }
}

module.exports = WSClient;