import Reflector from '../src/classes/Reflector.js';

describe('Reflector Test', () => {
  let reflector;

  beforeEach(() => {
    reflector = new Reflector();
  });

  test('should initialize with correct wiring', () => {
    expect(reflector.wiring).toBe('YRUHQSLDPXNGOKMIEBFZCWVJAT');
  });

  test('should correctly reflect input characters', () => {
    // Test a few known reflections based on the UKW-B wiring
    // A (0) -> Y (24)
    expect(reflector.process(0)).toBe(24);
    // B (1) -> R (17)
    expect(reflector.process(1)).toBe(17);
    // Z (25) -> T (19)
    expect(reflector.process(25)).toBe(19);
    // M (12) -> O (14)
    expect(reflector.process(12)).toBe(14);
  });
});
