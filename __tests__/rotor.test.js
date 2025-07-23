import Rotor from '../src/classes/Rotor.js'

describe('Rotor Test', () => {
  let rotor;

  beforeEach(() => {
    rotor = new Rotor('I', 'A', 'A')
  })

  test('should initialize with correct properties', () => {
    expect(rotor.name).toBe('I');
    expect(rotor.wiring).toBe('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
    expect(rotor.notch).toBe(16); // 'Q' is the 16th letter (0-indexed)
    expect(rotor.ring).toBe(0); // 'A' is the 0th letter (0-indexed)
    expect(rotor.position).toBe(0); // 'A' is the 0th letter (0-indexed)
  });
})
