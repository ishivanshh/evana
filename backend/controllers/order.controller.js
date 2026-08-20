import mongoose from 'mongoose';

import Address from '../models/Address.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { validateOrder, validateOrderStatus } from '../validators/order.validator.js';
import { sendSuccess } from '../utils/response.js';

const TAX_RATE = 0.18;
const SHIPPING_FEE = 100;
const FREE_SHIPPING_THRESHOLD = 1000;

const validationError = (errors) => {
  const error = new Error('Validation failed.');
  error.statusCode = 422;
  error.errors = errors;
  return error;
};

const roundMoney = amount => Math.round((amount + Number.EPSILON) * 100) / 100;

export const createOrder = async (req, res, next) => {
  const decremented = [];
  try {
    const errors = validateOrder(req.body);
    if (errors.length) throw validationError(errors);

    const [address, cart] = await Promise.all([
      Address.findOne({ _id: req.body.addressId, user: req.user._id }).lean(),
      Cart.findOne({ user: req.user._id }).lean()
    ]);
    if (!address) {
      const error = new Error('Address not found.');
      error.statusCode = 404;
      throw error;
    }
    if (!cart || !cart.items.length) {
      const error = new Error('Cart is empty.');
      error.statusCode = 400;
      throw error;
    }

    const productIds = cart.items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map(products.map(product => [product._id.toString(), product]));
    const orderItems = [];
    let subtotal = 0;
    let regularSubtotal = 0;

    for (const cartItem of cart.items) {
      const product = productMap.get(cartItem.product.toString());
      if (!product) {
        const error = new Error('One or more products in the cart no longer exist.');
        error.statusCode = 400;
        throw error;
      }
      if (!product.isActive) {
        const error = new Error(`Product "${product.name}" is no longer available.`);
        error.statusCode = 400;
        throw error;
      }
      if (product.stock < cartItem.quantity) {
        const error = new Error(`Insufficient stock for "${product.name}". Only ${product.stock} items available.`);
        error.statusCode = 400;
        throw error;
      }

      const price = product.discountPrice !== undefined && product.discountPrice !== null
        ? product.discountPrice
        : product.price;
      const itemSubtotal = roundMoney(price * cartItem.quantity);
      subtotal += itemSubtotal;
      regularSubtotal += product.price * cartItem.quantity;
      orderItems.push({ product: product._id, name: product.name, price, quantity: cartItem.quantity, subtotal: itemSubtotal });
    }

    subtotal = roundMoney(subtotal);
    const discount = roundMoney(Math.max(0, regularSubtotal - subtotal));
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const tax = roundMoney(subtotal * TAX_RATE);
    const totalAmount = roundMoney(subtotal + shippingFee + tax);

    for (const item of orderItems) {
      const result = await Product.updateOne(
        { _id: item.product, isActive: true, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (result.modifiedCount !== 1) {
        const error = new Error(`Stock changed while placing the order for "${item.name}".`);
        error.statusCode = 409;
        throw error;
      }
      decremented.push(item);
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        name: address.name, phone: address.phone, addressLine: address.addressLine,
        city: address.city, state: address.state, pincode: address.pincode, country: address.country
      },
      subtotal, discount, shippingFee, tax, totalAmount,
      paymentMethod: req.body.paymentMethod
    });
    await Cart.updateOne({ _id: cart._id }, { $set: { items: [] } });
    sendSuccess(res, 201, 'Order created successfully.', order);
  } catch (error) {
    await Promise.all(decremented.map(item => Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })));
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    sendSuccess(res, 200, 'Orders retrieved successfully.', { orders });
  } catch (error) { next(error); }
};

export const getOrderById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const error = new Error('Invalid order ID.');
      error.statusCode = 400;
      throw error;
    }
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }
    sendSuccess(res, 200, 'Order retrieved successfully.', order);
  } catch (error) { next(error); }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    sendSuccess(res, 200, 'All orders retrieved successfully.', { orders });
  } catch (error) { next(error); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!validateOrderStatus(status)) {
      const error = new Error('Invalid order status.');
      error.statusCode = 422;
      throw error;
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }
    const transitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: []
    };
    if (!transitions[order.orderStatus].includes(status)) {
      const error = new Error(`Cannot change order status from ${order.orderStatus} to ${status}.`);
      error.statusCode = 422;
      throw error;
    }
    order.orderStatus = status;
    await order.save();
    sendSuccess(res, 200, 'Order status updated successfully.', order);
  } catch (error) { next(error); }
};