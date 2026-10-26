import { embedText } from "../gemini.js";
import { getDB } from "../db.js";

export async function retrieveFromDocuments(query) {
  const test_query = await embedText(query, "RETRIEVAL_QUERY");
  const collection = getDB().collection("documentChunks");
  const result = await collection
    .aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: test_query,
          limit: 4,
          numCandidates: 100,
        },
      },
      {
        $project: {
          _id: 0,
          text: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ])
    .toArray();

  return result;
}
