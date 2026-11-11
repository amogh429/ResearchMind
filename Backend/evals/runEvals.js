import "dotenv/config";

import { connectDB, closeDB } from "../db.js";
import { runCoordinator } from "../coordinator.js";
import { testCases } from "./cases.js";
import { checkPath } from "./checks.js";

async function runEvals() {
  const results = [];

  await connectDB();

  try {
    for (const testCase of testCases) {
      try {
        const trace = await runCoordinator(testCase.input);
        const result = checkPath(testCase, trace);

        if (result.passed) {
          console.log(`PASS ${testCase.name}`);

          results.push({
            name: testCase.name,
            status: "PASS",
          });
        } else {
          console.log(`FAIL ${testCase.name}`);
          console.log(`  ${result.reason}`);

          results.push({
            name: testCase.name,
            status: "FAIL",
            reason: result.reason,
          });
        }
      } catch (error) {
        console.log(`ERROR ${testCase.name}`);
        console.log(`  ${error.message}`);

        results.push({
          name: testCase.name,
          status: "ERROR",
          reason: error.message,
        });
      }
    }

    const passed = results.filter(
      (result) => result.status === "PASS"
    ).length;

    const failed = results.filter(
      (result) => result.status === "FAIL"
    ).length;

    const errored = results.filter(
      (result) => result.status === "ERROR"
    ).length;

    console.log("\nSummary");
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Errored: ${errored}`);

    if (failed > 0 || errored > 0) {
      process.exitCode = 1;
    }
  } finally {
    await closeDB();
  }
}

runEvals();
