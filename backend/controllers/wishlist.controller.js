import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { validateObjectId } from '../validators/wishlist.validator.js';
import { sendSuccess } from '../utils/response.js';

export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name slug price discountPrice images stock sku scent waxType size rating numReviews'
    });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    sendSuccess(res, 200, 'Wishlist retrieved successfully.', wishlist);
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
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

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    if (wishlist.products.includes(productId)) {
      // Rule: Prevent duplicate entries, but return success or 200 indicating it is already in wishlist
      const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
        path: 'products',
        select: 'name slug price discountPrice images stock sku scent waxType size rating numReviews'
      });
      return sendSuccess(res, 200, 'Product is already in wishlist.', populatedWishlist);
    }

    wishlist.products.push(productId);
    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      select: 'name slug price discountPrice images stock sku scent waxType size rating numReviews'
    });

    sendSuccess(res, 200, 'Product added to wishlist successfully.', populatedWishlist);
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!validateObjectId(productId)) {
      const error = new Error('Invalid product ID.');
      error.statusCode = 400;
      throw error;
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      const error = new Error('Wishlist not found.');
      error.statusCode = 404;
      throw error;
    }

    const index = wishlist.products.indexOf(productId);
    if (index === -1) {
      const error = new Error('Product not found in wishlist.');
      error.statusCode = 404;
      throw error;
    }

    wishlist.products.splice(index, 1);
    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      select: 'name slug price discountPrice images stock sku scent waxType size rating numReviews'
    });

    sendSuccess(res, 200, 'Product removed from wishlist successfully.', populatedWishlist);
  } catch (error) {
    next(error);
  }
};
