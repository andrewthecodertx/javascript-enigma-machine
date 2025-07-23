import utils from '../utils.js';
import { rotorData } from '../dataLoader.js';

export default class Rotor {
  /**
   * @param {string} name
   * @param {string} ring
   * @param {string} position
   * @returns {Rotor}
   */
  constructor(name, ring, position) {
    const rotorConfig = rotorData.find(r => r.name === name);
    if (!rotorConfig) {
      throw new Error(`Rotor with name ${name} not found.`);
    }
    this.name = name;
    this.wiring = rotorConfig.wiring;
    this.notch = utils.convert(rotorConfig.notch);
    this.ring = typeof ring === 'number' ? ring % 26 : utils.convert(ring) % 26;
    this.position = typeof position === 'number' ? position % 26 : utils.convert(position) % 26;
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
    let i = input; // input - converted to position
    let p = this.position; // position of the rotor
    let r = this.ring; // ring setting of the rotor
    let w = this.wiring; // rotor wiring

    // adjust inmput based on ring setting
    let forwardEncrypt = utils.convert(w[(i + p - r + 26) % 26]);

    // find the position of the input in the wiring
    let reverseEncrypt = w.indexOf(utils.convert((i + p - r + 26) % 26));

    let entrypoint = !isReverse ? forwardEncrypt : reverseEncrypt;

    let output = (entrypoint - p + r + 26) % 26;

    return output;
  }
}
