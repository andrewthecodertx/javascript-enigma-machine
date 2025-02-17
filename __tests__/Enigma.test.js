import PlugBoard from '../src/PlugBoard.js';
import Rotor from '../src/Rotor.js';
import Reflector from '../src/Reflector.js';

describe('Enigma Machine Tests', () => {
  describe('PlugBoard', () => {
    let plugBoard;

    beforeEach(() => {
      plugBoard = new PlugBoard(['AB', 'CD', 'EF']);
    });

    test('should correctly swap connected letters', () => {
      expect(plugBoard.process('A')).toBe('B');
      expect(plugBoard.process('B')).toBe('A');
      expect(plugBoard.process('C')).toBe('D');
      expect(plugBoard.process('D')).toBe('C');
    });

    test('should return same letter if not connected', () => {
      expect(plugBoard.process('X')).toBe('X');
      expect(plugBoard.process('Y')).toBe('Y');
    });

    test('should throw error if more than 10 plug pairs', () => {
      expect(() => {
        plugBoard = new PlugBoard(['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP', 'QR', 'ST', 'UV']);
      }).toThrow('The plug board can only handle up to 10 plug pairs');
    });
  });

  describe('Rotor', () => {
    let rotor;
    const ROTOR_I = ['EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'Q'];

    beforeEach(() => {
      rotor = new Rotor(ROTOR_I);
    });

    describe('Stepping Mechanism', () => {
      test('should correctly identify notch position', () => {
        rotor.setPosition('P'); // Position before notch
        expect(rotor.isAtNotch()).toBeFalsy();

        rotor.setPosition('Q'); // At notch
        expect(rotor.isAtNotch()).toBeTruthy();

        rotor.setPosition('R'); // After notch
        expect(rotor.isAtNotch()).toBeFalsy();
      });

      test('should step correctly', () => {
        rotor.setPosition('A'); // Position 0
        rotor.step();
        expect(rotor.position).toBe(1); // Should be at position 'B'

        rotor.setPosition('Z'); // Position 25
        rotor.step();
        expect(rotor.position).toBe(0); // Should wrap around to 'A'
      });
    });

    describe('Encryption', () => {
      test('should correctly encode in forward direction', () => {
        rotor.setPosition('A');
        rotor.setRingSetting('A');
        // Test with known values from historical Enigma machines
        expect(rotor.process('A')).toBe('E');
      });

      test('should correctly encode in reverse direction', () => {
        rotor.setPosition('A');
        rotor.setRingSetting('A');
        expect(rotor.process('E', true)).toBe('A');
      });

      test('should respect ring settings', () => {
        rotor.setPosition('A');
        rotor.setRingSetting('B');
        const resultWithRingSetting = rotor.process('A');

        rotor.setRingSetting('A');
        const resultWithoutRingSetting = rotor.process('A');

        expect(resultWithRingSetting).not.toBe(resultWithoutRingSetting);
      });
    });
  });

  describe('Reflector', () => {
    let reflector;

    beforeEach(() => {
      reflector = new Reflector();
    });

    test('should reflect letters symmetrically', () => {
      const input1 = 'A';
      const output1 = reflector.process(input1);
      const input2 = output1;
      const output2 = reflector.process(input2);

      expect(output2).toBe(input1);
    });

    test('should never reflect a letter to itself', () => {
      for (let i = 0; i < 26; i++) {
        const input = String.fromCharCode(65 + i);
        expect(reflector.process(input)).not.toBe(input);
      }
    });
  });
});
