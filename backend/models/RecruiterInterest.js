import mongoose from 'mongoose';

const recruiterInterestSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  interestRate: { type: Number, required: true },
  recruiterName: { type: String },
  company: { type: String },
  email: { type: String },
  summary: { type: String },
  followupSent: { type: Boolean, default: false },
  reasonNoMatch: { type: String },
}, { timestamps: true });

const RecruiterInterest = mongoose.model('RecruiterInterest', recruiterInterestSchema);
export default RecruiterInterest;
