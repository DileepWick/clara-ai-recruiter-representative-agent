import RecruiterInterest from '../../models/RecruiterInterest.js'; // Adjust the import path as necessary

// Function to save or update recruiter interest information
export const saveOrUpdateRecruiterInterest = async (recruiterData) => {
  try {
    const { sessionId, engagementPercentage} = recruiterData;

    if (!sessionId || !engagementPercentage) {
      throw new Error('sessionId and engagementPercentage are required');
    }

    const updatedData = await RecruiterInterest.findOneAndUpdate(
      { sessionId },
      recruiterData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return {
      success: true,
      message: 'Recruiter interest info saved successfully',
      data: updatedData,
    };
  } catch (error) {
    console.error('Error in saving recruiter interest:', error);
    return {
      success: false,
      error: error.message || 'Internal server error',
    };
  }
};

//Function to get followup status
export const getFollowupStatus = async (sessionId) => {
  try {
    if (!sessionId) {
      throw new Error('sessionId is required');
    }

    const recruiterInterest = await RecruiterInterest.findOne({ sessionId });

    if (!recruiterInterest) {
      return false;
    } else {
      return recruiterInterest.followupSent;
    }
  } catch (error) {
    console.error('Error in getting followup status:', error);
    return {
      success: false,
      error: error.message || 'Internal server error',
    };
  }
};