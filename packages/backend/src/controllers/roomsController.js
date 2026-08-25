const roomService = require('../services/roomService');
const validateRoom = require('../validation/validateRoom');
const validateFurniture = require('../validation/validateFurniture');

function createRoom(req, res) {
  const errors = validateRoom(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const room = roomService.createRoom(req.body);
  return res.status(201).json(room);
}

function getRoom(req, res) {
  const room = roomService.getRoomById(req.params.id);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  return res.status(200).json(room);
}

function addFurniture(req, res) {
  const room = roomService.getRoomById(req.params.roomId);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const errors = validateFurniture(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const furniture = roomService.createFurniture(req.params.roomId, req.body);
  return res.status(201).json(furniture);
}

function getFurniture(req, res) {
  const furniture = roomService.getFurnitureByRoomId(req.params.roomId);

  if (!furniture) {
    return res.status(404).json({ error: 'Room not found' });
  }

  return res.status(200).json(furniture);
}

module.exports = { createRoom, getRoom, addFurniture, getFurniture };