import "dotenv/config";
import {
  checkToolErrors,
  checkPath,
  combineResults,
  checkNoFallback,
  checkUrlsFromSearch,
  checkWebAnswerCites,
} from "./checks.js";

// const tavilyDown = {
//   toolCalls: [
//     {
//       round: 2,
//       name: "search_web",
//       args: { query: "x" },
//       result: {
//         found: false,
//         results: [],
//         error: "Web search is currently unavailable.",
//       },
//     },
//   ],
// };

// const unknownTool = {
//   toolCalls: [
//     {
//       round: 1,
//       name: "search_web2",
//       args: { query: "x" },
//       result: { error: "Unknown tool: search_web2" },
//     },
//   ],
// };

// const failingCase = {
//   name: "path fail",
//   input: "test question",
//   expectedPath: ["retrieve_from_documents"],
// };

// const passingCase = {
//   name: "path pass",
//   input: "test question",
//   expectedPath: ["search_web"],
// };

// const windTurbineCase = {
//   name: "Wind Turbine",
//   input: "How do wind turbines work?",
//   mustCall: ["retrieve_from_documents"],
//   mustNotCall: ["search_web"],
// };

// const windTurbinePassTrace = {
//   toolCalls: [
//     {
//       round: 1,
//       name: "retrieve_from_documents",
//       args: { query: "wind turbines" },
//       result: {},
//     },
//     {
//       round: 2,
//       name: "retrieve_from_documents",
//       args: { query: "wind turbines" },
//       result: {},
//     },
//   ],
// };

// const windTurbineFailTrace = {
//   toolCalls: [
//     {
//       round: 1,
//       name: "search_web",
//       args: { query: "wind turbines" },
//       result: {},
//     },
//   ],
// };

// const noFallbackTrace = {
//   fallbackMessageUsed: false,
// };

// const fallbackTrace = {
//   fallbackMessageUsed: true,
// };

// const fallbackWithToolErrorTrace = {
//   fallbackMessageUsed: true,
//   toolCalls: [
//     {
//       round: 2,
//       name: "search_web",
//       args: { query: "x" },
//       result: {
//         error: "Web search is currently unavailable.",
//       },
//     },
//   ],
// };

// const validTrace = {
//   toolCalls: [
//     {
//       name: "search_web",
//       args: {
//         query: "example page",
//       },
//       result: {
//         found: true,
//         results: [
//           {
//             title: "Example Page",
//             url: "https://example.com/page/",
//           },
//           {
//             title: "YouTube",
//             url: "https://www.youtube.com/watch?v=V0Y1EvWrQVo&vl=en",
//           },
//         ],
//       },
//     },
//   ],

//   finalAnswer:
//     "Read [https://example.com/page](https://example.com/page). " +
//     "Video: https://www.youtube.com/watch?v=V0Y1EvWrQVo&vl=en.",
// };

// const inventedUrlTrace = {
//   toolCalls: [
//     {
//       name: "search_web",
//       args: {
//         query: "example page",
//       },
//       result: {
//         found: true,
//         results: [
//           {
//             title: "Example Page",
//             url: "https://example.com/page/",
//           },
//         ],
//       },
//     },
//   ],

//   finalAnswer:
//     "Source: https://example.com/page. " +
//     "More information: https://invented.com/article.",
// };

// const noUrlsTrace = {
//   toolCalls: [
//     {
//       name: "search_web",
//       args: {
//         query: "example page",
//       },
//       result: {
//         found: true,
//         results: [
//           {
//             title: "Example Page",
//             url: "https://example.com/page/",
//           },
//         ],
//       },
//     },
//   ],

//   finalAnswer: "The answer is based on the search results.",
// };

// const failedSearchTrace = {
//   toolCalls: [
//     {
//       name: "search_web",
//       args: {
//         query: "example page",
//       },
//       result: {
//         found: false,
//         error: "Web search is currently unavailable.",
//       },
//     },
//   ],

//   finalAnswer: "More information can be found at https://example.com/page.",
// };

// console.log("1. All URLs valid:", checkUrlsFromSearch({}, validTrace));

// console.log("2. One invented URL:", checkUrlsFromSearch({}, inventedUrlTrace));

// console.log("3. No URLs:", checkUrlsFromSearch({}, noUrlsTrace));

// console.log("4. Failed search:", checkUrlsFromSearch({}, failedSearchTrace));

// console.log("no fallback:", checkNoFallback({}, noFallbackTrace));

// console.log("fallback:", checkNoFallback({}, fallbackTrace));

// const fallbackResult = checkNoFallback({}, fallbackWithToolErrorTrace);

// const toolErrorResult = checkToolErrors({}, fallbackWithToolErrorTrace);

// const combinedResult = combineResults([fallbackResult, toolErrorResult]);

// console.log("fallback + tool error:", combinedResult);

// console.log(
//   "wind turbine pass:",
//   checkPath(windTurbineCase, windTurbinePassTrace),
// );

// console.log(
//   "wind turbine fail:",
//   checkPath(windTurbineCase, windTurbineFailTrace),
// );

// console.log("tavilyDown:", checkToolErrors(null,tavilyDown));
// console.log("unknownTool:", checkToolErrors(null,unknownTool));

// console.log("pathPass: ", checkPath(passingCase, tavilyDown));
// console.log("pathFail: ", checkPath(failingCase, tavilyDown));

// console.log(
//   "PASS + PASS:",
//   combineResults([{ status: "PASS" }, { status: "PASS" }]),
// );

// console.log(
//   "FAIL + PASS:",
//   combineResults([
//     { status: "FAIL", reason: "Wrong tool path" },
//     { status: "PASS" },
//   ]),
// );

// console.log(
//   "FAIL + ERROR:",
//   combineResults([
//     { status: "FAIL", reason: "Wrong tool path" },
//     { status: "ERROR", reason: "Web search is unavailable" },
//   ]),
// );

// console.log(combineResults([{ status: "OK"} , { status: "PASS"}]));
// console.log(checkPath({ name: "x", input: "y"}, {toolCalls: []}))



const resultsWithUrlTrace = {
  toolCalls: [
    {
      name: "search_web",
      args: {
        query: "example query",
      },
      result: {
        found: true,
        results: [
          {
            title: "Example",
            url: "https://example.com/page",
          },
        ],
      },
    },
  ],
  finalAnswer: "According to https://example.com/page, this is the answer.",
};

const resultsWithoutUrlTrace = {
  toolCalls: [
    {
      name: "search_web",
      args: {
        query: "example query",
      },
      result: {
        found: true,
        results: [
          {
            title: "Example",
            url: "https://example.com/page",
          },
        ],
      },
    },
  ],
  finalAnswer: "This is the answer based on the web results.",
};

const noSearchTrace = {
  toolCalls: [],
  finalAnswer: "This answer does not require web sources.",
};

const failedSearchTrace = {
  toolCalls: [
    {
      name: "search_web",
      args: {
        query: "example query",
      },
      result: {
        found: false,
        error: "Web search is currently unavailable.",
      },
    },
  ],
  finalAnswer: "I cannot provide the requested web-based information.",
};

console.log(
  "1. Results + URL:",
  checkWebAnswerCites({}, resultsWithUrlTrace)
);

console.log(
  "2. Results + no URL:",
  checkWebAnswerCites({}, resultsWithoutUrlTrace)
);

console.log(
  "3. No search + no URL:",
  checkWebAnswerCites({}, noSearchTrace)
);

console.log(
  "4. Failed search + no URL:",
  checkWebAnswerCites({}, failedSearchTrace)
);
