import {
  Gemini_model,
  generationConfigurations,
} from "../models/gemini_model.js";
import extractJsonFromText from "../util/jsonParsor.js";

import { SendSummaryToMake } from "./make_webhook.js";
import { SendObjection } from "./objection_webhook.js";
import { saveOrUpdateRecruiterInterest } from "../util/recruiterInterestController.js";

const model = Gemini_model;
const generationConfig = generationConfigurations;

// Utility to update conversation summary dynamically
async function updateSummary({
  summary,
  latestUserMessage,
  latestAIResponse,
  sessionId,
}) {
  try {
    const prompt = `
  You are a helpful assistant that keeps track of conversation about recruiters try to hire Dileepa.These summaries are about between recruiters and AI assistance. Here is the current summary of the chat:
  "${summary || "No summary yet."}"
  
  Session id is "${sessionId}"
  Now, the recruiter said: "${latestUserMessage}"
  And the Clara replied: "${latestAIResponse}"
  
  - Update the json body. 
  - Deeply reasons and provide exact interest as a percentage of the recruiter in the summary.
  - You should not skyrocket the interest percentage casually , you need to deeply analyze and give the increment or decrement based on the impact of the casuse. 
  - You should deeply analyze the reasons , then you can increase the interest rate based on the impact of the reason.
  - Interest rate is determined by the alignment of the recruiter's needs with Dileepa's skills and experience.
  - Compare new hiring interest percentage with the previous one and provide the difference in percentage and why the recruiter's interest changed and what it casued.
  - Show name, comapany and email of the recruiter in the summary if provided.
  - Summary should be short in bullet points.
  - You should include a time line how interest percentage changed overtime in the summary and provide the reasons for changes in interest.
  - You can use appropriate emojis and proper spacings.
  - You should never set interest percentage value to 0 or 100 .Least value should be 1 and max value should be 99.
  - If the recruiter tells that wants to connect , or has an interest in Dileepa's skills increase the interest rate above 90.
  
  - Give the result in a JSON format for following schema.
  
  const recruiterInterestSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    interestRate: { type: number, required: true },
    recruiterName: { type: String },
    company: { type: String },
    email: { type: String },
    summary: { type: String },
    followupSent: { type: Boolean, default: false },
    reasonNoMatch: { type: String },
  }, { timestamps: true });
  `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    //Convert the response to JSON object
    const JsonObject = extractJsonFromText(result.response.text());

    //Save or update the recruiter interest information in the database
    const recruiterData = {
      sessionId: sessionId,
      interestRate: JsonObject.interestRate,
      recruiterName: JsonObject.recruiterName,
      company: JsonObject.company,
      email: JsonObject.email,
      summary: JsonObject.summary,
      reasonNoMatch: JsonObject.reasonNoMatch,
    };

    const saveResult = await saveOrUpdateRecruiterInterest(recruiterData);

    if (saveResult.success) {
      console.log("Recruiter interest info saved successfully:");

      console.log("Interest Rate:", recruiterData.interestRate);
      console.log("Recruiter Name:", recruiterData.recruiterName);
      console.log("Company:", recruiterData.company);
      console.log("Email:", recruiterData.email);
      console.log("Followup Sent:", JsonObject.followupSent);


      //Send followup if needed
      if (
        recruiterData.interestRate >= 80 &&
        JsonObject.followupSent === false &&
        recruiterData.email !== null &&
        recruiterData.recruiterName !== null &&
        recruiterData.company !== null
      ) {
        
        const recruiterData = {
          sessionId: sessionId,
          interestRate: JsonObject.interestRate,
          recruiterName: JsonObject.recruiterName,
          company: JsonObject.company,
          email: JsonObject.email,
          summary: JsonObject.summary,
          reasonNoMatch: JsonObject.reasonNoMatch,
          followupSent: true,
        };

        const saveResult = await saveOrUpdateRecruiterInterest(recruiterData);

        if (saveResult.success) {
          console.log("Followup Sent:");
          //Send summary to Make
          SendSummaryToMake(
            JsonObject.summary,
            JsonObject.recruiterName,
            JsonObject.email
          );
        }

        console.log("Summary sent to Make successfully.");
      }
    } else {
      console.error("Error saving recruiter interest info:", saveResult.error);
    }


    //Send objections if has
    if(recruiterData.reasonNoMatch !== null){
      console.log("Reason No Match:", recruiterData.reasonNoMatch);
      SendObjection(recruiterData.reasonNoMatch,recruiterData.summary);
    }

    return JsonObject;
  } catch (error) {
    console.error("Summary Update Error:", error);
    return summary; // fallback to previous summary
  }
}

// Export the updateSummary function for use in other modules
export { updateSummary };
