import PlugBoard from './PlugBoard.js';
import Rotor from './Rotor.js';

export class EnigmaMachine {
  constructor(rotors, plugboard, reflector) {
    this.rotors = rotors;
    this.plugboard = plugboard;
    this.reflector = reflector;
  }

  // Method to encrypt a single character
  encrypt(char) {
    // 1. Plugboard connections
    let processedChar = this.plugboard.process(char);

    // 2. Rotors (right to left)
    processedChar = this.rotors[2].process(processedChar);
    processedChar = this.rotors[1].process(processedChar);
    processedChar = this.rotors[0].process(processedChar);

    // 3. Reflector
    processedChar = this.reflector.process(processedChar);

    // 4. Rotors (left to right, reverse)
    processedChar = this.rotors[0].process(processedChar, true);
    processedChar = this.rotors[1].process(processedChar, true);
    processedChar = this.rotors[2].process(processedChar, true);

    // 5. Plugboard again
    processedChar = this.plugboard.process(processedChar);

    return processedChar;
  }

  // Method to advance the rotors
  advanceRotors() {
    // Always step the rightmost rotor
    this.rotors[2].step();

    // Check for notch and double-stepping
    if (this.rotors[2].isAtNotch()) {
      this.rotors[1].step();
    }
    if (this.rotors[1].isAtNotch()) {
      this.rotors[0].step();
    }
  }

  // Method to get the current configuration
  getConfig() {
    return {
      rotors: this.rotors.map(rotor => ({
        wiring: rotor.wiring,
        notch: rotor.notch,
        ring: rotor.ring,
        position: rotor.position,
      })),
      plugboard: this.plugboard.connections,
    };
  }

  // Method to set the configuration from a JSON object
  setConfig(config) {
    this.rotors = config.rotors.map(
      rotorConfig =>
        new Rotor(
          [rotorConfig.wiring, String.fromCharCode(65 + rotorConfig.notch)],
          String.fromCharCode(65 + rotorConfig.ring),
          String.fromCharCode(65 + rotorConfig.position)
        )
    );
    this.plugboard = new PlugBoard(config.plugboard);
  }
}
