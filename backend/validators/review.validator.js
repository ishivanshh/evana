import mongoose from 'mongoose';

export const validateReviewBody = (body) => {
  const errors = [];
  const { rating, comment } = body;
  
  if (rating === undefined || rating === null || typeof rating !== 'number' || isNaN(rating) || rating < 1 || rating > 5) {
    errors.push({ field: 'rating', message: 'Rating must be a number between 1 and 5.' });
  }
  
  if (!comment || typeof comment !== 'string' || comment.trim().length < 2) {
    errors.push({ field: 'comment', message: 'Comment must be a string of at least 2 characters.' });
  }
  
  return errors;
};

export const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
