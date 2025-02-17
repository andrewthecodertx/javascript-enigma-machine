export class PlugBoard {
  /**
   * @returns {PlugBoard}
   */
  constructor() {
    this.plugConnections = {};
  }

  /**
   * @param {string} char
   * @returns {boolean}
   */
  isValidLetter(char) {
    return /^[A-Z]$/i.test(char);
  }

  /**
   * @param {string[]} plugs
   * @returns {void}
   */
  setPlugs(plugs) {
    if (plugs.length > 10) {
      throw new Error('The plug board can only handle up to 10 plug pairs.');
    }

    for (let pair of plugs) {
      if (pair.length !== 2 || typeof pair !== 'string') {
        throw new Error('Each plug must be a string of exactly two letters.');
      }
      const [a, b] = pair.split('');
      if (!this.isValidLetter(a) || !this.isValidLetter(b)) {
        throw new Error('Plugs must contain only letters A-Z.');
      }
      // Map both directions for symmetry
      this.plugConnections[a.toUpperCase()] = b.toUpperCase();
      this.plugConnections[b.toUpperCase()] = a.toUpperCase();
    }
  }

  /**
   * @param {string} letter
   * @returns {string}
   */
  process(letter) {
    letter = letter.toUpperCase();
    if (!this.isValidLetter(letter)) {
      throw new Error('Input must be a single letter A-Z.');
    }

    return this.plugConnections[letter] || letter;
  }
}
