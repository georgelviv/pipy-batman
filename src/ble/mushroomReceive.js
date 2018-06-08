const Buffer = require('buffer').Buffer;
const APPROXIMATE_NETWORK_DELAY_PER_PACKAGE = 80;

class MushroomReveice {
  constructor(value) {
    this.addData(value);
  }

  hasNext() {
    return this.count > this.index + 1;
  }

  addData(value) {
    let { data, index, count } = this.parseMushroom(value);

    if (index) {
      this.data += data;
    } else {
      this.data = data;
    }

    this.index = index;
    this.count = count;

    this.logData();
  }

  getEstimatedTimeLeft() {
    return APPROXIMATE_NETWORK_DELAY_PER_PACKAGE * (this.count - this.index);
  }

  getPercentageProgress() {
    return Math.round(this.index / this.count * 100);
  }

  logData() {
    console.log('BLE Mushroom: Lefts:', this.getEstimatedTimeLeft() / 1000, ' Percentage', this.getPercentageProgress());
  }

  parseMushroom(mushroom) {
    const parsedMushroom = mushroom.toString('utf8');
    const lastSemicolon = parsedMushroom.lastIndexOf(';');
    const metadData = parsedMushroom.slice(lastSemicolon + 1).split('-');
    const data = parsedMushroom.slice(0, lastSemicolon);
    
    const count = parseInt(metadData[1]);
    const index = parseInt(metadData[0]);

    return { data, count, index };
  }

  getData() {
    if (this.hasNext()) return false;
    let data = JSON.parse(this.data);
    if (data.type === 'image') {
      data.data = Buffer.from(data.data.data);
    }
    return data;
  }
}

module.exports = MushroomReveice;