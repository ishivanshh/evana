import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { validateAddToCart, validateUpdateCartItem, validateObjectId } from '../validators/cart.validator.js';
import { sendSuccess } from '../utils/response.js';

const createValidationError = (errors) => {
  const error = new Error('Validation failed.');
  error.statusCode = 422;
  error.errors = errors;
  return error;
};

const formatCartResponse = (cart) => {
  let totalAmount = 0;
  let totalItems = 0;

  const items = cart.items.map((item) => {
    const product = item.product;
    if (!product) {
      return {
        _id: item._id,
        product: null,
        quantity: item.quantity,
        price: 0,
        subtotal: 0
      };
    }

    const price = product.discountPrice !== undefined && product.discountPrice !== null
      ? product.discountPrice
      : product.price;

    const subtotal = price * item.quantity;
    totalAmount += subtotal;
    totalItems += item.quantity;

    return {
      _id: item._id,
      product: {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        images: product.images,
        stock: product.stock,
        sku: product.sku
      },
      quantity: item.quantity,
      price,
      subtotal
    };
  });

  return {
    _id: cart._id,
    user: cart.user,
    items,
    totalAmount,
    totalItems,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt
  };
};

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    sendSuccess(res, 200, 'Cart retrieved successfully.', formatCartResponse(cart));
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const errors = validateAddToCart(req.body);
    if (errors.length) {
      throw createValidationError(errors);
    }

    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    let newQuantity = quantity;
    if (itemIndex > -1) {
      newQuantity = cart.items[itemIndex].quantity + quantity;
    }

    // Check stock
    if (product.stock < newQuantity) {
      const error = new Error(`Insufficient stock. Only ${product.stock} items available.`);
      error.statusCode = 400;
      throw error;
    }

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    
    // Fetch fully populated cart for response
    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    sendSuccess(res, 200, 'Product added to cart successfully.', formatCartResponse(populatedCart));
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!validateObjectId(productId)) {
      const error = new Error('Invalid product ID.');
      error.statusCode = 400;
      throw error;
    }

    const errors = validateUpdateCartItem(req.body);
    if (errors.length) {
      throw createValidationError(errors);
    }

    const { quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    // Check stock
    if (product.stock < quantity) {
      const error = new Error(`Insufficient stock. Only ${product.stock} items available.`);
      error.statusCode = 400;
      throw error;
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      const error = new Error('Cart not found.');
      error.statusCode = 404;
      throw error;
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      const error = new Error('Product not found in cart.');
      error.statusCode = 404;
      throw error;
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    sendSuccess(res, 200, 'Cart item updated successfully.', formatCartResponse(populatedCart));
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!validateObjectId(productId)) {
      const error = new Error('Invalid product ID.');
      error.statusCode = 400;
      throw error;
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      const error = new Error('Cart not found.');
      error.statusCode = 404;
      throw error;
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      const error = new Error('Product not found in cart.');
      error.statusCode = 404;
      throw error;
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    sendSuccess(res, 200, 'Product removed from cart successfully.', formatCartResponse(populatedCart));
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      const error = new Error('Cart not found.');
      error.statusCode = 404;
      throw error;
    }

    cart.items = [];
    await cart.save();

    sendSuccess(res, 200, 'Cart cleared successfully.', formatCartResponse(cart));
  } catch (error) {
    next(error);
  }
};
