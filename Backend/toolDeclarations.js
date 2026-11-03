const toolDeclarations = [
  {
    name: "retrieve_from_documents",
    description: `
        Searches the user's uploaded documents and returns the most relevant excerpts.
        Call this for any question that asks for information, facts, explanations, or
        details about a topic, because you cannot know what the documents contain until
        you search. When in doubt, search.
        Do not call this for greetings or small talk, arithmetic or other simple
        calculations (such as 15 x 12), or requests about the conversation itself
        (such as "summarize what you just said").
`,
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "A short search phrase capturing what needs to be looked up in the documents.",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "search_web",
    description: `
    Searches the web and returns ranked results, each with a title, URl, and content snippet.
    Use this after retrieve_from_documents returns found: false for a question that asks for
    information. Also use it when the question needs current information the user's documents
    cannot contain, such as today's news, prices, or recent events.
    Do not call this first for questions the user's own documents could plausibly answer.
    Do not call this for greetings, arithmetic, or small talk.
    `,
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "A short, specific web search query capturing what needs to be looked up."
        },
      },
      required: ["query"],
    },
  },
];

export default toolDeclarations;
