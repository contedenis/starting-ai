import readline from 'node:readline';

import { openai } from './openai.js';
import { promptUser } from './common.js';

const newMessage = async (history, message) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [...history, message],
    model: 'gpt-3.5-turbo',
  });

  return chatCompletion.choices[0].message;
};

const formatMessage = (userInput) => ({ role: 'user', content: userInput });

export const chat = async () => {
  const history = [
    {
      role: 'system',
      content: `You are a helpful AI assistant. Answer the user's questions to the best of you ability.`,
    },
  ];
  const start = async () => {
    const userInput = await promptUser('You: ');
    if (userInput.toLowerCase() === 'exit') {
      return;
    }

    const userMessage = formatMessage(userInput);
    const response = await newMessage(history, userMessage);

    history.push(userMessage, response);
    console.log(`\n\nAI: ${response.content}\n\n`);
    await start();
  };

  console.log('\n\nAI: How can I help you today?\n\n');
  await start();
};
