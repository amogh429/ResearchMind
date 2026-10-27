const toolDeclarations = [
    {
        name: "retrieve_from_documents",
        description:
            "Searches the user's uploaded document and retrieves the most relevant excerpts to help answer their question",
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
];

export default toolDeclarations;
