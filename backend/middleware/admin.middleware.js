export const adminOnly = (req, res, next) => {
  if (!req.user) {
    const error = new Error('Authentication is required.');
    error.statusCode = 401;
    return next(error);
  }

  if (req.user.role !== 'admin') {
    const error = new Error('Admin access is required.');
    error.statusCode = 403;
    return next(error);
  }

  next();
};
