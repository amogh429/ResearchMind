import { toolRegistry } from "../tools/index.js";

const show = (names) => (names.length ? names.join(" -> ") : "no tools");

export function checkPath(testCase, trace) {
  const path = trace.toolCalls.map((call) => call.name);

  if (testCase.expectedPath) {
    const expected = testCase.expectedPath;

    if (path.length !== expected.length) {
      return {
        status: "FAIL",
        reason: `Expected path [${expected.join(
          ", ",
        )}], got [${path.join(", ")}]`,
      };
    }

    for (let i = 0; i < expected.length; i++) {
      if (path[i] !== expected[i]) {
        return {
          status: "FAIL",
          reason: `Expected path [${expected.join(
            ", ",
          )}], got [${path.join(", ")}]`,
        };
      }
    }

    return {
      status: "PASS",
    };
  }

  if (testCase.mustCall || testCase.mustNotCall) {
    const problems = [];

    for (const name of testCase.mustCall ?? []) {
      if (!path.includes(name)) {
        problems.push(`Expected tool "${name}" to be called`);
      }
    }

    for (const name of testCase.mustNotCall ?? []) {
      if (path.includes(name)) {
        problems.push(`Tool "${name}" should not have been called`);
      }
    }

    if (problems.length > 0) {
      return {
        status: "FAIL",
        reason: problems.join("; "),
      };
    }

    return {
      status: "PASS",
    };
  }

  return {
    status: "ERROR",
    reason: "Test case has no path requirements",
  };
}

export function checkToolErrors(testCase, trace) {
  for (const toolCall of trace.toolCalls) {
    const tool = toolRegistry[toolCall.name];

    if (!tool) {
      return {
        status: "FAIL",
        reason: `Tool "${toolCall.name}" is not registered`,
      };
    }

    if (toolCall.result?.error) {
      return {
        status: "ERROR",
        reason: `Tool "${toolCall.name}" failed: ${toolCall.result.error}`,
      };
    }
  }

  return {
    status: "PASS",
  };
}

export function combineResults(results) {
  const reasons = results
    .filter((result) => result.status !== "PASS")
    .map((result) => result.reason);

  let status = "PASS";

  for (const result of results) {
    if (
      result.status !== "PASS" &&
      result.status !== "FAIL" &&
      result.status !== "ERROR"
    ) {
      status = "ERROR";
      reasons.push(`Unrecognized check status: ${result.status}`);
      continue;
    }

    if (result.status === "ERROR") {
      status = "ERROR";
    } else if (result.status === "FAIL" && status !== "ERROR") {
      status = "FAIL";
    }
  }

  return {
    status,
    reasons,
  };
}

export function checkNoFallback(_testCase, trace) {
  if (trace.fallbackMessageUsed) {
    return {
      status: "FAIL",
      reason:
        "Coordinator use the fallback message after reaching the lookup cap.",
    };
  }

  return {
    status: "PASS",
  };
}


function normalizeUrl(url){
  return url.trim().replace(/[.,;:!]+$/, "").replace(/\/+$/, "");
};

export function checkUrlsFromSearch(_testCase,trace){
  const allowedUrls = new Set();

  for(const toolCall of trace.toolCalls ?? []){
    if(toolCall.name !== "search_web"){
      continue;
    }

    const results = toolCall.result?.results;

    if(!Array.isArray(results)){
      continue;
    }

    for(const result of results){
      if(typeof result.url === "string"){
        allowedUrls.add(normalizeUrl(result.url));
      }
    }
  }

  const answer = trace.finalAnswer ?? trace.answer ;

  if(typeof answer !== "string"){
    return {
      status: "ERROR",
      reason: "Trace final answer must be a string",
    };
  }

  const answerUrls = answer.match(/https?:\/\/[^\s)\]>"']+/g) ?? [];

  const normalizeAnswerUrls = [
    ...new Set(answerUrls.map(normalizeUrl)),
  ];

  if(normalizeAnswerUrls.length === 0){
    return {
      status: "PASS",
    };
  }

  const unsupportedUrls = normalizeAnswerUrls.filter(
    (url) => !allowedUrls.has(url)
  );

  if(unsupportedUrls.length > 0){
    return {
      status: "FAIL",
      reason: `Answer contains  URLs not found in search_web results: ${unsupportedUrls.join(", ")}`,
    };
  }

  return {
    status: "PASS",
  }
};

function extractUrls(text) {
  return text.match(/https?:\/\/[^\s)\]>"']+/g) ?? [];
}

export function checkWebAnswerCites(_testCase,trace){

  const answer = trace.finalAnswer ;

  if(typeof answer !== "string"){
    return {
      status: "ERROR",
      reason: "Trace final answer must be a string",
    };
  }

  let webResultsFound = false;
  for(const toolCall of trace.toolCalls ?? []){
    if(toolCall.name !== "search_web"){
      continue;
    }

    const results = toolCall.result?.results;

    if(Array.isArray(results) && results.length > 0){
      webResultsFound = true;
      break;
    }
  }

  if(!webResultsFound){
    return{
      status: "PASS",
    };
  }

  const answerUrls = extractUrls(answer);

  if(answerUrls.length > 0){
    return {
      status: "PASS",
    };
  }
  return{
    status: "FAIL",
    reason: "Web results were found but the answer cited no source."
  };
}

