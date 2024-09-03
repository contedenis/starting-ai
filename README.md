# 🤖 Embedding Generation and Chatbot Project ![License](https://img.shields.io/badge/license-MIT-green) ![Node.js](https://img.shields.io/badge/Node.js-v14%2B-brightgreen)

This project is a command-line application that allows users to interact with a chatbot and generate embeddings from PDF and CSV files. It utilizes the OpenAI API to process queries and generate responses.

## 📁 Project Structure

- **chat.js**: Contains the logic for interacting with the chatbot.
- **common.js**: Common functions used throughout the application, such as user input handling.
- **db.js**: Module for managing the connection and operations with the database.
- **embeddings.js**: Functions for generating embeddings from PDF and CSV files.
- **function.js**: Functions that enable the execution of specific commands using the OpenAI API, leveraging the tool_calls functionality to integrate additional tools into the chatbot's responses.
- **openai.js**: Responsible for the configuration and initialization of the connection to the OpenAI API..
- **init.js**: Main file that initializes the application and presents the menu to the user.
- **package.json**: Configuration file for the project that includes dependencies and scripts.

## 📋 Requirements

- Node.js (version 14 or higher) ![Node.js](https://img.shields.io/badge/Node.js-v14%2B-brightgreen)
- npm (Node.js package manager)
- OpenAI API key

## 🚀 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/contedenis/starting-ai
   cd starting-ai
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Configure your OpenAI API key. Create a `.env` file in the root of the project and add the following line:

   ```plaintext
   OPENAI_API_KEY=your_api_key
   ```

## 🛠️ Usage

To start the application, run the following command:

```bash
node init.js
```

### 🌟 Features

- **Chat**: Interact with the chatbot and receive answers to your questions.
- **Function**: Execute specific functions defined in the project.
- **Embedding**: Generate embeddings from PDF or CSV files. You will be prompted to enter the file path. **Note**: The CSV or PDF file must be located in the `files/csv` or `files/pdf` directories to be processed.

- **Search**: Perform queries on the generated embeddings and receive relevant results.

### 📖 Example Usage

1. Select "chat" to start interacting with the chatbot.
2. Select "embedding" to generate embeddings from a file. You will be prompted to enter the file path.
3. Select "search" to perform queries on the generated embeddings.

## 🗄️ Database

This project uses **PGLite** as its database.

### Why PGLite?

- **Lightweight**: PGLite is a lightweight database that is easy to set up and use, making it ideal for local projects and learning purposes.
- **Simplicity**: It provides a simple interface for managing data without the overhead of a full-fledged database server, which is beneficial for beginners.
- **Local Development**: Since this project is intended for local development and learning, PGLite allows for quick iterations and testing without complex configurations.
- **Familiarity with SQL**: Using PGLite helps users become familiar with SQL queries, which are widely used in many database systems.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for more details.
