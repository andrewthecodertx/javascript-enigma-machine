import express from 'express';
import { EnigmaMachine } from './src/classes/EnigmaMachine.js';
import PlugBoard from './src/classes/PlugBoard.js';
import Rotor from './src/classes/Rotor.js';
import Reflector from './src/classes/Reflector.js';
import utils from './src/utils.js';
import { rotorData } from './src/dataLoader.js';

const app = express();
const port = 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to process Enigma operations
app.post('/process', (req, res) => {
  const { settings, message } = req.body;

  if (!settings || !message) {
    return res.status(400).json({ error: 'Missing settings or message in request body.' });
  }

  try {
    // Validate settings structure
    if (!settings.rotors || settings.rotors.length !== 3 || !settings.plugboard || !settings.reflector) {
      return res.status(400).json({ error: 'Invalid Enigma settings structure.' });
    }

    // Instantiate components
    const plugboard = new PlugBoard(settings.plugboard);
    const leftRotor = new Rotor(settings.rotors[0].name, settings.rotors[0].ring, settings.rotors[0].position);
    const middleRotor = new Rotor(settings.rotors[1].name, settings.rotors[1].ring, settings.rotors[1].position);
    const rightRotor = new Rotor(settings.rotors[2].name, settings.rotors[2].ring, settings.rotors[2].position);
    const reflector = new Reflector();

    const enigma = new EnigmaMachine({
      plugboard,
      leftRotor,
      middleRotor,
      rightRotor,
      reflector,
    });

    const processedResult = enigma.processMessage(message);

    res.json({ result: processedResult });
  } catch (error) {
    console.error('Error processing Enigma message:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Enigma API listening at http://localhost:${port}`);
});
