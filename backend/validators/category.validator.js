import mongoose from 'mongoose';

export const validateCategoryBody = (body, isUpdate = false) => {
  const errors = [];
  const { name, description } = body;

  if (!isUpdate || name !== undefined) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Category name is required and must be a non-empty string.' });
    } else if (name.trim().length > 50) {
      errors.push({ field: 'name', message: 'Category name cannot exceed 50 characters.' });
    }
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string.' });
    } else if (description.trim().length > 500) {
      errors.push({ field: 'description', message: 'Description cannot exceed 500 characters.' });
    }
  }

  return errors;
};

export const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
