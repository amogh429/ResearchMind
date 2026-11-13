export const testCases = [
  {
    name: "Simple calculation , no tool",
    input: "What is 15 times 12?",
    mustCall: [],
    mustNotCall: ["retrieve_from_documents", "search_web"],
  },
  {
    name: "Wind turbines",
    input: "How do wind turbines produce electricity?",
    mustCall: ["retrieve_from_documents"],
    mustNotCall: ["search_web"],
  },
  {
    name: "marathon",
    input: "What's the best way to train for a marathon?",
    expectedPath: ["retrieve_from_documents", "search_web"],
  },
];
