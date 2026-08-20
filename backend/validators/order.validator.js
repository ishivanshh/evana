import mongoose from 'mongoose';

export const validateOrder = (body) => {
  const errors = [];
  if (!body.addressId || !mongoose.Types.ObjectId.isValid(body.addressId)) {
    errors.push({ field: 'addressId', message: 'A valid address ID is required.' });
  }
  if (typeof body.paymentMethod !== 'string' || !body.paymentMethod.trim()) {
    errors.push({ field: 'paymentMethod', message: 'Payment method is required.' });
  }
  return errors;
};

export const validateOrderStatus = (status) => [
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
].includes(status);