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
   * @param {string} char
   * @param {boolean} isReverse
   * @returns {string}
   */
  process(char, isReverse = false) {
    let p = utils.convert(char);
    let pos = this.position;
    let ring = this.ring;
    let w = this.wiring;

    let entrypoint = !isReverse ? utils.convert(w[(p + pos - ring + 26) % 26]) :
      w.indexOf(utils.convert((p + pos - ring + 26) % 26));
    return utils.convert((entrypoint - pos + ring + 26) % 26);
  }
}
