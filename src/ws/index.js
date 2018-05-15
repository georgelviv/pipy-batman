const WebsocketClient = require('websocket').client;
const WSConnection = require('./connection');

class WSClient {

  static get defaultSettings() {
    return { 
      port: 8080,
      serverLink: 'localhost',
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

  initClient() {
    const client = new WebsocketClient();

    client.on('connectFailed', (err) => {
      this.log(`connectFailed: ${ err }`);
    });

    client.on('connect', (connection) => {
      this.connection = new WSConnection(connection);
      this.log('connected');

      this.settings.onConnection(this.connection);
    });

    client.connect(`ws://${ this.settings.serverLink }:${ this.settings.port }/`, 'echo-protocol');

    return client;
  }

  log(msg) {
    console.log(`wss client: ${ msg }`)
  }
}

module.exports = WSClient;