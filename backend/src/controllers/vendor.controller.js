import Bid from '../models/Bid.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

class VendorController {
  /**
   * POST /api/v1/vendors/bids
   */
  static submitBid = asyncHandler(async (req, res) => {
    const { societyId, userId } = req;
    const { vendorName, serviceType, amount, proposal, attachment } = req.body;

    const bid = await Bid.create({
      societyId,
      vendorName,
      serviceType,
      amount,
      proposal,
      attachment,
      submittedBy: userId,
    });

    ApiResponse.created('Bid submitted successfully', bid).send(res);
  });

  /**
   * GET /api/v1/vendors/bids
   */
  static getBids = asyncHandler(async (req, res) => {
    const { societyId } = req;
    const bids = await Bid.find({ societyId }).sort({ createdAt: -1 });

    ApiResponse.ok('Bids fetched successfully', bids).send(res);
  });
}

export default VendorController;
