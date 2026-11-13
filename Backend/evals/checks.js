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
          ", "
        )}], got [${path.join(", ")}]`,
      };
    }

    for (let i = 0; i < expected.length; i++) {
      if (path[i] !== expected[i]) {
        return {
          status: "FAIL",
          reason: `Expected path [${expected.join(
            ", "
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
    status: "FAIL",
    reason: "Test case has no path requirements",
  };
}

export function checkToolErrors(testCase,trace) {
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

export function combineResults(results){
  const reasons = results.filter((result) => result.status !==  "PASS").map((result) => result.reason);

  let status = "PASS";

  if(results.some((result) => result.status === "ERROR")){
    status = "ERROR";
  }else if(results.some((result) => result.status === "FAIL")){
    status = "FAIL";
  }

  return {
    status,
    reasons,
  };
}
