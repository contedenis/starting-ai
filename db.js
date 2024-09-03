import { PGlite } from '@electric-sql/pglite';
import { vector } from '@electric-sql/pglite/vector';
import { NodeFS } from '@electric-sql/pglite/nodefs';

let dbInstance = null;

export const getDBInstance = async () => {
  if (!dbInstance) {
    dbInstance = new PGlite({
      fs: new NodeFS('./db'),
      extensions: {
        vector,
      },
    });
    await dbInstance.exec(`
      CREATE EXTENSION IF NOT EXISTS vector;
      CREATE TABLE IF NOT EXISTS vector_embeddings (
        id SERIAL PRIMARY KEY,
        file_name TEXT NOT NULL,
        original_text TEXT NOT NULL,
        embedding VECTOR(1536)
      )
    `);
  }
  return dbInstance;
};
