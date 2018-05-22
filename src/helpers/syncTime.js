const execSync = require('child_process').execSync;

const syncTime = () => {
  execSync('sudo service ntp stop && sudo ntpdate -s time.nist.gov && sudo service ntp start');
};

module.exports = syncTime;
