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
  - The engagement level is determined by the variety and depth of the user's messages, as well as the AI's responses.
  - You need explicitly mention the engagement level percentage in the summary.
  - When increasing the engagement level, consider the value of the latest user message and AI response.
  - Use a short bullet-point format for the overall summary. It should be concise but informative.
  - Include a timeline showing how engagement level changed over the session or across multiple sessions. Explain each change with its reason.
  - Use appropriate emojis and spacing to make the summary readable, friendly, and professional.
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

    // Save or update the recruiter interest information
    const saveResultOuter = await saveOrUpdateRecruiterInterest(recruiterData);

    if (saveResultOuter.success) {
     
      if (
        saveResultOuter.data.engagementPercentage >= 25 &&
        saveResultOuter.data.email !== null &&
        saveResultOuter.data.userName !== null &&
        saveResultOuter.data.casualEngagementFollowupSent === false
      ) {
        console.log("Casual Engagement Followup Detected. Sending followup...");
        const recruiterData = {
          sessionId: sessionId,
          engagementPercentage: saveResultOuter.data.engagementPercentage,
          casualEngagementFollowupSent: true,
        };
        const saveResult = await saveOrUpdateRecruiterInterest(recruiterData);
      
        // Check if the save operation was successful
        if (saveResult.success) {
          console.log("Followup Sent successfully ✅");
          //Send summary to Make
          SendSummaryToMake(JsonObject.summary, userName, email,saveResultOuter.data.engagementPercentage);
        }
      }if (
        saveResultOuter.data.engagementPercentage >= 50 &&
        saveResultOuter.data.email !== null &&
        saveResultOuter.data.userName !== null &&
        saveResultOuter.data.activeEngagementFollowupSent === false
      ) {
        console.log("Active Engagement Followup Detected. Sending followup...");
        const recruiterData = {
          sessionId: sessionId,
          engagementPercentage: saveResultOuter.data.engagementPercentage,
          activeEngagementFollowupSent: true,
        };
        const saveResult = await saveOrUpdateRecruiterInterest(recruiterData);
      
        // Check if the save operation was successful
        if (saveResult.success) {
          SendSummaryToMake(JsonObject.summary, userName, email,saveResultOuter.data.engagementPercentage);
        }
      }if (
        saveResultOuter.data.engagementPercentage >= 75 &&
        saveResultOuter.data.engagementPercentage < 100 &&
        saveResultOuter.data.email !== null &&
        saveResultOuter.data.userName !== null &&
        saveResultOuter.data.deepEngagementFollowupSent === false
      ) {
        console.log("Deep Engagement Followup Detected. Sending followup...");
        const recruiterData = {
          sessionId: sessionId,
          engagementPercentage: saveResultOuter.data.engagementPercentage,
          deepEngagementFollowupSent: true,
        };
        const saveResult = await saveOrUpdateRecruiterInterest(recruiterData);
      
        // Check if the save operation was successful
        if (saveResult.success) {
          SendSummaryToMake(JsonObject.summary, userName, email,saveResultOuter.data.engagementPercentage);
        }
      }
    } 

    //Send objections if has
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
