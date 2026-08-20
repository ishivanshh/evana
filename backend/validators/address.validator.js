const fields = ['name', 'phone', 'addressLine', 'city', 'state', 'pincode', 'country'];

export const validateAddress = (body) => fields.reduce((errors, field) => {
  if (typeof body[field] !== 'string' || !body[field].trim()) {
    errors.push({ field, message: `${field} is required.` });
  }
  return errors;
}, []);