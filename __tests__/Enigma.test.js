import { PlugBoard } from '../src/PlugBoard.js';
import { Rotor } from '../src/Rotor.js';
import { Reflector } from '../src/Reflector.js';
import { utils } from '../src/utils.js';

describe('Enigma Machine Tests', () => {
  describe('PlugBoard', () => {
    let plugBoard;

    beforeEach(() => {
      plugBoard = new PlugBoard();
    });

    test('should correctly swap connected letters', () => {
      plugBoard.setPlugs(['AB', 'CD', 'EF']);
      expect(plugBoard.process('A')).toBe('B');
      expect(plugBoard.process('B')).toBe('A');
      expect(plugBoard.process('C')).toBe('D');
      expect(plugBoard.process('D')).toBe('C');
    });

    test('should return same letter if not connected', () => {
      plugBoard.setPlugs(['AB', 'CD']);
      expect(plugBoard.process('X')).toBe('X');
      expect(plugBoard.process('Y')).toBe('Y');
    });

    test('should throw error if more than 10 plug pairs', () => {
      expect(() => {
        plugBoard.setPlugs(['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP', 'QR', 'ST', 'UV']);
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

  describe('Full Encryption Chain', () => {
    let plugBoard, rightRotor, middleRotor, leftRotor, reflector;

    beforeEach(() => {
      plugBoard = new PlugBoard();
      rightRotor = new Rotor(['EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'Q']); // I
      middleRotor = new Rotor(['AJDKSIRUXBLHWTMCQGZNPYFVOE', 'E']); // II
      leftRotor = new Rotor(['BDFHJLCPRTXVZNYEIWGAKMUSQO', 'V']); // III
      reflector = new Reflector();
    });

    test('should handle double-stepping mechanism correctly', () => {
      // Set middle rotor to position before notch
      middleRotor.setPosition('E'); // E is notch
      rightRotor.setPosition('Q'); // Q is notch
      leftRotor.setPosition('A');

      // Step and verify double-stepping
      if (rightRotor.isAtNotch()) {
        if (middleRotor.isAtNotch()) {
          leftRotor.step();
        }
        middleRotor.step();
      }
      rightRotor.step();

      // After this step:
      // - Right rotor should have stepped from Q to R
      // - Middle rotor should have stepped from E to F
      // - Left rotor should have stepped from A to B
      expect(utils.convert(rightRotor.position)).toBe('R');
      expect(utils.convert(middleRotor.position)).toBe('F');
      expect(utils.convert(leftRotor.position)).toBe('B');

      // Next step should trigger the double-step
      rightRotor.step();
      if (rightRotor.isAtNotch()) {
        if (middleRotor.isAtNotch()) {
          leftRotor.step();
        }
        middleRotor.step();
      }

      // After double-step:
      // - Right rotor should be at S
      // - Middle rotor should be at F
      // - Left rotor should have stepped to B
      expect(utils.convert(rightRotor.position)).toBe('S');
      expect(utils.convert(middleRotor.position)).toBe('F');
      expect(utils.convert(leftRotor.position)).toBe('B');
    });

    test('should encrypt and decrypt symmetrically', () => {
      plugBoard.setPlugs(['AB', 'CD']);
      rightRotor.setPosition('A');
      middleRotor.setPosition('B');
      leftRotor.setPosition('C');

      const input = 'HELLOWORLD';
      let encrypted = '';
      let decrypted = '';

      // Encrypt
      for (const char of input) {
        if (rightRotor.isAtNotch()) {
          if (middleRotor.isAtNotch()) {
            leftRotor.step();
          }
          middleRotor.step();
        }
        rightRotor.step();

        let tmp = plugBoard.process(char);
        tmp = rightRotor.process(tmp);
        tmp = middleRotor.process(tmp);
        tmp = leftRotor.process(tmp);
        tmp = reflector.process(tmp);
        tmp = leftRotor.process(tmp, true);
        tmp = middleRotor.process(tmp, true);
        tmp = rightRotor.process(tmp, true);
        tmp = plugBoard.process(tmp);
        encrypted += tmp;
      }

      // Reset positions for decryption
      rightRotor.setPosition('A');
      middleRotor.setPosition('B');
      leftRotor.setPosition('C');

      // Decrypt
      for (const char of encrypted) {
        if (rightRotor.isAtNotch()) {
          if (middleRotor.isAtNotch()) {
            leftRotor.step();
          }
          middleRotor.step();
        }
        rightRotor.step();

        let tmp = plugBoard.process(char);
        tmp = rightRotor.process(tmp);
        tmp = middleRotor.process(tmp);
        tmp = leftRotor.process(tmp);
        tmp = reflector.process(tmp);
        tmp = leftRotor.process(tmp, true);
        tmp = middleRotor.process(tmp, true);
        tmp = rightRotor.process(tmp, true);
        tmp = plugBoard.process(tmp);
        decrypted += tmp;
      }

      expect(decrypted).toBe(input);
    });
  });
});
