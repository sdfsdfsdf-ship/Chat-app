import { MongoClient } from "mongodb";

let cachedClient: MongoClient | null = null;

export async function connectDB(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;

  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();

  cachedClient = client;
  return client;
}
