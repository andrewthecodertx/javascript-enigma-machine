import PlugBoard from '../src/PlugBoard.js';

describe('PlugBoard Test', () => {
  let plugboard;

  beforeEach(() => {
    plugboard = new PlugBoard(['AB', 'CD']);
  });

  test('should switch connected letters', () => {
    expect(plugboard.process('A')).toBe('B');
    expect(plugboard.process('B')).toBe('A');
    expect(plugboard.process('C')).toBe('D');
    expect(plugboard.process('D')).toBe('C');
  });

  test('should return the same letter if not connected', () => {
    expect(plugboard.process('E')).toBe('E');
    expect(plugboard.process('F')).toBe('F');
  });
});
