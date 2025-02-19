import PlugBoard from './src/PlugBoard.js';
import Rotor from './src/Rotor.js';
import Reflector from './src/Reflector.js';

// the five available rotors for the Enigma M3
let I = ['EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'Q']
let II = ['AJDKSIRUXBLHWTMCQGZNPYFVOE', 'E']
let III = ['BDFHJLCPRTXVZNYEIWGAKMUSQO', 'V']
let IV = ['ESOVPZJAYQUIRHXLNFTGKDCMWB', 'J']
let V = ['VZBRGITYUPSDNHLXAWMJQOFECK', 'Z']

let plug = new PlugBoard(['AZ', 'BY', 'CX', 'TD', 'SW']);

// choose 3 rotors (from above) and then select the ring setting and 
// initial position for each rotor
let left = new Rotor(IV, 'A', 'J');
let middle = new Rotor(III, 'A', 'V');
let right = new Rotor(V, 'A', 'Z');

// there is only one reflector at the moment - the UKW-B
let reflector = new Reflector();

let input = 'this is a test';
let chars = input.split('');

let output = '';

chars.forEach(char => {
  // the enigma machine keyboard has no space bar!
  // but we can have spaces in the input text
  if (/[a-zA-Z]/.test(char)) {

    // check notch positions
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
