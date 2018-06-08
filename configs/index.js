module.exports = {
  BLETarget: {
    name: 'raspberry-pi-mario',
    address: 'b8:27:eb:bb:4d:e5',
    characteristicUUID: '2de9f101bdb01a111da5510efc2043de',
    serviceUUID: '07851bd7601037d692ed295f09016585',
    serviceName: 'mushroom'
  },
  WSServer: {
    port: '8080',
    ip: '169.254.51.1',
    reconnectTimeout: 5000
  }
};