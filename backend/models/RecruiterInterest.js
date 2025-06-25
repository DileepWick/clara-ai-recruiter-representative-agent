import mongoose from 'mongoose';

const recruiterInterestSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  engagementPercentage: { type: Number, required: true },
  userName: { type: String },
  email: { type: String },
  summary: { type: String },
  casualEngagementFollowupSent: { type: Boolean, default: false },
  activeEngagementFollowupSent: { type: Boolean, default: false },
  deepEngagementFollowupSent: { type: Boolean, default: false },
  objections: { type: String },
}, { timestamps: true });

const RecruiterInterest = mongoose.model('RecruiterInterest', recruiterInterestSchema);
export default RecruiterInterest;
