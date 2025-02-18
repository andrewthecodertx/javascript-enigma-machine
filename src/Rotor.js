import utils from './utils.js';

export default class Rotor {
  /**
   * @param {string[]} rotor
   * @param {string} ring
   * @param {string} position
   * @returns {Rotor}
   */
  constructor(rotor, ring, position) {
    this.wiring = rotor[0];
    this.notch = utils.convert(rotor[1]);
    this.ring = utils.convert(ring) % 26;
    this.position = utils.convert(position) % 26;
  }

  /**
   * @returns {void}
   */
  step() {
    this.position = (this.position + 1) % 26;
  }

  /**
   * @returns {boolean}
   */
  isAtNotch() {
    return this.position === this.notch;
  }

  /**
   * @param {string} input
   * @param {boolean} isReverse
   * @returns {string}
   */
  process(input, isReverse = false) {
    let i = utils.convert(input); // input - converted to position
    let p = this.position; // position of the rotor
    let r = this.ring; // ring setting of the rotor
    let w = this.wiring; // rotor wiring

    // adjust inmput based on ring setting
    let forwardEncrypt = utils.convert(w[(i + p - r + 26) % 26]);

    // find the position of the input in the wiring
    let reverseEncrypt = w.indexOf(utils.convert((i + p - r + 26) % 26));

    let entrypoint = !isReverse ? forwardEncrypt : reverseEncrypt;

    let output = utils.convert((entrypoint - p + r + 26) % 26);

    return output;
  }
}
