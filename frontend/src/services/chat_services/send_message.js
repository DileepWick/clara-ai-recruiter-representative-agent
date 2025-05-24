import axios from "axios";
import { BASE_URL } from "../../config.js";

/// Function to send a message to the chat API
export const sendChatMessage = async (prompt, sessionId) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/chat`, {
        prompt,
        sessionId,
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