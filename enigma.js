import { PlugBoard } from './src/PlugBoard.js';
import { Rotor } from './src/Rotor.js';
import { Reflector } from './src/Reflector.js';

// the five available rotors for the Enigma M3
let I = ['EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'Q']
let II = ['AJDKSIRUXBLHWTMCQGZNPYFVOE', 'E']
let III = ['BDFHJLCPRTXVZNYEIWGAKMUSQO', 'V']
let IV = ['ESOVPZJAYQUIRHXLNFTGKDCMWB', 'J']
let V = ['VZBRGITYUPSDNHLXAWMJQOFECK', 'Z']

let plug = new PlugBoard();
plug.setPlugs(['AZ', 'BY', 'CX', 'TD', 'SW']);

let left = new Rotor(IV)
left.setPosition('J');
left.setRingSetting('A');

let middle = new Rotor(III)
middle.setPosition('V');
middle.setRingSetting('A');

let right = new Rotor(V)
right.setPosition('Z');
right.setRingSetting('A');

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

    let tmp = '';

    // signal path from the keyboard
    tmp = plug.process(char);
    tmp = right.process(tmp);
    tmp = middle.process(tmp);
    tmp = left.process(tmp);
    tmp = reflector.process(tmp);
    tmp = left.process(tmp, true);
    tmp = middle.process(tmp, true);
    tmp = right.process(tmp, true);
    tmp = plug.process(tmp);

    // instead of lighting the bulb, we collect the output here...
    output += tmp;
  }
});

console.log('output:', output);
