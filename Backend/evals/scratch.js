import "dotenv/config";
import { checkToolErrors, checkPath, combineResults } from "./checks.js";

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

const failingCase = {
  name: "path fail",
  input: "test question",
  expectedPath: ["retrieve_from_documents"],
};

const passingCase = {
  name: "path pass",
  input: "test question",
  expectedPath: ["search_web"],
};

const windTurbineCase = {
  name: "Wind Turbine",
  input: "How do wind turbines wokr?",
  mustCall: ["retrieve_from_documents"],
  mustNotCall: ["search_web"],
};

const windTurbinePassTrace = {
  toolCalls: [
    {
      round: 1,
      name: "retrieve_from_documents",
      args: { query: "wind turbines" },
      result: {},
    },
    {
      round: 2,
      name: "retrieve_from_documents",
      args: { query: "wind turbines" },
      result: {},
    },
  ],
};

const windTurbineFailTrace = {
  toolCalls: [
    {
      round: 1,
      name: "search_web",
      args: { query: "wind turbines" },
      result: {},
    },
  ],
};

console.log(
  "wind turbine pass:",
  checkPath(windTurbineCase, windTurbinePassTrace),
);

console.log(
  "wind turbine fail:",
  checkPath(windTurbineCase, windTurbineFailTrace),
);

console.log("tavilyDown:", checkToolErrors(null,tavilyDown));
console.log("unknownTool:", checkToolErrors(null,unknownTool));

console.log("pathPass: ", checkPath(passingCase, tavilyDown));
console.log("pathFail: ", checkPath(failingCase, tavilyDown));

console.log(
  "PASS + PASS:",
  combineResults([{ status: "PASS" }, { status: "PASS" }]),
);

console.log(
  "FAIL + PASS:",
  combineResults([
    { status: "FAIL", reason: "Wrong tool path" },
    { status: "PASS" },
  ]),
);

console.log(
  "FAIL + ERROR:",
  combineResults([
    { status: "FAIL", reason: "Wrong tool path" },
    { status: "ERROR", reason: "Web search is unavailable" },
  ]),
);


console.log(combineResults([{ status: "OK"} , { status: "PASS"}]));
console.log(checkPath({ name: "x", input: "y"}, {toolCalls: []}))
