import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: String,
      required: [true, 'Poll question is required'],
      trim: true,
    },
    description: String,
    options: [{
      text: { type: String, required: true },
      voteCount: { type: Number, default: 0 },
    }],
    votes: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      optionIndex: Number,
      votedAt: { type: Date, default: Date.now },
    }],
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Cancelled'],
      default: 'Active',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Poll = mongoose.model('Poll', pollSchema);
export default Poll;
