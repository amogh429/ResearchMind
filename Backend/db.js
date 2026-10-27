import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

let db;

export async function connectDB() {
  await client.connect();
  db = client.db("ResearchMind");

  console.log("MongoDB connected");
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }

  return db;
}
