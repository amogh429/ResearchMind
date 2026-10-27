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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
