import Visitor from '../models/Visitor.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { VISITOR_STATUS } from '../utils/constants.js';

class VisitorController {
  /**
   * POST /api/v1/visitors/invite
   * Protected — Resident creates a visitor invite.
   */
  static createInvite = asyncHandler(async (req, res) => {
    const { name, phone, visitDate, purpose } = req.body;
    const hostId = req.user._id;
    const societyId = req.user.societyId;

    if (!visitDate) {
      throw ApiError.badRequest('Visit date is required.');
    }

    const visitor = await Visitor.create({
      hostId,
      societyId,
      name,
      phone,
      visitDate: new Date(visitDate),
      purpose,
      status: VISITOR_STATUS.APPROVED, // Pre-approved by resident
    });

    ApiResponse.created('Visitor invite created successfully', {
      visitor: {
        id: visitor._id,
        name: visitor.name,
        visitDate: visitor.visitDate,
        token: visitor.token,
      },
    }).send(res);
  });

  /**
   * GET /api/v1/visitors/verify/:token
   * Protected — Security scans QR code.
   */
  static verifyToken = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const visitor = await Visitor.findOne({ token })
      .populate('hostId', 'fullName phone flatId')
      .populate('societyId', 'name');

    if (!visitor) {
      throw ApiError.notFound('Invalid QR code or visitor not found.');
    }

    // Check if visit date is valid (User specified "one day")
    const today = new Date();
    const visitDate = new Date(visitor.visitDate);
    
    // Reset hours to compare dates only
    today.setHours(0, 0, 0, 0);
    visitDate.setHours(0, 0, 0, 0);

    if (visitDate.getTime() !== today.getTime()) {
      throw ApiError.badRequest(`This invite is for ${visitDate.toDateString()}, not for today.`);
    }

    if (visitor.status === VISITOR_STATUS.CHECKED_IN) {
      throw ApiError.badRequest('Visitor is already checked in.');
    }

    if (visitor.status === VISITOR_STATUS.CHECKED_OUT) {
      throw ApiError.badRequest('Visitor has already checked out.');
    }

    ApiResponse.ok('Visitor verified successfully', {
      visitor: {
        id: visitor._id,
        name: visitor.name,
        phone: visitor.phone,
        purpose: visitor.purpose,
        status: visitor.status,
      },
      host: {
        name: visitor.hostId?.fullName,
        phone: visitor.hostId?.phone,
        flat: visitor.hostId?.flatId,
      },
      society: visitor.societyId?.name,
    }).send(res);
  });

  /**
   * PATCH /api/v1/visitors/:id/status
   * Protected — Security checks in/out visitor.
   */
  static updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(VISITOR_STATUS).includes(status)) {
      throw ApiError.badRequest('Invalid status.');
    }

    const visitor = await Visitor.findById(id);

    if (!visitor) {
      throw ApiError.notFound('Visitor not found.');
    }

    visitor.status = status;
    if (status === VISITOR_STATUS.CHECKED_IN) {
      visitor.checkInTime = new Date();
    } else if (status === VISITOR_STATUS.CHECKED_OUT) {
      visitor.checkOutTime = new Date();
    }

    await visitor.save();

    ApiResponse.ok(`Visitor status updated to ${status}`, visitor).send(res);
  });
}

export default VisitorController;
