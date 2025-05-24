import axios from "axios";
import { BASE_URL } from "../../config";

export const getAllInterests = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/recruiter-interests`);
    return response.data;
  } catch (error) {
    console.error("Error fetching interests:", error);
    throw error;
  }
}