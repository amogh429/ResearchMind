const show = (names) => (names.length ? names.join(" -> ") : "no tools");

export function checkPath(testCases, trace){
    const actual = trace.toolCalls.map((call) => call.name);

    // Style 1: an exact sequence
    if(testCases.expectedPath){
        const expected = testCases.expectedPath;
        const same = actual.length === expected.length &&
            actual.every((name,i) => name === expected[i]);

        return same
        ?  { passed: true }
        : { passed: false,
            reason: `Expected path [${show(expected)}] but got [${show(actual)}]`,
        };
    }

    // Style 2: tools that must and must not be called
    const missing = (testCases.mustCall ?? []).filter((n) => !actual.includes(n));
    const forbidden  = (testCases.mustNotCall ?? []).filter((n) => actual.includes(n));

    if(missing.length === 0 && forbidden.length === 0) return { passed: true };

    const problem = [];
    if(missing.length) problems.push(`Never called: ${missing.join(", ")}`);
    if(forbidden.length) problems.push(`Called forbidden tool: ${forbidden.join(", ")}`);

    return {
        passed: false,
        reason: `${problems.join("; ")} (actual path: [${show(actual)})]`,
    };
}
