import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { validateProductBody, validateObjectId } from '../validators/product.validator.js';
import { sendSuccess } from '../utils/response.js';

const createValidationError = (errors) => {
  const error = new Error('Validation failed.');
  error.statusCode = 422;
  error.errors = errors;
  return error;
};

export const createProduct = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validateProductBody(req.body);
    if (errors.length) {
      throw createValidationError(errors);
    }

    const {
      name,
      description,
      price,
      discountPrice,
      category,
      images,
      stock,
      sku,
      scent,
      waxType,
      burnTime,
      size,
      isFeatured,
      isBestSeller,
      isActive
    } = req.body;

    // Check Category existence (Rule 4: Validate ObjectIds)
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      throw createValidationError([{ field: 'category', message: 'Category not found.' }]);
    }

    // Check SKU duplication
    const existingSku = await Product.findOne({ sku: sku.trim() });
    if (existingSku) {
      throw createValidationError([{ field: 'sku', message: 'SKU already exists.' }]);
    }

    // Double check discount price relation (Rule 5)
    if (discountPrice !== undefined && discountPrice !== null && discountPrice >= price) {
      throw createValidationError([{ field: 'discountPrice', message: 'Discount price must be less than regular price.' }]);
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price,
      discountPrice,
      category,
      images,
      stock,
      sku: sku.trim(),
      scent: scent?.trim(),
      waxType: waxType?.trim(),
      burnTime,
      size: size?.trim(),
      isFeatured,
      isBestSeller,
      isActive
    });

    const populatedProduct = await Product.findById(product._id).populate('category');

    sendSuccess(res, 201, 'Product created successfully.', populatedProduct);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // 1. Search (Rule 9)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Category filtering (Rule 10)
    if (category) {
      if (validateObjectId(category)) {
        query.category = category;
      } else {
        // Try slug search
        const categoryDoc = await Category.findOne({ slug: category });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        } else {
          // If no matching category, make the query return nothing
          query.category = new Product.db.base.Types.ObjectId();
        }
      }
    }

    // 3. Min/Max price (Rule 11)
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        const minVal = Number(minPrice);
        if (!isNaN(minVal)) {
          query.price.$gte = minVal;
        }
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        const maxVal = Number(maxPrice);
        if (!isNaN(maxVal)) {
          query.price.$lte = maxVal;
        }
      }
    }

    // 4. Sorting (Rule 12)
    let sortOption = { createdAt: -1 }; // default newest
    if (sort) {
      if (sort === 'price_asc' || sort === 'price-asc') sortOption = { price: 1 };
      else if (sort === 'price_desc' || sort === 'price-desc') sortOption = { price: -1 };
      else if (sort === 'name_asc') sortOption = { name: 1 };
      else if (sort === 'name_desc') sortOption = { name: -1 };
      else if (sort === 'newest') sortOption = { createdAt: -1 };
      else if (sort === 'oldest') sortOption = { createdAt: 1 };
    }

    // 5. Pagination (Rule 13)
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category') // Rule 15: Populate category where useful
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Pagination metadata (Rule 14)
    const totalPages = Math.ceil(total / limitNum);
    const pagination = {
      total,
      limit: limitNum,
      page: pageNum,
      pages: totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    };

    sendSuccess(res, 200, 'Products retrieved successfully.', {
      products,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      const error = new Error('Invalid Product ID.');
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.findById(id).populate('category');
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    sendSuccess(res, 200, 'Product retrieved successfully.', product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      const error = new Error('Invalid Product ID.');
      error.statusCode = 400;
      throw error;
    }

    // First retrieve the existing product to perform merged checks
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    // Validate request body
    const errors = validateProductBody(req.body, true);
    if (errors.length) {
      throw createValidationError(errors);
    }

    const {
      name,
      description,
      price,
      discountPrice,
      category,
      images,
      stock,
      sku,
      scent,
      waxType,
      burnTime,
      size,
      isFeatured,
      isBestSeller,
      isActive
    } = req.body;

    // Check discount price relation against the merged state (Rule 5)
    const finalPrice = price !== undefined ? price : product.price;
    const finalDiscountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
    
    if (finalDiscountPrice !== undefined && finalDiscountPrice !== null && finalDiscountPrice >= finalPrice) {
      throw createValidationError([{ field: 'discountPrice', message: 'Discount price must be less than regular price.' }]);
    }

    // If category is changing, validate it
    if (category !== undefined) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        throw createValidationError([{ field: 'category', message: 'Category not found.' }]);
      }
      product.category = category;
    }

    // If SKU is changing, validate unique constraints
    if (sku !== undefined) {
      const trimmedSku = sku.trim();
      if (trimmedSku !== product.sku) {
        const existingSku = await Product.findOne({ sku: trimmedSku });
        if (existingSku) {
          throw createValidationError([{ field: 'sku', message: 'SKU already exists.' }]);
        }
        product.sku = trimmedSku;
      }
    }

    // Apply updates
    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (images !== undefined) product.images = images;
    if (stock !== undefined) product.stock = stock;
    if (scent !== undefined) product.scent = scent ? scent.trim() : null;
    if (waxType !== undefined) product.waxType = waxType ? waxType.trim() : null;
    if (burnTime !== undefined) product.burnTime = burnTime;
    if (size !== undefined) product.size = size ? size.trim() : null;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isBestSeller !== undefined) product.isBestSeller = isBestSeller;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    const populatedProduct = await Product.findById(product._id).populate('category');
    sendSuccess(res, 200, 'Product updated successfully.', populatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      const error = new Error('Invalid Product ID.');
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    await product.deleteOne();

    sendSuccess(res, 200, 'Product deleted successfully.', {});
  } catch (error) {
    next(error);
  }
};
