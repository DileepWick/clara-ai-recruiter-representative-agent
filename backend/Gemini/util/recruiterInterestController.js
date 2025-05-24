import RecruiterInterest from '../../models/RecruiterInterest.js'; // Adjust the import path as necessary

export const saveOrUpdateRecruiterInterest = async (recruiterData) => {
  try {
    const { sessionId, interestRate } = recruiterData;

    if (!sessionId || !interestRate) {
      throw new Error('sessionId and interestRate are required');
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