import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const updateUserName = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'sc2796999@gmail.com';
    const newName = 'Vansh Sharma'; // I'll use a more natural name

    const result = await User.findOneAndUpdate(
      { email },
      { $set: { fullName: newName } },
      { new: true }
    );

    if (result) {
      console.log(`Success! Name updated for ${email} to "${result.fullName}"`);
    } else {
      console.log(`User ${email} not found.`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error updating name:', err);
  }
};

updateUserName();
