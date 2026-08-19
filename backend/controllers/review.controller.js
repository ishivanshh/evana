import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { validateReviewBody, validateObjectId } from '../validators/review.validator.js';
import { sendSuccess } from '../utils/response.js';

const createValidationError = (errors) => {
  const error = new Error('Validation failed.');
  error.statusCode = 422;
  error.errors = errors;
  return error;
};

export const createReview = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    if (!validateObjectId(productId)) {
      const error = new Error('Invalid product ID.');
      error.statusCode = 400;
      throw error;
    }

    const errors = validateReviewBody(req.body);
    if (errors.length) {
      throw createValidationError(errors);
    }

    const { rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    // Check if the user has already reviewed this product
    const existingReview = await Review.findOne({ product: productId, user: req.user._id });
    if (existingReview) {
      const error = new Error('You have already reviewed this product.');
      error.statusCode = 409;
      throw error;
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment: comment.trim()
    });

    // Recalculate rating stats
    await Review.calculateAverageRating(productId);

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    sendSuccess(res, 201, 'Review created successfully.', populatedReview);
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    if (!validateObjectId(productId)) {
      const error = new Error('Invalid product ID.');
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, 'Product reviews fetched successfully.', reviews);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { id: reviewId } = req.params;
    if (!validateObjectId(reviewId)) {
      const error = new Error('Invalid review ID.');
      error.statusCode = 400;
      throw error;
    }

    const errors = validateReviewBody(req.body);
    if (errors.length) {
      throw createValidationError(errors);
    }

    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      const error = new Error('Review not found.');
      error.statusCode = 404;
      throw error;
    }

    // Authorization Check: User can update only their own review
    if (review.user.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to modify this review.');
      error.statusCode = 403;
      throw error;
    }

    review.rating = rating;
    review.comment = comment.trim();
    await review.save();

    // Recalculate stats
    await Review.calculateAverageRating(review.product);

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    sendSuccess(res, 200, 'Review updated successfully.', populatedReview);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id: reviewId } = req.params;
    if (!validateObjectId(reviewId)) {
      const error = new Error('Invalid review ID.');
      error.statusCode = 400;
      throw error;
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      const error = new Error('Review not found.');
      error.statusCode = 404;
      throw error;
    }

    // Authorization Check: User can delete only their own review
    if (review.user.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to modify this review.');
      error.statusCode = 403;
      throw error;
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate stats
    await Review.calculateAverageRating(productId);

    sendSuccess(res, 200, 'Review deleted successfully.', {});
  } catch (error) {
    next(error);
  }
};
