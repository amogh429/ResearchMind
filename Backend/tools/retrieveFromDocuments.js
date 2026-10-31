import { embedText } from "../gemini.js";
import { getDB } from "../db.js";
const MIN_SCORE = 0.85;
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

  console.log(
    "Raw scores:",
    result.map((r) => r.score),
  );

  const chunks = result.filter((r) => r.score >= MIN_SCORE);

  if (chunks.length === 0) {
    return {
      found: false,
      chunks: [],
      message:
        "No document chunks score above the relevance threshold for this query.",
    };
  }

  return { found: true, chunks };
}
