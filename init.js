import 'dotenv/config';
import inquirer from 'inquirer';

import { promptUser } from './common.js';
import { chat } from './chat.js';
import { functionChat } from './function.js';
import { generateEmbedding, queryEmbeddings } from './embeddings.js';

const actions = ['chat', 'function', 'embedding', 'search'];

const mainMenu = async () => {
  while (true) {
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Choose an option:',
        choices: [...actions, 'exit'],
      },
    ]);

    if (choice === 'exit') {
      console.log('Exiting...');
      break;
    }

    switch (choice) {
      case 'chat':
        await chat();
        break;
      case 'function':
        await functionChat();
        break;
      case 'embedding':
        const path = await promptUser('Enter the path to the file: ');
        if (path.endsWith('.pdf') || path.endsWith('.csv')) {
          await generateEmbedding(path);
        } else {
          console.log('Invalid file type. Please provide a PDF or CSV file.');
        }
        break;
      case 'search':
        const query = await promptUser(
          '\n\nWhat would you like to know about your PDF/CSV?\n\n'
        );
        const results = await queryEmbeddings(query);
        console.log('\n\nSearch results:\n\n', results);
        break;
      default:
        console.log('Invalid option, please try again.');
    }
  }
};

await mainMenu();
