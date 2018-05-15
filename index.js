const { BLETarget } = require('./configs');
// const WSClient = require('batman').WSClient;
// const wsClient = new WSClient({
//   port: deadpoolPi.port,
//   serverLink: deadpoolPi.ip,
//   onConnection: onWSConnection
// });

// function onWSConnection(connection) {
//   connection.on('message', (message) => {
//     console.log(message);
//   });

//   setTimeout(() => {
//     connection.sendUTF('Hello my dear');
//   }, 500);
// }


const initBLE = require('./src').initBLE;

initBLE({
  config: BLETarget,
  onCharacteristicReceive: onCharacteristicReceive
});

function onCharacteristicReceive(characteristic) {
  characteristic.read((msg) => {
    console.log('Time passed:', Date.now() - (new Date(msg.date).getTime()));

    console.log(msg.data);
  });
}