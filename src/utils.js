//diff parsing, formatting helpers
import { Octokit } from "@octokit/rest";
import { execSync } from "child_process";

/*
LOCAL TESTING ONLY
Reads the diff of the last commit on your local machine.
*/
export function getLocalDiff() {
  try {
    return execSync("git diff HEAD~1", { encoding: "utf8" });
  } catch (err) {
    console.error("Failed to read local diff:", err);
    return "";
  }
}

/*
GITHUB ACTIONS
Fetches the pull request diff using GitHub's REST API.
*/
export async function getPullRequestDiff({ owner, repo, pull_number }) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN is missing. GitHub Actions must provide it.");
  }

  const octokit = new Octokit({ auth: token });

  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}",
      {
        owner,
        repo,
        pull_number,
        mediaType: { format: "diff" }
      }
    );

    return response.data;
  } catch (err) {
    console.error("Failed to fetch PR diff:", err);
    return "";
  }
}
/*supports local testing, "getLocalDiff()" run npm test and agent will analyze the local commit diff.
Fetches real PR diffs inside GitHub Actions, getPullRequestDiff() returns the raw unified diff.
Uses github token.
includes error handling*/