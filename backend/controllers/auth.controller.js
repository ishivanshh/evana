import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendSuccess } from '../utils/response.js';

const emailRegex = /^\S+@\S+\.\S+$/;

const createValidationError = (errors) => {
  const error = new Error('Validation failed.');
  error.statusCode = 422;
  error.errors = errors;
  return error;
};

const validateRegisterBody = ({ name, email, password }) => {
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters.' });
  }

  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'A valid email is required.' });
  }

  if (!password || password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters.' });
  }

  return errors;
};

const validateLoginBody = ({ email, password }) => {
  const errors = [];

  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'A valid email is required.' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required.' });
  }

  return errors;
};

// register user controller
export const register = async (req, res, next) => {
  try {
    const errors = validateRegisterBody(req.body);

    if (errors.length) {
      throw createValidationError(errors);
    }

    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      const error = new Error('Email is already registered.');
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password
    });

    const token = generateToken(user._id);
    const safeUser = await User.findById(user._id).select('-password');

    sendSuccess(res, 201, 'Registration successful.', {
      user: safeUser,
      token
    });
  } catch (error) {
    next(error);
  }
};

// login controller
export const login = async (req, res, next) => {
  try {
    const errors = validateLoginBody(req.body);

    if (errors.length) {
      throw createValidationError(errors);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id);
    const safeUser = await User.findById(user._id).select('-password');

    sendSuccess(res, 200, 'Login successful.', {
      user: safeUser,
      token
    });
  } catch (error) {
    next(error);
  }
};

// logout controller
export const logout = async (req, res, next) => {
  try {
    sendSuccess(res, 200, 'Logout successful. Remove the token on the client.', {});
  } catch (error) {
    next(error);
  }
};

// get personal info controller
export const getMe = async (req, res, next) => {
  try {
    sendSuccess(res, 200, 'Authenticated user fetched successfully.', {
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};


export const adminCheck = async (req, res, next) => {
  try {
    sendSuccess(res, 200, 'Admin access verified.', {
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};
