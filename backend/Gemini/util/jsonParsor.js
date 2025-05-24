
// This function takes a string containing JSON data, removes any code block formatting, and parses it into a JavaScript object.
export default function extractJsonFromText(rawText) {
    try {
      // Remove code block formatting and trim
      const cleaned = rawText
        .replace(/```json|```/g, '') // remove ```json and ```
        .trim();
      // Parse the cleaned string into JSON
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON parsing failed:", err.message);
      return null;
    }
  }
  