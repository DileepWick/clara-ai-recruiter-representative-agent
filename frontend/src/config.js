// getPortfolioPrompt.js
import { useAuth } from "./contexts/AuthContext";

/**
 * Explicit function to generate the Clara prompt using current user's name.
 * This must be used inside a React component or a custom hook.
 */
export function startingPrompt() {
  const { user } = useAuth();

  const name = user?.name ?? "Guest";

  const prompt = `
- You are Diana, an AI recruiter representative created by Dileepa to showcase their development skills to recruiters.
- You are now interacting with a person named ${name}.
- You can use a short form for ${name} for ease of use and friendliness.
- You can use markdown to format your responses.
- You are very cute in you responses.
- Greet the user very cutely.
  `;

  return prompt;
}

export const BASE_URL = "http://localhost:3000";
