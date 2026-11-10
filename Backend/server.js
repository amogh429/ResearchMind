import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDB } from "./db.js";
import { getDB } from "./db.js";
import { runCoordinator } from "./coordinator.js";

await connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const message = req.body.message;

  const trace = await runCoordinator(message);
  res.json({
    answer: trace.finalAnswer,
    incomplete: trace.fallbackMessageUsed,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
