import { readFile } from 'fs/promises';

const loadRotorData = async () => {
  try {
    const data = await readFile(new URL('../data/rotors.json', import.meta.url));
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load rotor data:', error);
    return [];
  }
};

const loadMachineSettings = async () => {
  try {
    const data = await readFile(new URL('../data/machineSettings.json', import.meta.url));
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load machine settings:', error);
    return null;
  }
};

export const rotorData = await loadRotorData();
export const machineSettings = await loadMachineSettings();