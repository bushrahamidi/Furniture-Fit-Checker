export const FURNITURE_TYPES = [
  { value: 'sofa', label: 'Sofa' },
  { value: 'coffeeTable', label: 'Coffee Table' },
  { value: 'diningTable', label: 'Dining Table' },
];

function isPositiveNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return false;
  }

  const number = Number(value);
  return Number.isFinite(number) && number > 0;
}

export function validateRoomFields(room) {
  const errors = {};

  if (!room.name.trim()) {
    errors.name = 'Room name is required.';
  }

  if (!isPositiveNumber(room.length)) {
    errors.length = 'Room length must be a number greater than zero.';
  }

  if (!isPositiveNumber(room.width)) {
    errors.width = 'Room width must be a number greater than zero.';
  }

  return errors;
}

export function validateFurnitureFields(furniture) {
  const errors = {};

  if (!furniture.name.trim()) {
    errors.name = 'Furniture name is required.';
  }

  if (!FURNITURE_TYPES.some((type) => type.value === furniture.type)) {
    errors.type = 'Select a furniture type.';
  }

  if (!isPositiveNumber(furniture.width)) {
    errors.width = 'Width must be a number greater than zero.';
  }

  if (!isPositiveNumber(furniture.depth)) {
    errors.depth = 'Depth must be a number greater than zero.';
  }

  return errors;
}
