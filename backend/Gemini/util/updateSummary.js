import {
  Gemini_model,
  generationConfigurations,
} from "../models/gemini_model.js";
import extractJsonFromText from "../util/jsonParsor.js";

import { SendSummaryToMake } from "./make_webhook.js";
import { SendObjection } from "./objection_webhook.js";
import { saveOrUpdateRecruiterInterest , getFollowupStatus} from "../util/recruiterInterestController.js";

const model = Gemini_model;
const generationConfig = generationConfigurations;

// Utility to update conversation summary dynamically
async function updateSummary({
  summary,
  latestUserMessage,
  latestAIResponse,
  sessionId,
  userName,
  email,
}) {
  try {
    const prompt = `
  You are Clara, a helpful assistant that keeps track of conversation about users interested in Dileepa's professional skills , potential job opportunities, and educational qualifications. 
  These summaries are about between users and AI assistance. Here is the current summary of the chat:
  "${summary || "No summary yet."}"
  
  Session id is "${sessionId}"
  Now, the user said: "${latestUserMessage}"
  And the Clara replied: "${latestAIResponse}"
  
  - Update the json body. 
  - Reasons and provide exact engagement level as a percentage of the user in the summary. 
  - You mainly focus on the user's engagement , not the AI's response.
  - You can only increase the engagement level, never decrease it.
  - You can only increase the engagement level by 1% to 15% at a time.
  - When increasing the engagement level, consider the value of the latest user message and AI response.
  - Use a short bullet-point format for the overall summary. It should be concise but informative.
  - Include a timeline showing how engagement level changed over the session or across multiple sessions. Explain each change with its reason.
  - Use appropriate emojis and spacing to make the summary readable, friendly, and professional.
  - Never assign the engagement level a value of 0% or 100%.The minimum allowed is 1%, and The maximum allowed is 99%.
  - Provide objections if Dileepa's skills don't match the user's interest.
  - Do not use ** or any other markdown formatting.
  - You can not use asterisk at all.
  - You only need to provide the JSON object as a response.
  - Use emojis to make the summary more engaging , formatted and friendly.
  - Summary should be very detailed and informative.
  
  - Give the result in a JSON format for following schema.
  
  const recruiterInterestSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    engagementPercentage: { type: number, required: true },
    summary: { type: String },
    objections: { type: String },
  }, { timestamps: true });
  `;

    const followUpStatus = await getFollowupStatus(sessionId);

    // Use a safe generation function to handle potential overloads
    async function safeGenerateContent(
      model,
      prompt,
      generationConfig,
      retries = 3,
      delay = 1000
    ) {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
          });
          return result; // ✅ success
        } catch (err) {
          if (err.status === 503 && attempt < retries - 1) {
            console.warn(
              `⚠️ Gemini model overloaded. Retrying in ${delay}ms... (Attempt ${
                attempt + 1
              }/${retries})`
            );
            await new Promise((res) => setTimeout(res, delay));
            delay *= 2; // exponential backoff
          } else {
            console.error("❌ Gemini generation failed:", err);
            throw err; // rethrow if final attempt or different error
          }
        }
      }
    }

    // Generate content using the model
    const result = await safeGenerateContent(model, prompt, generationConfig);

    //Convert the response to JSON object
    const JsonObject = extractJsonFromText(result.response.text());

    //update the recruiter interest information in the database
    const recruiterData = {
      sessionId: sessionId,
      engagementPercentage: JsonObject.engagementPercentage,
      summary: JsonObject.summary,
      objections: JsonObject.objections,
      userName: userName,
      email: email,
    };

    const saveResult = await saveOrUpdateRecruiterInterest(recruiterData);

    if (saveResult.success) {
      console.log("User info saved successfully ✅");
      console.log("User Name:", recruiterData.userName);
      console.log("Email:", recruiterData.email);
      console.log("followupSent before:", followUpStatus);

      //Send followup if needed
      if (
        recruiterData.engagementPercentage >= 50 &&
        recruiterData.email !== null &&
        recruiterData.userName !== null &&
        followUpStatus === false
      ) {
        console.log("Followup needed, sending summary to Make...🚀");
        const recruiterData = {
          sessionId: sessionId,
          engagementPercentage: JsonObject.engagementPercentage,
          followupSent: true,
        };

        const saveResult = await saveOrUpdateRecruiterInterest(recruiterData);

        console.log("followupSent after:", recruiterData.followupSent);

        // Check if the save operation was successful
        if (saveResult.success) {
          console.log("Followup Sent successfully ✅");
          //Send summary to Make
          SendSummaryToMake(JsonObject.summary, userName, email);
        }

        console.log("Summary sent to Make successfully.");
      }
    } else {
      console.error("Error saving recruiter interest info:", saveResult.error);
    }

    // //Send objections if has
    // if(recruiterData.objections !== null){
    //   console.log("Reason No Match:", recruiterData.objections);
    //   SendObjection(recruiterData.objections,recruiterData.summary);
    // }

    return JsonObject;
  } catch (error) {
    console.error("Summary Update Error:", error);
    return summary; // fallback to previous summary
  }
}

// Export the updateSummary function for use in other modules
export { updateSummary };
