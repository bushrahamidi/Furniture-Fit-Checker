const request = require('supertest');
const { app } = require('../src/app');

describe('Health check', () => {
  it('reports that the backend server is healthy', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      application: 'DesignFit',
    });
  });
});

describe('Rooms API', () => {
  it('creates a room and defaults its unit to inches', async () => {
    const response = await request(app)
      .post('/api/rooms')
      .send({ name: 'Living Room', length: 240, width: 180 });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'Living Room',
      length: 240,
      width: 180,
      unit: 'inches',
    });
  });

  it('retrieves a room by id', async () => {
    const createdRoom = await request(app)
      .post('/api/rooms')
      .send({ name: 'Bedroom', length: 150, width: 120, unit: 'feet' });

    const response = await request(app).get(`/api/rooms/${createdRoom.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(createdRoom.body);
  });

  it('rejects rooms with non-positive dimensions', async () => {
    const response = await request(app)
      .post('/api/rooms')
      .send({ name: 'Office', length: 0, width: -10 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        length: 'Length must be a number greater than zero',
        width: 'Width must be a number greater than zero',
      },
    });
  });

  it('returns 404 when a room does not exist', async () => {
    const response = await request(app).get('/api/rooms/missing-room');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Room not found' });
  });

  it('adds furniture to an existing room', async () => {
    const createdRoom = await request(app)
      .post('/api/rooms')
      .send({ name: 'Living Room', length: 240, width: 180 });

    const response = await request(app)
      .post(`/api/rooms/${createdRoom.body.id}/furniture`)
      .send({ name: 'Main Sofa', type: 'sofa', width: 84, depth: 38 });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      roomId: createdRoom.body.id,
      name: 'Main Sofa',
      type: 'sofa',
      width: 84,
      depth: 38,
    });
  });

  it('lists furniture for a room', async () => {
    const createdRoom = await request(app)
      .post('/api/rooms')
      .send({ name: 'Den', length: 200, width: 150 });

    const createdFurniture = await request(app)
      .post(`/api/rooms/${createdRoom.body.id}/furniture`)
      .send({ name: 'Coffee Table', type: 'coffeeTable', width: 48, depth: 24 });

    const response = await request(app).get(`/api/rooms/${createdRoom.body.id}/furniture`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([createdFurniture.body]);
  });

  it('returns an empty furniture list for an existing room with no furniture', async () => {
    const createdRoom = await request(app)
      .post('/api/rooms')
      .send({ name: 'Study', length: 160, width: 120 });

    const response = await request(app).get(`/api/rooms/${createdRoom.body.id}/furniture`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('rejects furniture with invalid type and non-positive dimensions', async () => {
    const createdRoom = await request(app)
      .post('/api/rooms')
      .send({ name: 'Office', length: 140, width: 120 });

    const response = await request(app)
      .post(`/api/rooms/${createdRoom.body.id}/furniture`)
      .send({ name: 'Item', type: 'bed', width: 0, depth: -4 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        type: 'Type must be one of: sofa, coffeeTable, diningTable',
        width: 'Width must be a number greater than zero',
        depth: 'Depth must be a number greater than zero',
      },
    });
  });

  it('returns 404 when adding furniture to a missing room', async () => {
    const response = await request(app)
      .post('/api/rooms/missing-room/furniture')
      .send({ name: 'Main Sofa', type: 'sofa', width: 84, depth: 38 });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Room not found' });
  });

  it('returns 404 when listing furniture for a missing room', async () => {
    const response = await request(app).get('/api/rooms/missing-room/furniture');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Room not found' });
  });
});

describe('Fit check API', () => {
  it('calculates fit for a valid room and sofa request', async () => {
    const response = await request(app)
      .post('/api/fit-check')
      .send({
        room: {
          name: 'Living Room',
          length: 196,
          width: 159,
        },
        furniture: {
          name: 'Sofa',
          type: 'sofa',
          width: 96,
          depth: 40,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      room: {
        name: 'Living Room',
        length: 196,
        width: 159,
      },
      furniture: {
        name: 'Sofa',
        type: 'sofa',
        width: 96,
        depth: 40,
      },
      fit: {
        fits: true,
        score: 100,
        rating: 'GOOD',
        widthPercentage: expect.any(Number),
        remainingWidth: 63,
        warnings: [],
        recommendation: 'This sofa is well proportioned for the wall width.',
      },
    });
    expect(response.body.fit.widthPercentage).toBeCloseTo((96 / 159) * 100, 10);
  });

  it('returns 400 when request body is missing room or furniture', async () => {
    const response = await request(app)
      .post('/api/fit-check')
      .send({
        room: {
          name: 'Living Room',
          length: 196,
          width: 159,
        },
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        furniture: {
          furniture: 'A furniture object is required',
        },
      },
    });
  });

  it('returns 400 for unsupported furniture type on fit-check', async () => {
    const response = await request(app)
      .post('/api/fit-check')
      .send({
        room: {
          name: 'Living Room',
          length: 196,
          width: 159,
        },
        furniture: {
          name: 'Coffee Table',
          type: 'coffeeTable',
          width: 56,
          depth: 24,
        },
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        furniture: {
          type: 'Type must be sofa for this endpoint',
        },
      },
    });
  });
});
