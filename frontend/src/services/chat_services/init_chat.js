import axios from "axios";
import { BASE_URL} from "../../config.js";

export const initChat = async (sessionId,prompt) => {
  try {
    // Initialize the chat session with the backend
    const sessionResponse = await axios.post(
      `${BASE_URL}/api/chat/init`,
      {
        sessionId: sessionId,
        characterPrompt: prompt,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (sessionResponse.status !== 200) {
      throw new Error("Failed to initialize chat session");
    }

    return sessionResponse.data.result;
  } catch (error) {
    console.error("Error initializing chat:", error);
    return null; // Fallback message if API fails

  }
}
