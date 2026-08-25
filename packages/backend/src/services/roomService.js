const { randomUUID } = require('crypto');

const rooms = new Map();
const furnitureByRoomId = new Map();

function createRoom({ name, length, width, unit = 'inches' }) {
  const room = {
    id: randomUUID(),
    name,
    length,
    width,
    unit,
  };

  rooms.set(room.id, room);
  return room;
}

function getRoomById(id) {
  return rooms.get(id);
}

function createFurniture(roomId, { name, type, width, depth }) {
  const furniture = {
    id: randomUUID(),
    roomId,
    name,
    type,
    width,
    depth,
  };

  const roomFurniture = furnitureByRoomId.get(roomId) || [];
  roomFurniture.push(furniture);
  furnitureByRoomId.set(roomId, roomFurniture);

  return furniture;
}

function getFurnitureByRoomId(roomId) {
  if (!rooms.has(roomId)) {
    return null;
  }

  return furnitureByRoomId.get(roomId) || [];
}

module.exports = {
  createRoom,
  getRoomById,
  createFurniture,
  getFurnitureByRoomId,
};