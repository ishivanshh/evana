import mongoose from 'mongoose';

export const validateAddToCart = (body) => {
  const errors = [];
  const { productId, quantity } = body;
  
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    errors.push({ field: 'productId', message: 'A valid product ID is required.' });
  }
  
  if (quantity !== undefined && quantity !== null) {
    if (typeof quantity !== 'number' || isNaN(quantity) || quantity <= 0) {
      errors.push({ field: 'quantity', message: 'Quantity must be a positive number.' });
    }
  }
  
  return errors;
};

export const validateUpdateCartItem = (body) => {
  const errors = [];
  const { quantity } = body;
  
  if (quantity === undefined || quantity === null || typeof quantity !== 'number' || isNaN(quantity) || quantity <= 0) {
    errors.push({ field: 'quantity', message: 'Quantity must be a positive number.' });
  }
  
  return errors;
};

export const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
