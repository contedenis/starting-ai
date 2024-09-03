import readline from 'node:readline';
import math from 'advanced-calculator';

import { openai } from './openai.js';
import { promptUser } from './common.js';

const tools = {
  calculate: {
    name: 'calculate',
    type: 'function',
    description: 'Run a math expression',
    parameters: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description:
            'The math expression to evaluate like "2 * 3 + (21 / 2) ^ 2"',
        },
      },
      required: ['expression'],
    },
    execute: async ({ expression }) => {
      return math.evaluate(expression);
    },
  },
};

const getCompletion = async (messages) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    tools: [
      {
        type: tools.calculate.type,
        function: {
          ...tools.calculate,
        },
      },
    ],
    temperature: 0,
  });

  return response;
};

const formatMessage = (userInput) => ({ role: 'user', content: userInput });

export const functionChat = async () => {
  const history = [
    {
      role: 'system',
      content: `You are a helpful AI assistant.
        Answer the user's questions to the best of you ability and use 
        the supplied tools to assist the user. Only show the user's last 
        operation, unless otherwise requested.`,
    },
  ];
  let response;

  const start = async () => {
    const userInput = await promptUser('You: ');

    if (userInput.toLowerCase() === 'exit') {
      return;
    }

    const getFinalReponse = async (message) => {
      const newHistory = message ? [...history, message] : history;
      response = await getCompletion(newHistory);
      const choice = response.choices[0];

      if (choice.finish_reason === 'stop') {
        console.log(choice.message.content);
        return;
      } else if (choice.finish_reason === 'tool_calls') {
        const toolName = choice.message.tool_calls[0].function.name;
        const args = JSON.parse(
          choice.message.tool_calls[0].function.arguments
        );

        const toolToCall = tools[toolName];
        const result = await toolToCall.execute(args);
        history.push({
          role: 'assistant',
          content: null,
          tool_calls: [choice.message.tool_calls[0]],
        });

        history.push({
          role: 'tool',
          tool_call_id: choice.message.tool_calls[0].id,
          content: JSON.stringify({
            result: `The result of the expression "${args.expression}" is ${result}. Avoid using LaTeX.`,
          }),
        });

        await getFinalReponse();
      }
    };

    await getFinalReponse(formatMessage(userInput));
    await start();
  };

  console.log(
    '\n\nAI: Hello there, I am here to help you, if you want to know the result of any operation, just write it like this: (2+5)*8\n\n'
  );
  await start();
};
