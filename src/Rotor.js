import { utils } from './utils.js';

export class Rotor {
  /**
   * @param {string[]} rotor
   * @returns {Rotor}
   */
  constructor(rotor) {
    this.wiring = rotor[0];
    this.notch = utils.convert(rotor[1]);
    this.position = 0;
    this.ringSetting = 0;
  }

  /**
   * @param {string} position
   * @returns {void}
   */
  setPosition(position) {
    this.position = utils.convert(position) % 26;
  }

  /**
   * @param {string} ringsetting
   * @returns {void}
   */
  setRingSetting(ringsetting) {
    this.ringSetting = utils.convert(ringsetting) % 26;
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
  * @param {string} char
  * @param {boolean} reverse
  * @returns {string}
  */
  process(char, reverse = false) {
    let p = utils.convert(char); // input position
    let pos = this.position; // rotor position
    let ring = this.ringSetting; // ring setting
    let w = this.wiring; // wiring

    if (!reverse) {
      let entrypoint = utils.convert(w[(p + pos - ring + 26) % 26]);
      let output = (entrypoint - pos + ring + 26) % 26
      return utils.convert(output);
    } else {
      let shifted = (p + pos - ring + 26) % 26;
      let reverse = w.indexOf(utils.convert(shifted));
      let output = (reverse - pos + ring + 26) % 26;
      return utils.convert(output);
    }
  }
}
