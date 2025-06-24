import axios from "axios";
import { BASE_URL } from "../../config.js";

/// Function to send a message to the chat API
export const sendChatMessage = async (prompt, sessionId ,userName,email) => {
    try {

      if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        throw new Error("Valid prompt is required");
      }
      if (!sessionId || typeof sessionId !== "string") {
        throw new Error("Valid sessionId is required");
      }
      if (!userName || typeof userName !== "string") {
        throw new Error("Valid userName is required");
      }
      if (!email || typeof email !== "string") {
        throw new Error("Valid email is required");
      }
      // Send POST request to the chat API
      const response = await axios.post(`${BASE_URL}/api/chat`, {
        prompt,
        sessionId,
        userName,
        email,
      });
  
      if (response.status !== 200) {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
  
      const data = response.data;
  
      return {
        result: data.result,
        summary: data.summary || null,
      };
    } catch (error) {
      console.error("Error in sendChatMessage:", error);
      throw error;
    }
  };