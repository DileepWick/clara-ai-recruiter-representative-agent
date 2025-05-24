import RecruiterInterest from '../models/RecruiterInterest.js';

export const getAllRecruiterInterests = async (req, res) => {
  try {
    const interests = await RecruiterInterest.find().sort({ createdAt: -1 }); // Optional: sort by newest
    res.status(200).json(interests);
  } catch (error) {
    console.error('Error fetching recruiter interests:', error);
    res.status(500).json({ message: 'Server error while retrieving recruiter interests.' });
  }
};
