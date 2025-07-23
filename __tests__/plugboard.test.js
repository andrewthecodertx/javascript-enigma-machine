import PlugBoard from '../src/classes/PlugBoard.js'
import utils from '../src/utils.js'

describe('PlugBoard Test', () => {
  let plugboard;

  beforeEach(() => {
    plugboard = new PlugBoard(['AB', 'CD']);
  });

  test('should switch connected letters', () => {
    expect(plugboard.process(utils.convert('A'))).toBe(utils.convert('B'));
    expect(plugboard.process(utils.convert('B'))).toBe(utils.convert('A'));
    expect(plugboard.process(utils.convert('C'))).toBe(utils.convert('D'));
    expect(plugboard.process(utils.convert('D'))).toBe(utils.convert('C'));
  });

  test('should return the same letter if not connected', () => {
    expect(plugboard.process(utils.convert('E'))).toBe(utils.convert('E'));
  });
});
