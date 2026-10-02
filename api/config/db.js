import mongoose from 'mongoose';

/**
 * Conexão com MongoDB otimizada para Serverless (Vercel) e Servidor Local.
 * Mantém em cache a conexão ativa para reutilização em invocações quentes (warm lambdas),
 * evitando a sobrecarga de abrir novas conexões a cada requisição.
 */

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️ MONGODB_URI não definida. Iniciando instância de MongoDB em memória para desenvolvimento local...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        if (!global.__mongodInstance) {
          global.__mongodInstance = await MongoMemoryServer.create();
        }
        uri = global.__mongodInstance.getUri();
        process.env.MONGODB_URI = uri;
      } catch (e) {
        throw new Error('A variável de ambiente MONGODB_URI não foi definida e não foi possível iniciar o banco em memória.');
      }
    } else {
      throw new Error('A variável de ambiente MONGODB_URI não foi definida.');
    }
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    if (process.env.MONGODB_DB) {
      opts.dbName = process.env.MONGODB_DB;
    }

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default connectDB;
