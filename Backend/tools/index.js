import { retrieveFromDocuments } from "./retrieveFromDocuments";

export const toolRegistry = {
    retrieve_from_documents: ({ query }) => retrieveFromDocuments(query),
};
