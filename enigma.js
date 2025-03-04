import PlugBoard from './src/PlugBoard.js';
import Rotor from './src/Rotor.js';
import Reflector from './src/Reflector.js';

// the five available rotors for the Enigma M3
// including the notch position for each rotor
let I = ['EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'Q']
let II = ['AJDKSIRUXBLHWTMCQGZNPYFVOE', 'E']
let III = ['BDFHJLCPRTXVZNYEIWGAKMUSQO', 'V']
let IV = ['ESOVPZJAYQUIRHXLNFTGKDCMWB', 'J']
let V = ['VZBRGITYUPSDNHLXAWMJQOFECK', 'Z']

// set the plugboard connections
// swap letters, but no more than 10 pairs
let plug = new PlugBoard(['AZ', 'BY', 'CX', 'TD', 'SW']);

// choose 3 rotors (from above) and then select the ring setting and 
// initial position for each rotor
let left = new Rotor(IV, 'A', 'J');
let middle = new Rotor(III, 'A', 'V');
let right = new Rotor(V, 'A', 'Z');

// there is only one reflector at the moment - the UKW-B
let reflector = new Reflector();

// set the message to be encoded
let input = 'this is a test';

// split the input into an array of characters
let chars = input.split('');

// initilize the output
let output = '';

chars.forEach(char => {
  // the enigma machine keyboard has no space bar!
  // but we can have spaces in the input text
  // we just ignore them
  if (/[a-zA-Z]/.test(char)) {

    // check notch positions and advance rotors
    // if at the notch
    if (right.isAtNotch()) {
      if (middle.isAtNotch()) {
        left.step();
      }
      middle.step();
    }
    right.step();

    // signal path from the keyboard
    char = plug.process(char);
    char = right.process(char);
    char = middle.process(char);
    char = left.process(char);
    char = reflector.process(char);
    char = left.process(char, true);
    char = middle.process(char, true);
    char = right.process(char, true);
    char = plug.process(char);

    // instead of lighting the bulb, we collect the output here...
    output += char;
  }
});

console.log('output:', output);
