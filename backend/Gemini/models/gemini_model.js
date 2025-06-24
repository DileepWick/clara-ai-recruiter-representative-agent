import { GoogleGenerativeAI } from "@google/generative-ai";
import { Gemini_API_KEY } from "../../config.js";

// Initialize the Google Generative AI client with the API key
const genAI = new GoogleGenerativeAI(Gemini_API_KEY);

// Get the Gemini model
const Gemini_model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

// Define the generation configurations
const generationConfigurations = {
  temperature: 1.0,
  topP: 0.1,
  topK: 10,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Export the model and configurations for use in other parts of the application
export { Gemini_model, generationConfigurations };
