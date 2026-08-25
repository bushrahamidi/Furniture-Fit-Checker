function validateRoom(room) {
  const errors = {};

  if (!room || typeof room !== 'object' || Array.isArray(room)) {
    return { room: 'A room object is required' };
  }

  if (typeof room.name !== 'string' || room.name.trim().length === 0) {
    errors.name = 'Name is required';
  }

  if (!isPositiveNumber(room.length)) {
    errors.length = 'Length must be a number greater than zero';
  }

  if (!isPositiveNumber(room.width)) {
    errors.width = 'Width must be a number greater than zero';
  }

  if (room.unit !== undefined && (typeof room.unit !== 'string' || room.unit.trim().length === 0)) {
    errors.unit = 'Unit must be a non-empty string';
  }

  return errors;
}

function isPositiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

module.exports = validateRoom;