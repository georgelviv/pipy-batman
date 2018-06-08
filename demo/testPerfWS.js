const { WSServer } = require('../configs');
const WsClientSimple = require('../src').WsClientSimple;

const nClients = 1000;
const clients = Array.from(new Array(nClients)).map((v, index) => 'client' + (index + 1));

const testClient = (clientName) => {
  return new Promise((resolve, reject) => {
    let client = new WsClientSimple({
      port: WSServer.port,
      link: WSServer.ip,
      name: clientName,
      isLog: false
    });
    
    client.onConnection(_ => {
      client.sendMessage({
        type: 'test'
      });
    
      client.onMessage(msg => {
        // console.log(`${ clientName }: ok`);
        resolve(clientName);
      });
    });
  });
};

Promise.all(clients.map(name => testClient(name)))
  .then(() => {
    console.log('Done!')
    process.exit();
  });