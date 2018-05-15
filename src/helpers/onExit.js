const eventsOnExit = [
  'exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException'
];

function exitHandler(eventName, cb, err) {
  if (err) console.error(err);
  cb();
  if (eventName !== 'exit') {
    process.exit();
  }
}

const onExixt = (cb) => {
  eventsOnExit.forEach(eventName => {
    process.on(eventName, exitHandler.bind(null, eventName, cb));
  });
};

module.exports = onExixt;