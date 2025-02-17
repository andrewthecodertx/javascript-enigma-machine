import utils from './utils.js';

// historical UKW-B reflector
// this was the most common reflector used in the enigma machines
export default class Reflector {
  /**
   * @returns {Reflector}
   */
  constructor() {
    this.wiring = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';
  }

  /**
   * @param {string} char
   * @returns {number}
   */
  process(char) {
    const position = utils.convert(char)

    return this.wiring[position];
  }
}
