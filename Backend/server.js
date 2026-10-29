import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDB } from "./db.js";
import { getDB } from "./db.js";
import { ai } from "./gemini.js";
import toolDeclarations from "./toolDeclarations.js";
import { retrieveFromDocuments } from "./tools/retrieveFromDocuments.js";

await connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const message = req.body.message;

  const contents = [
    {
      role: "user",
      parts: [{ text: message }],
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents,
    config: {
      tools: [{ functionDeclarations: toolDeclarations }],
    },
  });

  if (response.functionCalls && response.functionCalls.length > 0) {
    const call = response.functionCalls[0];
    const functionName = call.name;
    const query = call.args.query;
    const result = await retrieveFromDocuments(query);
    contents.push({
      role: "model",
      parts: [{ functionCall: call }],
    });

    contents.push({
      role: "user",
      parts: [
        {
          functionResponse: {
            name: call.name,
            response: { chunks: result },
            id: call.id,
          },
        },
      ],
    });

    const finalResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        tools: [{ functionDeclarations: toolDeclarations }],
      },
    });

    res.json({ answer: finalResponse.text });
  } else {
    res.json({ answer: response.text });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
