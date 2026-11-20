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
  {
    name: "Greeting",
    input: "Hi, how are you?",
    mustCall: [],
    mustNotCall: ["retrieve_from_documents", "search_web"],
  },
  {
    name: "Night sleep",
    input: "Why does my phone make it hard to fall asleep?",
    mustCall: ["retrieve_from_documents"],
    mustNotCall: ["search_web"],
  },
  {
    name: "Current News",
    input: "What are today's top technology news headlines?",
    mustCall: ["search_web"],
    mustNotCall: [],
  },
];
