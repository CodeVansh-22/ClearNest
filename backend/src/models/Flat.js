import mongoose from 'mongoose';

const flatSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
      index: true,
    },
    flatNumber: {
      type: String,
      required: [true, 'Flat number is required'],
      trim: true,
    },
    block: { type: String, default: 'A' },
    floor: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ['1BHK', '2BHK', '3BHK', '4BHK', 'Studio', 'Penthouse', 'Shop', 'Other'],
      default: '2BHK',
    },
    area: { type: Number }, // in sq ft

    // Ownership
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    residents: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      relation: { type: String, default: 'Owner' }, // Owner, Tenant, Family
      moveInDate: Date,
    }],

    // Status
    isOccupied: { type: Boolean, default: false },
    isRented: { type: Boolean, default: false },

    // Parking
    parkingSlots: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingSlot',
    }],

    // Vehicles
    vehicles: [{
      number: String,
      type: { type: String, enum: ['Car', 'Bike', 'Scooter', 'Cycle', 'Other'] },
      model: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Compound unique index
flatSchema.index({ societyId: 1, flatNumber: 1, block: 1 }, { unique: true });

const Flat = mongoose.model('Flat', flatSchema);
export default Flat;
