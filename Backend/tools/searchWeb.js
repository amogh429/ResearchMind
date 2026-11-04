import { tavily } from "@tavily/core";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function searchWeb(query){
    try{
        const response = await client.search(query, {
            maxResults: 5,
            searchDepth: "basic",
        });

        return {
            found: response.results.length > 0,
            results: response.results.map((result) => ({
                title: result.title,
                url: result.url,
                content: result.content,
                score: result.score,
                publishedDate: result.publishedDate,
            }))
        };
    }catch(error){
        console.error("Web search failed:",error);

        return {
            found: false,
            results: [],
            error: "Web search is currently unavailable.",
        };
    }
}
