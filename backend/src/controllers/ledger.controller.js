import Transaction from '../models/Transaction.js';
import Society from '../models/Society.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

class LedgerController {
  /**
   * GET /api/v1/ledger
   */
  static getTransactions = asyncHandler(async (req, res) => {
    const { societyId } = req;
    
    if (!societyId) {
      throw ApiError.badRequest('Society ID is required to fetch ledger.');
    }

    const transactions = await Transaction.find({ societyId })
      .sort({ date: -1 })
      .limit(100);

    ApiResponse.ok('Transactions fetched successfully', transactions).send(res);
  });

  /**
   * POST /api/v1/ledger
   */
  static addTransaction = asyncHandler(async (req, res) => {
    const { societyId, userId } = req;
    const { description, amount, type, category, date, paymentMethod } = req.body;

    if (!societyId) {
      throw ApiError.badRequest('Society ID is required to add transaction.');
    }

    const transaction = await Transaction.create({
      societyId,
      description,
      amount,
      type,
      category,
      date: date || new Date(),
      paymentMethod,
      performedBy: userId,
    });

    // Update society wallet balance
    const society = await Society.findById(societyId);
    if (society) {
      if (type === 'income') {
        society.wallet.balance += amount;
        society.wallet.totalIncome += amount;
      } else {
        society.wallet.balance -= amount;
        society.wallet.totalExpense += amount;
      }
      await society.save();
    }

    ApiResponse.created('Transaction added successfully', transaction).send(res);
  });

  /**
   * GET /api/v1/ledger/analytics
   */
  static getAnalytics = asyncHandler(async (req, res) => {
    const { societyId } = req;

    if (!societyId) {
      throw ApiError.badRequest('Society ID is required for analytics.');
    }

    const society = await Society.findById(societyId);
    if (!society) {
      throw ApiError.notFound('Society not found.');
    }

    const analytics = {
      income: society.wallet.totalIncome || 0,
      expense: society.wallet.totalExpense || 0,
      balance: society.wallet.balance || 0,
    };

    ApiResponse.ok('Analytics fetched successfully', analytics).send(res);
  });
}

export default LedgerController;
