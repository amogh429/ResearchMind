import "dotenv/config";
import { checkToolErrors } from "./checks.js";

const tavilyDown = {
  toolCalls: [
    {
      round: 2,
      name: "search_web",
      args: { query: "x" },
      result: {
        found: false,
        results: [],
        error: "Web search is currently unavailable.",
      },
    },
  ],
};

const unknownTool = {
  toolCalls: [
    {
      round: 1,
      name: "search_web2",
      args: { query: "x" },
      result: { error: "Unknown tool: search_web2" },
    },
  ],
};

console.log("tavilyDown:", checkToolErrors(tavilyDown));
console.log("unknownTool:", checkToolErrors(unknownTool));
