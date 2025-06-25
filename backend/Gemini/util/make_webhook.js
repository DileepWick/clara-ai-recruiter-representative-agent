import axios from 'axios';

// 🔁 Utility to send data to Make
const SendSummaryToMake = async (updatedSum,recruiterName,email, engamentPercentage) => {

    try {
      const response = await axios.post('https://hook.eu2.make.com/7fjb5ls55onc53dcipg2v4s91wyv9v5d', {
        recruiter:recruiterName,
        email:email,
        summary: updatedSum,
        engamentPercentage: engamentPercentage
      });

      if (response.status == 200) {
        console.log("Webhook triggered successfully:", response.data);
      }
    } catch (error) {
      console.error("Error sending data to Make:", error.message);
    }
  };

export { SendSummaryToMake };