import mongoose from 'mongoose';

const parkingSlotSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
      index: true,
    },
    slotNumber: {
      type: String,
      required: [true, 'Slot number is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Car', 'Bike', 'Other'],
      default: 'Car',
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
    assignedToFlat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flat',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique slot per society
parkingSlotSchema.index({ societyId: 1, slotNumber: 1 }, { unique: true });

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);
export default ParkingSlot;
