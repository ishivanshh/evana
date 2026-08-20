import mongoose from 'mongoose';

import Address from '../models/Address.js';
import { validateAddress } from '../validators/address.validator.js';
import { sendSuccess } from '../utils/response.js';

const validationError = (errors) => {
  const error = new Error('Validation failed.');
  error.statusCode = 422;
  error.errors = errors;
  return error;
};

const ensureDefault = async (userId, address) => {
  if (address.isDefault) {
    await Address.updateMany({ user: userId, _id: { $ne: address._id } }, { isDefault: false });
  }
};
export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    sendSuccess(res, 200, 'Addresses retrieved successfully.', { addresses });
  } catch (error) { next(error); }
};

export const createAddress = async (req, res, next) => {
  try {
    const errors = validateAddress(req.body);
    if (errors.length) throw validationError(errors);

    const hasAddress = await Address.exists({ user: req.user._id });
    const address = await Address.create({
      ...req.body,
      user: req.user._id,
      isDefault: hasAddress ? req.body.isDefault === true : true
    });
    await ensureDefault(req.user._id, address);
    sendSuccess(res, 201, 'Address created successfully.', address);
  } catch (error) { next(error); }
};

export const updateAddress = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const error = new Error('Invalid address ID.');
      error.statusCode = 400;
      throw error;
    }
    const errors = validateAddress(req.body);
    if (errors.length) throw validationError(errors);

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, isDefault: req.body.isDefault === true },
      { new: true, runValidators: true }
    );
    if (!address) {
      const error = new Error('Address not found.');
      error.statusCode = 404;
      throw error;
    }
    await ensureDefault(req.user._id, address);
    sendSuccess(res, 200, 'Address updated successfully.', address);
  } catch (error) { next(error); }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) {
      const error = new Error('Address not found.');
      error.statusCode = 404;
      throw error;
    }
    if (address.isDefault) {
      await Address.findOneAndUpdate({ user: req.user._id }, { isDefault: true }, { sort: { createdAt: -1 } });
    }
    sendSuccess(res, 200, 'Address deleted successfully.', address);
  } catch (error) { next(error); }
};