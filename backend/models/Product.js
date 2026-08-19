import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required.'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters.']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required.'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required.'],
    min: [0, 'Price cannot be negative.']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative.']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required.']
  },
  images: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required.'],
    min: [0, 'Stock cannot be negative.']
  },
  sku: {
    type: String,
    required: [true, 'Product SKU is required.'],
    unique: true,
    trim: true
  },
  scent: {
    type: String,
    trim: true
  },
  waxType: {
    type: String,
    trim: true
  },
  burnTime: {
    type: Number,
    min: [0, 'Burn time cannot be negative.']
  },
  size: {
    type: String,
    trim: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative.'],
    max: [5, 'Rating cannot exceed 5.']
  },
  numReviews: {
    type: Number,
    default: 0,
    min: [0, 'Number of reviews cannot be negative.']
  }
}, { timestamps: true });

// Pre-save middleware to generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
