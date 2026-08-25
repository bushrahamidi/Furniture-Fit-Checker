const validateRoom = require('./validateRoom');
const validateFurniture = require('./validateFurniture');

function validateFitCheck(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { request: 'A request body object is required' };
  }

  const errors = {};

  const roomErrors = validateRoom(payload.room);

  if (Object.keys(roomErrors).length > 0) {
    errors.room = roomErrors;
  }

  const furnitureErrors = validateFurniture(payload.furniture);

  if (payload.furniture && payload.furniture.type !== 'sofa') {
    furnitureErrors.type = 'Type must be sofa for this endpoint';
  }

  if (Object.keys(furnitureErrors).length > 0) {
    errors.furniture = furnitureErrors;
  }

  return errors;
}

module.exports = validateFitCheck;
