import { createInterface } from 'readline';
import inquirer from 'inquirer';

export const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const promptUser = async (message) => {
  const { response } = await inquirer.prompt([
    {
      type: 'input',
      name: 'response',
      message: message,
    },
  ]);
  return response;
};
