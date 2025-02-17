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
  * @param {boolean} isReverse
  * @returns {string}
  */
  process(char, isReverse = false) {
    let p = utils.convert(char);
    let pos = this.position;
    let ring = this.ringSetting;
    let w = this.wiring;

    let entrypoint = !isReverse ? utils.convert(w[(p + pos - ring + 26) % 26]) :
      w.indexOf(utils.convert((p + pos - ring + 26) % 26));
    return utils.convert((entrypoint - pos + ring + 26) % 26);
  }
}
