import { getPullRequestDiff } from "../src/utils.js";
import { reviewDiff } from "../src/agent.js";
import { postReviewComments } from "../src/github.js";

async function main() {
  try {
    const repoFull = process.env.REPO; 
    const [owner, repo] = repoFull.split("/");
    const pull_number = process.env.PR_NUMBER;

    console.log(`Running AI Review on PR #${pull_number} in ${owner}/${repo}`);

    //Fetch PR diff
    const diff = await getPullRequestDiff({ owner, repo, pull_number });

    if (!diff || diff.trim().length === 0) {
      console.log("No diff found. Exiting.");
      return;
    }

    console.log("Diff fetched successfully.");

    // Send diff to LLM agent
    const review = await reviewDiff(diff);

    if (!review || !review.comments || review.comments.length === 0) {
      console.log("No review comments generated.");
      return;
    }

    console.log(`Generated ${review.comments.length} review comments.`);

    //Post comments to GitHub
    await postReviewComments({
      owner,
      repo,
      pull_number,
      comments: review.comments
    });

    console.log("AI PR Review completed successfully.");

  } catch (error) {
    console.error("Error running AI PR Review:", error);
    process.exit(1);
  }
}

main();

/*reads environment variables from GitHub Actions
Fetches the PR diff
sends the diff to LLM agent
Posts inline comments
Logs everything*/