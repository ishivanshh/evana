import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true, min: 0 }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  addressLine: String,
  city: String,
  state: String,
  pincode: String,
  country: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], required: true, validate: items => items.length > 0 },
  shippingAddress: { type: shippingAddressSchema, required: true },
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, required: true, min: 0, default: 0 },
  shippingFee: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, required: true, trim: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;