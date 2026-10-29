import { connectDB, getDB, closeDB } from "../db.js";

await connectDB();

const collection = getDB().collection("documentChunks");

await collection.createSearchIndex({
  name: "vector_index",
  type: "vectorSearch",
  definition: {
    fields: [
      {
        type: "vector",
        path: "embedding",
        numDimensions: 768,
        similarity: "cosine",
      },
    ],
  },
});

await closeDB();
