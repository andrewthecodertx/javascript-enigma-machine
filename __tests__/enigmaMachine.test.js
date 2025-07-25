import { EnigmaMachine } from '../src/classes/EnigmaMachine.js';
import PlugBoard from '../src/classes/PlugBoard.js';
import Reflector from '../src/classes/Reflector.js';
import Rotor from '../src/classes/Rotor.js';
import utils from '../src/utils.js';

// Mock rotorData to ensure consistent test environment
jest.mock('../src/dataLoader.js', () => ({
  rotorData: [
    { name: 'I', wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
    { name: 'II', wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
    { name: 'III', wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' },
    { name: 'IV', wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notch: 'J' },
    { name: 'V', wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK', notch: 'Z' },
  ],
}));

describe('EnigmaMachine', () => {
  let enigmaMachine;
  let mockPlugboard;
  let mockLeftRotor;
  let mockMiddleRotor;
  let mockRightRotor;
  let mockReflector;

  beforeEach(() => {
    // Mock individual components
    mockPlugboard = new PlugBoard([]);
    mockLeftRotor = new Rotor('I', 'A', 'A');
    mockMiddleRotor = new Rotor('II', 'A', 'A');
    mockRightRotor = new Rotor('III', 'A', 'A');
    mockReflector = new Reflector();

    // Spy on key methods to track calls and control behavior
    jest.spyOn(mockPlugboard, 'process');
    jest.spyOn(mockLeftRotor, 'process');
    jest.spyOn(mockMiddleRotor, 'process');
    jest.spyOn(mockRightRotor, 'process');
    jest.spyOn(mockReflector, 'process');
    jest.spyOn(mockRightRotor, 'step');
    jest.spyOn(mockMiddleRotor, 'step');
    jest.spyOn(mockLeftRotor, 'step');
    jest.spyOn(mockRightRotor, 'isAtNotch');
    jest.spyOn(mockMiddleRotor, 'isAtNotch');

    const settings = {
      plugboard: mockPlugboard,
      leftRotor: mockLeftRotor,
      middleRotor: mockMiddleRotor,
      rightRotor: mockRightRotor,
      reflector: mockReflector,
    };

    enigmaMachine = new EnigmaMachine(settings);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should initialize with correct components', () => {
    expect(enigmaMachine.plugboard).toBe(mockPlugboard);
    expect(enigmaMachine.leftRotor).toBe(mockLeftRotor);
    expect(enigmaMachine.middleRotor).toBe(mockMiddleRotor);
    expect(enigmaMachine.rightRotor).toBe(mockRightRotor);
    expect(enigmaMachine.reflector).toBe(mockReflector);
  });

  describe('processChar', () => {
    test('should process a single character through the Enigma path', () => {
      // Mock the process methods to return predictable values
      // This simulates a simple pass-through for demonstration
      mockPlugboard.process.mockImplementation((char) => char);
      mockLeftRotor.process.mockImplementation((char) => char);
      mockMiddleRotor.process.mockImplementation((char) => char);
      mockRightRotor.process.mockImplementation((char) => char);
      mockReflector.process.mockImplementation((char) => char);

      const inputChar = 'A';
      const expectedOutputChar = 'A'; // If all components pass through

      const output = enigmaMachine.processChar(inputChar);

      expect(output).toBe(expectedOutputChar);

      // Verify the call order and arguments for a simple pass-through
      expect(mockPlugboard.process).toHaveBeenCalledWith(utils.convert(inputChar));
      expect(mockRightRotor.process).toHaveBeenCalledTimes(2); // Forward and reverse
      expect(mockMiddleRotor.process).toHaveBeenCalledTimes(2); // Forward and reverse
      expect(mockLeftRotor.process).toHaveBeenCalledTimes(2); // Forward and reverse
      expect(mockReflector.process).toHaveBeenCalledTimes(1);
    });

    test('should correctly encrypt a character with specific component behaviors', () => {
      // Simulate a specific encryption path
      // A (0) -> Plugboard (0) -> R3 (1) -> R2 (2) -> R1 (3) -> Ref (4) -> R1_rev (5) -> R2_rev (6) -> R3_rev (7) -> Plugboard (8) -> Output (8)
      mockPlugboard.process.mockImplementationOnce((input) => input); // A (0) -> A (0)
      mockRightRotor.process.mockImplementationOnce((input) => (input + 1) % 26); // A (0) -> B (1)
      mockMiddleRotor.process.mockImplementationOnce((input) => (input + 1) % 26); // B (1) -> C (2)
      mockLeftRotor.process.mockImplementationOnce((input) => (input + 1) % 26); // C (2) -> D (3)
      mockReflector.process.mockImplementationOnce((input) => (input + 1) % 26); // D (3) -> E (4)
      mockLeftRotor.process.mockImplementationOnce((input) => (input + 1) % 26); // E (4) -> F (5)
      mockMiddleRotor.process.mockImplementationOnce((input) => (input + 1) % 26); // F (5) -> G (6)
      mockRightRotor.process.mockImplementationOnce((input) => (input + 1) % 26); // G (6) -> H (7)
      mockPlugboard.process.mockImplementationOnce((input) => (input + 1) % 26); // H (7) -> I (8)

      const inputChar = 'A'; // 0
      const expectedOutputChar = 'I'; // 8

      const output = enigmaMachine.processChar(inputChar);
      expect(output).toBe(expectedOutputChar);
    });
  });

  describe('advanceRotors', () => {
    test('should step only the right rotor if no notches are hit', () => {
      mockRightRotor.isAtNotch.mockReturnValue(false);
      mockMiddleRotor.isAtNotch.mockReturnValue(false);

      enigmaMachine.advanceRotors();

      expect(mockRightRotor.step).toHaveBeenCalledTimes(1);
      expect(mockMiddleRotor.step).not.toHaveBeenCalled();
      expect(mockLeftRotor.step).not.toHaveBeenCalled();
    });

    test('should step middle rotor if right rotor is at notch', () => {
      mockRightRotor.isAtNotch.mockReturnValue(true);
      mockMiddleRotor.isAtNotch.mockReturnValue(false);

      enigmaMachine.advanceRotors();

      expect(mockRightRotor.step).toHaveBeenCalledTimes(1);
      expect(mockMiddleRotor.step).toHaveBeenCalledTimes(1);
      expect(mockLeftRotor.step).not.toHaveBeenCalled();
    });

    test('should step left and middle rotors (double-stepping) if middle rotor is at notch', () => {
      mockRightRotor.isAtNotch.mockReturnValue(true); // Right rotor causes middle to step
      mockMiddleRotor.isAtNotch.mockReturnValue(true); // Middle rotor causes left to step

      enigmaMachine.advanceRotors();

      expect(mockRightRotor.step).toHaveBeenCalledTimes(1);
      expect(mockMiddleRotor.step).toHaveBeenCalledTimes(1);
      expect(mockLeftRotor.step).toHaveBeenCalledTimes(1);
    });

    test('should step middle rotor if right rotor is at notch, and middle rotor is NOT at notch', () => {
      mockRightRotor.isAtNotch.mockReturnValue(true);
      mockMiddleRotor.isAtNotch.mockReturnValue(false);

      enigmaMachine.advanceRotors();

      expect(mockRightRotor.step).toHaveBeenCalledTimes(1);
      expect(mockMiddleRotor.step).toHaveBeenCalledTimes(1);
      expect(mockLeftRotor.step).not.toHaveBeenCalled();
    });
  });

  describe('processMessage', () => {
    test('should process a message character by character, advancing rotors', () => {
      // Mock processChar to return a simple incremented character
      jest.spyOn(enigmaMachine, 'processChar').mockImplementation((char) => {
        const charCode = utils.convert(char);
        return utils.convert((charCode + 1) % 26);
      });
      jest.spyOn(enigmaMachine, 'advanceRotors');

      const message = 'ABC';
      const expectedOutput = 'BCD'; // A->B, B->C, C->D with simple increment

      const output = enigmaMachine.processMessage(message);

      expect(output).toBe(expectedOutput);
      expect(enigmaMachine.processChar).toHaveBeenCalledTimes(message.length);
      expect(enigmaMachine.advanceRotors).toHaveBeenCalledTimes(message.length);
    });

    test('should ignore non-alphabetic characters in the message', () => {
      jest.spyOn(enigmaMachine, 'processChar').mockImplementation((char) => char);
      jest.spyOn(enigmaMachine, 'advanceRotors');

      const message = 'A1B C!';
      const expectedOutput = 'AB C'; // Non-alphabetic characters are skipped

      const output = enigmaMachine.processMessage(message);

      expect(output).toBe(expectedOutput);
      expect(enigmaMachine.processChar).toHaveBeenCalledTimes(2); // Only for 'A' and 'B'
      expect(enigmaMachine.advanceRotors).toHaveBeenCalledTimes(2); // Only for 'A' and 'B'
    });
  });

  describe('getSettings', () => {
    test('should return current settings of the machine', () => {
      const settings = enigmaMachine.getSettings();

      expect(settings.plugboard).toEqual(mockPlugboard.connections);
      expect(settings.rotors).toHaveLength(3);

      expect(settings.rotors[0]).toEqual({
        name: mockLeftRotor.name,
        ring: mockLeftRotor.ring,
        position: mockLeftRotor.position,
      });
      expect(settings.rotors[1]).toEqual({
        name: mockMiddleRotor.name,
        ring: mockMiddleRotor.ring,
        position: mockMiddleRotor.position,
      });
      expect(settings.rotors[2]).toEqual({
        name: mockRightRotor.name,
        ring: mockRightRotor.ring,
        position: mockRightRotor.position,
      });
    });
  });
});
