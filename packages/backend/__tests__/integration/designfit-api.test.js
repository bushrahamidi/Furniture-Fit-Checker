const request = require('supertest');
const { app } = require('../../src/app');

describe('DesignFit API integration', () => {
  test('performs a complete fit-check request', async () => {
    const response = await request(app)
      .post('/api/fit-check')
      .send({
        room: { name: 'Living Room', length: 196, width: 159 },
        furniture: { name: 'Sofa', type: 'sofa', width: 96, depth: 40 },
      });

    expect(response.status).toBe(200);
    expect(response.body.fit).toMatchObject({
      fits: true,
      score: 100,
      rating: 'GOOD',
    });
  });

  test('returns validation errors for an incomplete fit-check request', async () => {
    const response = await request(app)
      .post('/api/fit-check')
      .send({ room: { name: 'Living Room', length: 196, width: 159 } });

    expect(response.status).toBe(400);
    expect(response.body.errors.furniture.furniture).toBe('A furniture object is required');
  });
});