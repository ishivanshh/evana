import mongoose from 'mongoose';

export const validateProductBody = (body, isUpdate = false) => {
  const errors = [];
  
  // Rule 16: Do not trust frontend rating values.
  // We strip rating and numReviews from the request body to prevent manipulation.
  delete body.rating;
  delete body.numReviews;
  delete body.slug; // Slug should be auto-generated, not set by user directly

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
  } = body;

  // Name validation
  if (!isUpdate || name !== undefined) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Product name is required.' });
    } else if (name.trim().length > 100) {
      errors.push({ field: 'name', message: 'Product name cannot exceed 100 characters.' });
    }
  }

  // Description validation
  if (!isUpdate || description !== undefined) {
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      errors.push({ field: 'description', message: 'Product description is required.' });
    }
  }

  // Price validation (Rule 5)
  if (!isUpdate || price !== undefined) {
    if (price === undefined || price === null || typeof price !== 'number' || isNaN(price)) {
      errors.push({ field: 'price', message: 'Product price is required and must be a number.' });
    } else if (price < 0) {
      errors.push({ field: 'price', message: 'Price cannot be negative.' });
    }
  }

  // Discount Price validation (Rule 5)
  if (discountPrice !== undefined && discountPrice !== null) {
    if (typeof discountPrice !== 'number' || isNaN(discountPrice)) {
      errors.push({ field: 'discountPrice', message: 'Discount price must be a number.' });
    } else if (discountPrice < 0) {
      errors.push({ field: 'discountPrice', message: 'Discount price cannot be negative.' });
    } else {
      if (price !== undefined && discountPrice >= price) {
        errors.push({ field: 'discountPrice', message: 'Discount price must be less than regular price.' });
      }
    }
  }

  // Category validation (Rule 4)
  if (!isUpdate || category !== undefined) {
    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      errors.push({ field: 'category', message: 'A valid Category ID is required.' });
    }
  }

  // Stock validation (Rule 6, Rule 7)
  if (!isUpdate || stock !== undefined) {
    if (stock === undefined || stock === null || typeof stock !== 'number' || isNaN(stock)) {
      errors.push({ field: 'stock', message: 'Product stock is required and must be a number.' });
    } else if (stock < 0) {
      errors.push({ field: 'stock', message: 'Stock cannot be negative.' });
    }
  }

  // SKU validation
  if (!isUpdate || sku !== undefined) {
    if (!sku || typeof sku !== 'string' || sku.trim().length === 0) {
      errors.push({ field: 'sku', message: 'Product SKU is required.' });
    }
  }

  // Images validation
  if (images !== undefined && images !== null) {
    if (!Array.isArray(images)) {
      errors.push({ field: 'images', message: 'Images must be an array of strings.' });
    } else {
      for (let i = 0; i < images.length; i++) {
        if (typeof images[i] !== 'string') {
          errors.push({ field: `images[${i}]`, message: 'Each image must be a string URL.' });
        }
      }
    }
  }

  // Scent validation
  if (scent !== undefined && scent !== null && typeof scent !== 'string') {
    errors.push({ field: 'scent', message: 'Scent must be a string.' });
  }

  // Wax Type validation
  if (waxType !== undefined && waxType !== null && typeof waxType !== 'string') {
    errors.push({ field: 'waxType', message: 'Wax type must be a string.' });
  }

  // Burn Time validation
  if (burnTime !== undefined && burnTime !== null) {
    if (typeof burnTime !== 'number' || isNaN(burnTime) || burnTime < 0) {
      errors.push({ field: 'burnTime', message: 'Burn time must be a non-negative number.' });
    }
  }

  // Size validation
  if (size !== undefined && size !== null && typeof size !== 'string') {
    errors.push({ field: 'size', message: 'Size must be a string.' });
  }

  // Boolean validations
  if (isFeatured !== undefined && typeof isFeatured !== 'boolean') {
    errors.push({ field: 'isFeatured', message: 'isFeatured must be a boolean.' });
  }
  if (isBestSeller !== undefined && typeof isBestSeller !== 'boolean') {
    errors.push({ field: 'isBestSeller', message: 'isBestSeller must be a boolean.' });
  }
  if (isActive !== undefined && typeof isActive !== 'boolean') {
    errors.push({ field: 'isActive', message: 'isActive must be a boolean.' });
  }

  return errors;
};

export const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
