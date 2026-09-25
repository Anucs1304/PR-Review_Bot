//main LLM agent logic
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config(); // Load OPENAI_API_KEY

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/*
 reviewDiff(diffText),
Sends a PR diff to the LLM and returns structured JSON review comments.
 */
export async function reviewDiff(diffText) {
  try {
    // Load system prompt
    const systemPrompt = fs.readFileSync(
      path.join(process.cwd(), "prompts/review.txt"),
      "utf8"
    );

    // Send diff to LLM
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Analyze this pull request diff and return structured JSON:\n\n${diffText}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;

    console.log("LLM Review JSON Output:");
    console.log(content);

    return JSON.parse(content);

  } catch (error) {
    console.error("Error in reviewDiff:", error);
    return {
      comments: [
        {
          file: "unknown",
          line: 0,
          severity: "critical",
          comment: "LLM failed to generate review comments."
        }
      ]
    };
  }
}

/*Loads system prompt - review.txt
sends the PR diff to the LLM 
Forces structured JSON output, so GitHub Actions can parse it.
Return clear JSON
Includes error fallback
*/