//octokit wrapper for posting comments
import { Octokit } from "@octokit/rest";

/*
Initialize Octokit with GitHub token
 */
export function getOctokit() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN is missing. GitHub Actions must provide it.");
  }

  return new Octokit({ auth: token });
}

/*
postReviewComments
Takes structured JSON from the LLM agent and posts inline comments on the PR.
 */
export async function postReviewComments({
  owner,
  repo,
  pull_number,
  comments
}) {
  const octokit = getOctokit();

  for (const c of comments) {
    try {
      console.log(`Posting comment on ${c.file}:${c.line}`);

      await octokit.pulls.createReviewComment({
        owner,
        repo,
        pull_number,
        body: `[${c.severity.toUpperCase()}] ${c.comment}`,
        commit_id: await getLatestCommitSHA(octokit, owner, repo, pull_number),
        path: c.file,
        line: c.line
      });

    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  }
}

/*
 Get latest commit SHA for the PR
 */
async function getLatestCommitSHA(octokit, owner, repo, pull_number) {
  const { data } = await octokit.pulls.get({
    owner,
    repo,
    pull_number
  });

  return data.head.sha;
}
/* GitHub actions automatically injects the token.
Posts inline comments.
Uses latest commit SHA since github requires it. 
Formats comments with severity (eg: missing error handling here.).
Logs everything for debugging*/