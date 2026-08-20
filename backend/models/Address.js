import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: { type: String, required: [true, 'Name is required.'], trim: true },
  phone: { type: String, required: [true, 'Phone is required.'], trim: true },
  addressLine: { type: String, required: [true, 'Address line is required.'], trim: true },
  city: { type: String, required: [true, 'City is required.'], trim: true },
  state: { type: String, required: [true, 'State is required.'], trim: true },
  pincode: { type: String, required: [true, 'Pincode is required.'], trim: true },
  country: { type: String, required: [true, 'Country is required.'], trim: true },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

addressSchema.index({ user: 1, isDefault: 1 });

const Address = mongoose.model('Address', addressSchema);
export default Address;