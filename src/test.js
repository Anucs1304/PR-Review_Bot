import { getDiff } from "./utils.js";
import { reviewDiff } from "./agent.js";

async function startReview() {
  const diff = getDiff();
  const result = await reviewDiff(diff);
  console.log("LLM Review Output:\n", result);
}

function test() {
    if (x = 5) {
        console.log("bug");
    }
}
