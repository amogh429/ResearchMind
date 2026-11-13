import "dotenv/config";

import { connectDB, closeDB } from "../db.js";
import { runCoordinator } from "../coordinator.js";
import { testCases } from "./cases.js";
import { checkPath, checkToolErrors, combineResults } from "./checks.js";

const checks = [checkPath, checkToolErrors];

async function runEvals() {
  const results = [];

  await connectDB();

  try {
    for (const testCase of testCases) {
      try {
        const trace = await runCoordinator(testCase.input);

        const checkResults = checks.map((check) => check(testCase, trace));
        const result = combineResults(checkResults);

        console.log(`${result.status} ${testCase.name}`);

        for (const reason of result.reasons) {
          console.log(` ${reason}`);
        }

        results.push({
          name: testCase.name,
          status: result.status,
          reasons: result.reasons,
        });
      } catch (error) {
        console.log(`ERROR ${testCase.name}`);
        console.log(`  ${error.message}`);

        results.push({
          name: testCase.name,
          status: "ERROR",
          reasons: [error.message],
        });
      }
    }

    const passed = results.filter((result) => result.status === "PASS").length;

    const failed = results.filter((result) => result.status === "FAIL").length;

    const errored = results.filter(
      (result) => result.status === "ERROR",
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
