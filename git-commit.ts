import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Please set GEMINI_API_KEY in environment");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// Utility: sleep for X milliseconds
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Generate commit message with retry + delay
export async function getCommitMessage(
  diff: string,
  retries = 3,
  delayMs = 2000
): Promise<string> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Generate a concise conventional git commit message (type: feat, fix, chore) for the following git diff:\n${diff}`,
              },
            ],
          },
        ],
        config: {
          systemInstruction: {
            role: "system",
            parts: [
              {
                text: "You are an assistant that writes meaningful git commit messages in conventional commit format (feat, fix, chore). Provide a short summary.",
              },
            ],
          },
          temperature: 0.3,
        },
      });

      // Return trimmed commit message
      return response.text?.trim() as string;
    } catch (err: any) {
      console.warn(
        `Attempt ${attempt + 1} failed: ${err?.message || err}. Retrying in ${delayMs}ms...`
      );
      await sleep(delayMs);
    }
  }

  console.error("Failed to generate commit message after retries, using fallback.");
  return "chore: update files"; // fallback message
}

// CLI usage: read diffs from stdin
if (require.main === module) {
  (async () => {
    let diff = "";
    process.stdin.on("data", (chunk) => {
      diff += chunk;
    });

    process.stdin.on("end", async () => {
      // Add small delay between requests if batching multiple diffs
      await sleep(500); // optional initial delay
      const msg = await getCommitMessage(diff);
      console.log(msg);
    });
  })();
}
