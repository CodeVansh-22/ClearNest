import Poll from '../models/Poll.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

class VoteController {
  /**
   * POST /api/v1/votes/create
   */
  static createPoll = asyncHandler(async (req, res) => {
    const { societyId, userId } = req;
    const { question, description, options, expiresAt, isAnonymous } = req.body;

    const poll = await Poll.create({
      societyId,
      createdBy: userId,
      question,
      description,
      options: options.map(opt => ({ text: opt })),
      expiresAt: new Date(expiresAt),
      isAnonymous,
    });

    ApiResponse.created('Poll created successfully', poll).send(res);
  });

  /**
   * POST /api/v1/votes/cast
   */
  static castVote = asyncHandler(async (req, res) => {
    const { userId } = req;
    const { pollId, optionIndex } = req.body;

    const poll = await Poll.findById(pollId);
    if (!poll) {
      throw ApiError.notFound('Poll not found.');
    }

    if (poll.status !== 'Active' || poll.expiresAt < new Date()) {
      throw ApiError.badRequest('This poll is no longer active.');
    }

    // Check if user already voted
    const alreadyVoted = poll.votes.find(v => v.userId.toString() === userId);
    if (alreadyVoted) {
      throw ApiError.badRequest('You have already voted in this poll.');
    }

    // Add vote
    poll.votes.push({
      userId,
      optionIndex,
    });

    // Update count
    poll.options[optionIndex].voteCount += 1;

    await poll.save();

    ApiResponse.ok('Vote cast successfully').send(res);
  });

  /**
   * GET /api/v1/votes/results/:id
   */
  static getResults = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const poll = await Poll.findById(id);

    if (!poll) {
      throw ApiError.notFound('Poll not found.');
    }

    ApiResponse.ok('Results fetched', {
      question: poll.question,
      options: poll.options,
      totalVotes: poll.votes.length,
      status: poll.status,
    }).send(res);
  });

  /**
   * GET /api/v1/votes
   */
  static getActivePolls = asyncHandler(async (req, res) => {
    const { societyId } = req;
    const polls = await Poll.find({ societyId, status: 'Active' })
      .sort({ createdAt: -1 });

    ApiResponse.ok('Polls fetched', polls).send(res);
  });
}

export default VoteController;
