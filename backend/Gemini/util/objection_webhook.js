import axios from 'axios';

// 🔁 Utility to send data to Make
const SendObjection = async (objection,summary) => {

   console.log("Sending data to Make objection hook");
   console.log("Objection:", objection);
   console.log("Summary:", summary);

    try {
      const response = await axios.post('https://hook.eu2.make.com/qn1nmtje9kt146vxncvjc9tmulne6yj6', {
        objections:objection,
        summary: summary,
      });

      if (response.status == 200) {
        console.log("Objection triggered successfully:", response.data);
      }
    } catch (error) {
      console.error("Error sending data to Make:", error.message);
    }
  };

export { SendObjection };