const SUPPORTED_FURNITURE_TYPES = ['sofa', 'coffeeTable', 'diningTable'];

function validateFurniture(furniture) {
  const errors = {};

  if (!furniture || typeof furniture !== 'object' || Array.isArray(furniture)) {
    return { furniture: 'A furniture object is required' };
  }

  if (typeof furniture.name !== 'string' || furniture.name.trim().length === 0) {
    errors.name = 'Name is required';
  }

  if (!SUPPORTED_FURNITURE_TYPES.includes(furniture.type)) {
    errors.type = `Type must be one of: ${SUPPORTED_FURNITURE_TYPES.join(', ')}`;
  }

  if (!isPositiveNumber(furniture.width)) {
    errors.width = 'Width must be a number greater than zero';
  }

  if (!isPositiveNumber(furniture.depth)) {
    errors.depth = 'Depth must be a number greater than zero';
  }

  return errors;
}

function isPositiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

module.exports = validateFurniture;
