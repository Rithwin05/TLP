import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'lastthepuff';

// Use global variable to preserve connection across hot reloads in dev
// and across serverless function invocations on Vercel
const globalForMongo = globalThis;

if (!globalForMongo._mongoClientPromise) {
  const client = new MongoClient(MONGO_URL, {
    maxPoolSize: 10,
  });
  globalForMongo._mongoClientPromise = client.connect();
}

const clientPromise = globalForMongo._mongoClientPromise;

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return { client, db };
}

export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}

export default clientPromise;
