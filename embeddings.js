import path from 'path';
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';

import { getDBInstance } from './db.js';
import { promptUser } from './common.js';
import { openai } from './openai.js';

const loader = {
  csv: CSVLoader,
  pdf: PDFLoader,
};

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 2000,
  chunkOverlap: 200,
});

const getDocs = async (filePath, fileLoader) => {
  const loader = new fileLoader(filePath);
  const docs = await loader.load();
  const splitDocs = await textSplitter.splitDocuments(docs);
  return splitDocs;
};

const generateEmbeddingsFromDocs = async (textChunks) => {
  const openAIEmbeddings = new OpenAIEmbeddings();
  const embeddings = [];
  for (const chunk of textChunks) {
    const embedding = await openAIEmbeddings.embedQuery(chunk.pageContent);
    embeddings.push({
      vector: embedding,
      originalText: chunk.pageContent,
    });
  }
  return embeddings;
};

const storeEmbeddingsInDb = async (filePath, embeddings) => {
  const db = await getDBInstance();
  for (const embedding of embeddings) {
    await db.query(
      'INSERT INTO vector_embeddings (file_name, original_text, embedding) VALUES ($1, $2, $3::VECTOR(1536))',
      [filePath, embedding.originalText, JSON.stringify(embedding.vector)]
    );
  }
};

const checkEmbeddingsExist = async (filePath) => {
  const db = await getDBInstance();
  const row = await db.query(
    'SELECT COUNT(*) as count FROM vector_embeddings WHERE file_name = $1',
    [filePath]
  );
  return row.rows[0].count > 0;
};

export const generateEmbedding = async (filePath) => {
  if (await checkEmbeddingsExist(filePath)) {
    const answer = await promptUser(
      `Embeddings for "${filePath}" already exist. Do you want to overwrite them? (yes/no): `
    );
    if (answer.toLowerCase() !== 'yes') {
      console.log('Aborting operation.');
      return;
    }
  }

  const docs = await getDocs(filePath, loader[path.extname(filePath).slice(1)]);
  const embeddings = await generateEmbeddingsFromDocs(docs);
  await storeEmbeddingsInDb(filePath, embeddings);
  console.log('Embeddings generated and stored in database.');
};

export const queryEmbeddings = async (query) => {
  const db = await getDBInstance();
  const openAIEmbeddings = new OpenAIEmbeddings();
  const queryEmbedding = await openAIEmbeddings.embedQuery(query);
  const { rows } = await db.query(
    'SELECT original_text FROM vector_embeddings ORDER BY embedding <=> $1::VECTOR(1536) LIMIT 4',
    [JSON.stringify(queryEmbedding)]
  );

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [
      {
        role: 'assistant',
        content:
          'You are a helpful AI assistant. Answser questions to your best ability.',
      },
      {
        role: 'user',
        content: `Answer the following question using the provided context. If you cannot answer the question with the context, don't lie and make up stuff. Just say you need more context.
        Question: ${query}
  
        Context: ${rows.map((r) => r.original_text).join('\n')}`,
      },
    ],
  });
  return response.choices[0].message.content;
};
