import mongoose from 'mongoose';

import { sendError } from '../utils/response.js';

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error.';
  let errors = err.errors || [];

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid resource identifier.';
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value.';
    errors = Object.keys(err.keyValue || {}).map((field) => ({
      field,
      message: `${field} already exists.`
    }));
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error(err);
  }

  sendError(res, statusCode, message, errors);
};
