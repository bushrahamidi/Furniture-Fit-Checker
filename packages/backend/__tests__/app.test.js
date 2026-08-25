const request = require('supertest');
const { app } = require('../src/app');

describe('Health check', () => {
  it('reports that the backend server is running', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      message: 'Backend server is running',
    });
  });
});
