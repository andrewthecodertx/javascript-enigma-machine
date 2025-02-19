import PlugBoard from '../src/PlugBoard.js';

describe('PlugBoard Test', () => {
  let plugboard;

  beforeEach(() => {
    plugboard = new PlugBoard(['AB', 'CD']);
  });

  test('should process connected letters', () => {
    expect(plugboard.process('A')).toBe('B');
    expect(plugboard.process('B')).toBe('A');
    expect(plugboard.process('C')).toBe('D');
    expect(plugboard.process('D')).toBe('C');
  });

  test('should return the same letter if not connected', () => {
    expect(plugboard.process('E')).toBe('E');
    expect(plugboard.process('F')).toBe('F');
  });

  test('should throw error if more than 10 plugs connected', () => {
    expect(() => {
      plugboard = new PlugBoard(['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP', 'QR', 'ST', 'UV'])
        .toThrow('The plug board can only handle up to 10 plug pairs.');
    });
  });
});
