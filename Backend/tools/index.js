import { retrieveFromDocuments } from "./retrieveFromDocuments.js";
import { searchWeb } from "./searchWeb.js";

export const toolRegistry = {
  retrieve_from_documents: ({ query }) => retrieveFromDocuments(query),
  search_web: ({ query }) => searchWeb(query),
};
