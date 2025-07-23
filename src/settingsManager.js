import { writeFile } from 'fs/promises';
import utils from './utils.js';

export async function saveSettings(plugboard, leftRotor, middleRotor, rightRotor, reflector) {
  const settings = {
    plugboard: plugboard.connections,
    rotors: [
      { name: leftRotor.name, ring: utils.convert(leftRotor.ring), position: utils.convert(leftRotor.position) },
      { name: middleRotor.name, ring: utils.convert(middleRotor.ring), position: utils.convert(middleRotor.position) },
      { name: rightRotor.name, ring: utils.convert(rightRotor.ring), position: utils.convert(rightRotor.position) },
    ],
    reflector: reflector.wiring, // Assuming only one reflector type for now
  };

  const fileName = 'enigma_settings.json';
  try {
    await writeFile(fileName, JSON.stringify(settings, null, 2));
    console.log(`Settings saved to ${fileName}`);
  } catch (error) {
    console.error(`Error saving settings: ${error.message}`);
  }
}
