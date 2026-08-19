import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { validateCategoryBody, validateObjectId } from '../validators/category.validator.js';
import { sendSuccess } from '../utils/response.js';

const createValidationError = (errors) => {
  const error = new Error('Validation failed.');
  error.statusCode = 422;
  error.errors = errors;
  return error;
};

export const createCategory = async (req, res, next) => {
  try {
    const errors = validateCategoryBody(req.body);
    if (errors.length) {
      throw createValidationError(errors);
    }

    const { name, description } = req.body;
    
    // Check duplication
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      const error = new Error('Category name already exists.');
      error.statusCode = 409;
      throw error;
    }

    const category = await Category.create({
      name: name.trim(),
      description: description?.trim()
    });

    sendSuccess(res, 201, 'Category created successfully.', category);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    sendSuccess(res, 200, 'Categories retrieved successfully.', categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      const error = new Error('Invalid Category ID.');
      error.statusCode = 400;
      throw error;
    }

    const category = await Category.findById(id);
    if (!category) {
      const error = new Error('Category not found.');
      error.statusCode = 404;
      throw error;
    }

    sendSuccess(res, 200, 'Category retrieved successfully.', category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      const error = new Error('Invalid Category ID.');
      error.statusCode = 400;
      throw error;
    }

    const errors = validateCategoryBody(req.body, true);
    if (errors.length) {
      throw createValidationError(errors);
    }

    const category = await Category.findById(id);
    if (!category) {
      const error = new Error('Category not found.');
      error.statusCode = 404;
      throw error;
    }

    const { name, description } = req.body;

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (trimmedName !== category.name) {
        // Check duplication
        const existing = await Category.findOne({ name: trimmedName });
        if (existing) {
          const error = new Error('Category name already exists.');
          error.statusCode = 409;
          throw error;
        }
        category.name = trimmedName;
      }
    }

    if (description !== undefined) {
      category.description = description !== null ? description.trim() : null;
    }

    await category.save();

    sendSuccess(res, 200, 'Category updated successfully.', category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      const error = new Error('Invalid Category ID.');
      error.statusCode = 400;
      throw error;
    }

    const category = await Category.findById(id);
    if (!category) {
      const error = new Error('Category not found.');
      error.statusCode = 404;
      throw error;
    }

    // Check if products belong to this category
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      const error = new Error('Cannot delete category with associated products.');
      error.statusCode = 400;
      throw error;
    }

    await category.deleteOne();

    sendSuccess(res, 200, 'Category deleted successfully.', {});
  } catch (error) {
    next(error);
  }
};
