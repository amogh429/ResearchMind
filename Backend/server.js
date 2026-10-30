import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDB } from "./db.js";
import { getDB } from "./db.js";
import { ai } from "./gemini.js";
import toolDeclarations from "./toolDeclarations.js";
import { retrieveFromDocuments } from "./tools/retrieveFromDocuments.js";
import { FunctionResponse } from "@google/genai";

await connectDB();
const app = express();
app.use(cors());
app.use(express.json());

const MAX_TRIES = 3;
app.post("/api/chat", async (req, res) => {
  const message = req.body.message;

  const contents = [
    {
      role: "user",
      parts: [{ text: message }],
    },
  ];

  const config = {
    tools: [{ functionDeclarations: toolDeclarations }]
  };

  let response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents,
    config,
  });

  let count = 0;

  while (response.functionCalls && response.functionCalls.length > 0 && count < MAX_TRIES) {

    count++;
    // Gemini's own turn, thought signature intact
    contents.push(response.candidates[0].content);

    // Answer every function call in this turn, not just the first
    const responseParts = [];
    for(const call of response.functionCalls){
      const query = call.args.query;
      console.log(`Round ${count} - tool called with query:`, query);

      // Only one tool exists in Phase 1, so every call is retrieve_from_documents
      const result = await retrieveFromDocuments(query);
      console.log("Scores:", result.map((r) => r.score));

      responseParts.push({
        FunctionResponse: {
          name: call.name,
          response: { chunks: result },
          id: call.id,
        },
      });
    }

    contents.push({ role: "user", parts: responseParts });

    response = await ai.models.generateContent({
      model: "gemini=3.5-flash",
      contents,
      config,
    });
  }

  if(response.functionCalls && response.functionCalls.length > 0){
    return res.json({
      answer: "I couldn't find a confident answer within the allowed number of lookups.",
      incomplete: true,
    });
  }

  res.json({ answer: response.text })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
