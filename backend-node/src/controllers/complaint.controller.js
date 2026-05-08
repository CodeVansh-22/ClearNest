import Complaint from '../models/Complaint.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

class ComplaintController {
  /**
   * GET /api/v1/complaints
   */
  static getComplaints = asyncHandler(async (req, res) => {
    const { societyId, userId, role } = req;

    let query = { societyId };
    
    // Residents only see their own complaints
    if (role === 'RESIDENT') {
      query.raisedBy = userId;
    }

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .populate('raisedBy', 'fullName avatar')
      .populate('assignedTo', 'fullName');

    ApiResponse.ok('Complaints fetched successfully', complaints).send(res);
  });

  /**
   * POST /api/v1/complaints
   */
  static createComplaint = asyncHandler(async (req, res) => {
    const { societyId, userId } = req;
    const { title, description, category, priority, attachments } = req.body;

    const complaint = await Complaint.create({
      societyId,
      raisedBy: userId,
      title,
      description,
      category,
      priority,
      attachments,
    });

    ApiResponse.created('Complaint raised successfully', complaint).send(res);
  });

  /**
   * PATCH /api/v1/complaints/:id
   */
  static updateComplaint = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, note, assignedTo } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      throw ApiError.notFound('Complaint not found.');
    }

    if (status) {
      complaint.status = status;
      complaint.timeline.push({
        status,
        note: note || `Status updated to ${status}`,
        updatedBy: req.userId,
      });
    }

    if (assignedTo) {
      complaint.assignedTo = assignedTo;
    }

    await complaint.save();

    ApiResponse.ok('Complaint updated successfully', complaint).send(res);
  });
}

export default ComplaintController;
