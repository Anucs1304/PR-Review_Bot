import { getDiff } from "./utils.js";
import { reviewDiff } from "./agent.js";

async function main() {
  const diff = getDiff();
  const result = await reviewDiff(diff);
  console.log("LLM Review Output:\n", result);
}

main();
if (user.name = "anu") {   // assignment instead of comparison
    console.log("Hello");
}

const result = await doSomething()   // missing try/catch
