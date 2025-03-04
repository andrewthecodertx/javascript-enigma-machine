export default class PlugBoard {
  /**
   * @param {string[]} connections
   * @returns {PlugBoard}
   */
  constructor(connections) {
    this.plugConnections = connections;

    if (this.plugConnections.length > 10) {
      throw new Error('The plug board can only handle up to 10 plug pairs.');
    }

    for (let pair of this.plugConnections) {
      if (pair.length !== 2 || typeof pair !== 'string') {
        throw new Error('Each plug must be a string of exactly two letters.');
      }

      const [a, b] = pair.split('');

      if (!this.isValidLetter(a) || !this.isValidLetter(b)) {
        throw new Error('Plugs must contain only letters A-Z.');
      }

      if (a === b) {
        throw new Error('Plugs cannot be connected to themselves.');
      }

      this.plugConnections[a.toUpperCase()] = b.toUpperCase();
      this.plugConnections[b.toUpperCase()] = a.toUpperCase();
    }
  }

  /**
   * @param {string} char
   * @returns {boolean}
   */
  isValidLetter(char) {
    return /[a-zA-Z]/.test(char);
  }

  /**
   * @param {string} input
   * @returns {string}
   */
  process(input) {
    input = input.toUpperCase();

    let output = this.plugConnections[input] || input;

    return output;
  }
}
