import readline from 'readline';
import { readFile } from 'fs/promises';
import PlugBoard from './src/classes/PlugBoard.js';
import Rotor from './src/classes/Rotor.js';
import Reflector from './src/classes/Reflector.js';
import { machineSettings } from './src/dataLoader.js';
import utils from './src/utils.js';
import { saveSettings } from './src/settingsManager.js';

const DEFAULT_SETTINGS_FILE = 'enigma_settings.json';

let plug;
let left;
let middle;
let right;
let reflector;

async function initEnigma(settings) {
  try {
    plug = new PlugBoard(settings.plugboard);
    left = new Rotor(settings.rotors[0].name, settings.rotors[0].ring, settings.rotors[0].position);
    middle = new Rotor(settings.rotors[1].name, settings.rotors[1].ring, settings.rotors[1].position);
    right = new Rotor(settings.rotors[2].name, settings.rotors[2].ring, settings.rotors[2].position);
    reflector = new Reflector();
    console.log('Enigma machine initialized with new settings.');
  } catch (error) {
    console.error(`Error initializing Enigma machine: ${error.message}`);
  }
}

async function loadSettingsFromFile(filename) {
  try {
    const data = await readFile(filename, 'utf8');
    const settings = JSON.parse(data);
    await initEnigma(settings);
    console.log(`Settings loaded from ${filename}`);
  } catch (error) {
    console.error(`Error loading settings from ${filename}: ${error.message}`);
  }
}

async function handleSaveCommand(args) {
  const filename = args[0] || DEFAULT_SETTINGS_FILE;
  if (!plug || !left || !middle || !right || !reflector) {
    console.log("Enigma machine not fully initialized. Cannot save settings.");
    return;
  }
  await saveSettings(plug, left, middle, right, reflector);
}

function handleProcessCommand(args) {
  const inputMessage = args.join(' ');
  if (!inputMessage) {
    console.log("Please provide a message to process.");
    return;
  }
  if (!plug || !left || !middle || !right || !reflector) {
    console.log("Enigma machine not fully initialized. Cannot process message.");
    return;
  }

  // Re-initialize the Enigma machine to its initial state before processing
  initEnigma(machineSettings);

  let output = '';
  const chars = inputMessage.split('');

  chars.forEach(char => {
    if (/[a-zA-Z]/.test(char)) {
      if (right.isAtNotch()) {
        if (middle.isAtNotch()) {
          left.step();
        }
        middle.step();
      }
      right.step();

      let charCode = utils.convert(char);
      charCode = plug.process(charCode);
      charCode = right.process(charCode);
      charCode = middle.process(charCode);
      charCode = left.process(charCode);
      charCode = reflector.process(charCode);
      charCode = left.process(charCode, true);
      charCode = middle.process(charCode, true);
      charCode = right.process(charCode, true);
      charCode = plug.process(charCode);

      output += utils.convert(charCode);
    }
  });
  console.log(`Output: ${output}`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

async function startCli() {
  await initEnigma(machineSettings);
  console.log('Welcome to the Enigma CLI!');
  console.log('Commands: load [filename], save [filename], process <message>, exit');
  rl.prompt();

  rl.on('line', async (line) => {
    const [command, ...args] = line.trim().split(/\s+/);

    switch (command.toLowerCase()) {
      case 'load':
        await loadSettingsFromFile(args[0] || DEFAULT_SETTINGS_FILE);
        break;
      case 'save':
        await handleSaveCommand(args);
        break;
      case 'process':
        handleProcessCommand(args);
        break;
      case 'exit':
        rl.close();
        break;
      default:
        console.log(`Unknown command: ${command}`);
    }
    rl.prompt();
  }).on('close', () => {
    console.log('Exiting Enigma CLI. Goodbye!');
    process.exit(0);
  });
}

startCli();
