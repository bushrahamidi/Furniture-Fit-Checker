const roomService = require('../src/services/roomService');

describe('roomService', () => {
  it('creates a room with an id and default inches unit', () => {
    const room = roomService.createRoom({
      name: 'Living Room',
      length: 240,
      width: 180,
    });

    expect(room).toEqual({
      id: expect.any(String),
      name: 'Living Room',
      length: 240,
      width: 180,
      unit: 'inches',
    });
  });

  it('retrieves a stored room by id', () => {
    const room = roomService.createRoom({
      name: 'Bedroom',
      length: 150,
      width: 120,
      unit: 'feet',
    });

    expect(roomService.getRoomById(room.id)).toEqual(room);
  });

  it('returns undefined for a room that does not exist', () => {
    expect(roomService.getRoomById('missing-room')).toBeUndefined();
  });

  it('creates furniture linked to a room', () => {
    const room = roomService.createRoom({
      name: 'Dining Room',
      length: 180,
      width: 150,
    });

    const furniture = roomService.createFurniture(room.id, {
      name: 'Round Dining Table',
      type: 'diningTable',
      width: 60,
      depth: 60,
    });

    expect(furniture).toEqual({
      id: expect.any(String),
      roomId: room.id,
      name: 'Round Dining Table',
      type: 'diningTable',
      width: 60,
      depth: 60,
    });
  });

  it('retrieves room furniture and returns an empty list when none exists', () => {
    const room = roomService.createRoom({
      name: 'Guest Room',
      length: 160,
      width: 140,
    });

    expect(roomService.getFurnitureByRoomId(room.id)).toEqual([]);

    const furniture = roomService.createFurniture(room.id, {
      name: 'Small Sofa',
      type: 'sofa',
      width: 72,
      depth: 36,
    });

    expect(roomService.getFurnitureByRoomId(room.id)).toEqual([furniture]);
  });

  it('returns null for furniture lookup when room does not exist', () => {
    expect(roomService.getFurnitureByRoomId('missing-room')).toBeNull();
  });
});