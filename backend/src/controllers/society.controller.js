import Society from '../models/Society.js';
import User from '../models/User.js';
import Flat from '../models/Flat.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateSocietyCode } from '../utils/helpers.js';
import slugify from 'slugify';

class SocietyController {
  /**
   * POST /api/v1/societies/register
   * Public — registers a new society and creates admin account.
   */
  static register = asyncHandler(async (req, res) => {
    const { societyName, city, state, pincode, address, totalFlats, totalBlocks, adminName, adminEmail, adminPassword, adminPhone } = req.body;

    // Check if admin email already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      throw ApiError.conflict('An account with this admin email already exists.');
    }

    // Generate unique code
    let code;
    let codeExists = true;
    while (codeExists) {
      code = generateSocietyCode();
      codeExists = await Society.findOne({ code });
    }

    // Create admin user first
    const admin = await User.create({
      fullName: adminName,
      email: adminEmail,
      password: adminPassword,
      phone: adminPhone,
      role: 'SOCIETY_ADMIN',
      authProvider: 'local',
      isVerified: true,
    });

    // Create society
    const society = await Society.create({
      name: societyName,
      code,
      slug: slugify(societyName, { lower: true, strict: true }),
      address: {
        line1: address,
        city,
        state: state || city,
        pincode: pincode || '000000',
      },
      totalFlats: parseInt(totalFlats, 10) || 50,
      totalBlocks: parseInt(totalBlocks, 10) || 1,
      adminId: admin._id,
      contactEmail: adminEmail,
      contactPhone: adminPhone,
    });

    // Link society to admin
    admin.societyId = society._id;
    await admin.save();

    // Auto-generate flat entries
    const flatDocs = [];
    for (let i = 1; i <= Math.min(society.totalFlats, 500); i++) {
      flatDocs.push({
        societyId: society._id,
        flatNumber: `${i}`,
        block: 'A',
        floor: Math.ceil(i / 4),
      });
    }
    if (flatDocs.length > 0) {
      await Flat.insertMany(flatDocs, { ordered: false }).catch(() => {});
    }

    ApiResponse.created('Society registered successfully', {
      society: {
        id: society._id,
        name: society.name,
        code: society.code,
        totalFlats: society.totalFlats,
      },
      admin: {
        id: admin._id,
        email: admin.email,
      },
    }).send(res);
  });

  /**
   * GET /api/v1/societies/code/:code
   * Public — verify a society exists by code.
   */
  static getByCode = asyncHandler(async (req, res) => {
    const society = await Society.findOne({ code: req.params.code.toUpperCase() })
      .select('name code address totalFlats status');

    if (!society) {
      throw ApiError.notFound('No society found with this code.');
    }

    ApiResponse.ok('Society found', society).send(res);
  });

  /**
   * GET /api/v1/societies/:id
   * Protected — get society details.
   */
  static getById = asyncHandler(async (req, res) => {
    const society = await Society.findById(req.params.id)
      .populate('adminId', 'fullName email')
      .populate('committeeMembers.userId', 'fullName email');

    if (!society) {
      throw ApiError.notFound('Society not found.');
    }

    ApiResponse.ok('Society details', society).send(res);
  });

  /**
   * GET /api/v1/societies
   * Super Admin — list all societies.
   */
  static getAll = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    const societies = await Society.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .populate('adminId', 'fullName email');

    const total = await Society.countDocuments(filter);

    ApiResponse.ok('Societies list', {
      societies,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit),
      },
    }).send(res);
  });

  /**
   * PATCH /api/v1/societies/:id/status
   * Super Admin — activate/suspend a society.
   */
  static updateStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    
    const society = await Society.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!society) {
      throw ApiError.notFound('Society not found.');
    }

    ApiResponse.ok(`Society ${status.toLowerCase()} successfully`, society).send(res);
  });
}

export default SocietyController;
